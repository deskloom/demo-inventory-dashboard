import { NextRequest, NextResponse } from 'next/server';
import { addItem, listItems } from '@/lib/store';
import { parseNewItem, ValidationError } from '@/lib/validate';

export async function GET() {
  return NextResponse.json({ items: listItems() });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'リクエストをJSONとして読み取れませんでした' }, { status: 400 });
  }

  try {
    const item = addItem(parseNewItem(body));
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    // 想定外のエラー（ファイル書き込み失敗など）は詳細をクライアントへ返さない
    console.error('POST /api/items failed:', e);
    return NextResponse.json({ error: 'サーバーでエラーが発生しました。時間をおいて再度お試しください' }, { status: 500 });
  }
}
