// import { auth } from "@clerk/nextjs/server"
// import { supabase } from "@/lib/supabase"
// import { NextResponse } from "next/server"

// // GET /api/reviews — fetch all reviews
// export async function GET() {
//   const { userId } = await auth()

//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const { data, error } = await supabase
//     .from("reviews")
//     .select("*")
//     .order("created_at", { ascending: false })

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }

//   return NextResponse.json(data)
// }

// // POST /api/reviews — submit a new review
// export async function POST(req: Request) {
//   const { userId } = await auth()

//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const {
//     rating,
//     would_recomm,
//     has_pets,
//     pet_friendly,
//     years_lived,
//     comments,
//     rm_id
//   } = await req.json()

//   // Validate required fields
//   if (!rating || !rm_id) {
//     return NextResponse.json(
//       { error: "Missing required fields: 'rating' or 'rm_id'" },
//       { status: 400 }
//     )
//   }

//   const { data, error } = await supabase
//     .from("reviews")
//     .insert({
//       rating,
//       would_recomm,
//       has_pets,
//       pet_friendly,
//       years_lived,
//       comments,
//       reviewer_id: userId,
//       rm_id
//     })
//     .select()
//     .single()

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }

//   return NextResponse.json(data)
// }
