import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

export async function readTasks() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    const db = JSON.parse(data);
    return db.tasks || [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeTasks([]);
      return [];
    }
    console.error('Error reading database file:', error);
    throw error;
  }
}

export async function writeTasks(tasks) {
  try {
    const data = JSON.stringify({ tasks }, null, 2);
    const tempFile = `${DB_FILE}.tmp`;
    await fs.writeFile(tempFile, data, 'utf8');
    await fs.rename(tempFile, DB_FILE);
  } catch (error) {
    console.error('Error writing to database file:', error);
    throw error;
  }
}
