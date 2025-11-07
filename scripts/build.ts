#!/usr/bin/env tsx

import { resolve, basename, join } from 'node:path'
import {
  readdir,
  mkdir,
  copyFile,
  readFile,
  cp,
  stat,
  writeFile,
} from 'node:fs/promises'
import { DIST_DIR, run, ROOT_DIR } from './utils/index.js'

// constants
const PKGS_DIR = resolve(ROOT_DIR, 'packages')
const PUBLIC_DIR = resolve(ROOT_DIR, 'public')
const REGISTRY_TEMPLATE = resolve(
  ROOT_DIR,
  'registry-templates/v1/registry.json'
)
const REGISTRY_OUTPUT = resolve(DIST_DIR, 'registry.v1.json')

// types
interface PackageInfo {
  name: string
  version: string
  description?: string | null
  author?: string | null
  license?: string | null
  loader: {
    kind: string
    entry?: string | null
    styles?: string[]
    main_export?: string | null
  }
}

// helpers
async function getPackages() {
  const entries = await readdir(PKGS_DIR, { withFileTypes: true })
  const packages: string[] = []

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      const pkgPath = resolve(PKGS_DIR, entry.name)
      const pkgJsonPath = join(pkgPath, 'package.json')

      try {
        await stat(pkgJsonPath)
        packages.push(entry.name)
      } catch {
        // package.json 不存在，跳过
      }
    }
  }

  return packages
}

async function getPackageNames() {
  const entries = await readdir(PKGS_DIR, { withFileTypes: true })
  const packageNames: string[] = []

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      const pkgPath = resolve(PKGS_DIR, entry.name)
      const pkgJsonPath = join(pkgPath, 'package.json')

      try {
        const pkgJsonContent = await readFile(pkgJsonPath, 'utf-8')
        const pkgJson = JSON.parse(pkgJsonContent)
        if (pkgJson.name) {
          packageNames.push(pkgJson.name)
        }
      } catch {
        // package.json 不存在或无法解析，跳过
      }
    }
  }

  return packageNames
}

async function validateLoaderFiles(pkgName: string): Promise<boolean> {
  const pkgPath = resolve(PKGS_DIR, pkgName)
  const pkgJsonPath = join(pkgPath, 'package.json')

  let pkgJson: any
  try {
    const pkgJsonContent = await readFile(pkgJsonPath, 'utf-8')
    pkgJson = JSON.parse(pkgJsonContent)
  } catch (err) {
    consola.error(
      `  Failed to read package.json for ${pkgName}: ${err.message}`
    )
    return false
  }

  // 获取 loader 信息
  const loaderInfo = pkgJson.$ipe?.loader || pkgJson['ipe:loader']

  if (!loaderInfo) {
    consola.error(
      `  Package ${pkgName} does not have $ipe.loader configuration`
    )
    return false
  }

  const filesToCheck: string[] = []

  // 收集需要检查的文件
  if (loaderInfo.entry) {
    filesToCheck.push(loaderInfo.entry)
  }
  if (loaderInfo.styles && Array.isArray(loaderInfo.styles)) {
    filesToCheck.push(...loaderInfo.styles)
  }

  if (filesToCheck.length === 0) {
    consola.warn(
      `  Package ${pkgName} has no files to validate in loader config`
    )
  }

  // 检查所有文件是否存在
  for (const file of filesToCheck) {
    const filePath = join(pkgPath, file)
    try {
      await stat(filePath)
    } catch {
      consola.error(`  Package ${pkgName} is missing required file: ${file}`)
      consola.error(`  Expected path: ${filePath}`)
      return false
    }
  }

  return true
}

async function copyPackageFiles(pkgName: string) {
  const pkgPath = resolve(PKGS_DIR, pkgName)
  const pkgJsonPath = join(pkgPath, 'package.json')
  const distPkgDir = resolve(DIST_DIR, pkgName)

  // 读取 package.json
  const pkgJsonContent = await readFile(pkgJsonPath, 'utf-8')
  const pkgJson = JSON.parse(pkgJsonContent)

  // 获取 files 字段，如果没有则使用 ["dist"]
  const files: string[] = pkgJson.files || ['dist']

  // 创建目标文件夹
  await mkdir(distPkgDir, { recursive: true })

  // 复制 package.json
  await copyFile(pkgJsonPath, join(distPkgDir, 'package.json'))
  consola.info(`  Copied package.json for ${pkgName}`)

  // 复制 files 中指定的文件/文件夹
  for (const file of files) {
    const srcPath = join(pkgPath, file)
    const destPath = join(distPkgDir, file)

    try {
      const stats = await stat(srcPath)

      if (stats.isDirectory()) {
        await cp(srcPath, destPath, { recursive: true })
        consola.info(`  Copied directory ${file} for ${pkgName}`)
      } else {
        await mkdir(resolve(destPath, '..'), { recursive: true })
        await copyFile(srcPath, destPath)
        consola.info(`  Copied file ${file} for ${pkgName}`)
      }
    } catch (err) {
      consola.warn(`  Failed to copy ${file} for ${pkgName}: ${err.message}`)
    }
  }
}

