import schedule from 'node-schedule';
import {getAllSubWeathers} from '../controllers/weatherController';
import {bot, i18n} from "../app";
import getWeather from "../api/weatherApi";

const dateToCron = (date: number) => {
    const convert = new Date(+date);
    const minutes = convert.getMinutes();
    const hours = convert.getHours();
    return `${minutes} ${hours} */1 * *`;
};

async function setNotificationWeather(owner: number, city: string, alertDate: number) {
    console.log(owner, city, alertDate);
        schedule.scheduleJob(dateToCron(alertDate), async () =>
            await getWeather(city).then((res) => {
                    bot.telegram.sendMessage(owner, i18n.t('ru', 'weatherAlert', {res}))
                }
            ));
}

async function subscribeWeatherAll() {
    const subs = await getAllSubWeathers();
    subs.forEach((sub) => {
        schedule.scheduleJob(dateToCron(sub.subTime), async () =>
            await getWeather(sub.city).then((res) => {
                    bot.telegram.sendMessage(sub.owner, i18n.t('ru', 'weatherAlert', {res}))
                }
            ));
    });
}

export {
    subscribeWeatherAll,
    setNotificationWeather,
}
