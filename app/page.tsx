import { listItems } from '@/lib/store';
import { stockStatus } from '@/lib/types';
import { ItemTable } from '@/components/ItemTable';
import { ItemFilter } from '@/components/ItemFilter';
import { NewItemForm } from '@/components/NewItemForm';

export const dynamic = 'force-dynamic';

function first(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? '';
}

export default function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const all = listItems();
  const q = first(searchParams.q);
  const category = first(searchParams.category);
  const categories = Array.from(new Set(all.map((i) => i.category))).sort((a, b) => a.localeCompare(b, 'ja'));

  const items = all.filter(
    (i) => (!category || i.category === category) && (!q || i.name.toLowerCase().includes(q.toLowerCase())),
  );
  const lowOrOut = all.filter((i) => stockStatus(i) !== 'ok');
  const filtered = Boolean(q || category);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-bold">品目一覧（{filtered ? `${items.length}/${all.length}` : all.length}件）</h1>
        {lowOrOut.length > 0 && (
          <p className="mt-1 text-sm text-amber-700">
            要発注・欠品が {lowOrOut.length} 件あります: {lowOrOut.map((i) => i.name).join('、')}
          </p>
        )}
      </section>
      <ItemFilter categories={categories} q={q} category={category} />
      {items.length > 0 ? (
        <ItemTable items={items} />
      ) : (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          条件に一致する品目がありません
        </p>
      )}
      <section>
        <h2 className="mb-2 text-lg font-semibold">品目を追加</h2>
        <NewItemForm />
      </section>
    </div>
  );
}
