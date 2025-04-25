// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import { auth } from "@clerk/nextjs/server";

// export async function GET(
//   request: NextRequest,
//   { params }: any
// ) {
//   const id = params.id;

//   console.log('Roommate Details Request:', {
//     id,
//     method: request.method,
//     url: request.url
//   });

//   // Verify Clerk authentication
//   const { userId } = await auth();

//   if (!userId) {
//     console.warn("Unauthorized access attempt");
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // Set up Supabase client
//     const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//     const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//     if (!supabaseUrl || !supabaseKey) {
//       console.error("Missing Supabase environment variables");
//       return NextResponse.json(
//         { error: "Server configuration error" },
//         { status: 500 }
//       );
//     }

//     const supabase = createClient(supabaseUrl, supabaseKey);

//     console.log("Executing database query for roommate:", id);

//     // Fetch roommate details
//     const { data: roommate, error: roommateError } = await supabase
//       .from("roommates")
//       .select(
//         `
//         rm_id,
//         name,
//         unit_end,
//         places_id
//       `
//       )
//       .eq("rm_id", id)
//       .single();

//     if (roommateError) {
//       console.error("Roommate query error:", roommateError);
//       return NextResponse.json(
//         { error: roommateError.message },
//         { status: 500 }
//       );
//     }

//     if (!roommate) {
//       console.warn("No roommate found with ID:", id);
//       return NextResponse.json(
//         { error: "Roommate not found" },
//         { status: 404 }
//       );
//     }

//     // Fetch places details
//     const { data: place, error: placeError } = await supabase
//       .from("places")
//       .select("*")
//       .eq("places_id", roommate.places_id)
//       .single();

//     if (placeError) {
//       console.error("Places query error:", placeError);
//       return NextResponse.json({ error: placeError.message }, { status: 500 });
//     }

//     // Fetch reviews
//     const { data: reviews, error: reviewsError } = await supabase
//       .from("reviews")
//       .select("*")
//       .eq("rm_id", id);

//     if (reviewsError) {
//       console.error("Reviews query error:", reviewsError);
//       return NextResponse.json(
//         { error: reviewsError.message },
//         { status: 500 }
//       );
//     }

//     // Combine data
//     const responseData = {
//       rm_id: roommate.rm_id,
//       name: roommate.name,
//       unit_end: roommate.unit_end,
//       places: place,
//       reviews: reviews || [],
//     };

//     console.log("Roommate data retrieved successfully:", {
//       name: responseData.name,
//       reviewCount: responseData.reviews.length,
//     });

//     return NextResponse.json(responseData);
//   } catch (err) {
//     // Catch any unexpected errors
//     console.error("Unexpected error in roommate details route:", {
//       error: err instanceof Error ? err.message : String(err),
//       stack: err instanceof Error ? err.stack : "No stack trace",
//     });

//     return NextResponse.json(
//       {
//         error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
//       },
//       { status: 500 }
//     );
//   }
// }