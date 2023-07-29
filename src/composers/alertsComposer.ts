import IContext from "../interfaces/Context";
import {i18n} from "../app";
import {Composer, Markup, Scenes} from "telegraf";
import {getUserSubWeathers, unsubWeatherById} from "../controllers/weatherController";
import {getUserSubTasks, unsubTask} from "../controllers/taskController";

const alertsComposer = new Composer<IContext>();

alertsComposer.hears(['/alerts', '🔔 Подписки'], async (ctx) => {
    ctx.scene.session.chatId = ctx.message.chat.id
    ctx.scene.enter('sceneAlerts')
});

const welcomeAlerts = async (ctx: IContext) => {
    await ctx.reply(i18n.t('ru', 'alertStart'),
        Markup.keyboard(
            [
                [Markup.button.callback('Погода', 'btn_weather'), Markup.button.callback('Задачи', 'btn_tasks')],
            ],
        ).resize()
    );
    await ctx.wizard.next();
};

const showAlerts = new Composer<IContext>()
showAlerts.hears('Погода', async (ctx) => {
    const weathers = await getUserSubWeathers(ctx.scene.session.chatId);
    weathers.forEach(sub => {
        ctx.reply(i18n.t('ru', 'listWeather', {sub}),
            Markup.inlineKeyboard([Markup.button.callback('❌ Удалить уведомление', `btn_unsub_weather_${sub.id}`)])
        )
    })
})
showAlerts.hears('Задачи', async (ctx) => {
    const tasks = await getUserSubTasks(ctx.scene.session.chatId);
    tasks.forEach(sub => {
        ctx.reply(i18n.t('ru', 'listTasks', {sub}),
            Markup.inlineKeyboard([Markup.button.callback('❌ Удалить уведомление', `btn_unsub_task_${sub.id}`)])
        )
    })
})
showAlerts.action(/btn_unsub_weather_[0-9]*/, async (ctx) => {
    const subId = Number(ctx.match[0].slice(18));
    ctx.deleteMessage();
    await unsubWeatherById(subId);
})

showAlerts.action(/btn_unsub_task_[0-9]*/, async (ctx) => {
    const subId = Number(ctx.match[0].slice(15));
    ctx.deleteMessage();
    await unsubTask(subId);
})

const alertsScene = new Scenes.WizardScene(
    'sceneAlerts',
    welcomeAlerts,
    showAlerts,
);

export {
    alertsScene,
    alertsComposer,
}