import { z } from 'zod';

// Album links schema (e.g., Bandcamp, Spotify, etc.)
export const AlbumLinksSchema = z.record(z.string(), z.string().url());

// Social media links schema (e.g., Instagram, Twitter, etc.)
export const SocialMediaLinksSchema = z.record(z.string(), z.string().url());

// Album schema
export const AlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  artistId: z.string(), // Foreign key to Artist
  artwork: z.string().url(), // URL to artwork image
  description: z.string(),
  albumLinks: AlbumLinksSchema.optional(), // Optional links to streaming platforms
  socialMediaLinks: SocialMediaLinksSchema.optional(), // Optional social media links
  releaseDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Artist schema
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  members: z.array(z.string()).optional(), // Optional list of band members
  socialMediaLinks: SocialMediaLinksSchema.optional(), // Optional social media links
  bio: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Export types inferred from schemas
export type Album = z.infer<typeof AlbumSchema>;
export type Artist = z.infer<typeof ArtistSchema>;
export type AlbumLinks = z.infer<typeof AlbumLinksSchema>;
export type SocialMediaLinks = z.infer<typeof SocialMediaLinksSchema>;

// Collection names
export const COLLECTIONS = {
  ARTISTS: 'artists',
  ALBUMS: 'albums',
} as const; 