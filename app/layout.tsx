import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '在庫管理ダッシュボード（デモ）',
  description: '自主制作デモ・架空データ。Next.js + React + TypeScript + Tailwind CSS。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              在庫管理ダッシュボード
            </Link>
            <span className="ml-2 text-xs text-slate-400">（デモ・架空データ）</span>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
