// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "cookies-next";
import { mockUsers } from "@/app/data/mockUsers";


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json(); 

    const user = mockUsers.find(user => user.email === email && user.password === password);

    if (user) {
      setCookie("auth_token", user.token, {
        maxAge: 60 * 60 * 24 * 7, // 1 nedelja
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return NextResponse.json({ success: true, token: user.token });
    }

    // Ako email i lozinka nisu tačni
    return NextResponse.json({ success: false, message: "Pogrešan email ili lozinka" }, { status: 401 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Došlo je do greške prilikom prijavljivanja" }, { status: 500 });
  }
}
