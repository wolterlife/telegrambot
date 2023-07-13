import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import start from './controllers/start';
import help from './controllers/help';
import animals from './controllers/animals';

dotenv.config({ path: './config/.env' });
const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.use(start);
bot.use(help);
bot.use(animals);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
