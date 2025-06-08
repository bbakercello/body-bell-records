import { getFirestore } from 'firebase-admin/firestore';
import { Album, Artist, AlbumWithArtist, ArtistWithAlbums } from './types';
import { AlbumSchema, ArtistSchema } from './schema';

const db = getFirestore();

// Artist operations
export async function createArtist(artist: Artist): Promise<Artist> {
  const validatedArtist = ArtistSchema.parse(artist);
  const docRef = await db.collection('artists').add(validatedArtist);
  return { ...validatedArtist, id: docRef.id };
}

export async function getArtist(id: string): Promise<Artist | null> {
  const doc = await db.collection('artists').doc(id).get();
  if (!doc.exists) return null;
  return { ...doc.data() as Artist, id: doc.id };
}

export async function updateArtist(id: string, artist: Partial<Artist>): Promise<Artist | null> {
  const docRef = db.collection('artists').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const validatedArtist = ArtistSchema.partial().parse(artist);
  await docRef.update(validatedArtist);
  return { ...doc.data() as Artist, ...validatedArtist, id };
}

export async function deleteArtist(id: string): Promise<boolean> {
  const docRef = db.collection('artists').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;

  await docRef.delete();
  return true;
}

export async function listArtists(): Promise<Artist[]> {
  const snapshot = await db.collection('artists').get();
  return snapshot.docs.map(doc => ({ ...doc.data() as Artist, id: doc.id }));
}

// Album operations
export async function createAlbum(album: Album): Promise<Album> {
  const validatedAlbum = AlbumSchema.parse(album);
  const docRef = await db.collection('albums').add(validatedAlbum);
  return { ...validatedAlbum, id: docRef.id };
}

export async function getAlbum(id: string): Promise<AlbumWithArtist | null> {
  const doc = await db.collection('albums').doc(id).get();
  if (!doc.exists) return null;

  const album = { ...doc.data() as Album, id: doc.id };
  const artist = await getArtist(album.artistId);
  if (!artist) return null;

  return { ...album, artist };
}

export async function updateAlbum(id: string, album: Partial<Album>): Promise<Album | null> {
  const docRef = db.collection('albums').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const validatedAlbum = AlbumSchema.partial().parse(album);
  await docRef.update(validatedAlbum);
  return { ...doc.data() as Album, ...validatedAlbum, id };
}

export async function deleteAlbum(id: string): Promise<boolean> {
  const docRef = db.collection('albums').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;

  await docRef.delete();
  return true;
}

export async function listAlbums(): Promise<AlbumWithArtist[]> {
  const snapshot = await db.collection('albums').get();
  const albums = snapshot.docs.map(doc => ({ ...doc.data() as Album, id: doc.id }));
  
  // Fetch artists for all albums
  const artistIds = Array.from(new Set(albums.map(album => album.artistId)));
  const artists = await Promise.all(artistIds.map(id => getArtist(id)));
  const artistMap = new Map(artists.map(artist => [artist?.id, artist]));

  return albums.map(album => ({
    ...album,
    artist: artistMap.get(album.artistId)!
  }));
}

export async function getArtistWithAlbums(id: string): Promise<ArtistWithAlbums | null> {
  const artist = await getArtist(id);
  if (!artist) return null;

  const snapshot = await db.collection('albums')
    .where('artistId', '==', id)
    .get();

  const albums = snapshot.docs.map(doc => ({ ...doc.data() as Album, id: doc.id }));
  return { ...artist, albums };
} 