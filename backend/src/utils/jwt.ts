import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  role: 'customer' | 'admin';
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '15m',
  });
};