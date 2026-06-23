import cron from 'node-cron';
import type { Telegraf } from 'telegraf';
import { db } from './db';

// Send any reminders that have come due, then drop them from the store.
export async function deliverDueReminders(bot: Telegraf) {
	const now = Date.now();
	const due = db.data.reminders.filter((r) => r.dueAt <= now);
	if (due.length === 0) return;

	db.data.reminders = db.data.reminders.filter((r) => r.dueAt > now);
	await db.write();

	for (const reminder of due) {
		try {
			await bot.telegram.sendMessage(reminder.chatId, `⏰ *Reminder:* ${reminder.text}`, {
				parse_mode: 'Markdown'
			});
		} catch (err) {
			console.error('Could not deliver reminder', reminder.id, err);
		}
	}
}

// Check every minute. node-cron keeps this ticking for as long as Otto runs.
export function startReminderLoop(bot: Telegraf) {
	const task = cron.schedule('* * * * *', () => void deliverDueReminders(bot), {
		noOverlap: true
	});
	task.start();
	void deliverDueReminders(bot);
}
