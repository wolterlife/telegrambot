import { Context, Scenes } from 'telegraf';
import IWizardSession from './WizardSession';

interface IContext extends Context {
  myContextProp: string;
  scene: Scenes.SceneContextScene<IContext, IWizardSession>;
  wizard: Scenes.WizardContextWizard<IContext>;
}

export default IContext;
