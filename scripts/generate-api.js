import { execSync } from 'child_process'
import { existsSync, mkdirSync, rmSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 配置 - 使用相对路径避免 Windows 路径问题
const PROJECT_ROOT = join(__dirname, '..')
const INPUT_SPEC = './src/api/openAPI.json' // 使用相对路径
const OUTPUT_DIR = './src/api/generated' // 使用相对路径
const TEMP_DIR = join(PROJECT_ROOT, '.openapi-generator')

function generateApi() {
  try {
    console.log('🚀 开始生成 API 接口...\n')

    // 检查输入文件是否存在
    const inputSpecPath = join(PROJECT_ROOT, INPUT_SPEC)
    if (!existsSync(inputSpecPath)) {
      console.error(`❌ OpenAPI 文档不存在: ${inputSpecPath}`)
      console.error('请先运行: npm run fetch:api')
      process.exit(1)
    }

    // 清理旧的生成文件
    const outputDirPath = join(PROJECT_ROOT, OUTPUT_DIR)
    if (existsSync(outputDirPath)) {
      console.log('🧹 清理旧的生成文件...')
      rmSync(outputDirPath, { recursive: true, force: true })
    }

    // 创建输出目录
    mkdirSync(outputDirPath, { recursive: true })

    // 构建 OpenAPI Generator 命令
    const command = [
      'npx @openapitools/openapi-generator-cli generate',
      `-i ${INPUT_SPEC}`,
      `-g typescript-axios`,
      `-o ${OUTPUT_DIR}`,
      '--additional-properties=useSingleRequestParameter=false,withSeparateModelsAndApi=true,apiPackage=controllers,modelPackage=models,supportsES6=true,npmName=@api/client,npmVersion=1.0.0',
      '--skip-validate-spec',
    ].join(' ')

    console.log('📝 执行命令:')
    console.log(command)
    console.log('')

    // 执行生成命令
    execSync(command, {
      stdio: 'inherit',
      cwd: PROJECT_ROOT,
    })

    // 清理临时文件
    if (existsSync(TEMP_DIR)) {
      rmSync(TEMP_DIR, { recursive: true, force: true })
    }

    console.log('\n✅ API 接口生成成功!')
    console.log(`📁 输出目录: ${OUTPUT_DIR}`)
    console.log('\n使用方式:')
    console.log('  import { UserControllerApi } from "@/api/generated/controllers"')
    console.log('  import type { User } from "@/api/generated/models"')
    console.log('\n💡 提示: 生成的代码位于 src/api/generated/ 目录下')
  } catch (error) {
    console.error('\n❌ API 生成失败:', error.message)
    process.exit(1)
  }
}

generateApi()
