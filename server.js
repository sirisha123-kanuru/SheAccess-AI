import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import handler from './api/chat.js'
const app = express()
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
app.use(express.json())
app.all('/api/chat', (req, res) => handler(req, res))
app.use(express.static(dist))
app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html'), (e) => e && res.status(404).end()))
const port = process.env.PORT || 8787
app.listen(port, () => console.log('SheAccess API on :' + port))
