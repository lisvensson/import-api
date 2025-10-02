import { LocalFileStorage } from '@remix-run/file-storage/local';
import { FileUpload } from '@remix-run/form-data-parser';

export async function uploadHandler2(fileUpload: FileUpload) {
    const filePath = 'C:/Users/LiSve/Documents/FSU24/09_LIA-1/import-api/server/src/uploads/';
    const storage = new LocalFileStorage(filePath);

    if (fileUpload.fieldName === 'file') {
        const validateFile = fileUpload.type === 'text/csv';
        if (!validateFile) {
            throw new Error ('Ivalid file typ, only CSV files can be uploaded.');
        }
        const validateFileSize = 2 * 1024 * 1024;
        if (fileUpload.size > validateFileSize) {
            throw new Error('File too large max size is 2MB.');
        }

        const bytes = await fileUpload.bytes();         
        const file = new File([bytes], fileUpload.name, { type: fileUpload.type })
        console.log('File:', file);
        const key = `${Date.now()}-${fileUpload.name}`;
        console.log('Key:', key);
        await storage.set(key, file);

        return `${filePath}${key}` 
    }
}