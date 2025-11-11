"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface UserRow {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  isActive: boolean;
}

const ALL_ROLES: UserRole[] = [
  UserRole.SUBMITTER,
  UserRole.MODERATOR,
  UserRole.ANALYST,
  UserRole.ADMIN,
];

export default function AdminPage() {
  const { isAuthenticated, hasRole } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roles: [UserRole.SUBMITTER] as UserRole[],
  });
  const canAccess = isAuthenticated && hasRole("admin");

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canAccess) load();
  }, [canAccess]);

  const toggleRole = (u: UserRow, role: UserRole) => {
    const roles = u.roles.includes(role)
      ? u.roles.filter((r) => r !== role)
      : [...u.roles, role];
    setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, roles } : x)));
  };

  const saveRoles = async (u: UserRow) => {
    try {
      await api.patch(`/users/${u._id}`, { roles: u.roles });
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to update roles");
    }
  };

  const removeUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((x) => x._id !== id));
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to delete user");
    }
  };

  const createUser = async () => {
    try {
      setCreating(true);
      await api.post("/users", createForm);
      setCreateForm({ email: "", password: "", firstName: "", lastName: "", roles: [UserRole.SUBMITTER] });
      await load();
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  if (!isAuthenticated) return <div className="container mx-auto px-4 py-8">Please login.</div>;
  if (!canAccess) return <div className="container mx-auto px-4 py-8">No permission.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin - Users</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-3">Create User</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input placeholder="Email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="px-3 py-2 border rounded" />
          <input placeholder="Password" type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="px-3 py-2 border rounded" />
          <input placeholder="First Name" value={createForm.firstName} onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })} className="px-3 py-2 border rounded" />
          <input placeholder="Last Name" value={createForm.lastName} onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })} className="px-3 py-2 border rounded" />
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {ALL_ROLES.map((r) => (
            <label key={r} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={createForm.roles.includes(r)}
                onChange={() => {
                  const roles = createForm.roles.includes(r)
                    ? createForm.roles.filter((x) => x !== r)
                    : [...createForm.roles, r];
                  setCreateForm({ ...createForm, roles });
                }}
              />
              <span className="capitalize">{r}</span>
            </label>
          ))}
        </div>
        <div className="mt-3">
          <button onClick={createUser} disabled={creating} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50">
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Roles</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t align-top">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-3">
                    {ALL_ROLES.map((r) => (
                      <label key={r} className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={u.roles.includes(r)} onChange={() => toggleRole(u, r)} />
                        <span className="capitalize">{r}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <button onClick={() => saveRoles(u)} className="text-primary-600 hover:underline">Save Roles</button>
                  </div>
                </td>
                <td className="px-4 py-2">{u.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  <button onClick={() => removeUser(u._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
