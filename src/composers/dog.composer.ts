import { Composer } from 'telegraf';
import getDog from '../api/dogApi';
import { i18n } from '../app';

const dogComposer = new Composer();

dogComposer.hears(['🐶 Собака', '/dog'], async (ctx) => {
  try {
    await getDog().then((res) => ctx.sendPhoto(res));
  } catch (e) {
    await ctx.reply(i18n.t('ru', 'errorImg'));
  }
});

export default dogComposer;
