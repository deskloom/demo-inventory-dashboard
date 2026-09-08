// Smoke test against a running `npm run start` server (default http://localhost:3000).
// Verifies the add-item round trip end to end: POST -> GET reflects it -> home page renders it
// and flags it as low-stock. Exits non-zero on any mismatch.
//
// Usage:
//   npm run build && npm run start &
//   node smoke-test.mjs
const base = process.env.DEMO_BASE_URL || 'http://localhost:3000';

function assert(cond, message) {
  if (!cond) throw new Error('FAILED: ' + message);
  console.log('ok: ' + message);
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

  const notFound = await fetch(base + `/items/does-not-exist`);
  assert(notFound.status === 404, 'unknown item id returns 404');

  console.log('\nAll checks passed.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
