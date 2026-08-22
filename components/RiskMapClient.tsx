'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const RiskMap = dynamic<{
  records: RiskPoint[];
  pendingClick?: (lat: number, lng: number) => void;
}>(() => import('@/components/RiskMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg border">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

type RiskPoint = {
  id: string;
  full_name: string;
  purok: string | null;
  risk_level: 'low' | 'medium' | 'high';
  latitude: number;
  longitude: number;
};

type Unlocated = {
  id: string;
  full_name: string;
};

export default function RiskMapClient({
  records,
  unlocated,
}: {
  records: RiskPoint[];
  unlocated: Unlocated[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [selectedId, setSelectedId] = useState('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [saving, setSaving] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  async function handleMapClick(lat: number, lng: number) {
    if (!selectedId) return;
    setPendingCoords({ lat, lng });
  }

  async function confirmSave() {
    if (!selectedId || !pendingCoords) return;
    setSaving(true);

    await supabase
      .from('pregnant_mothers')
      .update({
        latitude: pendingCoords.lat,
        longitude: pendingCoords.lng,
        risk_level: riskLevel,
      })
      .eq('id', selectedId);

    setSaving(false);
    setPendingCoords(null);
    setSelectedId('');
    router.refresh();
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
          High risk
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          Medium risk
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600 inline-block"></span>
          Low risk
        </div>
      </div>

      {/* Assign location panel */}
      {unlocated.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <p className="text-sm font-medium mb-3">
            Set a location for a pregnant mother ({unlocated.length} without a pin)
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setPendingCoords(null);
              }}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select mother...</option>
              {unlocated.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name}
                </option>
              ))}
            </select>

            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as 'low' | 'medium' | 'high')}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low risk</option>
              <option value="medium">Medium risk</option>
              <option value="high">High risk</option>
            </select>

            {selectedId && !pendingCoords && (
              <span className="text-sm text-gray-500">
                Click on the map to place the pin
              </span>
            )}

            {pendingCoords && (
              <button
                onClick={confirmSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Confirm pin location'}
              </button>
            )}
          </div>
        </div>
      )}

      <RiskMap records={records} pendingClick={handleMapClick} />
    </div>
  );
}