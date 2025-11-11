"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

interface ArticleListItem {
  _id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  doi?: string;
}

export default function ModeratePage() {
  const { isAuthenticated, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const canAccess = isAuthenticated && (hasRole("moderator") || hasRole("admin"));

  useEffect(() => {
    if (!canAccess) return;
    const fetchPending = async () => {
      try {
        setLoading(true);
        const res = await api.get("/articles/pending-review");
        setArticles(res.data || []);
      } catch (e: any) {
        setError(e.response?.data?.message || "Failed to load pending articles");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [canAccess]);

  const approve = async (id: string) => {
    try {
      setActionLoadingId(id);
      await api.post(`/articles/${id}/approve`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (e: any) {
      setError(e.response?.data?.message || "Approve failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Reject reason (optional)") || undefined;
    try {
      setActionLoadingId(id);
      await api.post(`/articles/${id}/reject`, { reason });
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (e: any) {
      setError(e.response?.data?.message || "Reject failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-700">Please login to access this page.</p>
        <Link href="/login" className="text-primary-600 hover:underline">Go to Login</Link>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Review</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-600">No pending articles.</p>
      ) : (
        <div className="space-y-4">
          {articles.map((a) => (
            <div key={a._id} className="bg-white p-6 rounded-lg shadow flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">{a.title}</h2>
                <p className="text-gray-600 mb-1"><strong>Authors:</strong> {a.authors.join(", ")}</p>
                <p className="text-gray-600"><strong>Year:</strong> {a.publicationYear}{a.doi ? ` · DOI: ${a.doi}` : ""}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve(a._id)}
                  disabled={actionLoadingId === a._id}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoadingId === a._id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => reject(a._id)}
                  disabled={actionLoadingId === a._id}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoadingId === a._id ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
