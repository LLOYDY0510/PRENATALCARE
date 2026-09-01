import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ActivityLogPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from('activity_logs')
    .select('id, action, target_type, details, created_at, actor_id, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Activity Log</h1>
      <p className="text-gray-600 mb-6">
        System-wide history of actions taken by all users.
      </p>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {(!logs || logs.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No activity recorded yet.
                </td>
              </tr>
            )}
            {logs?.map((log: any) => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {new Date(log.created_at).toLocaleString('en-PH', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {log.profiles?.full_name || log.profiles?.email || 'System'}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{log.details ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}