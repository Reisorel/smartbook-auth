import bcrypt from 'bcrypt';

/**
 * Hash un mot de passe avec bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Nombre d'itérations pour l'algorithme de hachage (2^10 = 1024) - équilibre entre sécurité et performance
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare un mot de passe en clair avec un hash
 */
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
