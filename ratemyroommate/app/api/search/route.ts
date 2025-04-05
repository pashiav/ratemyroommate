import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

// GET /api/search?name=alex&place_id=abc-123
export async function GET(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name")
  const place_id = searchParams.get("place_id")

  // Join roommates with places to get place name
  let query = supabase
    .from("roommates")
    .select(`
      rm_id,
      name,
      school,
      unit_end,
      created_at,
      places (
        name
      )
    `)

  if (name) {
    query = query.ilike("name", `%${name}%`)
  }

  if (place_id) {
    query = query.eq("places_id", place_id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
