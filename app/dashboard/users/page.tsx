import { createClient } from '@/utils/supabase/server';
<<<<<<< HEAD
import ManageUsersTable from '../../../components/ManageUsersTable';

export const dynamic = 'force-dynamic';

export default async function ManageUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, purok')
    .order('role', { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Manage Users</h1>
      <p className="text-gray-600 mb-6">
        Assign or change roles for every account in the system.
      </p>

      <ManageUsersTable initialUsers={users ?? []} />
    </div>
  );
}
=======
import UserRoleEditor from '@/components/UserRoleEditor';
 
export const dynamic = 'force-dynamic';
 
export default async function ManageUsersPage() {
  const supabase = await createClient();
 
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, purok, created_at')
    .order('created_at', { ascending: false });
 
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Manage Users</h1>
        <p className="text-muted">
          {profiles?.length ?? 0} account{profiles?.length === 1 ? '' : 's'}
        </p>
      </div>
 
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded mb-4">
          Failed to load users: {error.message}
        </p>
      )}
 
      <div className="card overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b text-left text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Purok</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(!profiles || profiles.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-2">
                  No user accounts found.
                </td>
              </tr>
            )}
            {profiles?.map((p) => (
              <UserRoleEditor key={p.id} profile={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
>>>>>>> f8ba70f07c1b1e8f6027bc68203762510ca6735f
