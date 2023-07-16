import { Markup, Composer } from 'telegraf';

const startComposer = new Composer();

startComposer.start(async (ctx) => {
  await ctx.replyWithHTML(`Приветствую <b>${ctx.message.from.first_name} ${ctx.message.from.last_name}!</b>`, Markup.keyboard(
    [
      [Markup.button.callback('☀️ Прогноз погоды', 'btn_weather')],
      [Markup.button.callback('😺 Кот', 'btn_cat'), Markup.button.callback('🐶 Собака', 'btn_dog')],
    ],
  ).resize());
});

export default startComposer;