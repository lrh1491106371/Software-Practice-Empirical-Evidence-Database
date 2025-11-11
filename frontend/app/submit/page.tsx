"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.string().min(1, 'Authors are required'),
  publicationYear: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  doi: z.string().optional(),
  journalName: z.string().optional(),
  volume: z.string().optional(),
  pages: z.string().optional(),
  abstract: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      authors: '',
      publicationYear: new Date().getFullYear(),
      doi: '',
      journalName: '',
      volume: '',
      pages: '',
      abstract: '',
      url: '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  const handleBibtex = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseBibtexSimple(text);
      setValue('title', parsed.title || watch('title'));
      setValue('authors', parsed.authors.join(', '));
      setValue('publicationYear', parsed.publicationYear || watch('publicationYear'));
      setValue('doi', parsed.doi || watch('doi'));
      setValue('journalName', parsed.journalName || watch('journalName'));
      setValue('volume', parsed.volume || watch('volume'));
      setValue('pages', parsed.pages || watch('pages'));
      setValue('url', parsed.url || watch('url'));
    } catch (err) {
      setError('Failed to parse BibTeX file.');
    }
  };

  const onSubmit = async (data: FormValues) => {
    setError('');
    try {
      const submitData = {
        ...data,
        authors: data.authors.split(',').map(a => a.trim()).filter(a => a),
      } as any;
      await api.post('/articles', submitData);
      setSuccess(true);
      setTimeout(() => router.push('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
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

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">BibTeX Upload</label>
            <input type="file" accept=".bib,.bibtex,text/plain" onChange={handleBibtex} />
            <p className="mt-1 text-sm text-gray-500">Upload a .bib file to prefill fields</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input {...register('title')} className="w-full px-4 py-2 border rounded" />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Authors * (comma-separated)</label>
            <input {...register('authors')} className="w-full px-4 py-2 border rounded" />
            {errors.authors && <p className="text-sm text-red-600 mt-1">{errors.authors.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year *</label>
            <input type="number" {...register('publicationYear', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded" />
            {errors.publicationYear && <p className="text-sm text-red-600 mt-1">{errors.publicationYear.message as any}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">DOI</label>
              <input {...register('doi')} className="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Journal Name</label>
              <input {...register('journalName')} className="w-full px-4 py-2 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
              <input {...register('volume')} className="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
              <input {...register('pages')} className="w-full px-4 py-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
            <textarea {...register('abstract')} rows={5} className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input type="url" {...register('url')} className="w-full px-4 py-2 border rounded" />
            {errors.url && <p className="text-sm text-red-600 mt-1">{errors.url.message as any}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit Article'}
          </button>
        </form>
      </div>
    </div>
  );
}

