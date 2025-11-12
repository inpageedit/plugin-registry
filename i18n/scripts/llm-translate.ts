import 'dotenv/config'
import { OpenAI } from 'openai'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  ChatCompletionChunk,
  ChatCompletionCreateParamsStreaming,
} from 'openai/resources/index.mjs'
import consola from 'consola'
import { parseDocument, isMap } from 'yaml'

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
  ar: 'العربية (ar)',
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
  const stream = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL!,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    enable_thinking: true,
  } as ChatCompletionCreateParamsStreaming)
  let content = ''
  let thinkEnd: null | boolean = null
  for await (const chunk of stream) {
    const delta = chunk.choices[0].delta as ChatCompletionChunk.Choice.Delta & {
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
  if (isMap(doc.contents)) {
    // Ensure __meta__ exists and stays at the top
    doc.contents.delete('__meta__')
    const pair = doc.createPair('__meta__', meta)
    ;(doc.contents as any).items.unshift(pair as any)
    // append a blank line after __meta__ by inserting spaceBefore on the next item
    if ((doc.contents as any).items.length > 1) {
      ;(doc.contents as any).items[0].spaceAfter = 1
    }
  } else {
    // Fallback: if root is not a map, just set __meta__ (appends at end)
    doc.set('__meta__', meta)
  }
  const yaml = doc.toString()

  await writeFile(resolve(OUTPUT_DIR, `${code}.yaml`), yaml)

  consola.success(`[${code}] ${name} translated successfully`)
}

consola.success('LLM translation completed')
