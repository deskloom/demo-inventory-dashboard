'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function MovementForm({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [type, setType] = useState<'in' | 'out'>('in');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    try {
      const res = await fetch(`/api/items/${itemId}/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, quantity: Number(form.get('quantity')), note: String(form.get('note') || '') }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      formEl.reset();
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  const tab = (value: 'in' | 'out', label: string) => (
    <button
      type="button"
      onClick={() => setType(value)}
      aria-pressed={type === value}
      className={`px-4 py-1.5 text-sm ${type === value ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
    >
      {label}
    </button>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="inline-flex overflow-hidden rounded border border-slate-300">
        {tab('in', '入庫')}
        {tab('out', '出庫')}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <input name="quantity" type="number" min={1} step={1} placeholder="数量" required className="rounded border border-slate-300 px-2 py-1" />
        <input name="note" maxLength={100} placeholder="備考（任意）" className="col-span-2 rounded border border-slate-300 px-2 py-1" />
        <button
          type="submit"
          disabled={pending}
          className="col-span-2 rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 disabled:opacity-50 sm:col-span-1"
        >
          {pending ? '記録中...' : `${type === 'in' ? '入庫' : '出庫'}を記録`}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
