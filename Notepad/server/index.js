import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.DB_NAME || 'notepad_db'
const COLLECTION_NAME = process.env.DB_COLLECTION || 'informations'
const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment variables')
}

const translationCache = new Map()

const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })

try {
  await client.connect()
  await client.db(DB_NAME).command({ ping: 1 })
  console.log('MongoDB connected')
} catch (err) {
  console.error('MongoDB connection failed:', err.message)
  throw err
}

const db = client.db(DB_NAME)
const notesCollection = db.collection(COLLECTION_NAME)

await notesCollection.createIndex({ id: 1 }, { unique: true })
await notesCollection.createIndex({ created_at: -1 })

app.get('/api/notes', async (req, res) => {
  try {
    const rows = await notesCollection
      .find({}, { projection: { _id: 0, id: 1, title: 1, avatar: 1, created_at: 1 } })
      .sort({ created_at: -1 })
      .toArray()
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

app.post('/api/notes', async (req, res) => {
  try {
    const { id, title, body, avatar } = req.body
    if (!id || !title) return res.status(400).json({ error: 'missing_fields' })

    await notesCollection.updateOne(
      { id },
      {
        $set: {
          title,
          body: body || '',
          avatar: avatar || '',
        },
        $setOnInsert: {
          created_at: new Date(),
        },
      },
      { upsert: true }
    )

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

app.get('/api/describe', async (req, res) => {
  try {
    const rows = [
      { Field: 'id', Type: 'number', Null: 'NO', Key: 'UNI' },
      { Field: 'title', Type: 'string', Null: 'NO', Key: '' },
      { Field: 'body', Type: 'string', Null: 'YES', Key: '' },
      { Field: 'avatar', Type: 'string', Null: 'YES', Key: '' },
      { Field: 'created_at', Type: 'date', Null: 'YES', Key: 'MUL' },
    ]
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

app.post('/api/translate', async (req, res) => {
  try {
    const { targetLanguage, sourceText } = req.body || {}
    const languageName = String(targetLanguage || '').trim()

    if (!languageName) {
      return res.status(400).json({ error: 'missing_target_language' })
    }

    if (!sourceText || typeof sourceText !== 'object') {
      return res.status(400).json({ error: 'missing_source_text' })
    }

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'missing_groq_api_key' })
    }

    const cacheKey = languageName.toLowerCase()
    const cached = translationCache.get(cacheKey)
    if (cached) {
      return res.json({ translations: cached })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You translate app UI text. Return only valid JSON. Preserve placeholder tokens, brand names like MongoDB and Notepad, and the original JSON keys.',
          },
          {
            role: 'user',
            content: JSON.stringify({ targetLanguage: languageName, sourceText }),
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`groq_request_failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('groq_empty_translation_response')
    }

    const translations = JSON.parse(content)
    translationCache.set(cacheKey, translations)
    res.json({ translations })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'translation_failed' })
  }
})

app.listen(PORT, () => console.log(`API server listening on ${PORT}`))

process.on('SIGINT', async () => {
  await client.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await client.close()
  process.exit(0)
})
