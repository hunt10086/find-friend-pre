/**
 * WebSocket 配置与工具方法
 *
 * 用法示例：
 * 1) 构建 URL：
 *    const url = buildWsUrl('/ws/friend')
 *
 * 2) 直接使用管理器：
 *    const ws = new WebSocketManager('/ws/friend', {
 *      onOpen: () => console.log('opened'),
 *      onMessage: (ev) => console.log('msg', ev.data),
 *    }, { enabled: true, maxAttempts: 8 })
 *    ws.connect()
 *    ws.send(JSON.stringify({ hello: 'world' }))
 *    ws.close()
 */

// 与 myAxios.js 保持一致的环境判断
export const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:7777/api'
    : 'http://bc.seestars.top/api'
export const BASE_URL = API_BASE_URL

// 基于 API_BASE_URL 推导 WebSocket 基址
// 例如: http://localhost:7777/api -> ws://localhost:7777/api
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws')

// 构建完整的 WebSocket URL
export function buildWsUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${WS_BASE_URL}${normalized}`
}

export type WsEventHandlers = {
  onOpen?: (ev: Event) => void
  onMessage?: (ev: MessageEvent) => void
  onClose?: (ev: CloseEvent) => void
  onError?: (ev: Event) => void
}

export type ReconnectOptions = {
  // 是否启用自动重连
  enabled?: boolean
  // 最大重连次数（达到后不再重连），默认 10
  maxAttempts?: number
  // 初始重连延迟（毫秒），默认 500
  initialDelayMs?: number
  // 最大重连延迟（毫秒），默认 10_000
  maxDelayMs?: number
  // 指数退避因子，默认 2
  backoffFactor?: number
}

export type HeartbeatOptions = {
  // 是否启用心跳
  enabled?: boolean
  // 心跳间隔（毫秒），默认 30_000
  intervalMs?: number
  // 心跳消息内容，默认 'ping'
  payload?: string
}

export type WebSocketManagerOptions = {
  // 可传完整 ws(s):// 开头的地址，或以 / 开头的接口路径
  urlOrPath: string
  // WebSocket 子协议
  protocols?: string | string[]
  // 事件回调
  handlers?: WsEventHandlers
  // 自动重连配置
  reconnect?: ReconnectOptions
  // 心跳（保活）配置
  heartbeat?: HeartbeatOptions
}

/**
 * 简单的 WebSocket 管理器：支持自动重连与心跳保活
 */
export class WebSocketManager {
  private urlOrPath: string
  private protocols?: string | string[]
  private handlers: WsEventHandlers
  private reconnect: Required<ReconnectOptions>
  private heartbeat: Required<HeartbeatOptions>

  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: number | null = null
  private heartbeatTimer: number | null = null
  private manuallyClosed = false

  constructor(options: WebSocketManagerOptions) {
    this.urlOrPath = options.urlOrPath
    this.protocols = options.protocols
    this.handlers = options.handlers ?? {}

    const r = options.reconnect ?? {}
    this.reconnect = {
      enabled: r.enabled ?? true,
      maxAttempts: r.maxAttempts ?? 10,
      initialDelayMs: r.initialDelayMs ?? 500,
      maxDelayMs: r.maxDelayMs ?? 10_000,
      backoffFactor: r.backoffFactor ?? 2,
    }

    const h = options.heartbeat ?? {}
    this.heartbeat = {
      enabled: h.enabled ?? true,
      intervalMs: h.intervalMs ?? 30_000,
      payload: h.payload ?? 'ping',
    }
  }

  /**
   * 当前是否已连接（OPEN）
   */
  get isOpen(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * 获取底层实例（谨慎使用）
   */
  get instance(): WebSocket | null {
    return this.ws
  }

  /**
   * 连接
   */
  connect(): void {
    this.manuallyClosed = false
    const url = this.resolveUrl(this.urlOrPath)

    try {
      this.ws = this.protocols ? new WebSocket(url, this.protocols) : new WebSocket(url)
      this.bindEvents(this.ws)
    } catch (err) {
      // 立即触发错误回调，并尝试重连
      this.handlers.onError?.(new Event('error'))
      this.scheduleReconnect()
    }
  }

  /**
   * 关闭连接（不会自动重连）
   */
  close(code?: number, reason?: string): void {
    this.manuallyClosed = true
    this.clearReconnectTimer()
    this.stopHeartbeat()

    try {
      this.ws?.close(code, reason)
    } catch {
      // ignore
    } finally {
      this.ws = null
    }
  }

  /**
   * 发送消息
   */
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(data as any)
        return true
      } catch {
        return false
      }
    }
    return false
  }

  /**
   * 立即发起一次重连（会重置重连次数）
   */
  reconnectNow(): void {
    this.reconnectAttempts = 0
    this.clearReconnectTimer()
    if (!this.manuallyClosed) {
      this.safeReconnect()
    }
  }

  // 内部方法

  private resolveUrl(urlOrPath: string): string {
    if (/^wss?:\/\//i.test(urlOrPath)) {
      return urlOrPath
    }
    return buildWsUrl(urlOrPath)
  }

  private bindEvents(socket: WebSocket): void {
    socket.onopen = (ev) => {
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.handlers.onOpen?.(ev)
    }

    socket.onmessage = (ev) => {
      // 心跳响应可按需忽略（这里不做过滤）
      this.handlers.onMessage?.(ev)
    }

    socket.onerror = (ev) => {
      this.handlers.onError?.(ev)
    }

    socket.onclose = (ev) => {
      this.stopHeartbeat()
      this.handlers.onClose?.(ev)

      if (!this.manuallyClosed) {
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect(): void {
    if (!this.reconnect.enabled) return
    if (this.reconnectAttempts >= this.reconnect.maxAttempts) return
    if (this.manuallyClosed) return

    this.reconnectAttempts += 1

    const delay = Math.min(
      this.reconnect.maxDelayMs,
      this.reconnect.initialDelayMs *
        Math.pow(this.reconnect.backoffFactor, this.reconnectAttempts - 1),
    )

    this.clearReconnectTimer()
    this.reconnectTimer = window.setTimeout(() => this.safeReconnect(), delay)
  }

  private safeReconnect(): void {
    if (this.manuallyClosed) return
    try {
      this.ws?.close()
    } catch {
      // ignore
    } finally {
      this.ws = null
    }
    this.connect()
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private startHeartbeat(): void {
    if (!this.heartbeat.enabled) return
    this.stopHeartbeat()

    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(this.heartbeat.payload)
        } catch {
          // 发送失败交由 onerror/onclose 触发重连
        }
      }
    }, this.heartbeat.intervalMs) as unknown as number
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}
