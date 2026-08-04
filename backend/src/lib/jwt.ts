import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_SECRET || 'dev-secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-refresh-secret';
const accessExpires = process.env.JWT_EXPIRES_IN || '7d';
const refreshExpires = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

const signOptions = (expiresIn: string): SignOptions => ({ expiresIn: expiresIn as SignOptions['expiresIn'] });

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, accessSecret, signOptions(accessExpires));
}

export function signTokenPair(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, accessSecret, signOptions(accessExpires));
  const refreshToken = jwt.sign(payload, refreshSecret, signOptions(refreshExpires));
  return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, refreshSecret) as TokenPayload;
}
