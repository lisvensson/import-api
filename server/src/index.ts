import * as fsp from 'node:fs/promises';
import * as http from 'node:http';
import { createRequestListener, FetchHandler } from '@remix-run/node-fetch-server';
import { performance } from 'node:perf_hooks';
import { FileUpload, parseFormData } from '@remix-run/form-data-parser';
import { LocalFileStorage } from '@remix-run/file-storage/local';
import 'dotenv/config';


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
      const uploadHandler = async (fileUpload: FileUpload) => {
        if (fileUpload.fieldName === 'file') {
          const filePath = `C:/Users/LiSve/Documents/FSU24/09_LIA-1/import-api/server/src/uploads/${Date.now()}-${fileUpload.name}`;
          const bytes = await fileUpload.bytes();
          await fsp.writeFile(filePath, bytes);
          console.log(fileUpload);
          return filePath;
        }
      }

      const formData = await parseFormData(request, uploadHandler);
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

  if (path === '/upload2' && method === 'POST') {
    const storage = new LocalFileStorage('C:/Users/LiSve/Documents/FSU24/09_LIA-1/import-api/server/src/uploads/')
    try {    
      const uploadHandler = async (fileUpload: FileUpload) => {
        if (fileUpload.fieldName === 'file') {
          const bytes = await fileUpload.bytes()
          const file = new File([bytes], fileUpload.name, { type: fileUpload.type })
          console.log('File:', file);
          const key = `${Date.now()}-${fileUpload.name}`;
          console.log('Key:', key)
          await storage.set(key, file);

          return `/uploads/${key}` 
        }
      }

      const formData = await parseFormData(request, uploadHandler);
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