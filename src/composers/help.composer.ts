import { Composer } from 'telegraf';

const helpComposer = new Composer();

helpComposer.help((ctx) => ctx.reply(`
/start - Перезапуск бота
/help - Помощь
/weather - Прогноз погоды
/cat - Случайный кот
/dog - Случайная собака`));

export default helpComposer;
