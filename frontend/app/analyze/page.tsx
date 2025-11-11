"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { SE_PRACTICES, PRACTICE_TO_CLAIMS } from "@/lib/constants";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ArticleItem {
  _id: string;
  title: string;
  authors: string[];
  publicationYear: number;
}

const schema = z.object({
  sePractice: z.string().min(1, 'SE Practice is required'),
  claim: z.string().min(1, 'Claim is required'),
  evidenceResult: z.enum(['supports','opposes','neutral']),
  researchType: z.string(),
  participantType: z.string(),
  participantCount: z.number().int().min(0).optional().or(z.nan()),
  summary: z.string().optional(),
  notes: z.string().optional(),
});

type EvidenceForm = z.infer<typeof schema>;

export default function AnalyzePage() {
  const { isAuthenticated, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [dialogFor, setDialogFor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<EvidenceForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      sePractice: SE_PRACTICES[0] || '',
      claim: PRACTICE_TO_CLAIMS[SE_PRACTICES[0]]?.[0] || '',
      evidenceResult: 'supports',
      researchType: 'case_study',
      participantType: 'students',
      participantCount: 0,
      summary: '',
      notes: '',
    }
  });

  const canAccess = isAuthenticated && (hasRole("analyst") || hasRole("admin"));

  useEffect(() => {
    if (!canAccess) return;
    const fetchPending = async () => {
      try {
        setLoading(true);
        const res = await api.get("/articles/pending-analysis");
        setArticles(res.data || []);
      } catch (e: any) {
        setError(e.response?.data?.message || "Failed to load pending analysis queue");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [canAccess]);

  const openDialog = (id: string) => {
    setDialogFor(id);
    reset({
      sePractice: SE_PRACTICES[0] || '',
      claim: PRACTICE_TO_CLAIMS[SE_PRACTICES[0]]?.[0] || '',
      evidenceResult: 'supports',
      researchType: 'case_study',
      participantType: 'students',
      participantCount: 0,
      summary: '',
      notes: '',
    });
  };

  const onSubmit = async (data: EvidenceForm) => {
    if (!dialogFor) return;
    try {
      setSaving(true);
      await api.post("/evidence", {
        articleId: dialogFor,
        ...data,
      });
      setArticles((prev) => prev.filter((a) => a._id !== dialogFor));
      setDialogFor(null);
    } catch (e: any) {
      setError(e.response?.data?.message || "Save evidence failed");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-700">Please login to access this page.</p>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-700">You do not have permission to view this page.</p>
      </div>
    );
  }

  const claims = (sePractice: string) => PRACTICE_TO_CLAIMS[sePractice] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Analysis</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-600">No pending items.</p>
      ) : (
        <div className="space-y-4">
          {articles.map((a) => (
            <div key={a._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{a.title}</h2>
                  <p className="text-gray-600 mb-1"><strong>Authors:</strong> {a.authors.join(", ")}</p>
                  <p className="text-gray-600"><strong>Year:</strong> {a.publicationYear}</p>
                </div>
                <button onClick={() => openDialog(a._id)} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Add Evidence</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogFor && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Evidence</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SE Practice</label>
                <select {...register('sePractice')} onChange={(e) => { setValue('sePractice', e.target.value); setValue('claim', claims(e.target.value)[0] || ''); }} className="w-full px-3 py-2 border rounded">
                  {SE_PRACTICES.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
                {errors.sePractice && <p className="text-sm text-red-600 mt-1">{errors.sePractice.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim</label>
                <select {...register('claim')} className="w-full px-3 py-2 border rounded">
                  {claims((document.querySelector('select[name="sePractice"]') as HTMLSelectElement)?.value || SE_PRACTICES[0])
                    .map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
                {errors.claim && <p className="text-sm text-red-600 mt-1">{errors.claim.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Result</label>
                <select {...register('evidenceResult')} className="w-full px-3 py-2 border rounded">
                  <option value="supports">supports</option>
                  <option value="opposes">opposes</option>
                  <option value="neutral">neutral</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Research Type</label>
                <input {...register('researchType')} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participant Type</label>
                <input {...register('participantType')} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participant Count</label>
                <input type="number" {...register('participantCount', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea {...register('summary')} rows={3} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea {...register('notes')} rows={3} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <button type="button" onClick={() => setDialogFor(null)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
