'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Checkup = {
  id: string;
  trimester: '1st' | '2nd' | '3rd';
  checkup_date: string;
  blood_pressure: string | null;
  weight_kg: number | null;
  notes: string | null;
};

const TRIMESTERS: ('1st' | '2nd' | '3rd')[] = ['1st', '2nd', '3rd'];

const TRIMESTER_STYLES: Record<string, string> = {
  '1st': 'bg-blue-100 text-blue-700',
  '2nd': 'bg-purple-100 text-purple-700',
  '3rd': 'bg-orange-100 text-orange-700',
};

export default function PrenatalCheckups({
  motherId,
  initialCheckups,
}: {
  motherId: string;
  initialCheckups: Checkup[];
}) {
  const supabase = createClient();
  const [checkups, setCheckups] = useState(initialCheckups);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    trimester: '1st' as '1st' | '2nd' | '3rd',
    checkup_date: '',
    blood_pressure: '',
    weight_kg: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const sortedCheckups = [...checkups].sort((a, b) =>
    b.checkup_date.localeCompare(a.checkup_date)
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.checkup_date) {
      setError('Checkup date is required.');
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('prenatal_checkups')
      .insert({
        pregnant_mother_id: motherId,
        trimester: form.trimester,
        checkup_date: form.checkup_date,
        blood_pressure: form.blood_pressure || null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        notes: form.notes || null,
        recorded_by: user?.id ?? null,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setCheckups((prev) => [...prev, data as Checkup]);
    setForm({ trimester: '1st', checkup_date: '', blood_pressure: '', weight_kg: '', notes: '' });
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Delete this checkup record?');
    if (!confirmed) return;

    await supabase.from('prenatal_checkups').delete().eq('id', id);
    setCheckups((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Prenatal Checkups</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-brand-dark hover:underline"
          >
            + Add checkup
          </button>
        )}
      </div>

      {/* Add checkup form */}
      {showForm && (
        <form onSubmit={handleAdd} className="border rounded-lg p-4 space-y-3 bg-gray-50 mb-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Trimester</label>
              <select
                value={form.trimester}
                onChange={(e) =>
                  setForm((p) => ({ ...p, trimester: e.target.value as '1st' | '2nd' | '3rd' }))
                }
                className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {TRIMESTERS.map((t) => (
                  <option key={t} value={t}>
                    {t} Trimester
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Date they went for checkup
              </label>
              <input
                type="date"
                value={form.checkup_date}
                onChange={(e) => setForm((p) => ({ ...p, checkup_date: e.target.value }))}
                className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Blood Pressure</label>
            <input
              type="text"
              value={form.blood_pressure}
              onChange={(e) => setForm((p) => ({ ...p, blood_pressure: e.target.value }))}
              placeholder="e.g. 120/80"
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={form.weight_kg}
              onChange={(e) => setForm((p) => ({ ...p, weight_kg: e.target.value }))}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              rows={2}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand text-white px-4 py-1.5 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Checkup'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 rounded-lg text-sm border hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Flat list of all checkups, trimester shown beside each entry */}
      <div className="space-y-2">
        {sortedCheckups.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center border rounded-lg">
            No checkups recorded yet.
          </p>
        )}
        {sortedCheckups.map((c) => (
          <div
            key={c.id}
            className="flex items-start justify-between border rounded-lg px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  TRIMESTER_STYLES[c.trimester]
                }`}
              >
                {c.trimester} Tri
              </span>
              <div>
                <p className="text-sm font-medium">{c.checkup_date}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {c.blood_pressure ? `BP: ${c.blood_pressure}` : ''}
                  {c.weight_kg ? ` · Weight: ${c.weight_kg}kg` : ''}
                </p>
                {c.notes && <p className="text-xs text-gray-600 mt-1">{c.notes}</p>}
              </div>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-500 hover:underline text-xs shrink-0"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}