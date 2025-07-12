import { adminDb } from "../config";

/**
 * @typedef {Object} Artist
 * @property {string} name
 * @property {string} bio
 * @property {string[]} members
 * @property {Object} socialMedia
 * @property {string} [socialMedia.instagram]
 * @property {string} [socialMedia.twitter]
 * @property {string} [socialMedia.facebook]
 * @property {string} [socialMedia.youtube]
 * @property {string} [socialMedia.spotify]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Album
 * @property {string} title
 * @property {string} artistId
 * @property {string} releaseDate
 * @property {string} description
 * @property {string} coverImage
 * @property {Array<{title: string, duration: string, spotifyUrl?: string}>} tracks
 * @property {string} createdAt
 * @property {string} updatedAt
 */

async function doInitializeCollections() {
  try {
    // Create artists collection with a sample artist
    const artistsCollection = adminDb.collection("artists");
    const sampleArtist = {
      name: "Body Bell Records",
      bio: "A record label dedicated to experimental and avant-garde music.",
      members: ["Ben Baker"],
      socialMedia: {
        instagram: "https://instagram.com/bodybellrecords",
        twitter: "https://twitter.com/bodybellrecords",
        facebook: "https://facebook.com/bodybellrecords",
        youtube: "https://youtube.com/bodybellrecords",
        spotify: "https://open.spotify.com/artist/bodybellrecords",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Check if sample artist already exists
    const artistRef = artistsCollection.doc("body-bell-records");
    const artistDoc = await artistRef.get();

    if (!artistDoc.exists) {
      await artistRef.set(sampleArtist);
      console.log("Created sample artist");
    }

    // Create albums collection with a sample album
    const albumsCollection = adminDb.collection("albums");
    const sampleAlbum = {
      title: "First Release",
      artistId: "body-bell-records",
      releaseDate: new Date().toISOString(),
      description: "Our first experimental release",
      coverImage: "/images/album-cover.jpg",
      tracks: [
        {
          title: "Track 1",
          duration: "5:00",
          spotifyUrl: "https://open.spotify.com/track/1",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Check if sample album already exists
    const albumRef = albumsCollection.doc("first-release");
    const albumDoc = await albumRef.get();

    if (!albumDoc.exists) {
      await albumRef.set(sampleAlbum);
      console.log("Created sample album");
    }

    console.log("Collections initialized successfully");
  } catch (error) {
    console.error("Error initializing collections:", error);
    throw error;
  }
}

export { doInitializeCollections as initializeCollections };
