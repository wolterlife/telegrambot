const { Telegraf } = require('telegraf');
require('dotenv').config()
const text = require('./const')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Приветствую ${ctx.message.from.first_name} ${ctx.message.from.last_name}!`));
bot.help((ctx) => ctx.reply(text.commands))



bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
