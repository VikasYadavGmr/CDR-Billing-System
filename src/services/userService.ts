import type { User } from '../types/user';
import { mockUsers } from '../mock-data/userData';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockUsers]), 50));
  },
  addUser: async (user: Omit<User, 'id' | 'lastLogin'>): Promise<User> => {
    const newUser: User = { ...user, id: `usr-${Date.now()}`, lastLogin: 'Never' };
    mockUsers.push(newUser);
    return newUser;
  },
};
