import { Composer, Markup, Scenes } from 'telegraf';
import IContext from '../interfaces/Context';
import getWeather from '../api/weatherApi';
import { subWeather, unsubWeather } from '../controllers/Weather.controller';
import { i18n } from '../app';

// Todo: переделать в контекст? Если в общий, - значение доставались с undefined.

const weatherComposer = new Composer<IContext>();
weatherComposer.hears(['/weather', '☀️ Прогноз погоды'], async (ctx) => ctx.scene.enter('sceneWeather'));

const cityInfo = new Composer<IContext>();
cityInfo.command('leave', (ctx) => ctx.scene.leave());
cityInfo.on('message', async (ctx) => {
  if (!('text' in ctx.message)) {
    ctx.reply(i18n.t('ru', 'errorInputCity'));
    return;
  }
  await getWeather(ctx.message.text)
    .then((res) => {
      ctx.scene.session.chatId = ctx.message.chat.id;
      ctx.replyWithHTML(
        i18n.t('ru', 'weather', { res }),
        Markup.inlineKeyboard([Markup.button.callback('☔ Получать ежедневный прогноз ', 'btn_weather_sub')]),
      );
    })
    .catch(() => ctx.reply(i18n.t('ru', 'errorGetWeather')));
});

cityInfo.action('btn_weather_sub', async (ctx) => {
  if (!ctx.update.callback_query.message) return;
  const cityName = ctx.update.callback_query.message;
  const { chatId } = ctx.scene.session;
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [[Markup.button.callback('❌ Отписаться', 'btn_weather_unsub')]],
  });
  await subWeather(chatId, cityName);
});

cityInfo.action('btn_weather_unsub', async (ctx) => {
  if (!ctx.update.callback_query.message) return;
  const cityName = ctx.update.callback_query.message;
  const { chatId } = ctx.scene.session;
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [[Markup.button.callback('☔ Получать ежедневный прогноз ', 'btn_weather_sub')]],
  });
  await unsubWeather(chatId, cityName);
});

const weatherScene = new Scenes.WizardScene(
  'sceneWeather',
  async (ctx) => {
    await ctx.reply(i18n.t('ru', 'weatherStart'), Markup.removeKeyboard());
    await ctx.wizard.next();
  },
  cityInfo,
);

export {
  weatherComposer,
  weatherScene,
};
