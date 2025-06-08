import { NextRequest, NextResponse } from 'next/server';
import { auth0Config } from '@/lib/auth0-config';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get artist from Firestore
    const artistRef = doc(db, 'artists', params.id);
    const artistSnap = await getDoc(artistRef);

    if (!artistSnap.exists()) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const artist = {
      id: artistSnap.id,
      ...artistSnap.data()
    };

    return NextResponse.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if artist exists
    const artistRef = doc(db, 'artists', params.id);
    const artistSnap = await getDoc(artistRef);

    if (!artistSnap.exists()) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const data = await request.json();
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Update artist in Firestore
    await updateDoc(artistRef, updatedData);

    const updatedArtist = {
      id: params.id,
      ...updatedData,
    };

    return NextResponse.json(updatedArtist);
  } catch (error) {
    console.error('Error updating artist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if artist exists
    const artistRef = doc(db, 'artists', params.id);
    const artistSnap = await getDoc(artistRef);

    if (!artistSnap.exists()) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Delete artist from Firestore
    await deleteDoc(artistRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 