import { Composer } from 'telegraf';
import getDog from '../api/dogApi';

const dogComposer = new Composer();

dogComposer.hears(['🐶 Собака', '/dog'], async (ctx) => {
  try {
    await getDog().then((res) => ctx.sendPhoto(res));
  } catch (e) {
    await ctx.reply('Произошла ошибка при загрузке картинки');
  }
});

export default dogComposer;
