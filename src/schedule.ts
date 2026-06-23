import { Client } from '@upstash/qstash';
import { deliverSecret } from './config';
import { getBaseUrl } from './store';

// When hosted, hand the reminder to QStash, which calls /api/deliver at the due
// time. Locally (no QSTASH_TOKEN) this is a no-op and the dev polling loop in
// dev.ts delivers instead.
export async function scheduleDelivery(id: number, dueAt: number): Promise<void> {
	const token = process.env.QSTASH_TOKEN;
	if (!token) return;

	const base = await getBaseUrl();
	if (!base) return;

	const delay = Math.max(0, Math.round((dueAt - Date.now()) / 1000));
	const qstash = new Client({ token });
	await qstash.publishJSON({
		url: `${base}/api/deliver`,
		body: { id, secret: deliverSecret() },
		delay
	});
}
