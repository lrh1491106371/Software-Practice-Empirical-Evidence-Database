"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

export default function ResetWithTokenPage() {
  const { token } = useParams() as { token: string };
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setMsg('Password reset successful. Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (e: any) {
      setMsg('Reset failed. Token invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <form onSubmit={submit} className="max-w-md bg-white p-6 rounded shadow space-y-4">
        <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required minLength={6} />
        <button type="submit" disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        {msg && <p className="text-gray-700">{msg}</p>}
      </form>
    </div>
  );
}
