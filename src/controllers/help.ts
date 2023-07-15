import { Composer } from 'telegraf';

const help = new Composer();

help.help((ctx) => ctx.reply(`
/start - Перезапуск бота
/help - Помощь
/weather - Прогноз погоды
/cat - Случайный кот
/dog - Случайная собака`));

export default help;
