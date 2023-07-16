import axios from 'axios';
import IWeather from '../interfaces/Weather';

const getWeather = async (city: string) => axios
  .get<IWeather>(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_TOKEN}&q=${city}&aqi=no`)
  .then((res) => res.data);

export default getWeather;
