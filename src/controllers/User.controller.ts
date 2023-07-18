import AppDataSource from '../db';
import User from '../models/User.model';

async function addUser(chatId: number, userName?: string) {
  const userRepos = AppDataSource.getRepository(User);
  const isRegister = await userRepos.findOneBy({ chatId });
  if (!isRegister) {
    const user = new User();
    user.chatId = chatId;
    user.telegram = userName;
    await userRepos.save(user);
  }
}

export default addUser;
