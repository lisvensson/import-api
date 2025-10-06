import fs from 'fs';
import readline from 'readline';
import { emailAnalyze } from './emailAnalyze.js';
import { getNameList, nameAnalyze } from './nameAnalyze.js';

export async function parseCsvFile(filePath: string) {
  const readStream = fs.createReadStream(filePath, {encoding: 'utf-8'});
  const rl = readline.createInterface({ input: readStream });

  return await new Promise<{ columns: { name: string; hint: { type: string; probability: number } }[]; rows: string[][] }>((resolve, reject) => {
    const rows: string[][] = []
    rl.on('line', (line) => {
      const row = line.trim().split(';');
      rows.push(row);
      console.log(row);
    })
    rl.on('close', async () => {
      console.log('Finished reading file');
      const filePath = './src/assets/names.txt';
      const nameList = await getNameList(filePath);
      const headers = rows[0];
      const dataRows = rows.slice(1);
      const columns = headers.map((name, index) => {
        const columnValues = dataRows.map(row => row[index] ?? '');
        const emailProbability = emailAnalyze(columnValues);
        const nameProbability = nameAnalyze(columnValues, nameList);
        const hint = emailProbability > 0
        ? {type: 'email', probability: Number(emailProbability.toFixed(2))}
        : nameProbability > 0
        ? {type: 'person name', probability: Number(nameProbability.toFixed(2))}
        : undefined;
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