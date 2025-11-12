import 'dotenv/config'
import { OpenAI } from 'openai'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  ChatCompletionChunk,
  ChatCompletionCreateParamsStreaming,
} from 'openai/resources/index.mjs'
import consola from 'consola'
import { parseDocument, stringify } from 'yaml'

const LANGUAGES_SRC_DIR = resolve(import.meta.dirname, '../src/languages')
const OUTPUT_DIR = resolve(import.meta.dirname, './.llm-output')
const BASE_PROMPT = await readFile(
  resolve(import.meta.dirname, './translate.prompt.md'),
  'utf-8'
)
const SOURCE_LANGUAGE_CONTENT = await readFile(
  resolve(LANGUAGES_SRC_DIR, 'en.yaml'),
  'utf-8'
)
const TARGET_LANGUAGES = {
  // ar: 'العربية (ar)',
  fr: 'Français (fr)',
  hi: 'Hindī (hi)',
  ja: '日本語 (ja)',
  nl: 'Nederlands (nl)',
  pl: 'Polski (pl)',
  'pt-br': 'Português do Brasil (pt-br)',
  'zh-hans': '中文(简体) (zh-hans)',
  'zh-hant': '中文(繁體) (zh-hant)',
}

try {
  mkdir(OUTPUT_DIR, { recursive: true })
} catch (_) {
  /* noop */
}

const client = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})

for (const [code, name] of Object.entries(TARGET_LANGUAGES)) {
  consola.info(`[${code}] Translating ${name}...`)

  const prompt = BASE_PROMPT.replace(
    '%SOURCE_LANGUAGE_CONTENT%',
    SOURCE_LANGUAGE_CONTENT
  ).replace('%OUTPUT_LANGUAGE%', name)

  let content = ''

  try {
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      enable_thinking: true,
    } as ChatCompletionCreateParamsStreaming)
    let thinkEnd: null | boolean = null
    for await (const chunk of stream) {
      const delta = chunk.choices[0]
        .delta as ChatCompletionChunk.Choice.Delta & {
        reasoning_content?: string
      }
      if (delta.reasoning_content) {
        if (thinkEnd === null) {
          thinkEnd = false
          process.stdout.write('\n<think>\n')
        }
        process.stdout.write(delta.reasoning_content)
      }
      if (delta.content) {
        if (thinkEnd === false) {
          thinkEnd = true
          process.stdout.write('\n</think>\n')
          process.stdout.write('\n<content>\n')
        }
        content += delta.content
        process.stdout.write(delta.content)
      }
    }
    process.stdout.write('\n</content>\n')

    if (content.includes('```')) {
      content = content.replace(/```ya?ml\n|```/g, '')
    }

    const doc = parseDocument(content)
    const meta = {
      code,
      name,
      timestamp: new Date().toISOString(),
      model: process.env.OPENAI_MODEL!,
    }
    const yaml = `${stringify({ __meta__: meta })}\n${doc.toString()}`

    await writeFile(resolve(OUTPUT_DIR, `${code}.yaml`), yaml)

    consola.success(`[${code}] ${name} translated successfully`)
  } catch (e) {
    consola.error(`[${code}] ${name} translation failed: ${e}`)
    await writeFile(
      resolve(import.meta.dirname, 'llm-error.log'),
      `[${new Date().toISOString()}] ${code} ${name} ${e}\n${content}\n\n`,
      {
        flag: 'a',
        encoding: 'utf-8',
      }
    )
  }
}

consola.success('LLM translation completed')
