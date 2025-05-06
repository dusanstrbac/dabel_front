
import { generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const mockUser = {
  email: "test@example.com",
  username: 'test',
  password: "1234",
};

const verifyPassword = (inputPassword: string, storedPassword: string) => {
  return inputPassword === storedPassword;
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email i lozinka su obavezni" },
        { status: 400 }
      );
    }

    if (mockUser.email == email && verifyPassword(password, mockUser.password)) {
      const token = generateToken(mockUser);
      console.log('Generisani token: ', token);

      return NextResponse.json({
        message: 'Uspesno ste se prijavili',
        token
      });
    } else {
      return NextResponse.json({
        message: 'Pogresni emaili ili lozinka'
      }, { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Došlo je do greške prilikom prijavljivanja" },
      { status: 500 }
    );
  }
}
