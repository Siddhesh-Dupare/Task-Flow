import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { fullName, email, password } = await request.json();

  // Create a Supabase client for the route handler
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Use the signUp method from Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This is where we pass the full_name to our trigger
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Supabase sends a confirmation email by default.
  // The user object will be returned upon successful sign-up,
  // but the session will only be active after the user confirms their email.
  return NextResponse.json({ user: data.user, message: 'Confirmation email sent. Please check your inbox.' });
}