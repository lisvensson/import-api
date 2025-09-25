import * as http from 'node:http'
import { createRequestListener, FetchHandler } from '@remix-run/node-fetch-server'
import { performance } from 'node:perf_hooks';


const handler: FetchHandler = async (request: Request, client) => {
  const start = performance.now();
  let url = new URL(request.url);
  let path = url.pathname;
  let method = request.method;
  console.log(`Path: ${path}`);
  console.log(`Method: ${method}`);
  console.log(`Client IP: ${client.address}:${client.port}`);

  if (path === '/' && method === 'GET') {
    return new Response('Hello world!');
  }

  if (path === '/hello' && method === 'POST') {
    try {
       let formData = await request.json();
       let name = formData.name;

       if (!name) {
        return Response.json({error: 'Name is required'}, {status: 400});
      } 
      const end = performance.now();
      console.log(`Request time: ${end - start} milliseconds`);
      return Response.json(`Hello ${name}`);
      
    } catch (error) {
      return Response.json({error: 'Invalid JSON'}, {status: 400});
    }
  }

  return new Response('Not Found', { status: 404 });
}

let server = http.createServer(createRequestListener(handler));

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});