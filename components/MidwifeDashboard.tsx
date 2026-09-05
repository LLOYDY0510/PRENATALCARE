import { createClient } from '@/utils/supabase/server';

export default async function MidwifeDashboard() {
  const supabase = await createClient();

  const { data: records } = await supabase
    .from('pregnant_mothers')
    .select('id, purok, risk_level');

  const total = records?.length ?? 0;
  const highRisk = records?.filter((r) => r.risk_level === 'high').length ?? 0;
  const lowRisk = records?.filter((r) => r.risk_level === 'low').length ?? 0;

  const { count: userCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  const { count: pendingCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'pending');

  const { count: bhwCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'bhw_purok');

  const { data: recentActivity } = await supabase
    .from('activity_logs')
    .select('id, action, details, created_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(5);

  const highPct = total > 0 ? Math.round((highRisk / total) * 100) : 0;
  const lowPct = total > 0 ? 100 - highPct : 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Midwife Dashboard</h1>
        <p className="text-sm text-muted mt-0.5">{today}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Registered" value={total} icon="👥" iconBg="bg-brand-light" />
        <KpiCard
          label="High Risk"
          value={highRisk}
          icon="⚠️"
          iconBg="bg-red-50"
          valueColor="text-red-600"
        />
        <KpiCard
          label="Total System Users"
          value={userCount ?? 0}
          icon="🧑‍⚕️"
          iconBg="bg-brand-light"
          valueColor="text-brand-dark"
        />
        <KpiCard
          label="Pending Approval"
          value={pendingCount ?? 0}
          icon="⏳"
          iconBg="bg-amber-50"
          valueColor="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donut chart */}
        <div className="card p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-ink mb-6">Risk Distribution</h2>
          {total === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-2">
              No data yet.
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F4" strokeWidth="14" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="14"
                  strokeDasharray={`${(lowPct / 100) * 251.2} 251.2`}
                  strokeLinecap={lowPct === 100 ? 'butt' : 'round'}
                />
                {highPct > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="14"
                    strokeDasharray={`${(highPct / 100) * 251.2} 251.2`}
                    strokeDashoffset={`${-(lowPct / 100) * 251.2}`}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="flex gap-5 mt-5 text-xs">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" />
                  Low {lowPct}%
                </span>
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                  High {highPct}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* System overview */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">System Overview</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Low Risk Mothers</span>
              <span className="font-medium text-green-600">{lowRisk}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">High Risk Mothers</span>
              <span className="font-medium text-red-600">{highRisk}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Active BHW (Purok)</span>
              <span className="font-medium text-ink">{bhwCount ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Accounts Awaiting Role</span>
              <span className="font-medium text-amber-600">{pendingCount ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Recent Activity</h2>
          {!recentActivity || recentActivity.length === 0 ? (
            <p className="text-sm text-muted-2">No recent activity.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((log: any) => (
                <li key={log.id} className="text-xs">
                  <p className="text-muted">
                    <span className="font-medium text-ink">
                      {log.profiles?.full_name || log.profiles?.email || 'System'}
                    </span>{' '}
                    — {log.action}
                  </p>
                  <p className="text-muted-2">
                    {new Date(log.created_at).toLocaleString('en-PH', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  iconBg,
  valueColor = 'text-ink',
}: {
  label: string;
  value: number;
  icon: string;
  iconBg: string;
  valueColor?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center text-sm`}>
          {icon}
        </span>
      </div>
      <p className={`text-3xl font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}