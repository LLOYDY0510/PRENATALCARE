import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import EditPregnantMotherForm from '@/components/EditPregnantMotherForm';

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

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-1">
        {record.serial_no ?? 'Record'} — {record.first_name} {record.last_name}
      </h1>
      <p className="text-gray-600 mb-6">View and update this pregnant mother&apos;s record.</p>

      <EditPregnantMotherForm record={record} />
    </div>
  );
}