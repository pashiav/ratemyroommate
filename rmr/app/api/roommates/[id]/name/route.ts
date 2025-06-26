import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: roommate, error } = await supabase
    .from("roommates")
    .select("full_name")
    .eq("rm_id", id.trim())
    .single();

  if (error || !roommate) {
    return NextResponse.json(
      { error: error?.message ?? "Roommate not found" },
      { status: error ? 500 : 404 }
    );
  }

  return NextResponse.json({ full_name: roommate.full_name });
}
