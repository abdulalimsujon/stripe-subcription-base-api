import { Tuser } from './user.interface';
import { User } from './user.model';

const createUserIntoDb = async (data: Tuser) => {
  const result = await User.create(data);

  return result;
};

export const userServices = {
  createUserIntoDb,
};
