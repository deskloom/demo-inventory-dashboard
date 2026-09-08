import type { InventoryItem } from '@/lib/types';
import { stockStatus } from '@/lib/types';

const LABEL: Record<ReturnType<typeof stockStatus>, string> = {
  ok: '十分',
  low: '要発注',
  out: '欠品',
};

const CLASS: Record<ReturnType<typeof stockStatus>, string> = {
  ok: 'bg-emerald-100 text-emerald-800',
  low: 'bg-amber-100 text-amber-800',
  out: 'bg-red-100 text-red-800',
};

export function StockBadge({ item }: { item: Pick<InventoryItem, 'stock' | 'reorderPoint'> }) {
  const status = stockStatus(item);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CLASS[status]}`}>
      {LABEL[status]}
    </span>
  );
}
