import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import User from './models/User.model';

dotenv.config({ path: './src/config/.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_LOGIN,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  entities: [User],
  synchronize: true,
  logging: false,
  ssl: true,
});

export default AppDataSource;
