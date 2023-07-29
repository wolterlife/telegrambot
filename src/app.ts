import 'reflect-metadata';
import dotenv from 'dotenv';
import {I18n} from '@edjopato/telegraf-i18n';
import {Scenes, session, Telegraf} from 'telegraf';
import IContext from './interfaces/Context';
import AppDataSource from './db';
import {weatherComposer, weatherScene} from './composers/weatherComposer';
import {placeComposer, placeScene} from "./composers/placeComposer";
import {todoComposer, todoScene} from "./composers/todoComposer";
import startComposer from './composers/startComposer';
import helpComposer from './composers/helpComposer';
import catComposer from './composers/catComposer';
import dogComposer from './composers/dogComposer';
import {subscribeWeatherAll} from './subscribers/weatherSubscriber';
import {subscribeTaskAll} from "./subscribers/taskSubscriber";
import {alertsComposer, alertsScene} from "./composers/alertsComposer";

dotenv.config({path: './src/config/.env'});
const bot = new Telegraf<IContext>(process.env.BOT_TOKEN || '');
const stage = new Scenes.Stage<IContext>([weatherScene, placeScene, todoScene, alertsScene]);

AppDataSource.initialize()
    .then(() => {
        console.log('db init');
        subscribeWeatherAll();
        subscribeTaskAll()
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
bot.use(placeComposer);
bot.use(todoComposer);
bot.use(startComposer);
bot.use(helpComposer);
bot.use(catComposer);
bot.use(dogComposer);
bot.use(alertsComposer);
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export {
    bot,
    i18n,
};
