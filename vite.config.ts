import { resolve } from 'node:path'
import { defineConfig, Plugin } from 'vite'
import type {
  PluginStoreRegistry,
  PluginStorePackage,
} from './scripts/utils/PluginStoreSchema'
import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const REGISTRY_TEMPLATE_FILE = resolve(
  import.meta.dirname,
  'registry-templates',
  'v1',
  'registry.v1.json'
)

/**
 * 读取 packages 目录下的所有插件，并生成虚拟的 registry.v1.json
 * 在请求 /registry.v1.json 时，返回虚拟的 registry.v1.json
 *
 * 猜测可能的入口文件，生成类似 "packages/april-fool-2023/src/index.ts?_=<timestamp>" 的 entry
 * 猜测可能的 css 入口，生成类似 ["packages/april-fool-2023/src/style.scss?_=<timestamp>"] 的 styles
 */
function pluginIPEPluginRegistry(options: {
  template: PluginStoreRegistry
  rootDir: string
  packagesDir: string
  sourceDir: string
  entriesPattern: (string | RegExp)[]
  styleEntriesPattern: (string | RegExp)[]
}): Plugin {
  const VIRTUAL_MODULE_ID = '/registry.v1.json'
  const INDEX_HTML_PATH = resolve(options.rootDir, 'public', 'index.html')

  return {
    name: 'ipe-plugin-registry-dev-helper',

    async configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 处理根目录和 index.html 请求
        if (req.url === '/' || req.url === '/index.html') {
          try {
            const html = await readFile(INDEX_HTML_PATH, 'utf-8')
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            res.end(html)
            return
          } catch (error) {
            console.error('Failed to read index.html:', error)
            res.statusCode = 404
            res.end('404 Not Found')
            return
          }
        }

        // 处理注册表 JSON 请求
        if (req.url === VIRTUAL_MODULE_ID) {
          try {
            const registry = await generateRegistry()
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Cache-Control', 'no-cache')
            res.end(JSON.stringify(registry, null, 2))
            return
          } catch (error) {
            console.error('Failed to generate registry:', error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to generate registry' }))
            return
          }
        }

        next()
      })
    },

    resolveId(source, importer) {
      // 处理 @/ 别名，将其解析为当前插件的 src 目录
      if (source.startsWith('@/')) {
        // 如果没有 importer，无法确定是哪个插件
        if (!importer) return null

        // 检查 importer 是否在 packages 目录下
        const normalizedImporter = importer.replace(/\\/g, '/')
        const packagesPath = options.packagesDir.replace(/\\/g, '/')

        if (normalizedImporter.includes(packagesPath)) {
          // 提取插件名称
          // 例如：E:/path/to/packages/foo/src/index.ts -> foo
          const relativePath = normalizedImporter.substring(
            normalizedImporter.indexOf(packagesPath) + packagesPath.length + 1
          )
          const pluginName = relativePath.split('/')[0]

          if (pluginName) {
            // 构建目标路径
            const targetPath = source.substring(2) // 移除 '@/'
            const resolvedPath = join(
              options.packagesDir,
              pluginName,
              options.sourceDir,
              targetPath
            )
            return resolvedPath
          }
        }
      }

      return null
    },
  } satisfies Plugin

  /**
   * 生成注册表
   */
  async function generateRegistry(): Promise<PluginStoreRegistry> {
    const packages = await scanPackages()
    return {
      ...options.template,
      last_modified: new Date().toISOString(),
      packages,
    }
  }

  /**
   * 扫描 packages 目录下的所有插件
   */
  async function scanPackages(): Promise<PluginStorePackage[]> {
    const packages: PluginStorePackage[] = []
    const entries = await readdir(options.packagesDir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue

      const packageDir = join(options.packagesDir, entry.name)
      const packageJsonPath = join(packageDir, 'package.json')

      try {
        const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
        const packageJson = JSON.parse(packageJsonContent)

        // 获取 $ipe 配置（参考 build.ts）
        const ipeConfig = packageJson.$ipe || {}
        const loaderInfo = ipeConfig.loader
        const devLoaderInfo = ipeConfig.dev_loader // 开发环境专用配置

        if (!loaderInfo) {
          console.warn(
            `Package ${entry.name} does not have loader info, skipping`
          )
          continue
        }

        const packageInfo: PluginStorePackage = {
          id: entry.name,
          name: ipeConfig.name || packageJson.name || entry.name,
          version: packageJson.version || '0.0.0',
          description:
            ipeConfig.description || packageJson.description || undefined,
          // 处理 author 字段：可能是字符串或对象
          author:
            typeof packageJson.author === 'string'
              ? packageJson.author
              : packageJson.author?.name || undefined,
          license: packageJson.license || undefined,
          // 确保 categories 是数组
          categories: Array.isArray(ipeConfig.categories)
            ? ipeConfig.categories
            : [],
          loader: {
            kind: loaderInfo.kind,
            entry: undefined,
            styles: [],
            main_export: loaderInfo.main_export || undefined,
          },
        }

        const timestamp = Date.now()

        // 处理入口文件
        // 优先使用 dev_loader.entry，其次使用 loader.entry，最后自动检测
        if (devLoaderInfo?.entry) {
          // 如果配置了 dev_loader.entry，直接使用
          const entryPath = join(packageDir, devLoaderInfo.entry)
          const relativePath = entryPath
            .replace(options.rootDir, '')
            .replace(/\\/g, '/')
          packageInfo.loader.entry = `${
            relativePath.startsWith('/')
              ? relativePath.slice(1)
              : relativePath
          }?_=${timestamp}`
        } else if (loaderInfo.entry) {
          // 如果配置中指定了 entry，尝试转换为开发环境的源文件路径
          const devEntry = await convertToDevPath(
            packageDir,
            loaderInfo.entry,
            options.entriesPattern
          )
          if (devEntry) {
            const relativePath = devEntry
              .replace(options.rootDir, '')
              .replace(/\\/g, '/')
            packageInfo.loader.entry = `${
              relativePath.startsWith('/')
                ? relativePath.slice(1)
                : relativePath
            }?_=${timestamp}`
          }
        } else {
          // 自动检测入口文件
          const detectedEntry = await detectEntry(packageDir)
          if (detectedEntry) {
            const relativePath = detectedEntry
              .replace(options.rootDir, '')
              .replace(/\\/g, '/')
            packageInfo.loader.entry = `${
              relativePath.startsWith('/')
                ? relativePath.slice(1)
                : relativePath
            }?_=${timestamp}`
          }
        }

        // 处理样式文件
        // 优先使用 dev_loader.styles，其次使用 loader.styles，最后自动检测
        if (
          devLoaderInfo?.styles &&
          Array.isArray(devLoaderInfo.styles) &&
          devLoaderInfo.styles.length > 0
        ) {
          // 如果配置了 dev_loader.styles，直接使用
          packageInfo.loader.styles = devLoaderInfo.styles.map(
            (style: string) => {
              const stylePath = join(packageDir, style)
              const relativePath = stylePath
                .replace(options.rootDir, '')
                .replace(/\\/g, '/')
              return `${
                relativePath.startsWith('/')
                  ? relativePath.slice(1)
                  : relativePath
              }?_=${timestamp}`
            }
          )
        } else if (
          loaderInfo.styles &&
          Array.isArray(loaderInfo.styles) &&
          loaderInfo.styles.length > 0
        ) {
          // 如果配置中指定了 styles，尝试转换为开发环境的源文件路径
          const devStyles = await Promise.all(
            loaderInfo.styles.map(async (style: string) => {
              const devStyle = await convertToDevPath(
                packageDir,
                style,
                options.styleEntriesPattern
              )
              if (devStyle) {
                const relativePath = devStyle
                  .replace(options.rootDir, '')
                  .replace(/\\/g, '/')
                return `${
                  relativePath.startsWith('/')
                    ? relativePath.slice(1)
                    : relativePath
                }?_=${timestamp}`
              }
              return null
            })
          )
          packageInfo.loader.styles = devStyles.filter(
            (s): s is string => s !== null
          )
        } else {
          // 自动检测样式文件
          const detectedStyles = await detectStyles(packageDir)
          if (detectedStyles.length > 0) {
            packageInfo.loader.styles = detectedStyles.map((stylePath) => {
              const relativePath = stylePath
                .replace(options.rootDir, '')
                .replace(/\\/g, '/')
              return `${
                relativePath.startsWith('/')
                  ? relativePath.slice(1)
                  : relativePath
              }?_=${timestamp}`
            })
          }
        }

        packages.push(packageInfo)
      } catch (error) {
        console.warn(`Failed to read package ${entry.name}:`, error)
        continue
      }
    }

    return packages
  }

  /**
   * 将构建产物路径转换为开发环境的源文件路径
   * 例如：dist/index.js -> src/index.ts
   */
  async function convertToDevPath(
    packageDir: string,
    distPath: string,
    patterns: (string | RegExp)[]
  ): Promise<string | null> {
    // 首先尝试从 src 目录中查找匹配的源文件
    const sourceDir = join(packageDir, options.sourceDir)

    try {
      const files = await readdir(sourceDir)

      // 从 dist 路径中提取基础文件名（不含扩展名）
      const distFileName = distPath.split('/').pop()?.split('.')[0]
      if (!distFileName) return null

      // 尝试找到匹配的源文件
      for (const file of files) {
        const fileNameWithoutExt = file.split('.')[0]

        // 检查文件名是否匹配
        if (fileNameWithoutExt === distFileName) {
          // 检查文件是否符合模式
          for (const pattern of patterns) {
            const matches =
              typeof pattern === 'string'
                ? file === pattern
                : pattern.test(file)

            if (matches) {
              const filePath = join(sourceDir, file)
              const fileStat = await stat(filePath)
              if (fileStat.isFile()) {
                return filePath
              }
            }
          }
        }
      }
    } catch (error) {
      // sourceDir 不存在或无法读取
    }

    // 如果在 src 中找不到，尝试使用原始路径
    const originalPath = join(packageDir, distPath)
    try {
      const fileStat = await stat(originalPath)
      if (fileStat.isFile()) {
        return originalPath
      }
    } catch (error) {
      // 文件不存在
    }

    return null
  }

  /**
   * 检测入口文件
   */
  async function detectEntry(packageDir: string): Promise<string | null> {
    const sourceDir = join(packageDir, options.sourceDir)

    try {
      const files = await readdir(sourceDir)

      for (const pattern of options.entriesPattern) {
        for (const file of files) {
          const matches =
            typeof pattern === 'string' ? file === pattern : pattern.test(file)

          if (matches) {
            const filePath = join(sourceDir, file)
            const fileStat = await stat(filePath)
            if (fileStat.isFile()) {
              return filePath
            }
          }
        }
      }
    } catch (error) {
      // sourceDir 不存在或无法读取
    }

    return null
  }

  /**
   * 检测样式文件
   */
  async function detectStyles(packageDir: string): Promise<string[]> {
    const sourceDir = join(packageDir, options.sourceDir)
    const styles: string[] = []

    try {
      const files = await readdir(sourceDir)

      for (const pattern of options.styleEntriesPattern) {
        for (const file of files) {
          const matches =
            typeof pattern === 'string' ? file === pattern : pattern.test(file)

          if (matches) {
            const filePath = join(sourceDir, file)
            const fileStat = await stat(filePath)
            if (fileStat.isFile()) {
              styles.push(filePath)
            }
          }
        }
      }
    } catch (error) {
      // sourceDir 不存在或无法读取
    }

    return styles
  }
}

export default defineConfig(async () => {
  const template = JSON.parse(
    await readFile(REGISTRY_TEMPLATE_FILE, 'utf-8')
  ) as PluginStoreRegistry
  return {
    plugins: [
      pluginIPEPluginRegistry({
        template,
        rootDir: resolve(import.meta.dirname),
        packagesDir: resolve(import.meta.dirname, 'packages'),
        sourceDir: 'src',
        entriesPattern: [/^(index|main)\.(js|ts|tsx)$/],
        styleEntriesPattern: [/(index|styles?)\.(css|scss|less|styl|sass)$/],
      }),
    ],
    resolve: {
      alias: {
        '~~': resolve(import.meta.dirname, 'common'),
      },
    },
    server: {
      port: 1029,
      cors: true,
    },
  }
})
