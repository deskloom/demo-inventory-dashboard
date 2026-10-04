export type MovementType = 'in' | 'out';

export interface Movement {
  id: string;
  type: MovementType;
  quantity: number;
  note: string;
  at: string;
  /** 処理後の在庫数 */
  stockAfter: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  unitPrice: number;
  updatedAt: string;
  /** 入出庫履歴（新しい順）。既存データには無いので省略可 */
  movements?: Movement[];
}

export type StockStatus = 'ok' | 'low' | 'out';

export function stockStatus(item: Pick<InventoryItem, 'stock' | 'reorderPoint'>): StockStatus {
  if (item.stock <= 0) return 'out';
  if (item.stock <= item.reorderPoint) return 'low';
  return 'ok';
}
