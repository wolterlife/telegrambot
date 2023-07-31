import { Scenes } from 'telegraf';
import ITask from "./Task";

interface IWizardSession extends Scenes.WizardSessionData {
  cityForPlace: string;
  cityWeather: string;
  taskText: string | undefined;
  taskDate: string;
  tasks: ITask[];
  chatId: number;
}

export default IWizardSession;
