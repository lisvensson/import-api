import * as fsp from 'fs/promises'

export async function parseCsvFile(filePath: string) {
  const fileContent = await fsp.readFile(filePath, 'utf-8');
  const rows = fileContent.trim().split('\n').map(row => row.split(';'));
  const headers = rows[0];
  const columns = headers.map(name => ({
        name,
        hint: name.toLowerCase().includes('e-post') || name.toLowerCase().includes('email') ? 'email' : 'text'
  }));
  const dataRows = rows.slice(1);

  return { columns, rows: dataRows }
}