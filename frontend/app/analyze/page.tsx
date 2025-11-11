"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { SE_PRACTICES, PRACTICE_TO_CLAIMS } from "@/lib/constants";

interface ArticleItem {
  _id: string;
  title: string;
  authors: string[];
  publicationYear: number;
}

export default function AnalyzePage() {
  const { isAuthenticated, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [dialogFor, setDialogFor] = useState<string | null>(null);
  const [form, setForm] = useState({
    sePractice: "",
    claim: "",
    evidenceResult: "supports",
    researchType: "case_study",
    participantType: "students",
    participantCount: 0,
    summary: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

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

  const draftKey = (id: string) => `draft_evidence_${id}`;

  const openDialog = (id: string) => {
    setDialogFor(id);
    const draft = typeof window !== 'undefined' ? localStorage.getItem(draftKey(id)) : null;
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setForm(parsed);
        return;
      } catch {}
    }
    setForm({
      sePractice: SE_PRACTICES[0] || "",
      claim: PRACTICE_TO_CLAIMS[SE_PRACTICES[0]]?.[0] || "",
      evidenceResult: "supports",
      researchType: "case_study",
      participantType: "students",
      participantCount: 0,
      summary: "",
      notes: "",
    });
  };

  const updateForm = (patch: Partial<typeof form>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (dialogFor && typeof window !== 'undefined') {
      localStorage.setItem(draftKey(dialogFor), JSON.stringify(next));
    }
  };

  const validate = () => {
    if (!form.sePractice.trim()) return "SE Practice is required";
    if (!form.claim.trim()) return "Claim is required";
    return "";
  };

  const submitEvidence = async () => {
    if (!dialogFor) return;
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    try {
      setSaving(true);
      await api.post("/evidence", {
        articleId: dialogFor,
        ...form,
      });
      setArticles((prev) => prev.filter((a) => a._id !== dialogFor));
      if (typeof window !== 'undefined') localStorage.removeItem(draftKey(dialogFor));
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

  const claims = form.sePractice ? PRACTICE_TO_CLAIMS[form.sePractice] || [] : [];

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
                <button
                  onClick={() => openDialog(a._id)}
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Add Evidence
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogFor && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Evidence</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SE Practice</label>
                <select
                  value={form.sePractice}
                  onChange={(e) => updateForm({ sePractice: e.target.value, claim: (PRACTICE_TO_CLAIMS[e.target.value] || [""])[0] || "" })}
                  className="w-full px-3 py-2 border rounded"
                >
                  {SE_PRACTICES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim</label>
                <select
                  value={form.claim}
                  onChange={(e) => updateForm({ claim: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  {claims.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Result</label>
                <select
                  value={form.evidenceResult}
                  onChange={(e) => updateForm({ evidenceResult: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="supports">supports</option>
                  <option value="opposes">opposes</option>
                  <option value="neutral">neutral</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Research Type</label>
                <select
                  value={form.researchType}
                  onChange={(e) => updateForm({ researchType: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="case_study">case_study</option>
                  <option value="experiment">experiment</option>
                  <option value="survey">survey</option>
                  <option value="systematic_review">systematic_review</option>
                  <option value="meta_analysis">meta_analysis</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participant Type</label>
                <select
                  value={form.participantType}
                  onChange={(e) => updateForm({ participantType: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="students">students</option>
                  <option value="professionals">professionals</option>
                  <option value="mixed">mixed</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participant Count</label>
                <input
                  type="number"
                  value={form.participantCount}
                  onChange={(e) => updateForm({ participantCount: parseInt(e.target.value || "0", 10) })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => updateForm({ summary: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateForm({ notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button onClick={() => setDialogFor(null)} className="px-4 py-2 rounded border">Cancel</button>
              <button
                onClick={submitEvidence}
                disabled={saving}
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
