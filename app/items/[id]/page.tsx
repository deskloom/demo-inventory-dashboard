import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItem } from '@/lib/store';
import { StockBadge } from '@/components/StockBadge';
import { MovementForm } from '@/components/MovementForm';

const yen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
const dateFmt = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tokyo' });

export const dynamic = 'force-dynamic';

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = getItem(params.id);
  if (!item) notFound();
  const movements = item.movements ?? [];

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← 一覧に戻る
      </Link>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{item.name}</h1>
          <StockBadge item={item} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-slate-500">カテゴリ</dt>
          <dd>{item.category}</dd>
          <dt className="text-slate-500">在庫数</dt>
          <dd>{item.stock}</dd>
          <dt className="text-slate-500">発注点</dt>
          <dd>{item.reorderPoint}</dd>
          <dt className="text-slate-500">単価</dt>
          <dd>{yen.format(item.unitPrice)}</dd>
          <dt className="text-slate-500">最終更新</dt>
          <dd>{dateFmt.format(new Date(item.updatedAt))}</dd>
        </dl>
      </div>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">入出庫を記録</h2>
        <MovementForm itemId={item.id} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">入出庫履歴</h2>
        {movements.length === 0 ? (
          <p className="text-sm text-slate-500">まだ入出庫の履歴がありません</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">日時</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">区分</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-600">数量</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">備考</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-600">処理後在庫</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap px-4 py-2">{dateFmt.format(new Date(m.at))}</td>
                    <td className={`px-4 py-2 ${m.type === 'in' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {m.type === 'in' ? '入庫' : '出庫'}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">{m.quantity}</td>
                    <td className="px-4 py-2 text-slate-600">{m.note || '-'}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{m.stockAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
