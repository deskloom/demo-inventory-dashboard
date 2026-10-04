import { NextRequest, NextResponse } from 'next/server';
import { addMovement, InsufficientStockError } from '@/lib/store';
import { parseMovement, ValidationError } from '@/lib/validate';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'リクエストをJSONとして読み取れませんでした' }, { status: 400 });
  }

  try {
    const item = addMovement(params.id, parseMovement(body));
    if (!item) {
      return NextResponse.json({ error: '指定された品目が見つかりません' }, { status: 404 });
    }
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    if (e instanceof ValidationError || e instanceof InsufficientStockError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error('POST /api/items/[id]/movements failed:', e);
    return NextResponse.json({ error: 'サーバーでエラーが発生しました。時間をおいて再度お試しください' }, { status: 500 });
  }
}
