import AppDataSource from "../db";
import Task from "../models/TaskModel";
import {setNotificationTask, subscribeTaskAll} from "../subscribers/taskSubscriber";
import schedule from "node-schedule";
import {subscribeWeatherAll} from "../subscribers/weatherSubscriber";

async function addTask(owner: number, text: string, date: string) {
    const taskRepos = AppDataSource.getRepository(Task);
    const task = new Task();
    task.owner = owner;
    task.text = text;
    task.dateAndTime = date;
    task.isAlert = false;
    task.alertTime = '';
    return await taskRepos.save(task);
}

async function getUserTasks(currentOwner: number) {
    console.log(currentOwner);
    const taskRepos = AppDataSource.getRepository(Task)
    return await taskRepos.find({where: {owner: currentOwner}})
}

async function removeTask(ownerId: number, task?: string) {
    const taskRepos = AppDataSource.getRepository(Task)
    if (task) {
        const [taskText, taskDate] = task.split(' - ');
        return await taskRepos.delete({owner: ownerId, text: taskText, dateAndTime: taskDate})
    }
}

async function subTask(owner: number, task: string, alertDate: string,) {
    const taskRepos = AppDataSource.getRepository(Task);
    const [taskText, taskDate] = task.split(' - ');
    await taskRepos.update({owner, text: taskText, dateAndTime: taskDate}, {
        alertTime: alertDate,
        isAlert: true,
    })
    await setNotificationTask(owner, task, alertDate);
}

async function unsubTask(id: number) {
    const taskRepos = AppDataSource.getRepository(Task);
    await taskRepos.update({id}, {
        alertTime: '',
        isAlert: false,
    })
    await schedule.gracefulShutdown()
    await subscribeWeatherAll();
    await subscribeTaskAll();
}


async function getAllSubTasks() {
    return AppDataSource.getRepository(Task).find({
        where: {isAlert: true}
    });
}

async function getUserSubTasks(currentOwner: number) {
    return AppDataSource.getRepository(Task).find({
        where: {
            isAlert: true,
            owner: currentOwner,
        }
    });
}

export {
    addTask,
    getUserTasks,
    removeTask,
    subTask,
    unsubTask,
    getAllSubTasks,
    getUserSubTasks,
}