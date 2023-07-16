import { Composer, Scenes } from 'telegraf';
import IContext from '../interfaces/Context';
import getWeather from '../api/weatherApi';

const weatherComposer = new Composer<IContext>();
weatherComposer.hears(['/weather', '☀️ Прогноз погоды'], async (ctx) => ctx.scene.enter('sceneWeather'));

const cityInfo = new Composer<IContext>();
cityInfo.on('message', async (ctx) => {
  if (!('text' in ctx.message)) {
    ctx.reply('Введите корректное название');
    return ctx.scene.leave();
  }
  try {
    await getWeather(ctx.message.text)
      .then((res) => {
        console.log(res);
        ctx.replyWithHTML(`
Погода в городе ${res.location.name} (${res.location.country})
Сейчас ${res.current.temp_c}° (ощущается ${res.current.feelslike_c}°), ${res.current.is_day ? 'день' : 'ночь'}
Влажность: ${res.current.humidity}%
Облачность: ${res.current.cloud}%
Состояние: ${res.current.condition.text.toLowerCase()}
Скорость ветра: ${res.current.wind_kph} км/ч
        `);
      });
  } catch (e) {
    console.log(e);
  }
  return ctx.scene.leave();
});

const weatherScene = new Scenes.WizardScene(
  'sceneWeather',
  async (ctx) => {
    await ctx.reply('Введите город для получения данных');
    return ctx.wizard.next();
  },
  cityInfo,
);

export {
  weatherComposer,
  weatherScene,
};
