import { Composer } from 'telegraf';
import axios, { AxiosHeaders } from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });
const animals = new Composer();
const headers = new AxiosHeaders({ 'x-api-key': process.env.ANIMALS_TOKEN || '' });

animals.hears(['😺 Кот', '/cat'], async (ctx) => {
  try {
    await axios
      .get('https://api.thecatapi.com/v1/images/search', { headers })
      .then((res) => ctx.sendPhoto(res.data[0].url));
  } catch (e) {
    console.log(e);
  }
});

animals.hears(['🐶 Собака', '/dog'], async (ctx) => {
  try {
    await axios
      .get('https://api.thedogapi.com/v1/images/search', { headers })
      .then((res) => ctx.sendPhoto(res.data[0].url));
  } catch (e) {
    console.log(e);
  }
});

export default animals;
