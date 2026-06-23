import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';
import { deliverSecret, getBotToken } from '../src/config';
import { takeReminder } from '../src/store';

// Called by QStash at a reminder's due time.
export default async function handler(req: VercelRequest, res: VercelResponse) {
	const body = (req.body ?? {}) as { id?: number; secret?: string };
	const secret = body.secret ?? req.query.secret;
	if (secret !== deliverSecret()) {
		res.status(401).end();
		return;
	}

	const id = Number(body.id ?? req.query.id);
	const reminder = await takeReminder(id);
	if (reminder) {
		const bot = new Telegraf(getBotToken());
		await bot.telegram.sendMessage(reminder.chatId, `⏰ *Reminder:* ${reminder.text}`, {
			parse_mode: 'Markdown'
		});
	}
	res.status(200).end();
}
