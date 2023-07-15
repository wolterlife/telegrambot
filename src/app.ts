import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import start from './controllers/start';
import help from './controllers/help';
import cat from './controllers/cat';
import dog from './controllers/dog';

dotenv.config({ path: './src/config/.env' });
const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.use(start);
bot.use(help);
bot.use(cat);
bot.use(dog);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
