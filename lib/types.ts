export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  unitPrice: number;
  updatedAt: string;
}

export type StockStatus = 'ok' | 'low' | 'out';

export function stockStatus(item: Pick<InventoryItem, 'stock' | 'reorderPoint'>): StockStatus {
  if (item.stock <= 0) return 'out';
  if (item.stock <= item.reorderPoint) return 'low';
  return 'ok';
}
