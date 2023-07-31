import AppDataSource from '../db';
import Weather from '../models/WeatherModel';
import {setNotificationWeather, subscribeWeatherAll} from '../subscribers/weatherSubscriber';
import {subscribeTaskAll} from "../subscribers/taskSubscriber";
import schedule from "node-schedule";

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

async function unsubWeatherByCity(ownerId: number, cityName?: any) {
    const modCity = cityName.text.split('\n')[0].replace('Погода в городе ', '');
    const weatherRepos = AppDataSource.getRepository(Weather);
    await weatherRepos.delete({owner: ownerId, city: modCity});
    await schedule.gracefulShutdown()
    await subscribeWeatherAll();
    await subscribeTaskAll();
}

async function unsubWeatherById(id: number) {
    const weatherRepos = AppDataSource.getRepository(Weather);
    await weatherRepos.delete({id});
    await schedule.gracefulShutdown()
    await subscribeWeatherAll();
    await subscribeTaskAll();
}

async function getAllSubWeathers() {
    return AppDataSource.getRepository(Weather).find();
}

async function getUserSubWeathers(owner: number) {
    return AppDataSource.getRepository(Weather).find({where: {owner}})
}

export {
    subWeather,
    unsubWeatherByCity,
    unsubWeatherById,
    getAllSubWeathers,
    getUserSubWeathers,
};
