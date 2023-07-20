import schedule from 'node-schedule';
import {} from 'node-cron';
import { getAllSubWeathers } from '../controllers/Weather.controller';

const dateToCron = (date: number) => {
  const convert = new Date(+date);
  const minutes = convert.getMinutes();
  const hours = convert.getHours();
  return `${minutes} ${hours} */1 * *`;
};

async function subscribeWeatherAll() {
  const subs = await getAllSubWeathers();
  const schedules: any = {};
  // TODO: fix any

  subs.forEach((sub) => {
    schedules[`${sub.id}`] = schedule.scheduleJob(dateToCron(sub.subTime), () => {
      console.log(`Time start: ${sub.subTime} for: ${sub.city}`);
    });
  });
}

export default subscribeWeatherAll;
