import fs from 'node:fs';
import path from 'node:path';
import type { InventoryItem } from './types';

// テスト時などは環境変数 DATA_FILE で保存先を差し替えられる（既定は data/items.json）
const DATA_FILE = process.env.DATA_FILE || path.join(process.cwd(), 'data', 'items.json');

export function listItems(): InventoryItem[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const items = JSON.parse(raw) as InventoryItem[];
  return items.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
}

export function getItem(id: string): InventoryItem | undefined {
  return listItems().find((i) => i.id === id);
}

export interface NewItemInput {
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  unitPrice: number;
}

function nextId(items: InventoryItem[]): string {
  const max = items.reduce((acc, i) => {
    const n = Number(i.id.replace('itm-', ''));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return `itm-${String(max + 1).padStart(3, '0')}`;
}

export function addItem(input: NewItemInput): InventoryItem {
  const items = listItems();
  const item: InventoryItem = {
    id: nextId(items),
    name: input.name.trim(),
    category: input.category.trim() || '未分類',
    stock: input.stock,
    reorderPoint: input.reorderPoint,
    unitPrice: input.unitPrice,
    updatedAt: new Date().toISOString(),
  };
  const next = [...items, item];
  fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2) + '\n', 'utf8');
  return item;
}
