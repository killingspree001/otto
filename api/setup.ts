import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';
import { getBotToken } from '../src/config';
import { COMMAND_MENU } from '../src/bot';
import { rememberBaseUrl } from '../src/store';

// Visit this once after deploying to connect Telegram to your deployment.
export default async function handler(req: VercelRequest, res: VercelResponse) {
	const base = `https://${req.headers.host}`;
	const missing = (
		['BOT_TOKEN', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'QSTASH_TOKEN', 'DELIVER_SECRET'] as const
	).filter((key) => !process.env[key]);

	if (!process.env.BOT_TOKEN) {
		res
			.status(500)
			.send(
				`Can't set up yet — BOT_TOKEN is missing.\n` +
					`Add it in Vercel → Settings → Environment Variables, then redeploy.`
			);
		return;
	}

	try {
		const bot = new Telegraf(getBotToken());
		await bot.telegram.setWebhook(`${base}/api/telegram`);
		await bot.telegram.setMyCommands(COMMAND_MENU);
		await rememberBaseUrl(base).catch(() => {});

		const note = missing.length
			? `\n\nHeads up — still missing: ${missing.join(', ')}. ` +
				`Stateless commands work; reminders/to-dos need the Upstash ones.`
			: '\n\nAll environment variables are present. Reminders are fully enabled.';

		res
			.status(200)
			.send(`Otto is set up.\nWebhook: ${base}/api/telegram\nOpen your bot in Telegram and send /start.${note}`);
	} catch (err) {
		res.status(500).send(`Setup failed: ${(err as Error).message}`);
	}
}
