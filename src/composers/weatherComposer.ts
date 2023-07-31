import {Composer, Markup, Scenes} from 'telegraf';
import IContext from '../interfaces/Context';
import getWeather from '../api/weatherApi';
import {subWeather, unsubWeatherByCity} from '../controllers/weatherController';
import {i18n} from '../app';
import leaveFoo from "./leaveComposer";
import {message} from "telegraf/filters";


const weatherComposer = new Composer<IContext>();
weatherComposer.hears(['/weather', '☀️ Прогноз погоды'], async (ctx) => ctx.scene.enter('sceneWeather'));

const welcomeWeather = async (ctx: IContext) => {
    await ctx.reply(i18n.t('ru', 'cityStart'), Markup.removeKeyboard());
    await ctx.wizard.next();
}

const cityInfo = new Composer<IContext>();
cityInfo.command('leave', leaveFoo());
cityInfo.on(message('text'), async (ctx) => {
    await getWeather(ctx.message.text)
        .then((res) => {
            ctx.scene.session.chatId = ctx.message.chat.id;
            ctx.replyWithHTML(
                i18n.t('ru', 'weather', {res}),
                Markup.inlineKeyboard([Markup.button.callback('☔ Получать ежедневный прогноз ', 'btn_weather_sub')]),
            );
        })
        .catch(() => ctx.reply(i18n.t('ru', 'errorGetWeather')));
});

cityInfo.action('btn_weather_sub', async (ctx) => {
    if (!ctx.update.callback_query.message) return;
    const cityName = ctx.update.callback_query.message;
    const chatId = ctx.scene.session.chatId;
    await ctx.editMessageReplyMarkup({
        inline_keyboard: [[Markup.button.callback('❌ Отписаться', 'btn_weather_unsub')]],
    });
    await subWeather(chatId, cityName);
});

cityInfo.action('btn_weather_unsub', async (ctx) => {
    if (!ctx.update.callback_query.message) return;
    const cityName = ctx.update.callback_query.message;
    const chatId = ctx.scene.session.chatId;
    await ctx.editMessageReplyMarkup({
        inline_keyboard: [[Markup.button.callback('☔ Получать ежедневный прогноз ', 'btn_weather_sub')]],
    });
    await unsubWeatherByCity(chatId, cityName);
});

const weatherScene = new Scenes.WizardScene(
    'sceneWeather',
    welcomeWeather,
    cityInfo,
);

export {
    weatherComposer,
    weatherScene,
};
