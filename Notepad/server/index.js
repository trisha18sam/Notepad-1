import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

const PORT = process.env.PORT || 4000

const DB_NAME = process.env.DB_NAME || 'notepad_db'

// ensure database exists first
const adminConn = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
})
await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)
await adminConn.end()

const pool = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

// ensure table exists
await (async function ensureTable() {
  const create = `
  CREATE TABLE IF NOT EXISTS informations (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `
  await pool.query(create)
})()

app.get('/api/notes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, avatar, created_at FROM informations ORDER BY created_at DESC')
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
    await pool.query(
      `INSERT INTO informations (id, title, body, avatar) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), avatar = VALUES(avatar)`,
      [id, title, body || '', avatar || '']
    )
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

app.get('/api/describe', async (req, res) => {
  try {
    const [rows] = await pool.query('DESCRIBE informations')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

app.listen(PORT, () => console.log(`API server listening on ${PORT}`))
