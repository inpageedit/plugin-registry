import { platform } from 'node:os'
import { spawn, SpawnOptions } from 'node:child_process'

export const PLATFORM = platform()

// helpers
export function run(command: string, args?: string[], opts: SpawnOptions = {}) {
  consola.info(`$> ${command} ${args?.join(' ')}`)
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: PLATFORM === 'win32' ? 'pwsh.exe' : true,
      ...opts,
    })
    child.on('error', reject)
    child.on('close', (code, signal) => {
      if (code === 0) return resolve()
      const reason = code !== null ? `exit code ${code}` : `signal ${signal}`
      reject(new Error(`${command} ${args.join(' ')} failed with ${reason}`))
    })
  })
}
export { run as $ }
