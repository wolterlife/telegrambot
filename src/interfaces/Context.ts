import { Context, Scenes } from 'telegraf';
import IWizardSession from './WizardSession';
import ISession from "./Session";

interface IContext extends Context {
  session: ISession;
  scene: Scenes.SceneContextScene<IContext, IWizardSession>;
  wizard: Scenes.WizardContextWizard<IContext>;

}

export default IContext;
