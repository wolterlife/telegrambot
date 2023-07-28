import { Scenes } from 'telegraf';
import ITask from "./Task";

interface IWizardSession extends Scenes.WizardSessionData {
  // will be available under `ctx.scene.session.myWizardSessionProp
  cityForPlace: string;
  cityWeather: string;
  taskText: string | undefined;
  taskDate: string;
  tasks: ITask[];
  chatId: number;
}

export default IWizardSession;
