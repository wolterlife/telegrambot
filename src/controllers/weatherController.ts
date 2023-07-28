import AppDataSource from '../db';
import Weather from '../models/WeatherModel';
import {setNotificationWeather, subscribeWeatherAll} from '../subscribers/weatherSubscriber';
import {subscribeTaskAll} from "../subscribers/taskSubscriber";
import schedule from "node-schedule";

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
  await setNotificationWeather(ownerId, modCity, Math.trunc(currentDate))
}

async function unsubWeather(ownerId: number, cityName?: any) {
  const modCity = cityName.text.split('\n')[0].replace('Погода в городе ', '');
  const weatherRepos = AppDataSource.getRepository(Weather);
  await weatherRepos.delete({ owner: ownerId, city: modCity });
  await schedule.gracefulShutdown()
  await subscribeWeatherAll();
  await subscribeTaskAll();
}

async function getAllSubWeathers() {
  return AppDataSource.getRepository(Weather).find();
}

export {
  subWeather,
  unsubWeather,
  getAllSubWeathers,
};
