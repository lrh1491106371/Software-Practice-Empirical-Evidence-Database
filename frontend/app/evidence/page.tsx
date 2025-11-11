"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface EvidenceRow {
  _id: string;
  sePractice: string;
  claim: string;
  evidenceResult: string;
  researchType: string;
  participantType: string;
  articleId: any;
}

export default function EvidenceListPage() {
  const { isAuthenticated, hasRole } = useAuth();
  const [list, setList] = useState<EvidenceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [practice, setPractice] = useState("");

  const canAccess = isAuthenticated && (hasRole("analyst") || hasRole("admin"));

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/evidence', { params: practice ? { sePractice: practice } : {} });
        setList(res.data || []);
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load evidence');
      } finally {
        setLoading(false);
      }
    };
    if (canAccess) load();
  }, [canAccess, practice]);

  if (!isAuthenticated) return <div className="container mx-auto px-4 py-8">Please login.</div>;
  if (!canAccess) return <div className="container mx-auto px-4 py-8">No permission.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Evidence</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="Filter by SE Practice"
          className="px-3 py-2 border rounded"
        />
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-600">No evidence found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Practice</th>
                <th className="px-4 py-2">Claim</th>
                <th className="px-4 py-2">Result</th>
                <th className="px-4 py-2">Research</th>
                <th className="px-4 py-2">Article</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((ev) => (
                <tr key={ev._id} className="border-t">
                  <td className="px-4 py-2">{ev.sePractice}</td>
                  <td className="px-4 py-2">{ev.claim}</td>
                  <td className="px-4 py-2 capitalize">{ev.evidenceResult}</td>
                  <td className="px-4 py-2 capitalize">{ev.researchType}</td>
                  <td className="px-4 py-2">{typeof ev.articleId === 'object' ? ev.articleId.title : ev.articleId}</td>
                  <td className="px-4 py-2">
                    <a href={`/evidence/${ev._id}/edit`} className="text-primary-600 hover:underline">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
