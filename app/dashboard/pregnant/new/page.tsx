'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPregnantMotherPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    date_registered: new Date().toISOString().slice(0, 10),
    first_name: '',
    middle_name: '',
    last_name: '',
    address: '',
    purok: '',
    age: '',
    contact_number: '',
    lmp: '',
    gravida_para: '',
    edd: '',
    blood_pressure: '',
    height_cm: '',
    weight_kg: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.last_name.trim() || !form.first_name.trim()) {
      setError('First and last name are required.');
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const full_name = [form.first_name, form.middle_name, form.last_name]
      .filter(Boolean)
      .join(' ');

    const { error: insertError } = await supabase.from('pregnant_mothers').insert({
      date_registered: form.date_registered,
      first_name: form.first_name,
      middle_name: form.middle_name || null,
      last_name: form.last_name,
      full_name,
      address: form.address || null,
      purok: form.purok || null,
      age: form.age ? parseInt(form.age) : null,
      contact_number: form.contact_number || null,
      lmp: form.lmp || null,
      gravida_para: form.gravida_para || null,
      edd: form.edd || null,
      blood_pressure: form.blood_pressure || null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      registered_by: user?.id ?? null,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push('/dashboard/pregnant');
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-1">Register Pregnant Mother</h1>
      <p className="text-gray-600 mb-6">
        Fill in the details below to add a new record.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 space-y-5"
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Date of Registration</label>
          <input
            type="date"
            value={form.date_registered}
            onChange={(e) => updateField('date_registered', e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => updateField('first_name', e.target.value)}
              placeholder="First name"
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={form.middle_name}
              onChange={(e) => updateField('middle_name', e.target.value)}
              placeholder="Middle name"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => updateField('last_name', e.target.value)}
              placeholder="Last name"
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Purok</label>
            <input
              type="text"
              value={form.purok}
              onChange={(e) => updateField('purok', e.target.value)}
              placeholder="e.g. 1"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => updateField('age', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="text"
            value={form.contact_number}
            onChange={(e) => updateField('contact_number', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pregnancy details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">LMP (Last Menstrual Period)</label>
            <input
              type="date"
              value={form.lmp}
              onChange={(e) => updateField('lmp', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">EDC (Expected Date of Confinement)</label>
            <input
              type="date"
              value={form.edd}
              onChange={(e) => updateField('edd', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gravida-Para (G-P)</label>
          <input
            type="text"
            value={form.gravida_para}
            onChange={(e) => updateField('gravida_para', e.target.value)}
            placeholder="e.g. G2P1"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Vitals */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Blood Pressure</label>
            <input
              type="text"
              value={form.blood_pressure}
              onChange={(e) => updateField('blood_pressure', e.target.value)}
              placeholder="e.g. 120/80"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              step="0.1"
              value={form.height_cm}
              onChange={(e) => updateField('height_cm', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={form.weight_kg}
              onChange={(e) => updateField('weight_kg', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Saving...' : 'Save Record'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/pregnant')}
            className="px-5 py-2 rounded-lg text-sm border hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}