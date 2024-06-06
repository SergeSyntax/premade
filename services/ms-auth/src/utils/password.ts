import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = await scryptAsync(password, salt, 64);

    if (!Buffer.isBuffer(buf)) {
      throw new Error('Error hashing password');
    }

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = await scryptAsync(suppliedPassword, salt, 64);

    if (!Buffer.isBuffer(buf)) {
      throw new Error('Error hashing password when comparing');
    }

    return buf.toString('hex') === hashedPassword;
  }
}
