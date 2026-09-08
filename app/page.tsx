import { listItems } from '@/lib/store';
import { stockStatus } from '@/lib/types';
import { ItemTable } from '@/components/ItemTable';
import { NewItemForm } from '@/components/NewItemForm';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const items = listItems();
  const lowOrOut = items.filter((i) => stockStatus(i) !== 'ok');

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-bold">品目一覧（{items.length}件）</h1>
        {lowOrOut.length > 0 && (
          <p className="mt-1 text-sm text-amber-700">
            要発注・欠品が {lowOrOut.length} 件あります: {lowOrOut.map((i) => i.name).join('、')}
          </p>
        )}
      </section>
      <ItemTable items={items} />
      <section>
        <h2 className="mb-2 text-lg font-semibold">品目を追加</h2>
        <NewItemForm />
      </section>
    </div>
  );
}
