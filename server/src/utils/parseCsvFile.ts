import fs from 'fs';
import readline from 'readline'

export async function parseCsvFile(filePath: string) {
  const readStream = fs.createReadStream(filePath, {encoding: 'utf-8'});
  const rl = readline.createInterface({ input: readStream });

  return await new Promise<{ columns: { name: string; hint: string }[]; rows: string[][] }>((resolve, reject) => {
    const rows: string[][] = []
    rl.on('line', (line) => {
      const row = line.trim().split(';');
      rows.push(row);
      console.log(row);
    })
    rl.on('close', () => {
      console.log('Finished reading file');
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
    rl.on('error', (error) => {
      console.log('An error occured: ', error);
      reject(error);
    })
  })
}