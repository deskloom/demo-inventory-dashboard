// GET フォームなのでJS不要。送信すると ?q=...&category=... でサーバー側が絞り込む。
export function ItemFilter({ categories, q, category }: { categories: string[]; q: string; category: string }) {
  return (
    <form method="get" action="/" className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm">
      <input name="q" defaultValue={q} placeholder="品名で検索" className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1" />
      <select name="category" defaultValue={category} className="rounded border border-slate-300 px-2 py-1">
        <option value="">すべてのカテゴリ</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
        絞り込む
      </button>
      {(q || category) && (
        <a href="/" className="text-blue-600 hover:underline">
          クリア
        </a>
      )}
    </form>
  );
}
