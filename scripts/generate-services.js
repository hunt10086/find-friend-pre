import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ROOT = join(__dirname, '..')
const INPUT_SPEC = join(PROJECT_ROOT, 'src/api/openAPI.json')
const OUTPUT_DIR = join(PROJECT_ROOT, 'src/services')

// 辅助函数：将路径转换为函数名
function pathToFunctionName(path, method) {
  const cleanPath = path.replace(/^\//, '')
  const parts = cleanPath.split('/').filter(Boolean)
  const camelParts = parts.map((part, index) => {
    const clean = part.replace(/[{}]/g, '')
    if (index === 0) return clean
    return clean.charAt(0).toUpperCase() + clean.slice(1)
  })

  const methodPrefix = method.toLowerCase()
  const functionName =
    methodPrefix + camelParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')

  return functionName
}

// 辅助函数：将 schema 名称转换为 TypeScript 类型
function schemaRefToType(ref) {
  if (!ref) return 'any'
  const match = ref.match(/#\/components\/schemas\/(.+)/)
  return match ? match[1] : 'any'
}

// 辅助函数：解析 OpenAPI schema 定义生成 TypeScript interface
function schemaToInterface(name, schema, allSchemas) {
  if (!schema || schema.type !== 'object') return null

  const properties = schema.properties || {}
  const required = schema.required || []

  const fields = Object.entries(properties).map(([propName, propSchema]) => {
    const isRequired = required.includes(propName)
    const optionalMark = isRequired ? '' : '?'
    const type = openApiTypeToTS(propSchema, allSchemas)
    return `  ${propName}${optionalMark}: ${type}`
  })

  if (fields.length === 0) return null

  return `export interface ${name} {\n${fields.join('\n')}\n}`
}

// 辅助函数：将 OpenAPI 类型转换为 TypeScript 类型
function openApiTypeToTS(schema, allSchemas = {}) {
  if (!schema) return 'any'

  if (schema.$ref) {
    return schemaRefToType(schema.$ref)
  }

  if (schema.type === 'array') {
    const itemType = openApiTypeToTS(schema.items, allSchemas)
    return `${itemType}[]`
  }

  if (schema.type === 'object') {
    if (schema.properties) {
      return 'Record<string, any>'
    }
    if (schema.additionalProperties) {
      return 'Record<string, any>'
    }
    return 'Record<string, any>'
  }

  const typeMap = {
    string: 'string',
    number: 'number',
    integer: 'number',
    boolean: 'boolean',
  }

  if (schema.format === 'int64' || schema.format === 'int32') {
    return 'number'
  }

  if (schema.format === 'date-time') {
    return 'string'
  }

  if (schema.format === 'binary') {
    return 'File'
  }

  return typeMap[schema.type] || 'any'
}

// 辅助函数：提取 BaseResponse 的 data 类型
function extractDataType(responseType, allSchemas) {
  if (!responseType || responseType === 'any') return 'any'

  // 检查是否是 BaseResponse 类型
  if (responseType.startsWith('BaseResponse')) {
    const schema = allSchemas[responseType]
    if (schema && schema.properties && schema.properties.data) {
      return openApiTypeToTS(schema.properties.data, allSchemas)
    }
  }

  return responseType
}

// 辅助函数：提取响应类型
function getResponseType(responses, allSchemas) {
  const successResponse = responses['200'] || responses['201']
  if (!successResponse) return 'any'

  const content = successResponse.content?.['*/*'] || successResponse.content?.['application/json']
  if (!content?.schema) return 'any'

  const fullType = openApiTypeToTS(content.schema, allSchemas)
  return extractDataType(fullType, allSchemas)
}

// 辅助函数：提取请求体类型
function getRequestBodyType(requestBody, allSchemas) {
  if (!requestBody) return null

  const content =
    requestBody.content?.['application/json'] || requestBody.content?.['multipart/form-data']
  if (!content?.schema) return null

  return openApiTypeToTS(content.schema, allSchemas)
}

// 辅助函数：提取参数
function extractParameters(operation, allSchemas) {
  const queryParams = []
  const pathParams = []

  if (operation.parameters) {
    operation.parameters.forEach((param) => {
      if (param.in === 'query') {
        queryParams.push({
          name: param.name,
          required: param.required || false,
          type: openApiTypeToTS(param.schema, allSchemas),
          description: param.description,
        })
      } else if (param.in === 'path') {
        pathParams.push({
          name: param.name,
          required: true,
          type: openApiTypeToTS(param.schema, allSchemas),
          description: param.description,
        })
      }
    })
  }

  return { queryParams, pathParams }
}

// 生成服务文件
function generateServiceFile(controllerName, operations, allSchemas) {
  const usedTypes = new Set()
  const interfaces = new Map()
  const functions = []

  // 通用接口定义
  const commonTypes = `export interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
  description?: string
}\n`

  // 为每个操作生成函数
  operations.forEach(({ path, method, operation, functionName }) => {
    const { queryParams, pathParams } = extractParameters(operation, allSchemas)
    const requestBodyType = getRequestBodyType(operation.requestBody, allSchemas)
    const responseType = getResponseType(operation.responses, allSchemas)

    // 生成参数接口（如果需要）
    const allParams = [...queryParams, ...pathParams]
    const hasParams = allParams.length > 0

    let paramsInterfaceName = null
    if (hasParams) {
      paramsInterfaceName = functionName.charAt(0).toUpperCase() + functionName.slice(1) + 'Params'

      const paramsInterface = `export interface ${paramsInterfaceName} {\n${allParams.map((p) => `  ${p.name}${p.required ? '' : '?'}: ${p.type}`).join('\n')}\n}`

      interfaces.set(paramsInterfaceName, paramsInterface)
    }

    // 记录使用的类型
    if (
      requestBodyType &&
      requestBodyType !== 'any' &&
      !requestBodyType.includes('[]') &&
      !requestBodyType.includes('Record') &&
      !requestBodyType.includes('File')
    ) {
      usedTypes.add(requestBodyType)
    }

    if (
      responseType !== 'any' &&
      !responseType.includes('[]') &&
      !responseType.includes('Record')
    ) {
      usedTypes.add(responseType)
    }

    // 生成函数
    const summary = operation.summary || operation.description || ''
    const funcParams = []

    if (hasParams) {
      funcParams.push(`params: ${paramsInterfaceName}`)
    }

    if (requestBodyType) {
      funcParams.push(`input: ${requestBodyType}`)
    }

    funcParams.push('config?: AxiosRequestConfig')

    // 构建 axios 调用
    const axiosMethod = method.toLowerCase()
    let axiosCall = ''

    // 处理路径参数
    let finalPath = path
    pathParams.forEach((param) => {
      finalPath = finalPath.replace(`{${param.name}}`, `\${params.${param.name}}`)
    })

    if (axiosMethod === 'get' || axiosMethod === 'delete') {
      if (queryParams.length > 0) {
        const paramsObj = queryParams.map((p) => `    ${p.name}: params.${p.name}`).join(',\n')
        axiosCall = `  const paramsInput = {\n${paramsObj}\n  }
  return myAxios.${axiosMethod}(\`${finalPath}\`, {
    params: paramsInput,
    ...(config ?? {})
  })`
      } else {
        axiosCall = `  return myAxios.${axiosMethod}(\`${finalPath}\`, config)`
      }
    } else {
      // post, put, patch
      if (requestBodyType) {
        if (queryParams.length > 0) {
          const paramsObj = queryParams.map((p) => `    ${p.name}: params.${p.name}`).join(',\n')
          axiosCall = `  const paramsInput = {\n${paramsObj}\n  }
  return myAxios.${axiosMethod}(\`${finalPath}\`, input, {
    params: paramsInput,
    ...(config ?? {})
  })`
        } else {
          axiosCall = `  return myAxios.${axiosMethod}(\`${finalPath}\`, input, config)`
        }
      } else {
        axiosCall = `  return myAxios.${axiosMethod}(\`${finalPath}\`, config)`
      }
    }

    const functionCode = `/**
 * ${summary}
 * ${method.toUpperCase()} ${path}
 */
export function ${functionName}(
  ${funcParams.join(',\n  ')}
): Promise<AxiosResponse<ApiResponse<${responseType}>>> {
${axiosCall}
}`

    functions.push(functionCode)
  })

  // 组装文件内容
  let content = `import type { AxiosResponse, AxiosRequestConfig } from 'axios'\nimport myAxios from '@/plugins/myAxios.js'\n\n`

  // 添加通用类型
  content += commonTypes

  // 添加使用的类型定义
  usedTypes.forEach((typeName) => {
    const schema = allSchemas[typeName]
    if (schema) {
      const interfaceDef = schemaToInterface(typeName, schema, allSchemas)
      if (interfaceDef) {
        content += interfaceDef + '\n\n'
      }
    }
  })

  // 添加参数接口定义
  interfaces.forEach((interfaceCode) => {
    content += interfaceCode + '\n\n'
  })

  // 添加函数
  functions.forEach((func) => {
    content += func + '\n\n'
  })

  return content
}

function generateServices() {
  try {
    console.log('🚀 开始生成 Services...\n')

    // 读取 OpenAPI 文档
    if (!existsSync(INPUT_SPEC)) {
      console.error(`❌ OpenAPI 文档不存在: ${INPUT_SPEC}`)
      console.error('请先运行: npm run fetch:api')
      process.exit(1)
    }

    const spec = JSON.parse(readFileSync(INPUT_SPEC, 'utf-8'))
    const allSchemas = spec.components?.schemas || {}

    // 按 controller 分组
    const controllers = new Map()

    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) return

        const tags = operation.tags || ['default']
        const tag = tags[0]

        if (!controllers.has(tag)) {
          controllers.set(tag, [])
        }

        const functionName = pathToFunctionName(path, method)

        controllers.get(tag).push({
          path,
          method,
          operation,
          functionName,
        })
      })
    })

    // 确保输出目录存在
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true })
    }

    // 生成每个 controller 的文件
    const serviceFiles = []
    controllers.forEach((operations, controllerName) => {
      const fileName = controllerName.replace(/-controller$/, '') + '.ts'
      const filePath = join(OUTPUT_DIR, fileName)

      console.log(`📝 生成 ${fileName}...`)

      const content = generateServiceFile(controllerName, operations, allSchemas)
      writeFileSync(filePath, content, 'utf-8')

      serviceFiles.push(fileName.replace('.ts', ''))
    })

    // 生成 index.ts
    const indexContent = serviceFiles.map((file) => `export * from './${file}'`).join('\n') + '\n'

    writeFileSync(join(OUTPUT_DIR, 'index.ts'), indexContent, 'utf-8')

    console.log('\n✅ Services 生成成功!')
    console.log(`📁 输出目录: ${OUTPUT_DIR}`)
    console.log(`📄 生成文件: ${serviceFiles.length + 1} 个`)
    console.log('\n使用方式:')
    console.log('  import { getUserCurrent, postUserLogin } from "@/services"')
    console.log('  import type { User, UserLoginRequest } from "@/services"')
  } catch (error) {
    console.error('\n❌ 生成失败:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

generateServices()
