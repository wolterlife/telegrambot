import { Composer } from 'telegraf';
import getCat from '../api/catApi';

const catComposer = new Composer();

catComposer.hears(['😺 Кот', '/cat'], async (ctx) => {
  try {
    await getCat().then((res) => ctx.sendPhoto(res));
  } catch (e) {
    console.log(e);
  }
});

export default catComposer;
