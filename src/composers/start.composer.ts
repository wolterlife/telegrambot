import { Markup, Composer } from 'telegraf';
import addUser from '../controllers/User.controller';
import { i18n } from '../app';

const startComposer = new Composer();

startComposer.start(async (ctx) => {
  await ctx.replyWithHTML(i18n.t('ru', 'start', { ctx }), Markup.keyboard(
    [
      [Markup.button.callback('☀️ Прогноз погоды', 'btn_weather'), Markup.button.callback('🔍 Поиск мест', 'btn_places')],
      [Markup.button.callback('📒 Планировщик задач', 'btn_tasks'), Markup.button.callback('🔔 Управление подписками', 'btn_subscribe_control')],
      [Markup.button.callback('😺 Кот', 'btn_cat'), Markup.button.callback('🐶 Собака', 'btn_dog')],
    ],
  ).resize());
  await addUser(ctx.chat.id, ctx.from.username);
});

export default startComposer;
