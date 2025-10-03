import fs from 'fs/promises';

export async function getNameList(filePath: string): Promise<Set<string>> {
    const content = await fs.readFile(filePath, 'utf-8');
    const names = content.split('\n').map(name => name.trim().toLowerCase()).filter(name => name.length > 0);
    return new Set(names);
}

export function nameAnalyze(values: string[], names: Set<string>): number {
    const totalValue = values.length;
    if (totalValue === 0) return 0;

    const validNames = values.filter(value => {
        const nameParts = value.trim().split(/\s+/); 
        const result = nameParts.every(part => names.has(part.toLowerCase()));
        return result;
    });

    return (validNames.length / totalValue);
}