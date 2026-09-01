import { createClient } from '@/utils/supabase/client';

/**
 * Logs an action to the activity_logs table.
 * Call this after any significant action (register, update, delete, role change, etc.)
 *
 * Example:
 *   await logActivity('Registered pregnant mother', 'pregnant_mother', record.id, `Serial: ${serial_no}`);
 */
export async function logActivity(
  action: string,
  targetType?: string,
  targetId?: string,
  details?: string
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from('activity_logs').insert({
    actor_id: user?.id ?? null,
    action,
    target_type: targetType ?? null,
    target_id: targetId ?? null,
    details: details ?? null,
  });
}