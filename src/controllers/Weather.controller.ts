import schedule from 'node-schedule';
import AppDataSource from '../db';
import Weather from '../models/WeatherSub.model';
import getWeather from '../api/weatherApi';
import { bot, i18n } from '../app';
import subscribeWeatherAll from '../subscribers/Weather.subscriber';

// TODO: fix any type;
async function subWeather(ownerId: number, cityName?: any) {
  const currentDate = Date.now();
  const weatherRepos = AppDataSource.getRepository(Weather);
  const weather = new Weather();
  const modCity = cityName.text.split('\n')[0].replace('Погода в городе ', '');
  weather.owner = ownerId;
  weather.city = modCity;
  weather.subTime = Math.trunc(currentDate);
  await weatherRepos.save(weather);
  await subscribeWeatherAll();
}

async function unsubWeather(ownerId: number, cityName?: any) {
  const modCity = cityName.text.split('\n')[0].replace('Погода в городе ', '');
  const weatherRepos = AppDataSource.getRepository(Weather);
  await weatherRepos.delete({ owner: ownerId, city: modCity });
  await subscribeWeatherAll();
}

async function getAllSubWeathers() {
  return AppDataSource.getRepository(Weather).find();
}

export {
  subWeather,
  unsubWeather,
  getAllSubWeathers,
};
