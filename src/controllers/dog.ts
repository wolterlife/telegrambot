import { Composer } from 'telegraf';
import axios, { AxiosHeaders } from 'axios';

const dog = new Composer();
const headers = new AxiosHeaders({ 'x-api-key': process.env.ANIMALS_TOKEN || '' });

dog.hears(['🐶 Собака', '/dog'], async (ctx) => {
  try {
    await axios
      .get('https://api.thedogapi.com/v1/images/search', { headers })
      .then((res) => ctx.sendPhoto(res.data[0].url));
  } catch (e) {
    console.log(e);
  }
});

export default dog;
