import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import PrenatalCheckups from '@/components/PrenatalCheckups';
import { getPregnancyMonth, getTrimester, getNutritionTips } from '@/utils/nutritionTips';

export const dynamic = 'force-dynamic';

export default async function ViewPregnantMotherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: record } = await supabase
    .from('pregnant_mothers')
    .select('*')
    .eq('id', id)
    .single();

  if (!record) {
    notFound();
  }
const {
  data: { user },
} = await supabase.auth.getUser();

const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user?.id)
  .single();
const canEdit = profile?.role !== 'admin' && profile?.role !== 'nurse';


  const { data: checkups } = await supabase
    .from('prenatal_checkups')
    .select('id, trimester, checkup_date, blood_pressure, weight_kg, notes')
    .eq('pregnant_mother_id', id);

  const fullName = [record.first_name, record.middle_name, record.last_name]
    .filter(Boolean)
    .join(' ');

  const month = getPregnancyMonth(record.lmp);
  const trimester = getTrimester(month);
  const tips = getNutritionTips(month);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">
          {record.serial_no ?? 'Record'} — {fullName}
        </h1>
        <p className="text-muted">Pregnant mother record details.</p>
      </div>

      {/* Nutrition Tips — based on LMP-calculated pregnancy month */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Nutrition Tips</h2>
          {month != null && (
            <span className="text-xs px-2 py-1 rounded-full bg-brand-light text-brand-dark font-medium">
              Month {month} · {trimester} Trimester
            </span>
          )}
        </div>

        {month == null ? (
          <p className="text-sm text-muted-2">
            LMP not set for this record — cannot determine pregnancy month.
          </p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-dark">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Read-only info summary — hidden for now */}
      {/*
      <div className="card p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <InfoRow label="Date Registered" value={record.date_registered} />
          <InfoRow label="Address" value={record.address} />
          <InfoRow label="Purok" value={record.purok} />
          <InfoRow label="Age" value={record.age} />
          <InfoRow label="Contact Number" value={record.contact_number} />
          <InfoRow label="LMP" value={record.lmp} />
          <InfoRow label="EDC" value={record.edd} />
          <InfoRow label="Gravida-Para" value={record.gravida_para} />
          <InfoRow label="Blood Pressure" value={record.blood_pressure} />
          <InfoRow label="Height" value={record.height_cm ? `${record.height_cm} cm` : null} />
          <InfoRow label="Weight" value={record.weight_kg ? `${record.weight_kg} kg` : null} />
          <InfoRow label="Risk Level" value={record.risk_level} />
        </div>
      </div>
      */}

      <PrenatalCheckups motherId={id} initialCheckups={checkups ?? []} canEdit={canEdit} />
    </div>
  );
}

// Kept for when the summary card above is re-enabled.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function InfoRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <p className="text-muted-2 text-xs mb-0.5">{label}</p>
      <p className="text-gray-800">{value ?? '—'}</p>
    </div>
  );
}