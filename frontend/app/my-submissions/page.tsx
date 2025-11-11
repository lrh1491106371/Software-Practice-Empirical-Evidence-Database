"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

interface ArticleRow {
  _id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  status: string;
}

export default function MySubmissionsPage() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<ArticleRow[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/articles/my-submissions");
        setRows(res.data || []);
      } catch (e: any) {
        setError(e.response?.data?.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-700">Please login to view your submissions.</p>
        <Link href="/login" className="text-primary-600 hover:underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Submissions</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-600">You have no submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Authors</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-2">
                    <Link href={`/articles/${r._id}`} className="text-primary-600 hover:underline">
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{r.authors.join(", ")}</td>
                  <td className="px-4 py-2">{r.publicationYear}</td>
                  <td className="px-4 py-2 capitalize">{r.status.replace(/_/g, " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
