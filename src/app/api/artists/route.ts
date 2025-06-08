import { NextRequest, NextResponse } from 'next/server';
import { auth0Config } from '@/lib/auth0-config';
import { adminDb } from '@/lib/firebase/config';

export async function GET(request: NextRequest) {
  console.log('GET /api/artists - Starting request');
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    console.log('GET /api/artists - Fetching user info');
    const response = await fetch(`${auth0Config.issuerBaseURL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await response.json();
    console.log('GET /api/artists - User info:', user);
    const isAdmin = auth0Config.adminEmails.includes(user.email);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Get artists from Firestore using admin SDK
    const artistsSnapshot = await adminDb.collection('artists').get();
    const artists = artistsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('GET /api/artists - Returning artists:', artists);
    return NextResponse.json(artists);
  } catch (error) {
    console.error('GET /api/artists - Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const response = await fetch(`${auth0Config.issuerBaseURL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await response.json();
    const isAdmin = auth0Config.adminEmails.includes(user.email);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const data = await request.json();
    const artistData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add artist to Firestore using admin SDK
    const docRef = await adminDb.collection('artists').add(artistData);
    const artist = {
      id: docRef.id,
      ...artistData,
    };

    return NextResponse.json(artist);
  } catch (error) {
    console.error('Error creating artist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 