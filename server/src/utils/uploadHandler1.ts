import { FileUpload } from '@remix-run/form-data-parser';
import * as fsp from 'node:fs/promises';

export async function uploadHandler1(fileUpload: FileUpload) {
  if (fileUpload.fieldName === 'file') {
    const validateFile = fileUpload.type === 'text/csv';
    if (!validateFile) {
      throw new Error ('Ivalid file typ, only CSV files can be uploaded.');
    }
    const validateFileSize = 2 * 1024 * 1024;
    if (fileUpload.size > validateFileSize) {
      throw new Error('File too large max size is 2MB.');
    }

    const filePath = `./src/uploads/${Date.now()}-${fileUpload.name}`;
    const bytes = await fileUpload.bytes();
    await fsp.writeFile(filePath, bytes);
    console.log(fileUpload);
    return filePath;
  }
}