import { Composer } from 'telegraf';
import getCat from '../api/catApi';
import { i18n } from '../app';

const catComposer = new Composer();

catComposer.hears(['😺 Кот', '/cat'], async (ctx) => {
  try {
    await getCat().then((res) => ctx.sendPhoto(res));
  } catch (e) {
    await ctx.reply(i18n.t('ru', 'errorImg'));
  }
});

export default catComposer;
