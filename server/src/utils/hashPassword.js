import bcrypt from 'bcryptjs';

export const hashPassword = (plainPassword) => bcrypt.hash(plainPassword, 10);

export const comparePassword = (plainPassword, hashedPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);
