import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

// GET /api/roommates → returns all roommate profiles
export async function GET(req: Request) {
    const { userId } = await auth()
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    const { searchParams } = new URL(req.url)
    const place_id = searchParams.get("place_id")
  
    let query = supabase.from("roommates").select("*")
  
    if (place_id) {
      query = query.eq("places_id", place_id)
    }
  
    const { data, error } = await query
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  
    return NextResponse.json(data)
  }
  

// POST /api/roommates → creates a new roommate profile
export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, school, unit_end, places_id } = body

  // Validate required fields
  if (!name || !places_id) {
    return NextResponse.json(
      { error: "Missing required fields: name or places_id" },
      { status: 400 }
    )
  }

  // Insert roommate profile
  const { data, error } = await supabase
    .from("roommates")
    .insert({
      name,
      school,
      unit_end,
      places_id
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
