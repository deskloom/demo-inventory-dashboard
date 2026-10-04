import type { MovementInput, NewItemInput } from './store';

export class ValidationError extends Error {}

const MAX_NAME = 100;
const MAX_CATEGORY = 50;
const MAX_COUNT = 1_000_000; // 在庫数・発注点の上限
const MAX_PRICE = 100_000_000; // 単価（円）の上限

function intField(v: unknown, label: string, max: number): number {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > max) {
    throw new ValidationError(`${label}は0以上${max.toLocaleString('ja-JP')}以下の整数で入力してください`);
  }
  return v;
}

/** 未知の入力を検証し、NewItemInput に変換する。不正なら ValidationError（日本語メッセージ）。 */
export function parseNewItem(body: unknown): NewItemInput {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new ValidationError('リクエストはJSONオブジェクトで送信してください');
  }
  const b = body as Record<string, unknown>;

  if (typeof b.name !== 'string' || !b.name.trim()) {
    throw new ValidationError('品名を入力してください');
  }
  if (b.name.trim().length > MAX_NAME) {
    throw new ValidationError(`品名は${MAX_NAME}文字以内で入力してください`);
  }

  if (b.category !== undefined && typeof b.category !== 'string') {
    throw new ValidationError('カテゴリは文字列で入力してください');
  }
  const category = (b.category as string | undefined) ?? '';
  if (category.trim().length > MAX_CATEGORY) {
    throw new ValidationError(`カテゴリは${MAX_CATEGORY}文字以内で入力してください`);
  }

  return {
    name: b.name,
    category,
    stock: intField(b.stock, '在庫数', MAX_COUNT),
    reorderPoint: intField(b.reorderPoint, '発注点', MAX_COUNT),
    unitPrice: intField(b.unitPrice, '単価', MAX_PRICE),
  };
}

const MAX_NOTE = 100;
const MAX_QUANTITY = 1_000_000;

/** 入出庫リクエストを検証する。不正なら ValidationError（日本語メッセージ）。 */
export function parseMovement(body: unknown): MovementInput {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new ValidationError('リクエストはJSONオブジェクトで送信してください');
  }
  const b = body as Record<string, unknown>;

  if (b.type !== 'in' && b.type !== 'out') {
    throw new ValidationError('区分は入庫（in）または出庫（out）で指定してください');
  }
  if (typeof b.quantity !== 'number' || !Number.isInteger(b.quantity) || b.quantity < 1 || b.quantity > MAX_QUANTITY) {
    throw new ValidationError(`数量は1以上${MAX_QUANTITY.toLocaleString('ja-JP')}以下の整数で入力してください`);
  }
  if (b.note !== undefined && typeof b.note !== 'string') {
    throw new ValidationError('備考は文字列で入力してください');
  }
  const note = ((b.note as string | undefined) ?? '').trim();
  if (note.length > MAX_NOTE) {
    throw new ValidationError(`備考は${MAX_NOTE}文字以内で入力してください`);
  }
  return { type: b.type, quantity: b.quantity, note };
}
