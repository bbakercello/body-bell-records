import { NextRequest, NextResponse } from 'next/server';
import { auth0Config } from '@/lib/auth0-config';

// Cache user info for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
let userCache: { user: any; timestamp: number } | null = null;

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    console.log('No access token found');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Check cache first
    if (userCache && Date.now() - userCache.timestamp < CACHE_DURATION) {
      return NextResponse.json(userCache.user);
    }

    const response = await fetch(`${auth0Config.issuerBaseURL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to get user info:', await response.text());
      return NextResponse.json({ error: 'Failed to get user info' }, { status: 401 });
    }

    const user = await response.json();
    // Update cache
    userCache = { user, timestamp: Date.now() };
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error getting user info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 