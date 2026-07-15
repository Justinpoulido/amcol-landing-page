import { NextResponse } from "next/server";
import { hasSupabaseAdminConfig } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ContactRequestPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  projectType?: unknown;
  pumpBrand?: unknown;
  urgency?: unknown;
  message?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json(
      {
        error:
          "Supabase admin access is not configured. Add SUPABASE_SERVICE_ROLE_KEY before accepting contact requests.",
      },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as ContactRequestPayload;
    const fullName = cleanText(body.name, 160);
    const email = cleanText(body.email, 254).toLowerCase();
    const company = cleanText(body.company, 180);
    const phone = cleanText(body.phone, 80);
    const projectType = cleanText(body.projectType, 120);
    const pumpBrand = cleanText(body.pumpBrand, 80);
    const urgency = cleanText(body.urgency, 80);
    const message = cleanText(body.message, 4000);

    if (!fullName) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 },
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid work email." },
        { status: 400 },
      );
    }

    if (
      projectType === "Pump Service Request" &&
      !["Dosivac", "Nomad"].includes(pumpBrand)
    ) {
      return NextResponse.json(
        { error: "Please select the pump brand for service." },
        { status: 400 },
      );
    }

    const requestMessage =
      projectType === "Pump Service Request" && pumpBrand
        ? [`Pump Brand: ${pumpBrand}`, message].filter(Boolean).join("\n\n")
        : message;

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("contact_requests").insert({
      full_name: fullName,
      email,
      company: company || null,
      phone: phone || null,
      project_type: projectType || null,
      urgency: urgency || null,
      message: requestMessage || null,
      source_page: "/contact",
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to submit contact request.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
