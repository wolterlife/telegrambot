interface ILocation {
  name: string,
  country: string,
}

interface ICondition {
  text: string
}

interface ICurrent {
  temp_c: number,
  is_day: number,
  feelslike_c: number,
  wind_kph: number,
  humidity: number,
  cloud: number,
  condition: ICondition,
}

interface IWeather {
  location: ILocation,
  current: ICurrent,
}

export default IWeather;
