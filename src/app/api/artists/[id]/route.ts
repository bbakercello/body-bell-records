import { NextRequest, NextResponse } from "next/server";
import { auth0Config } from "@/lib/auth0-config";
import { adminDb } from "@/lib/firebase/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch(`${auth0Config.issuerBaseURL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await response.json();
    const isAdmin = auth0Config.adminEmails.includes(user.email);

    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Get artist from Firestore using Admin SDK
    const artistRef = adminDb.collection("artists").doc(id);
    const artistSnap = await artistRef.get();

    if (!artistSnap.exists) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    const artist = {
      id: artistSnap.id,
      ...artistSnap.data(),
    };

    return NextResponse.json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch(`${auth0Config.issuerBaseURL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await response.json();
    const isAdmin = auth0Config.adminEmails.includes(user.email);

    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if artist exists using Admin SDK
    const artistRef = adminDb.collection("artists").doc(id);
    const artistSnap = await artistRef.get();

    if (!artistSnap.exists) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    const data = await request.json();
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Update artist in Firestore using Admin SDK
    await artistRef.update(updatedData);

    const updatedArtist = {
      id: id,
      ...updatedData,
    };

    return NextResponse.json(updatedArtist);
  } catch (error) {
    console.error("Error updating artist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch(`${auth0Config.issuerBaseURL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await response.json();
    const isAdmin = auth0Config.adminEmails.includes(user.email);

    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if artist exists using Admin SDK
    const artistRef = adminDb.collection("artists").doc(id);
    const artistSnap = await artistRef.get();

    if (!artistSnap.exists) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Delete artist from Firestore using Admin SDK
    await artistRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
