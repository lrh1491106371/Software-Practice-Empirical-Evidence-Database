'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

function parseBibtexSimple(text: string) {
  const get = (re: RegExp) => {
    const m = text.match(re);
    return m ? m[1].trim().replace(/[{}]/g, '') : '';
  };
  const title = get(/title\s*=\s*[\{\"]([^\}^"]+)[\}\"]/i);
  const authorsRaw = get(/author\s*=\s*[\{\"]([^\}^"]+)[\}\"]/i);
  const year = get(/year\s*=\s*[\{\"]([^\}^"]+)[\}\"]/i);
  const doi = get(/doi\s*=\s*[\{\"]([^\}^"]+)[\}\"]/i);
  const journal = get(/journal\s*=\s*[\{\"]([^\}^"]+)[\}\"]/i);
  const volume = get(/volume\s*=\s*[\{\"]([^\}^"]+)[\}\"]/i);
  const pages = get(/pages\s*=\s*[\{\"]([^\}^"]+)[\}\"]/i);
  const url = get(/url\s*=\s*[\{\"]([^\}^"]+)[\}\"]/i);

  return {
    title,
    authors: authorsRaw
      ? authorsRaw.split(/\s+and\s+/i).map((a) => a.replace(/\s+/g, ' ').trim())
      : [],
    publicationYear: parseInt(year || '') || new Date().getFullYear(),
    doi,
    journalName: journal,
    volume,
    pages,
    url,
  };
}

export default function SubmitPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    publicationYear: new Date().getFullYear(),
    doi: '',
    journalName: '',
    volume: '',
    pages: '',
    abstract: '',
    url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleBibtex = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseBibtexSimple(text);
      setFormData((prev) => ({
        ...prev,
        title: parsed.title || prev.title,
        authors: parsed.authors.join(', '),
        publicationYear: parsed.publicationYear || prev.publicationYear,
        doi: parsed.doi || prev.doi,
        journalName: parsed.journalName || prev.journalName,
        volume: parsed.volume || prev.volume,
        pages: parsed.pages || prev.pages,
        url: parsed.url || prev.url,
      }));
    } catch (err) {
      setError('Failed to parse BibTeX file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        authors: formData.authors.split(',').map(a => a.trim()).filter(a => a),
      };

      await api.post('/articles', submitData);
      setSuccess(true);
      setFormData({
        title: '',
        authors: '',
        publicationYear: new Date().getFullYear(),
        doi: '',
        journalName: '',
        volume: '',
        pages: '',
        abstract: '',
        url: '',
      });
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Submit Article</h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Article submitted successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BibTeX Upload
            </label>
            <input type="file" accept=".bib,.bibtex,text/plain" onChange={handleBibtex} />
            <p className="mt-1 text-sm text-gray-500">Upload a .bib file to prefill fields</p>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-2">
              Authors * (comma-separated)
            </label>
            <input
              type="text"
              id="authors"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-2">
              Publication Year *
            </label>
            <input
              type="number"
              id="publicationYear"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="doi" className="block text-sm font-medium text-gray-700 mb-2">
              DOI
            </label>
            <input
              type="text"
              id="doi"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="journalName" className="block text-sm font-medium text-gray-700 mb-2">
              Journal Name
            </label>
            <input
              type="text"
              id="journalName"
              name="journalName"
              value={formData.journalName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
                Volume
              </label>
              <input
                type="text"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2">
                Pages
              </label>
              <input
                type="text"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
              Abstract
            </label>
            <textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Article'}
          </button>
        </form>
      </div>
    </div>
  );
}

