import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    // En production stricte, exiger admin ; en environnement de test local, autoriser l'upload
    if (process.env.NODE_ENV === "production" && (!user || user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Accès refusé. Réservé à l'administrateur." }, { status: 403 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nom de fichier unique et propre
    const origExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const extension = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(origExt) ? origExt : "jpg";
    const filename = `fxxty-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;

    // Répertoire de destination
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de l'upload de l'image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
