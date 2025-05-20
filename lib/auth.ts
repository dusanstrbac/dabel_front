import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || '123456';

interface CustomJwtPayload {
  username: string;
  email: string;
  role: string;
}

export function GenerateToken(user: {username: string, email:string, role:string }) {
  const payload: CustomJwtPayload = {
    username: user.username,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  return token;
}

export function verifyToken(token: string): CustomJwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
    return decoded;
  } catch(err) {
    return null;
  }
}