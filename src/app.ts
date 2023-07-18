import 'reflect-metadata';
import { Scenes, session, Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import AppDataSource from './db';
import IContext from './interfaces/Context';
import { weatherComposer, weatherScene } from './composers/weather.composer';
import startComposer from './composers/start.composer';
import helpComposer from './composers/help.composer';
import catComposer from './composers/cat.composer';
import dogComposer from './composers/dog.composer';

dotenv.config({ path: './src/config/.env' });
const bot = new Telegraf<IContext>(process.env.BOT_TOKEN || '');
const stage = new Scenes.Stage<IContext>([weatherScene]);

AppDataSource.initialize()
  .then(() => {
    console.log('db init');
  })
  .catch((error) => console.log(error));

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