async function extractPackageInfo(
  pkgName: string
): Promise<PackageInfo | null> {
  try {
    const pkgJsonPath = join(PKGS_DIR, pkgName, 'package.json')
    const pkgJsonContent = await readFile(pkgJsonPath, 'utf-8')
    const pkgJson = JSON.parse(pkgJsonContent)

    // 获取 $ipe 配置
    const ipeConfig = pkgJson.$ipe || {}
    const loaderInfo = ipeConfig.loader

    if (!loaderInfo) {
      consola.warn(`  Package ${pkgName} does not have loader info, skipping`)
      return null
    }

    // 将路径加上包名前缀（如 "dist/index.mjs" -> "test/dist/index.mjs"）
    const prefixPath = (path: string | null) => {
      return path ? `${pkgName}/${path}` : null
    }

    return {
      // $ipe.name 可以覆写 package.json 的 name
      name: ipeConfig.name || pkgJson.name || pkgName,
      version: pkgJson.version || '0.0.0',
      // $ipe.description 可以覆写 package.json 的 description
      description: ipeConfig.description || pkgJson.description || null,
      author:
        typeof pkgJson.author === 'string'
          ? pkgJson.author
          : pkgJson.author?.name || null,
      license: pkgJson.license || null,
      loader: {
        kind: loaderInfo.kind,
        entry: prefixPath(loaderInfo.entry),
        styles: (loaderInfo.styles || []).map(
          (style: string) => `${pkgName}/${style}`
        ),
        main_export: loaderInfo.main_export || null,
      },
    }
  } catch (err) {
    consola.warn(
      `  Failed to extract package info for ${pkgName}: ${err.message}`
    )
    return null
  }
}

async function generateRegistry(packages: string[]) {
  consola.info('Generating registry...')

  // 读取模板
  const templateContent = await readFile(REGISTRY_TEMPLATE, 'utf-8')
  const registry = JSON.parse(templateContent)

  // 提取所有包的信息
  const packageInfos: PackageInfo[] = []
  for (const pkgName of packages) {
    const info = await extractPackageInfo(pkgName)
    if (info) {
      packageInfos.push(info)
      consola.info(`  Added ${info.name} to registry`)
    }
  }

  // 填充 packages 字段
  registry.packages = packageInfos

  // 写入输出文件
  await writeFile(REGISTRY_OUTPUT, JSON.stringify(registry, null, 2), 'utf-8')
  consola.success(
    `Registry generated at ${REGISTRY_OUTPUT} with ${packageInfos.length} packages`
  )
}

async function copyPublicFiles() {
  try {
    // 检查 public 目录是否存在
    await stat(PUBLIC_DIR)
  } catch {
    consola.info('No public directory found, skipping')
    return
  }

  consola.info('Copying public files to dist...')

  async function copyRecursive(srcDir: string, destDir: string) {
    const entries = await readdir(srcDir, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = join(srcDir, entry.name)
      const destPath = join(destDir, entry.name)

      if (entry.isDirectory()) {
        // 创建目标目录
        await mkdir(destPath, { recursive: true })
        // 递归复制
        await copyRecursive(srcPath, destPath)
      } else {
        // 检查目标文件是否已存在
        try {
          await stat(destPath)
          consola.info(`  Skipped ${entry.name} (already exists)`)
        } catch {
          // 文件不存在，复制
          await copyFile(srcPath, destPath)
          consola.info(`  Copied ${entry.name}`)
        }
      }
    }
  }

  await copyRecursive(PUBLIC_DIR, DIST_DIR)
  consola.success('Public files copied successfully')
}

// main
async function main() {
  consola.info('Building all packages...')
  // 构建所有非 ^_ 开头的包
  const packageNames = await getPackageNames()

  if (packageNames.length === 0) {
    consola.warn('No packages found to build, skipping build step')
  } else {
    const filterArgs = packageNames.flatMap((pkg) => ['--filter', pkg])
    await run('pnpm', [...filterArgs, 'build'])
  }

  // 确保输出目录存在
  await mkdir(DIST_DIR, { recursive: true })

  // 扫描 packages 文件夹
  const packages = await getPackages()
  consola.info(`Found ${packages.length} packages: ${packages.join(', ')}`)

  // 验证所有包
  consola.info('Validating all packages...')
  for (const pkgName of packages) {
    const isValid = await validateLoaderFiles(pkgName)
    if (!isValid) {
      consola.error(`Package ${pkgName} validation failed`)
      throw new Error(
        `Build failed: Package ${pkgName} has missing or invalid loader files`
      )
    }
    consola.success(`  ${pkgName} validation passed`)
  }

  // 处理每个包
  for (const pkgName of packages) {
    consola.info(`Processing ${pkgName}...`)
    await copyPackageFiles(pkgName)
  }

  // 生成 registry
  await generateRegistry(packages)

  // 复制 public 文件到 dist
  await copyPublicFiles()

  consola.success('Build completed successfully.')
}

main().catch((err) => {
  consola.error(err)
  process.exitCode = 1
})
