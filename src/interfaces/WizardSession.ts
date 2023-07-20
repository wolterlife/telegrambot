import { Scenes } from 'telegraf';

interface IWizardSession extends Scenes.WizardSessionData {
  // will be available under `ctx.scene.session.myWizardSessionProp`
  cityWeather: string;
  chatId: number;

}

export default IWizardSession;
