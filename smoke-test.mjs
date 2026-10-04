// Smoke test against a running `npm run start` server (default http://localhost:3000).
// Verifies the add-item round trip end to end: POST -> GET reflects it -> home page renders it
// and flags it as low-stock. Exits non-zero on any mismatch.
//
// Usage:
//   npm run build && npm run start &
//   node smoke-test.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// このテストは POST でデータファイルを書き換えるため、終了時に必ず元の内容へ戻す。
// サーバーを DATA_FILE 付きで起動した場合は、同じパスを DATA_FILE で渡すこと。
const dataFile = process.env.DATA_FILE || path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'items.json');
const base = process.env.DEMO_BASE_URL || 'http://localhost:3000';

function assert(cond, message) {
  if (!cond) throw new Error('FAILED: ' + message);
  console.log('ok: ' + message);
}

async function post(body, raw = false) {
  return fetch(base + '/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw ? body : JSON.stringify(body),
  });
}

async function main() {
  const before = await (await fetch(base + '/api/items')).json();

  const res = await fetch(base + '/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'ガムテープ 50mm', category: '梱包資材', stock: 5, reorderPoint: 10, unitPrice: 300 }),
  });
  assert(res.status === 201, `POST /api/items returns 201 (got ${res.status})`);
  const created = await res.json();

  const after = await (await fetch(base + '/api/items')).json();
  assert(after.items.length === before.items.length + 1, 'item count increased by 1');
  const found = after.items.find((i) => i.id === created.item.id);
  assert(found && found.name === 'ガムテープ 50mm', 'new item round-trips with correct UTF-8 name');

  const home = await (await fetch(base + '/')).text();
  assert(home.includes('ガムテープ 50mm'), 'home page renders the new item');
  assert(home.includes('要発注・欠品が'), 'home page flags it as low-stock (stock 5 <= reorderPoint 10)');

  const badReq = await fetch(base + '/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'x', stock: -1, reorderPoint: 1, unitPrice: 1 }),
  });
  assert(badReq.status === 400, 'negative stock is rejected with 400');

  const missingName = await fetch(base + '/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock: 1, reorderPoint: 1, unitPrice: 1 }),
  });
  assert(missingName.status === 400, 'missing name is rejected with 400');

  const valid = { name: 'x', category: 'c', stock: 1, reorderPoint: 1, unitPrice: 1 };
  const nullBody = await post('null', true);
  assert(nullBody.status === 400, 'null body is rejected with 400 (not 500)');
  const boolStock = await post({ ...valid, stock: true });
  assert(boolStock.status === 400, 'boolean stock is rejected with 400');
  const decimalStock = await post({ ...valid, stock: 1.5 });
  assert(decimalStock.status === 400, 'decimal stock is rejected with 400');
  const objCategory = await post({ ...valid, category: { x: 1 } });
  assert(objCategory.status === 400, 'object category is rejected with 400');
  const msg = (await boolStock.json()).error;
  assert(/[ぁ-ん]/.test(msg), 'error message is Japanese (' + msg + ')');

  const notFound = await fetch(base + `/items/does-not-exist`);
  assert(notFound.status === 404, 'unknown item id returns 404');

  console.log('\nAll checks passed.');
}

const original = fs.readFileSync(dataFile);
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => {
    fs.writeFileSync(dataFile, original);
    console.log('restored ' + dataFile);
  });
