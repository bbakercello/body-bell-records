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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Members</label>
        {formData.members.map((member, index) => (
          <div key={index} className="mt-2 flex gap-2">
            <input
              type="text"
              value={member}
              onChange={(e) => handleMemberChange(index, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
              placeholder="Member name"
            />
            {formData.members.length > 1 && (
              <button
                type="button"
                onClick={() => removeMemberField(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMemberField}
          className="mt-2 text-sky-600 hover:text-sky-800"
        >
          Add Member
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Social Media</label>
        <div className="mt-2 space-y-2">
          {Object.entries(formData.socialMedia).map(([platform, url]) => (
            <div key={platform}>
              <label htmlFor={platform} className="block text-sm text-gray-600">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/artists')}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-sky-800 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : artist ? 'Update Artist' : 'Add Artist'}
        </button>
      </div>
    </form>
  );
} 