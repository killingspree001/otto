import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Telegraf } from 'telegraf';
import { createBot } from '../src/bot.js';
import { rememberBaseUrl } from '../src/store.js';

let bot: Telegraf | null = null;
function getBot(): Telegraf {
	if (!bot) bot = createBot();
	return bot;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'POST') {
		res.status(200).send('Otto webhook is alive. Visit /api/setup once to connect it.');
		return;
	}
	try {
		// Non-fatal: only needed for scheduling, and shouldn't block commands.
		if (req.headers.host) {
			await rememberBaseUrl(`https://${req.headers.host}`).catch(() => {});
		}
		await getBot().handleUpdate(req.body);
	} catch (err) {
		console.error('webhook error', err);
	}
	res.status(200).end();
}
