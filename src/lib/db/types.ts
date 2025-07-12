import { z } from 'zod';
import { AlbumSchema, ArtistSchema } from './schema';

export type Album = z.infer<typeof AlbumSchema>;
export type Artist = z.infer<typeof ArtistSchema>;

export interface AlbumWithArtist extends Album {
  artist: Artist;
}

export interface ArtistWithAlbums extends Artist {
  albums: Album[];
} 