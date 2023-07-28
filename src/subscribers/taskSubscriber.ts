import schedule from 'node-schedule';
import {getAllSubTasks} from "../controllers/taskController";
import {bot, i18n} from "../app";

const dateToCron = (date: string) => {
    const convert = new Date(+Date.parse(date.replace(/([0-9]+)\/([0-9]+)/,'$2/$1')));
    const minutes = convert.getMinutes();
    const hours = convert.getHours();
    const days = convert.getDate();
    const months = convert.getMonth() + 1;
    const dayOfWeek = convert.getDay();
    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

async function setNotificationTask(owner: number, sub: string, alertDate: string) {
    schedule.scheduleJob(dateToCron(alertDate), () => {
        bot.telegram.sendMessage(owner, i18n.t('ru', 'oneTaskAlertNew', {sub}))
    });
}

async function subscribeTaskAll() {
    const subs = await getAllSubTasks();
    subs.forEach((sub) => {
        schedule.scheduleJob(dateToCron(sub.alertTime), () => {
            bot.telegram.sendMessage(sub.owner, i18n.t('ru', 'oneTaskAlert', {sub}))
        });
    });
}

export {
    subscribeTaskAll,
    setNotificationTask,
}


