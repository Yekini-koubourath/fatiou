import { NextResponse } from "next/server";
import { z } from "zod";
import { userRepo, comparePassword, setSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await userRepo.findByEmail(email);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès réservé à l'administrateur." },
        { status: 403 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };

    await setSessionCookie(session);

    return NextResponse.json({ success: true, user: session });
  } catch (error) {
    console.error("Erreur de connexion :", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}