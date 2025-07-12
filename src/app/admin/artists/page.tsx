'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import ArtistForm from '@/components/ArtistForm';

interface Artist {
  id: string;
  name: string;
  bio: string;
  members: string[];
  socialMedia: {
    [key: string]: string;
  };
}

export default function ArtistsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isAddingArtist, setIsAddingArtist] = useState(false);

  useEffect(() => {
    if (!isLoading && !user?.isAdmin) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/artists');
        if (!response.ok) {
          throw new Error('Failed to fetch artists');
        }
        const data = await response.json();
        setArtists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchArtists();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artist?')) {
      return;
    }

    try {
      const response = await fetch(`/api/artists/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete artist');
      }

      setArtists(artists.filter(artist => artist.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete artist');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = selectedArtist 
        ? `/api/artists/${selectedArtist.id}`
        : '/api/artists';
      
      const response = await fetch(url, {
        method: selectedArtist ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(selectedArtist 
          ? 'Failed to update artist'
          : 'Failed to create artist'
        );
      }

      const updatedArtist = await response.json();
      
      if (selectedArtist) {
        setArtists(artists.map(artist => 
          artist.id === selectedArtist.id ? updatedArtist : artist
        ));
      } else {
        setArtists([...artists, updatedArtist]);
      }

      setSelectedArtist(null);
      setIsAddingArtist(false);
    } catch (err) {
      throw err;
    }
  };

  if (isLoading || loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>Artists</h1>
        {!isAddingArtist && !selectedArtist && (
          <button
            onClick={() => setIsAddingArtist(true)}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 font-medium"
          >
            Add Artist
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4 font-medium">
          {error}
        </div>
      )}

      {(isAddingArtist || selectedArtist) ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#000000' }}>
            {selectedArtist ? 'Edit Artist' : 'Add New Artist'}
          </h2>
          <ArtistForm
            artist={selectedArtist || undefined}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <div className="grid gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>{artist.name}</h2>
                  <p className="mb-4" style={{ color: '#374151' }}>{artist.bio}</p>
                  {artist.members.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2" style={{ color: '#000000' }}>Members:</h3>
                      <ul className="list-disc list-inside" style={{ color: '#374151' }}>
                        {artist.members.map((member, index) => (
                          <li key={index}>{member}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Object.keys(artist.socialMedia).length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: '#000000' }}>Social Media:</h3>
                      <div className="flex gap-4">
                        {Object.entries(artist.socialMedia).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-700 font-medium"
                          >
                            {platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedArtist(artist)}
                    className="text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(artist.id)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 