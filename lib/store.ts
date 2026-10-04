import fs from 'node:fs';
import path from 'node:path';
import type { InventoryItem, Movement, MovementType } from './types';

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

export interface MovementInput {
  type: MovementType;
  quantity: number;
  note: string;
}

export class InsufficientStockError extends Error {
  constructor(public current: number) {
    super(`在庫数が不足しています（現在 ${current}）`);
  }
}

/** 入出庫を記録して在庫数を更新する。品目が無ければ undefined、出庫で在庫がマイナスになるなら InsufficientStockError。 */
export function addMovement(id: string, input: MovementInput): InventoryItem | undefined {
  const items = listItems();
  const item = items.find((i) => i.id === id);
  if (!item) return undefined;
  const stockAfter = item.stock + (input.type === 'in' ? input.quantity : -input.quantity);
  if (stockAfter < 0) throw new InsufficientStockError(item.stock);
  const now = new Date().toISOString();
  const movement: Movement = {
    id: `mv-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    type: input.type,
    quantity: input.quantity,
    note: input.note,
    at: now,
    stockAfter,
  };
  item.stock = stockAfter;
  item.updatedAt = now;
  item.movements = [movement, ...(item.movements ?? [])];
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2) + '\n', 'utf8');
  return item;
}
