import { Hono } from 'hono'
import api from './api'

const app = new Hono()
const PORT = 3001

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api', api)

export default {
  port: PORT,
  fetch: app.fetch
}

console.log(`🔥 Hono is running on port ${PORT}!`)