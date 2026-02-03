import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 后端 API 文档地址
const API_DOCS_URL = 'http://localhost:7777/api/v3/api-docs'
const OUTPUT_PATH = join(__dirname, '../src/api/openAPI.json')

async function fetchApiDocs() {
  try {
    console.log('正在从后端获取 OpenAPI 文档...')
    console.log(`URL: ${API_DOCS_URL}`)

    const response = await fetch(API_DOCS_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 保存到文件
    writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8')

    console.log('✅ OpenAPI 文档已成功保存到:', OUTPUT_PATH)
    console.log('📝 API 版本:', data.info?.version || 'unknown')
    console.log('📝 API 标题:', data.info?.title || 'unknown')
  } catch (error) {
    console.error('❌ 获取 API 文档失败:', error.message)
    console.error('\n请确保:')
    console.error('1. 后端服务已启动 (http://localhost:7777)')
    console.error('2. Swagger/OpenAPI 文档已启用')
    console.error('3. 可以访问文档端点:', API_DOCS_URL)
    process.exit(1)
  }
}

fetchApiDocs()
