import fs from 'fs';

export async function parseCsvFile(filePath: string) {
  const readStream = fs.createReadStream(filePath, {encoding: 'utf-8', highWaterMark: 1024})

  let fileContent = '';

  return await new Promise<{ columns: { name: string; hint: string }[]; rows: string[][] }>((resolve, reject) => {
    readStream.on('data', (chunk) => {
      console.log('Chunk of data: ', chunk);
      fileContent += chunk
    })
    readStream.on('end', () => {
      console.log('Finished reading file');
      const rows = fileContent.trim().split('\n').map(row => row.split(';'));
      const headers = rows[0];
      const columns = headers.map(name => {
        let hint = 'text';
        if (name.toLowerCase().includes('e-post') || name.toLowerCase().includes('email')) {
          hint = 'email';
        } else if (name.toLowerCase().includes('namn') || name.toLowerCase().includes('name')) {
          hint = 'person name';
        }
        return { name, hint }
      });

      const dataRows = rows.slice(1);
      resolve({columns, rows: dataRows});
    })
    readStream.on('error', (error) => {
      console.log('An error occured: ', error);
      reject(error);
    })
  })
}