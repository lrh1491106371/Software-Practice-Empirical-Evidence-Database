"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setToken("");
    setLoading(true);
    try {
      const res = await api.post('/auth/request-reset', { email });
      setMsg('If the email exists, a reset link has been sent. (Testing token shown below)');
      if (res.data?.token) setToken(res.data.token);
    } catch (e: any) {
      setMsg('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Request Password Reset</h1>
      <form onSubmit={submit} className="max-w-md bg-white p-6 rounded shadow space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        <button type="submit" disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit'}</button>
        {msg && <p className="text-gray-700">{msg}</p>}
        {token && (
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-700">Testing token:</p>
            <code className="break-all text-xs">{token}</code>
          </div>
        )}
      </form>
    </div>
  );
}
