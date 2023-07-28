import {Composer, deunionize, Markup, Scenes} from "telegraf";
import IContext from "../interfaces/Context";
import {i18n} from "../app";
import {addTask, getUserTasks, removeTask, subTask} from "../controllers/taskController";

const todoComposer = new Composer<IContext>();
todoComposer.hears(['/todo', '📒 Задачи'], async (ctx) => ctx.scene.enter('sceneTodo'));

const welcomeTodo = async (ctx: IContext) => {
    await ctx.reply(i18n.t('ru', 'todoStart'),
        Markup.keyboard(
            [
                [Markup.button.callback('Добавить задачу', 'btn_add_task'), Markup.button.callback('Выбрать задачу', 'btn_p_5')],
            ],
        ).resize()
    );
        ctx.scene.session.tasks = await getUserTasks(ctx.message ? ctx.message.chat.id : ctx.scene.session.chatId)
        if (ctx.scene.session.tasks.length) {
            await ctx.reply(ctx.scene.session.tasks
                .map(({text, dateAndTime}, index) => `${index + 1} - ${text} (${dateAndTime})`)
                .join('\n'))
        }
    await ctx.wizard.next();
};

const actionSelector = new Composer<IContext>()
actionSelector.command('leave', (ctx) => ctx.scene.leave());
actionSelector.hears('Добавить задачу', (ctx) => {
    ctx.reply('Введите задачу')
    ctx.wizard.selectStep(2);
})
actionSelector.hears('Выбрать задачу', (ctx) => {
    ctx.reply('Напишите номер задачи')
    ctx.wizard.selectStep(4);
})

const addTaskDate = new Composer<IContext>()
addTaskDate.command('leave', (ctx) => ctx.scene.leave());
addTaskDate.on('message', async (ctx) => {
    if (!('text' in ctx.message)) {
        ctx.reply(i18n.t('ru', 'errorInputCity'));
        return;
    }
    ctx.reply(i18n.t('ru', 'inputDateForTask'))
    ctx.scene.session.taskDate = ctx.message.text;
    ctx.wizard.selectStep(3)
})

const addTaskResult = new Composer<IContext>()
addTaskResult.command('leave', (ctx) => ctx.scene.leave());
addTaskResult.on('message', async (ctx) => {
    if (!('text' in ctx.message)) {
        ctx.reply(i18n.t('ru', 'errorInputCity'));
        return;
    }
    await addTask(ctx.message.chat.id, ctx.scene.session.taskDate, ctx.message.text)
    ctx.scene.reenter()
})

const openTask = new Composer<IContext>()
openTask.command('leave', (ctx) => ctx.scene.leave());
openTask.on('message', (ctx) => {
    if (!('text' in ctx.message)) {
        ctx.reply(i18n.t('ru', 'errorInputCity'));
        return;
    }
    ctx.scene.session.chatId = ctx.message.chat.id;
    let task = ctx.scene.session.tasks[+ctx.message.text - 1]
    if (task) {
        ctx.reply(i18n.t('ru', 'oneTask', {task}),
            Markup.inlineKeyboard([
                Markup.button.callback('Включить уведомления', `btn_task_notification`),
                Markup.button.callback('Удалить', `btn_task_delete`),
            ]))
    } else ctx.reply(i18n.t('ru', 'errorGetTask'))
})

openTask.action('btn_task_delete', async (ctx) => {
    if (!ctx.update.callback_query.message) return;
    const ownerId = ctx.scene.session.chatId;
    const textAndDate = deunionize(ctx.update.callback_query.message).text
    await removeTask(ownerId, textAndDate);
    ctx.answerCbQuery();
    ctx.scene.reenter()
})

openTask.action('btn_task_notification', async (ctx) => {
    if (!ctx.update.callback_query.message) return;
    ctx.scene.session.taskText = deunionize(ctx.update.callback_query.message).text
    ctx.reply(i18n.t('ru', 'inputDateForTask'))
    ctx.answerCbQuery();
    ctx.wizard.selectStep(5)
})

const addNotification = new Composer<IContext>()
addNotification.on('message', async (ctx) => {
    const task = ctx.scene.session.taskText;
    const alertDate = deunionize(ctx.message).text;
    const owner = ctx.scene.session.chatId;
    if (task && alertDate) await subTask(owner, task, alertDate);
    await ctx.reply(i18n.t('ru', 'taskSubGood'))
    ctx.scene.reenter();
})

const todoScene = new Scenes.WizardScene(
    'sceneTodo',
    welcomeTodo,
    actionSelector,
    addTaskDate,
    addTaskResult,
    openTask,
    addNotification,
);

export {
    todoComposer,
    todoScene,
};
