import fs from 'fs';
import readline from 'readline';
import { emailAnalyze } from './emailAnalyze.js';

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
      const dataRows = rows.slice(1);
      const columns = headers.map((name, index) => {
        const columnValues = dataRows.map(row => row[index] ?? '');
        const emailPercentage = emailAnalyze(columnValues);
        let hint = 'text';
        if (emailPercentage) {
          hint = `email (${emailPercentage.toFixed(0)}%)`;
        } 
        return { name, hint };
      })
      resolve({columns, rows: dataRows});
    })
    rl.on('error', (error) => {
      console.log('An error occured: ', error);
      reject(error);
    })
  })
}