import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { embedText, parsePassportOcr } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get student_id from profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("student_id")
    .eq("id", user.id)
    .single();

  const profile = profileData as { student_id: string | null } | null;

  if (!profile?.student_id) {
    return NextResponse.json({ error: "No linked student record" }, { status: 400 });
  }

  const { rawText } = await req.json() as { rawText: string };
  if (!rawText) return NextResponse.json({ error: "rawText required" }, { status: 400 });

  // Parse passport fields + generate embedding in parallel
  const [parsed, embedding] = await Promise.all([
    parsePassportOcr(rawText),
    embedText(rawText),
  ]);

  // Upsert into passport_embeddings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("passport_embeddings")
    .upsert({
      student_id:      profile.student_id,
      passport_number: parsed.passport_number ?? null,
      name_en:         parsed.name_en ?? null,
      birth_date:      parsed.birth_date ?? null,
      nationality:     parsed.nationality ?? null,
      expiry_date:     parsed.expiry_date ?? null,
      gender:          parsed.gender ?? null,
      raw_text:        rawText,
      embedding,
    }, { onConflict: "student_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, parsed });
}
