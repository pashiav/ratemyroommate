import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { clerkClient } from '@clerk/clerk-sdk-node'; // ✅ Correct Clerk import for server-side use

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const {
      rating,
      would_recommend,
      has_pets,
      pet_friendly,
      years_lived,
      comments,
      rm_id,
      reviewer_id, // Clerk user ID (text)
    } = await request.json();

    if (!rm_id || typeof rating !== 'number' || !reviewer_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ✅ Get user info from Clerk
    const clerkUser = await clerkClient.users.getUser(reviewer_id);
    const email = clerkUser.emailAddresses[0]?.emailAddress || null;
    const name = clerkUser.firstName || '';
    const school = clerkUser.publicMetadata?.school || null;
    const living_place = clerkUser.publicMetadata?.living_place || null;

    // ✅ Upsert into Users table
    const { error: userUpsertError } = await supabaseAdmin.from('Users').upsert({
      user_id: reviewer_id,
      email,
      name,
      school,
      living_place,
    });

    if (userUpsertError) {
      console.error('User upsert error:', userUpsertError);
      return NextResponse.json(
        { error: 'Failed to create or update user: ' + userUpsertError.message },
        { status: 500 }
      );
    }

    // ✅ Insert review using RLS bypass function
    const { data, error } = await supabaseAdmin
      .rpc('insert_review_bypass_rls', {
        p_rating: rating,
        p_would_recommend: would_recommend,
        p_has_pets: has_pets,
        p_pet_friendly: pet_friendly,
        p_years_lived: years_lived,
        p_comments: comments,
        p_rm_id: rm_id,
        p_temp_reviewer_id: reviewer_id,
      });

    if (error) {
      console.error('RPC error:', error);
      return NextResponse.json(
        { error: 'Failed to submit review: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, review: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
