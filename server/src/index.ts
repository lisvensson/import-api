import * as http from 'node:http'
import { createRequestListener } from '@remix-run/node-fetch-server'

async function handler(request: Request) {
  let url = new URL(request.url)

  if (url.pathname === '/' && request.method === 'GET') {
    return new Response('Hello world!')
  }

  return new Response('Not Found', { status: 404 })
}

let server = http.createServer(createRequestListener(handler))

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})