import 'dotenv/config';
import { createBot, COMMAND_MENU } from './bot.js';
import { dueReminderIds, takeReminder } from './store.js';

// Local development: long polling + a simple loop that delivers due reminders
// (in production, QStash + /api/deliver handle that instead).
const bot = createBot();

async function poll() {
	try {
		const ids = await dueReminderIds(Date.now());
		for (const id of ids) {
			const reminder = await takeReminder(id);
			if (reminder) {
				await bot.telegram.sendMessage(reminder.chatId, `⏰ *Reminder:* ${reminder.text}`, {
					parse_mode: 'Markdown'
				});
			}
		}
	} catch (err) {
		console.error('reminder poll error', err);
	}
}

setInterval(() => void poll(), 20_000);
void poll();

bot.telegram.setMyCommands(COMMAND_MENU).catch(() => {});
bot.launch().catch((err) => {
	console.error('Failed to start Otto:', err);
	process.exit(1);
});

console.log('🤖 Otto running locally (long polling). Press Ctrl+C to stop.');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
