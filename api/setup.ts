import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';
import { getBotToken } from '../src/config';
import { COMMAND_MENU } from '../src/bot';
import { rememberBaseUrl } from '../src/store';

// Visit this once after deploying to connect Telegram to your deployment.
export default async function handler(req: VercelRequest, res: VercelResponse) {
	const base = `https://${req.headers.host}`;
	try {
		const bot = new Telegraf(getBotToken());
		await bot.telegram.setWebhook(`${base}/api/telegram`);
		await bot.telegram.setMyCommands(COMMAND_MENU);
		await rememberBaseUrl(base).catch(() => {});
		res
			.status(200)
			.send(`Otto is set up.\nWebhook: ${base}/api/telegram\nOpen your bot in Telegram and send /start.`);
	} catch (err) {
		res.status(500).send(`Setup failed: ${(err as Error).message}`);
	}
}
