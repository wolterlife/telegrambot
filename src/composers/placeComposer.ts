import {Composer, Markup, Scenes} from 'telegraf';
import IContext from '../interfaces/Context';
import IPlace from "../interfaces/Place";
import {i18n} from '../app';
import getPlace from "../api/getPlace";

const placeComposer = new Composer<IContext>();
placeComposer.hears(['/places', '🔍 Поиск мест'], async (ctx) => ctx.scene.enter('scenePlace'));

const welcomePlace = async (ctx: IContext) => {
    await ctx.reply(i18n.t('ru', 'cityStart'), Markup.removeKeyboard());
    await ctx.wizard.next();
};

const cityForSearch = new Composer<IContext>();
cityForSearch.command('leave', (ctx) => ctx.scene.leave());
cityForSearch.on('message', async (ctx) => {
    if (!('text' in ctx.message)) {
        ctx.reply(i18n.t('ru', 'errorInputCity'));
        return;
    }
    ctx.scene.session.cityForPlace = ctx.message.text;

    await ctx.reply(i18n.t('ru', 'selectTypePlace'),
        Markup.keyboard(
            [
                [Markup.button.callback('Жильё', 'btn_p_1'), Markup.button.callback('Больницы', 'btn_p_5')],
                [Markup.button.callback('Магазины', 'btn_p_2'), Markup.button.callback('Одежда', 'btn_p_6')],
                [Markup.button.callback('Кафе', 'btn_p_3'), Markup.button.callback('Ресторан', 'btn_p_7')],
                [Markup.button.callback('Кино', 'btn_p_4'), Markup.button.callback('Клубы', 'btn_p_8')],
            ],
        ).resize());
    await ctx.wizard.next();
});

const selectType = new Composer<IContext>();
selectType.command('leave', (ctx) => ctx.scene.leave());
selectType.on('message', async (ctx) => {
    if (!('text' in ctx.message)) {
        ctx.reply(i18n.t('ru', 'errorInputCity'));
        return;
    }
    await getPlace(ctx.scene.session.cityForPlace, ctx.message.text)
        .then((res) => {
            if (!res.length) {
                ctx.reply(i18n.t('ru', 'errorCityPlace'))
                ctx.scene.leave()
            }
            res.map((item: IPlace) => {
                ctx.replyWithHTML(i18n.t('ru', 'placeResult', {item}),
                    Markup.inlineKeyboard([Markup.button.url('Открыть карту', `https://maps.google.com/?q=${item.properties.lat},${item.properties.lon}`)]))
            })
        })
        .catch(() => ctx.reply(i18n.t('ru', 'errorGetPlace')));
});
const placeScene = new Scenes.WizardScene(
    'scenePlace',
    welcomePlace,
    cityForSearch,
    selectType,
);

export {
    placeComposer,
    placeScene,
};
