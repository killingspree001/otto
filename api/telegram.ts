import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createBot } from '../src/bot';
import { rememberBaseUrl } from '../src/store';

const bot = createBot();

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'POST') {
		res.status(200).send('Otto webhook is alive. Visit /api/setup once to connect it.');
		return;
	}
	try {
		if (req.headers.host) await rememberBaseUrl(`https://${req.headers.host}`);
		await bot.handleUpdate(req.body);
	} catch (err) {
		console.error('webhook error', err);
	}
	res.status(200).end();
}
