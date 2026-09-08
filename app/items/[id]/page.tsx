import { notFound } from 'next/navigation';
import { getItem } from '@/lib/store';
import { StockBadge } from '@/components/StockBadge';

const yen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
const dateFmt = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeStyle: 'short' });

export const dynamic = 'force-dynamic';

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = getItem(params.id);
  if (!item) notFound();

  return (
    <div className="space-y-4">
      <a href="/" className="text-sm text-blue-600 hover:underline">
        ← 一覧に戻る
      </a>
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
    </div>
  );
}
