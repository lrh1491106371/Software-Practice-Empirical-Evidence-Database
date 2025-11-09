'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Article } from '@/types';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.get('/search/articles', {
        params: { q: query },
      });
      setResults(response.data);
    } catch (err: any) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Articles</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((article) => (
            <div key={article._id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/articles/${article._id}`} className="text-primary-600 hover:underline">
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-2">
                <strong>Authors:</strong> {article.authors.join(', ')}
              </p>
              <p className="text-gray-600">
                <strong>Year:</strong> {article.publicationYear}
              </p>
              {article.journalName && (
                <p className="text-gray-600">
                  <strong>Journal:</strong> {article.journalName}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && query && (
          <p className="text-gray-600 text-center py-8">No results found.</p>
        )
      )}
    </div>
  );
}

