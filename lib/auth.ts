import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || '123456'; 

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

const mockUser = {
  email: "test@example.com",
  username: 'test',
  password: "1234",
  role: 'user'
};

export function generateToken(user: typeof mockUser) {
  const payload = {
    email : user.email,
    username : user.username,
    role: user.role
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });  // Token važi 1h
  return token;
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; 
  } catch (err) {
    return null;
  }
}

export function getUsernameFromToken(): string | null {
  const token = localStorage.getItem('token');  
  if (!token) return null; 

  try {
    const decoded = jwt.decode(token) as { username: string } | null;

    return decoded?.username || null; 
  } catch (error) {
    console.error("Greška prilikom verifikacije tokena:", error);
    return null;
  }
}

export function getEmailFromToken(): string | null {
  const token = localStorage.getItem('token');
  if(!token) return null;

  try {
    const decoded = jwt.decode(token) as { email: string } | null;
    return decoded?.email || null
  } catch(error) {
    console.error("Greska prilikom verifikacije tokena: ", error);
    return null;
  }
}

export function deleteToken() {
  localStorage.removeItem('token');
}

// Funkcija za ekstrakciju tokena iz Authorization header-a
export function extractTokenFromHeader(req: any): string | null {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7, authHeader.length); 
  }
  return null;
}
