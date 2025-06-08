'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import ArtistForm from '@/components/ArtistForm';
import { useRouter } from 'next/navigation';

interface Artist {
  id: string;
  name: string;
  bio: string;
  members: string[];
  socialMedia: {
    [key: string]: string;
  };
}

export default function AdminPage() {
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isAddingArtist, setIsAddingArtist] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      redirect('/api/auth/login');
    }
  }, [user, loading]);

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
        setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchArtists();
    }
  }, [user]);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
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
      setErrorMessage(err instanceof Error ? err.message : 'Failed to delete artist');
    }
  };

  if (loading || isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {(isAddingArtist || selectedArtist) ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            {selectedArtist ? 'Edit Artist' : 'Add New Artist'}
          </h2>
          <ArtistForm
            artist={selectedArtist || undefined}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Artists</h2>
            <button
              onClick={() => setIsAddingArtist(true)}
              className="bg-sky-800 text-white px-4 py-2 rounded hover:bg-sky-700"
            >
              Add Artist
            </button>
          </div>

          <div className="grid gap-6">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="border rounded-lg p-6 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{artist.name}</h3>
                    <p className="text-gray-600 mb-4">{artist.bio}</p>
                    {artist.members.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Members:</h4>
                        <ul className="list-disc list-inside">
                          {artist.members.map((member, index) => (
                            <li key={index}>{member}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Object.keys(artist.socialMedia).length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Social Media:</h4>
                        <div className="flex gap-4">
                          {Object.entries(artist.socialMedia).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-800 hover:text-sky-600"
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
                      className="text-sky-800 hover:text-sky-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(artist.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 