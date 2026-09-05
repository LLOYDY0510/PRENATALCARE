import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PrenatalCheckupsPage() {
  const supabase = await createClient();

  const { data: records } = await supabase
    .from('pregnant_mothers')
    .select('id, serial_no, first_name, middle_name, last_name, purok, edd')
    .order('serial_no', { ascending: true });

  const { data: allCheckups } = await supabase
    .from('prenatal_checkups')
    .select('pregnant_mother_id, trimester, checkup_date')
    .order('checkup_date', { ascending: true });

  // Map: motherId -> { '1st': date, '2nd': date, '3rd': date }
  const datesByMother: Record<string, Record<string, string>> = {};
  const countsByMother: Record<string, number> = {};
  allCheckups?.forEach((c) => {
    if (!datesByMother[c.pregnant_mother_id]) {
      datesByMother[c.pregnant_mother_id] = {};
    }
    // Keep the latest date recorded for that trimester
    datesByMother[c.pregnant_mother_id][c.trimester] = c.checkup_date;
    countsByMother[c.pregnant_mother_id] = (countsByMother[c.pregnant_mother_id] || 0) + 1;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Prenatal Checkups</h1>
      <p className="text-muted mb-6">
        Select a pregnant mother to view or record her 1st–3rd trimester checkups.
      </p>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b text-left text-muted">
            <tr>
              <th className="px-4 py-3">Serial No.</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Purok</th>
              <th className="px-4 py-3">EDC</th>
              <th className="px-4 py-3">Checkup Recorded</th>
              <th className="px-4 py-3 bg-blue-50/50">1st Tri</th>
              <th className="px-4 py-3 bg-purple-50/50">2nd Tri</th>
              <th className="px-4 py-3 bg-orange-50/50">3rd Tri</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(!records || records.length === 0) && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-2">
                  No pregnant mothers registered yet.
                </td>
              </tr>
            )}
            {records?.map((r) => {
              const dates = datesByMother[r.id] ?? {};
              return (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {r.serial_no ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {[r.first_name, r.middle_name, r.last_name].filter(Boolean).join(' ')}
                  </td>
                  <td className="px-4 py-3">{r.purok ?? '—'}</td>
                  <td className="px-4 py-3">{r.edd ?? '—'}</td>
                  <td className="px-4 py-3">{countsByMother[r.id] ?? 0}</td>
                  <td className="px-4 py-3 bg-blue-50/30">
                    {dates['1st'] ? (
                      <span className="text-gray-700">{dates['1st']}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 bg-purple-50/30">
                    {dates['2nd'] ? (
                      <span className="text-gray-700">{dates['2nd']}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 bg-orange-50/30">
                    {dates['3rd'] ? (
                      <span className="text-gray-700">{dates['3rd']}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/pregnant/${r.id}`}
                      className="text-brand hover:underline"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}