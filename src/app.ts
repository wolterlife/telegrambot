import { Scenes, session, Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import startComposer from './controllers/start.composer';
import helpComposer from './controllers/help.composer';
import catComposer from './controllers/cat.composer';
import dogComposer from './controllers/dog.composer';
import { weatherComposer, weatherScene } from './controllers/weather.composer';
import IContext from './interfaces/Context';

dotenv.config({ path: './src/config/.env' });
const bot = new Telegraf<IContext>(process.env.BOT_TOKEN || '');
const stage = new Scenes.Stage<IContext>([weatherScene]);

bot.use(session());

bot.use(stage.middleware());
bot.use(weatherComposer);
bot.use(startComposer);
bot.use(helpComposer);
bot.use(catComposer);
bot.use(dogComposer);
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
