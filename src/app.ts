import 'reflect-metadata';
import dotenv from 'dotenv';
import { I18n } from '@edjopato/telegraf-i18n';
import { Scenes, session, Telegraf } from 'telegraf';
import IContext from './interfaces/Context';
import AppDataSource from './db';
import { weatherComposer, weatherScene } from './composers/weather.composer';
import startComposer from './composers/start.composer';
import helpComposer from './composers/help.composer';
import catComposer from './composers/cat.composer';
import dogComposer from './composers/dog.composer';
import subscribeWeatherAll from './subscribers/Weather.subscriber';

dotenv.config({ path: './src/config/.env' });
const bot = new Telegraf<IContext>(process.env.BOT_TOKEN || '');
const stage = new Scenes.Stage<IContext>([weatherScene]);

AppDataSource.initialize()
  .then(() => {
    console.log('db init');
    subscribeWeatherAll();
  })
  .catch((error) => console.log(error));

const i18n = new I18n({
  defaultLanguage: 'ru',
  defaultLanguageOnMissing: true,
  allowMissing: false,
  directory: './src/locales',
});

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
export {
  bot,
  i18n,
};
