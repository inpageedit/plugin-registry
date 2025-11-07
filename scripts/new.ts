import { resolve } from 'node:path'
import { cp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { interpolate, ROOT_DIR, snakeCase } from './utils/index.js'

const BOILERPLATE_DIR = resolve(ROOT_DIR, 'packages', '_boilerplate')

// "foo bar" => "foo-bar"
const normalizePkgName = (name: string) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

const replaceTemplateVars = async (
  filePath: string,
  vars: Record<string, string>
) => {
  const content = await readFile(filePath, 'utf-8')
  let result = interpolate(content, vars)
  return writeFile(filePath, result, 'utf-8')
}

async function main() {
  // get informations
  let name = process.argv.slice(2).join(' ')
  if (!name) {
    name = await consola.prompt('Project name:', { type: 'text' })
  }
  // normalize package name
  let pkgName = normalizePkgName(name)
  if (!pkgName.includes('plugin-')) {
    pkgName = `inpageedit-plugin-${pkgName}`
  }
  const dirName = pkgName.split('plugin-').pop() || pkgName
  if (!pkgName) {
    consola.error('Package name is required.')
    process.exit(1)
  } else {
    const exists = await stat(resolve(ROOT_DIR, 'packages', dirName))
      .then(() => true)
      .catch(() => false)
    if (exists) {
      const confirm = await consola.prompt(
        `Package ${pkgName} already exists. Do you want to replace it?`,
        { type: 'confirm', initial: false }
      )
      if (!confirm) {
        consola.info('Aborted.')
        process.exit(0)
      } else {
        await rm(resolve(ROOT_DIR, 'packages', dirName), { recursive: true })
      }
    }
  }
  const description =
    (await consola.prompt('Project description:', {
      type: 'text',
    })) || ''

  // copy files
  consola.info(`Creating new package: ${name}`)
  const destDir = resolve(ROOT_DIR, 'packages', dirName)
  await cp(BOILERPLATE_DIR, destDir, { recursive: true })
  try {
    await rm(resolve(destDir, 'dist'), { recursive: true })
  } catch {
    // noop
  }

  const pkgJsonPath = resolve(destDir, 'package.json')
  const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf-8'))
  pkgJson.name = pkgName
  pkgJson.description = description
  await writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2), 'utf-8')
  consola.success(`Package ${name} created successfully at ${destDir}`)
}

main().catch((err) => {
  consola.error(err)
  process.exitCode = 1
})
