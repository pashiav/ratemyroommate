import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
      reviewer_id, // <- Clerk user ID (text)
    } = await request.json();

    // Validate required fields
    if (!rm_id || typeof rating !== 'number' || !reviewer_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call the RLS-bypassing function
    const { data, error } = await supabaseAdmin
      .rpc('insert_review_bypass_rls', {
        p_rating: rating,
        p_would_recommend: would_recommend,
        p_has_pets: has_pets,
        p_pet_friendly: pet_friendly,
        p_years_lived: years_lived,
        p_comments: comments,
        p_rm_id: rm_id,
        p_temp_reviewer_id: reviewer_id, // ← Clerk ID passed to the function
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
