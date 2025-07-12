'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ArtistFormProps {
  artist?: {
    id: string;
    name: string;
    bio: string;
    members: string[];
    socialMedia: {
      [key: string]: string;
    };
  };
  onSubmit: (data: any) => Promise<void>;
}

export default function ArtistForm({ artist, onSubmit }: ArtistFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    members: [''],
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: '',
      spotify: '',
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        bio: artist.bio,
        members: artist.members.length > 0 ? artist.members : [''],
        socialMedia: {
          instagram: artist.socialMedia.instagram || '',
          twitter: artist.socialMedia.twitter || '',
          facebook: artist.socialMedia.facebook || '',
          youtube: artist.socialMedia.youtube || '',
          spotify: artist.socialMedia.spotify || '',
        },
      });
    }
  }, [artist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Filter out empty members
      const filteredMembers = formData.members.filter(member => member.trim() !== '');
      // Filter out empty social media links
      const filteredSocialMedia = Object.fromEntries(
        Object.entries(formData.socialMedia).filter(([_, value]) => value.trim() !== '')
      );

      const data = {
        ...formData,
        members: filteredMembers,
        socialMedia: filteredSocialMedia,
      };

      await onSubmit(data);
      setSuccess(artist ? 'Artist updated successfully!' : 'Artist added successfully!');
      
      if (!artist) {
        // Only redirect if we're adding a new artist
        router.push('/admin/artists');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData({ ...formData, members: newMembers });
  };

  const addMemberField = () => {
    setFormData({ ...formData, members: [...formData.members, ''] });
  };

  const removeMemberField = (index: number) => {
    const newMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: newMembers.length ? newMembers : [''] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md" style={{ color: '#000000' }}>
      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: '#000000', fontWeight: '600' }}>
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 bg-white"
          style={{ color: '#000000', backgroundColor: '#ffffff' }}
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-semibold mb-2" style={{ color: '#000000', fontWeight: '600' }}>
          Bio *
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          required
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 bg-white"
          style={{ color: '#000000', backgroundColor: '#ffffff' }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#000000', fontWeight: '600' }}>Members</label>
        {formData.members.map((member, index) => (
          <div key={index} className="mt-2 flex gap-2 items-center">
            <input
              type="text"
              value={member}
              onChange={(e) => handleMemberChange(index, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 bg-white"
              placeholder="Member name"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
            />
            {formData.members.length > 1 && (
              <button
                type="button"
                onClick={() => removeMemberField(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800 font-medium"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMemberField}
          className="mt-2 text-sky-600 hover:text-sky-800 font-medium"
        >
          + Add Member
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#000000', fontWeight: '600' }}>Social Media</label>
        <div className="mt-2 space-y-3">
          {Object.entries(formData.socialMedia).map(([platform, url]) => (
            <div key={platform}>
              <label htmlFor={platform} className="block text-sm font-medium mb-1" style={{ color: '#374151', fontWeight: '500' }}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
              <input
                type="url"
                id={platform}
                value={url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: {
                      ...formData.socialMedia,
                      [platform]: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 bg-white"
                placeholder={`https://${platform}.com/...`}
                style={{ color: '#000000', backgroundColor: '#ffffff' }}
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md font-medium">
          {success}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/admin/artists')}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Saving...' : artist ? 'Update Artist' : 'Add Artist'}
        </button>
      </div>
    </form>
  );
} 