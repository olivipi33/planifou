import * as fs from 'fs/promises';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);

export const saveBlobToFile = async (blob: Blob, fileName: string): Promise<void> => {
  try {
    const buffer = await blob.arrayBuffer();
    await writeFile(fileName, Buffer.from(buffer), 'binary');
    console.log('File saved successfully.');
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}
