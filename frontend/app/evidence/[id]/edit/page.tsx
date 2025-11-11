"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function EvidenceEditPage() {
  const { isAuthenticated, hasRole } = useAuth();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const canAccess = isAuthenticated && (hasRole("analyst") || hasRole("admin"));

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/evidence/${id}`);
        setForm(res.data);
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load evidence');
      } finally {
        setLoading(false);
      }
    };
    if (id && canAccess) load();
  }, [id, canAccess]);

  const update = async () => {
    try {
      setSaving(true);
      const payload = {
        sePractice: form.sePractice,
        claim: form.claim,
        evidenceResult: form.evidenceResult,
        researchType: form.researchType,
        participantType: form.participantType,
        participantCount: form.participantCount,
        summary: form.summary,
        notes: form.notes,
      };
      await api.patch(`/evidence/${id}`, payload);
      router.push('/evidence');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return <div className="container mx-auto px-4 py-8">Please login.</div>;
  if (!canAccess) return <div className="container mx-auto px-4 py-8">No permission.</div>;
  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!form) return <div className="container mx-auto px-4 py-8">Not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Evidence</h1>
      <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SE Practice</label>
          <input value={form.sePractice} onChange={(e) => setForm({ ...form, sePractice: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Claim</label>
          <input value={form.claim} onChange={(e) => setForm({ ...form, claim: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Result</label>
          <select value={form.evidenceResult} onChange={(e) => setForm({ ...form, evidenceResult: e.target.value })} className="w-full px-3 py-2 border rounded">
            <option value="supports">supports</option>
            <option value="opposes">opposes</option>
            <option value="neutral">neutral</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Research Type</label>
          <input value={form.researchType} onChange={(e) => setForm({ ...form, researchType: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Participant Type</label>
          <input value={form.participantType} onChange={(e) => setForm({ ...form, participantType: e.target.value })} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Participant Count</label>
          <input type="number" value={form.participantCount || 0} onChange={(e) => setForm({ ...form, participantCount: parseInt(e.target.value || '0', 10) })} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
          <textarea value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="md:col-span-2 flex gap-2 justify-end">
          <button onClick={() => router.push('/evidence')} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={update} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
