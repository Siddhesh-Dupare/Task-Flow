import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Create a Supabase client for the route handler
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Use the signInWithPassword method from Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Return a more specific error for invalid credentials
    if (error.message === "Invalid login credentials") {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // A session cookie is automatically set upon successful sign-in
  return NextResponse.json({ user: data.user, message: "Sign-in successful!" });
}
