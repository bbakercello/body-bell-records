import { NextRequest, NextResponse } from 'next/server';
import { auth0Config } from '@/lib/auth0-config';

// Cache admin status for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
let adminCache: { [email: string]: { isAdmin: boolean; timestamp: number } } = {};

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  try {
    const response = await fetch(`${auth0Config.issuerBaseURL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const user = await response.json();
    const email = user.email;

    // Check cache first
    if (adminCache[email] && Date.now() - adminCache[email].timestamp < CACHE_DURATION) {
      return NextResponse.json({ isAdmin: adminCache[email].isAdmin });
    }

    const isAdmin = auth0Config.adminEmails.includes(email);
    // Update cache
    adminCache[email] = { isAdmin, timestamp: Date.now() };

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
} 