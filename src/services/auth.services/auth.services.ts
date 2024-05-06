/* eslint-disable @typescript-eslint/no-extraneous-class */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export type Payload = {
  id: string;
  email: string;
  role: string;
} & jwt.JwtPayload;

export class Auth {
  static secret = process.env.SECRET_JWT;

  static async hash(password: string, saltRounds: number) {
    return bcrypt.hash(password, saltRounds);
  }

  static async compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }

  static signJwt(payload: Payload) {
    if (!Auth.secret) {
      throw new Error('JWT secret not set');
    }

    return jwt.sign(payload, Auth.secret);
  }

  static verifyJwt(token: string) {
    if (!Auth.secret) {
      throw new Error('JWT secret not set');
    }

    return jwt.verify(token, Auth.secret);
  }
}
