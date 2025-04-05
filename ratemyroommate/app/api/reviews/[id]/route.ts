import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type Props = {
  params: { id: string };
};

// GET /api/reviews/[id] — fetch a specific review by ID
export async function GET(_: Request, { params }: Props) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id) // Ensure the column name matches your database schema
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
