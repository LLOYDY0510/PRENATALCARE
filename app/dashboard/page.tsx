import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import BhwHeadDashboard from '@/components/BhwHeadDashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, purok')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'pending';

  return (
    <div>
      {role === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-2">Waiting for role assignment</h1>
          <p className="text-gray-600">
            Your account hasn&apos;t been assigned a role yet. Please contact the admin.
          </p>
        </div>
      )}

      {role === 'bhw_head' && <BhwHeadDashboard />}

      {role === 'nurse' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Nurse Dashboard 💉</h1>
          <p className="text-gray-600">Patient records, immunizations, and health monitoring.</p>
        </div>
      )}

      {role === 'midwife' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Midwife Dashboard 🩺</h1>
          <p className="text-gray-600">Overview of pregnant mothers, checkups, and schedules.</p>
        </div>
      )}

      {role === 'bhw_purok' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">
            BHW Dashboard — Purok {profile?.purok ?? '?'} 📍
          </h1>
          <p className="text-gray-600">Households and pregnant mothers in your assigned purok.</p>
        </div>
      )}

      {role === 'pregnant_mother' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">My Health Dashboard 🤰</h1>
          <p className="text-gray-600">Your checkup schedule, records, and reminders.</p>
        </div>
      )}
    </div>
  );
}