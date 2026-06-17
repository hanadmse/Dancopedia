import fs from 'node:fs/promises';
import path from 'node:path';

const envPath = path.resolve(import.meta.dirname, '../../src/config/.env');
const envBackupPath = path.resolve(import.meta.dirname, '../../src/config/.env.e2e-backup');

export default async function globalTeardown() {
  try {
    const contents = await fs.readFile(envPath, 'utf8');
    if (contents.includes('DANCOPEDIA_E2E_ACTIVE=1')) {
      const backupContents = await fs.readFile(envBackupPath, 'utf8');
      if (backupContents === '') {
        await fs.unlink(envPath);
      } else {
        await fs.writeFile(envPath, backupContents, 'utf8');
      }
    }
    await fs.unlink(envBackupPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}
