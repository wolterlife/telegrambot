import 'reflect-metadata';
import 'dotenv/config.js'
import {I18n} from '@edjopato/telegraf-i18n';
import { limit } from "@grammyjs/ratelimiter"
import {Scenes, session, Telegraf} from 'telegraf';
import IContext from './interfaces/Context';
import AppDataSource from './db';
import {weatherComposer, weatherScene} from './composers/weatherComposer';
import {placeComposer, placeScene} from "./composers/placeComposer";
import {todoComposer, todoScene} from "./composers/todoComposer";
import {alertsComposer, alertsScene} from "./composers/alertsComposer";
import startComposer from './composers/startComposer';
import helpComposer from './composers/helpComposer';
import catComposer from './composers/catComposer';
import dogComposer from './composers/dogComposer';
import {subscribeWeatherAll} from './subscribers/weatherSubscriber';
import {subscribeTaskAll} from "./subscribers/taskSubscriber";

const bot = new Telegraf<IContext>(process.env.BOT_TOKEN || '');
const stage = new Scenes.Stage<IContext>([weatherScene, placeScene, todoScene, alertsScene]);

const i18n = new I18n({
    defaultLanguage: 'ru',
    defaultLanguageOnMissing: true,
    allowMissing: false,
    directory: './src/locales',
});

bot.use(limit({
    timeFrame: 2000,
    limit: 1,
    onLimitExceeded: ctx => { ctx.reply("Помедленее! Вы отправляете сообщения слишком часто 😞") },
}));

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


AppDataSource.initialize()
    .then(() => {
        bot.launch();
        console.log('db init');
        subscribeWeatherAll();
        subscribeTaskAll()
    })
    .catch((error) => console.log(error));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export {
    bot,
    i18n,
};
