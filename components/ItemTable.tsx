import Link from 'next/link';
import type { InventoryItem } from '@/lib/types';
import { StockBadge } from './StockBadge';

const yen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

export function ItemTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-slate-600">品名</th>
            <th className="px-4 py-2 text-left font-semibold text-slate-600">カテゴリ</th>
            <th className="px-4 py-2 text-right font-semibold text-slate-600">在庫数</th>
            <th className="px-4 py-2 text-right font-semibold text-slate-600">単価</th>
            <th className="px-4 py-2 text-left font-semibold text-slate-600">状態</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="px-4 py-2">
                <Link href={`/items/${item.id}`} className="text-blue-600 hover:underline">
                  {item.name}
                </Link>
              </td>
              <td className="px-4 py-2 text-slate-600">{item.category}</td>
              <td className="px-4 py-2 text-right tabular-nums">{item.stock}</td>
              <td className="px-4 py-2 text-right tabular-nums">{yen.format(item.unitPrice)}</td>
              <td className="px-4 py-2">
                <StockBadge item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
