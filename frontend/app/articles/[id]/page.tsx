"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { StarRating } from "@/components/StarRating";
import { useAuth } from "@/contexts/AuthContext";

interface Article {
  _id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  doi?: string;
  journalName?: string;
  volume?: string;
  pages?: string;
  abstract?: string;
  averageRating?: number;
}

interface Evidence {
  _id: string;
  sePractice: string;
  claim: string;
  evidenceResult: string;
  researchType: string;
  participantType: string;
  participantCount?: number;
  summary?: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [ratingSaving, setRatingSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [a, e] = await Promise.all([
          api.get(`/articles/${id}`),
          api.get(`/evidence/article/${id}`),
        ]);
        setArticle(a.data || null);
        setEvidence(e.data || null);
      } catch (e: any) {
        setError(e.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const submitRating = async (val: number) => {
    if (!isAuthenticated || !id) return;
    try {
      setRatingSaving(true);
      const res = await api.post(`/articles/${id}/rate`, { value: val });
      setArticle((prev) => ({ ...(prev as any), averageRating: res.data?.averageRating || val }));
    } catch (e: any) {
      setError(e.response?.data?.message || "Rating failed");
    } finally {
      setRatingSaving(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!article) return <div className="container mx-auto px-4 py-8">Not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <div className="flex items-center gap-3">
          <StarRating value={article.averageRating || 0} readOnly={!isAuthenticated} onChange={submitRating} />
          {ratingSaving && <span className="text-sm text-gray-500">Saving...</span>}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p className="text-gray-700 mb-1"><strong>Authors:</strong> {article.authors.join(", ")}</p>
        <p className="text-gray-700 mb-1"><strong>Year:</strong> {article.publicationYear}</p>
        {article.journalName && (
          <p className="text-gray-700 mb-1"><strong>Journal:</strong> {article.journalName}</p>
        )}
        {article.volume && (
          <p className="text-gray-700 mb-1"><strong>Volume:</strong> {article.volume}</p>
        )}
        {article.pages && (
          <p className="text-gray-700 mb-1"><strong>Pages:</strong> {article.pages}</p>
        )}
        {article.doi && (
          <p className="text-gray-700 mb-1"><strong>DOI:</strong> {article.doi}</p>
        )}
        {article.abstract && (
          <div className="mt-3">
            <p className="text-gray-900 font-semibold mb-1">Abstract</p>
            <p className="text-gray-700">{article.abstract}</p>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-3">Evidence</h2>
      {!evidence ? (
        <p className="text-gray-600">No evidence available for this article.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700 mb-1"><strong>SE Practice:</strong> {evidence.sePractice}</p>
          <p className="text-gray-700 mb-1"><strong>Claim:</strong> {evidence.claim}</p>
          <p className="text-gray-700 mb-1"><strong>Result:</strong> {evidence.evidenceResult}</p>
          <p className="text-gray-700 mb-1"><strong>Research Type:</strong> {evidence.researchType}</p>
          <p className="text-gray-700 mb-1"><strong>Participant Type:</strong> {evidence.participantType}</p>
          {typeof evidence.participantCount === "number" && (
            <p className="text-gray-700 mb-1"><strong>Participant Count:</strong> {evidence.participantCount}</p>
          )}
          {evidence.summary && (
            <div className="mt-3">
              <p className="text-gray-900 font-semibold mb-1">Summary</p>
              <p className="text-gray-700">{evidence.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
