import { NextResponse } from "next/server";
import { company } from "@/lib/company";
import { getResend } from "@/lib/resend";

type ContactBody = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  consent?: boolean;
};

function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido." },
      { status: 400 },
    );
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160).toLowerCase();
  const message = clean(body.message, 2000);

  if (!name || name.length < 2) {
    return NextResponse.json(
      { success: false, error: "Indica tu nombre." },
      { status: 400 },
    );
  }

  if (!phone || phone.length < 8) {
    return NextResponse.json(
      { success: false, error: "Indica un número de teléfono válido." },
      { status: 400 },
    );
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: "Indica un email válido." },
      { status: 400 },
    );
  }

  if (!message || message.length < 5) {
    return NextResponse.json(
      { success: false, error: "Escribe un mensaje breve." },
      { status: 400 },
    );
  }

  if (!body.consent) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Debes autorizar el tratamiento de tus datos personales para enviar el mensaje.",
      },
      { status: 400 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || company.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Agua Ser Plus <onboarding@resend.dev>";

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Ayuda web — ${name}`,
      text: [
        "Nuevo mensaje desde el formulario de ayuda del sitio.",
        "",
        `Nombre: ${name}`,
        `Teléfono: ${phone}`,
        `Email: ${email}`,
        "",
        "Mensaje:",
        message,
        "",
        "Consentimiento: el titular autorizó el tratamiento de sus datos personales conforme a la Ley N° 19.628 y la Ley N° 21.719.",
      ].join("\n"),
    });

    if (error) {
      console.error("contact email error", error);
      return NextResponse.json(
        {
          success: false,
          error: "No pudimos enviar tu mensaje. Intenta más tarde o llámanos.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("contact route error", error);
    return NextResponse.json(
      {
        success: false,
        error: "No pudimos enviar tu mensaje. Intenta más tarde o llámanos.",
      },
      { status: 500 },
    );
  }
}
