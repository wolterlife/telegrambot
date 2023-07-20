import { Context, Scenes } from 'telegraf';
import IWizardSession from './WizardSession';

interface IContext extends Context {
  scene: Scenes.SceneContextScene<IContext, IWizardSession>;
  wizard: Scenes.WizardContextWizard<IContext>;
  lang: string;
}

export default IContext;
