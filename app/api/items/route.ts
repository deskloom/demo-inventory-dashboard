import { NextRequest, NextResponse } from 'next/server';
import { addItem, listItems, type NewItemInput } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ items: listItems() });
}

export async function POST(req: NextRequest) {
  let body: Partial<NewItemInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  if (typeof body.name !== 'string' || !body.name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const stock = Number(body.stock);
  const reorderPoint = Number(body.reorderPoint);
  const unitPrice = Number(body.unitPrice);
  if (!Number.isFinite(stock) || !Number.isFinite(reorderPoint) || !Number.isFinite(unitPrice)) {
    return NextResponse.json({ error: 'stock/reorderPoint/unitPrice must be numbers' }, { status: 400 });
  }

  try {
    const item = addItem({ name: body.name, category: String(body.category || ''), stock, reorderPoint, unitPrice });
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
