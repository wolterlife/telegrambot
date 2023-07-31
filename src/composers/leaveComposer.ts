import IContext from "../interfaces/Context";
import {Markup} from "telegraf";
import {i18n} from "../app";

function leaveFoo() {
    return function (ctx: IContext) {
        ctx.reply(i18n.t('ru', 'help'), Markup.keyboard(
            [
                [Markup.button.callback('☀️ Прогноз погоды', 'btn_weather'), Markup.button.callback('🔍 Поиск мест', 'btn_places')],
                [Markup.button.callback('📒 Задачи', 'btn_tasks'), Markup.button.callback('🔔 Подписки', 'btn_subscribe_control')],
                [Markup.button.callback('😺 Кот', 'btn_cat'), Markup.button.callback('🐶 Собака', 'btn_dog')],
            ],
        ).resize());
        ctx.scene.leave()
    }
}

export default leaveFoo;