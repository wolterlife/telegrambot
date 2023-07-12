require('dotenv').config({ path: './config/.env' });
const { Telegraf, Markup } = require('telegraf');
const text = require('./const');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.replyWithHTML(`Приветствую <b>${ctx.message.from.first_name} ${ctx.message.from.last_name}!</b>`, Markup.keyboard(
    [
      [Markup.button.callback('☀️ Прогноз погоды', 'btn_weather')],
      [Markup.button.callback('😺 Кот', 'btn_cat'), Markup.button.callback('🐶 Собака', 'btn_dog')],
    ],
  ).resize());
});

bot.hears(['😺 Кот', '/cat'], (ctx) => {
  ctx.reply('Выбран котяра');
});

bot.help((ctx) => ctx.reply(text.commands));

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
