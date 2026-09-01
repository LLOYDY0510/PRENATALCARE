import { createClient } from '@/utils/supabase/server';
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