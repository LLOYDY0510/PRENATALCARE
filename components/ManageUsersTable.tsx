'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  purok: string | null;
};

const ROLES = [
  { value: 'pending', label: 'Pending' },
  { value: 'pregnant_mother', label: 'Pregnant Mother' },
  { value: 'bhw_purok', label: 'BHW (Purok)' },
  { value: 'bhw_head', label: 'BHW Head' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'midwife', label: 'Midwife' },
];

const ROLE_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  pregnant_mother: 'bg-pink-100 text-pink-700',
  bhw_purok: 'bg-green-100 text-green-700',
  bhw_head: 'bg-blue-100 text-blue-700',
  nurse: 'bg-purple-100 text-purple-700',
  midwife: 'bg-teal-100 text-teal-700',
};

export default function ManageUsersTable({ initialUsers }: { initialUsers: UserRow[] }) {
  const supabase = createClient();
  const [users, setUsers] = useState(initialUsers);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  async function updateRole(id: string, role: string) {
    setSavingId(id);
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    }
    setSavingId(null);
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.full_name ?? '').toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full max-w-sm border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name / Email</th>
              <th className="px-4 py-3">Current Role</th>
              <th className="px-4 py-3">Purok</th>
              <th className="px-4 py-3">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  No matching users found.
                </td>
              </tr>
            )}
            {filtered.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{user.full_name || 'No name set'}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ROLE_STYLES[user.role] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.purok ?? '—'}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    disabled={savingId === user.id}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {savingId === user.id && (
                    <span className="text-xs text-gray-400 ml-2">Saving...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}