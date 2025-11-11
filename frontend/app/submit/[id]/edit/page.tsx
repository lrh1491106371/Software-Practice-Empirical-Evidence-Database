"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function EditSubmissionPage() {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/${id}`);
        setFormData({
          title: res.data?.title || '',
          authors: (res.data?.authors || []).join(', '),
          publicationYear: res.data?.publicationYear || new Date().getFullYear(),
          doi: res.data?.doi || '',
          journalName: res.data?.journalName || '',
          volume: res.data?.volume || '',
          pages: res.data?.pages || '',
          abstract: res.data?.abstract || '',
          url: res.data?.url || '',
          status: res.data?.status,
        });
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'publicationYear' ? parseInt(value) || new Date().getFullYear() : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...formData, authors: formData.authors.split(',').map((a: string) => a.trim()).filter(Boolean) };
      delete (payload as any).status;
      await api.patch(`/articles/${id}`, payload);
      router.push('/my-submissions');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed. Ensure article is pending review and you are the submitter.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!formData) return <div className="container mx-auto px-4 py-8">Not found</div>;

  const disabled = formData.status !== 'pending_review';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Submission</h1>

      {disabled && (
        <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 rounded mb-4">
          Only articles in pending_review can be edited by submitter.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={disabled} className="w-full px-4 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Authors * (comma-separated)</label>
          <input type="text" name="authors" value={formData.authors} onChange={handleChange} disabled={disabled} className="w-full px-4 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year *</label>
          <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} disabled={disabled} className="w-full px-4 py-2 border rounded" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DOI</label>
            <input type="text" name="doi" value={formData.doi} onChange={handleChange} disabled={disabled} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Journal</label>
            <input type="text" name="journalName" value={formData.journalName} onChange={handleChange} disabled={disabled} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
            <input type="text" name="volume" value={formData.volume} onChange={handleChange} disabled={disabled} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
            <input type="text" name="pages" value={formData.pages} onChange={handleChange} disabled={disabled} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
          <textarea name="abstract" value={formData.abstract} onChange={handleChange} disabled={disabled} rows={5} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input type="url" name="url" value={formData.url} onChange={handleChange} disabled={disabled} className="w-full px-4 py-2 border rounded" />
        </div>

        <button type="submit" disabled={disabled || saving} className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
