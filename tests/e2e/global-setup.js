import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

const rootDir = path.resolve(import.meta.dirname, '../..');
const configDir = path.join(rootDir, 'src/config');
const envPath = path.join(configDir, '.env');
const envBackupPath = path.join(configDir, '.env.e2e-backup');
const sqlPath = path.join(rootDir, 'src/database/database_creation.sql');

const dbConfig = {
  host: process.env.DANCOPEDIA_DB_HOST,
  port: Number(process.env.DANCOPEDIA_DB_PORT),
  user: process.env.DANCOPEDIA_DB_USER,
  password: process.env.DANCOPEDIA_DB_PASSWORD,
  database: process.env.DANCOPEDIA_E2E_DB_NAME,
};

async function resetDatabase() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  });

  const sourceSql = await fs.readFile(sqlPath, 'utf8');
  const e2eSql = sourceSql.replaceAll('brazil_dances', dbConfig.database);
  await connection.query(e2eSql);
  await connection.query(`USE \`${dbConfig.database}\``);

  const testUser = process.env.TEST_USER_USERNAME;
  const testUserPass = process.env.TEST_USER_PASSWORD;
  const testAdmin = process.env.TEST_ADMIN_USERNAME;
  const testAdminPass = process.env.TEST_ADMIN_PASSWORD;

  await connection.execute(
    `INSERT INTO users_form (username, email, password, user_type)
     VALUES (?, ?, MD5(?), 'user')
     ON DUPLICATE KEY UPDATE email = VALUES(email), password = VALUES(password), user_type = VALUES(user_type)`,
    [testUser, `${testUser}@example.com`, testUserPass],
  );

  await connection.execute(
    `INSERT INTO users_form (username, email, password, user_type)
     VALUES (?, ?, MD5(?), 'admin')
     ON DUPLICATE KEY UPDATE email = VALUES(email), password = VALUES(password), user_type = VALUES(user_type)`,
    [testAdmin, `${testAdmin}@example.com`, testAdminPass],
  );

  await connection.end();
}

async function writePhpEnv() {
  await fs.mkdir(configDir, { recursive: true });

  try {
    await fs.copyFile(envPath, envBackupPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    await fs.writeFile(envBackupPath, '', 'utf8');
  }

  await fs.writeFile(
    envPath,
    [
      'DANCOPEDIA_E2E_ACTIVE=1',
      `DANCOPEDIA_DB_HOST=${dbConfig.host}`,
      `DANCOPEDIA_DB_PORT=${dbConfig.port}`,
      `DANCOPEDIA_DB_USER=${dbConfig.user}`,
      `DANCOPEDIA_DB_PASSWORD=${dbConfig.password}`,
      `DANCOPEDIA_DB_NAME=${dbConfig.database}`,
      '',
    ].join('\n'),
    'utf8',
  );
}

export default async function globalSetup() {
  await resetDatabase();
  await writePhpEnv();
}
