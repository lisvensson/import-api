import * as http from 'node:http';
import { createRequestListener, FetchHandler } from '@remix-run/node-fetch-server';
import { performance } from 'node:perf_hooks';
import { parseFormData } from '@remix-run/form-data-parser';
import 'dotenv/config';
import { uploadHandler1 } from './utils/uploadHandler1.js';
import { uploadHandler2 } from './utils/uploadHandler2.js';
import { parseCsvFile } from './utils/parseCsvFile.js';

const handler: FetchHandler = async (request: Request, client) => {
  const start = performance.now();
  let url = new URL(request.url);
  let path = url.pathname;
  let method = request.method;
  console.log(`Path: ${path}`);
  console.log(`Method: ${method}`);
  console.log(`Client IP: ${client.address}:${client.port}`);

  const authHeader = request.headers.get('Authorization');
  const apiKey = process.env.API_KEY;

  if (!authHeader || authHeader !== apiKey) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  if (path === '/upload1' && method === 'POST') {
    try {    
      const formData = await parseFormData(request, uploadHandler1);
      const uploadedFile = formData.get('file') as string;
      const {columns, rows} = await parseCsvFile(uploadedFile);

      if (!uploadedFile) {
        return Response.json({success: false, message: 'No file uploaded'}, {status: 400});
      }

      return Response.json({
        success: true,
        file: uploadedFile,
        columns,
        rows
      });

    } catch (error) {
      console.error('Upload failed:', error);
      return Response.json({success: false, error: 'Upload failed'}, {status: 500});
    }
  }

  if (path === '/upload2' && method === 'POST') {
    try {
      const formData = await parseFormData(request, uploadHandler2);
      const uploadedFile = formData.get('file');

      if (!uploadedFile) {
        return Response.json({success: false, message: 'No file uploaded'}, {status: 400});
      }

      return Response.json({
        success: true,
        file: uploadedFile,
      });

    } catch (error) {
      console.error('Upload failed:', error);
      return Response.json({success: false, error: 'Upload failed'}, {status: 500});
    }
  }

  return new Response('Not Found', { status: 404 });
}

let server = http.createServer(createRequestListener(handler));

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});