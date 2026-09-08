'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function NewItemForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      category: String(form.get('category') || ''),
      stock: Number(form.get('stock')),
      reorderPoint: Number(form.get('reorderPoint')),
      unitPrice: Number(form.get('unitPrice')),
    };
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-5">
      <input name="name" placeholder="品名" required className="col-span-2 rounded border border-slate-300 px-2 py-1 sm:col-span-1" />
      <input name="category" placeholder="カテゴリ" className="rounded border border-slate-300 px-2 py-1" />
      <input name="stock" type="number" placeholder="在庫数" required min={0} className="rounded border border-slate-300 px-2 py-1" />
      <input name="reorderPoint" type="number" placeholder="発注点" required min={0} className="rounded border border-slate-300 px-2 py-1" />
      <input name="unitPrice" type="number" placeholder="単価" required min={0} className="rounded border border-slate-300 px-2 py-1" />
      <button
        type="submit"
        disabled={pending}
        className="col-span-2 rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 disabled:opacity-50 sm:col-span-5"
      >
        {pending ? '登録中...' : '品目を追加'}
      </button>
      {error && <p className="col-span-2 text-sm text-red-600 sm:col-span-5">{error}</p>}
    </form>
  );
}
