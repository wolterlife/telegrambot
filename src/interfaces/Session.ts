import {Scenes} from "telegraf";
import IWizardSession from "./WizardSession";

interface ISession extends Scenes.WizardSession<IWizardSession> {
    chatId: number;
}

export default ISession;