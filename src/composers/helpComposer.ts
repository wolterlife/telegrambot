import { Composer } from 'telegraf';
import { i18n } from '../app';

const helpComposer = new Composer();

helpComposer.help(async (ctx) => {
  await ctx.reply(i18n.t('ru', 'help'));
});

export default helpComposer;
