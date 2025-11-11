'use client';

import { useState, useMemo } from 'react';
import api from '@/lib/api';
import { Article } from '@/types';
import Link from 'next/link';
import { StarRating } from '@/components/StarRating';
import { SE_PRACTICES, PRACTICE_TO_CLAIMS } from '@/lib/constants';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [sePractice, setSePractice] = useState('');
  const [claim, setClaim] = useState('');
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'publicationYear' | 'journalName'>('publicationYear');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const claimOptions = useMemo(() => (sePractice ? PRACTICE_TO_CLAIMS[sePractice] || [] : []), [sePractice]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (query && !sePractice && !yearFrom && !yearTo && !claim) {
        const response = await api.get('/search/articles', { params: { q: query } });
        setResults(sortArticles(response.data));
      } else {
        const response = await api.get('/search/advanced', {
          params: {
            q: query || undefined,
            sePractice: sePractice || undefined,
            claim: claim || undefined,
            yearFrom: yearFrom || undefined,
            yearTo: yearTo || undefined,
          },
        });
        const articles = (response.data || [])
          .map((e: any) => e.articleId)
          .filter(Boolean);
        setResults(sortArticles(articles));
      }
    } catch (err: any) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortArticles = (arr: Article[]): Article[] => {
    const copy = [...(arr || [])];
    copy.sort((a: any, b: any) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Articles</h1>

      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title contains..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            value={sePractice}
            onChange={(e) => { setSePractice(e.target.value); setClaim(''); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">SE Practice (optional)</option>
            {SE_PRACTICES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            disabled={!sePractice}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Claim (optional)</option>
            {claimOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              placeholder="Year From"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              placeholder="Year To"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2 items-center">
          <label className="text-sm text-gray-700">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded"
          >
            <option value="publicationYear">Year</option>
            <option value="title">Title</option>
            <option value="journalName">Journal</option>
          </select>
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as any)}
            className="px-3 py-2 border rounded"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
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
          {results.map((article: any) => (
            <div key={article._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    <Link href={`/articles/${article._id}`} className="text-primary-600 hover:underline">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <strong>Authors:</strong> {article.authors.join(', ')}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Year:</strong> {article.publicationYear}
                  </p>
                  {article.journalName && (
                    <p className="text-gray-600 mb-1">
                      <strong>Journal:</strong> {article.journalName}
                    </p>
                  )}
                  {article.doi && (
                    <p className="text-gray-600 mb-1">
                      <strong>DOI:</strong> {article.doi}
                    </p>
                  )}
                </div>
                <div className="mt-1">
                  <StarRating value={article.averageRating || 0} readOnly />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (query || sePractice || claim || yearFrom || yearTo) && (
          <p className="text-gray-600 text-center py-8">No results found.</p>
        )
      )}
    </div>
  );
}

