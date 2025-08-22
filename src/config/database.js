import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'library',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false,
  }
);

export async function connectWithRetry(retries = 20, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      return true;
    } catch (err) {
      console.error(`[DB] Connection failed (attempt ${i+1}/${retries}):`, err.message);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('Failed to connect to DB after retries');
}
