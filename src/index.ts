import { Telegraf } from 'telegraf';
import { config, hasAi } from './config';
import { registerBasic } from './commands/basic';
import { registerInfo } from './commands/info';
import { registerReminders } from './commands/reminders';
import { registerTodos } from './commands/todos';
import { registerAi } from './commands/ai';
import { startReminderLoop } from './reminders';

const bot = new Telegraf(config.botToken);

registerBasic(bot);
registerInfo(bot);
registerReminders(bot);
registerTodos(bot);
registerAi(bot);

bot.catch((err) => console.error('Otto error:', err));

// The slash-command menu users see in Telegram.
bot.telegram
	.setMyCommands([
		{ command: 'help', description: 'Show what Otto can do' },
		{ command: 'weather', description: 'Weather for a city' },
		{ command: 'price', description: 'Crypto price' },
		{ command: 'convert', description: 'Convert currency' },
		{ command: 'define', description: 'Define a word' },
		{ command: 'remind', description: 'Set a reminder' },
		{ command: 'reminders', description: 'List your reminders' },
		{ command: 'todo', description: 'Manage your to-do list' },
		{ command: 'ask', description: 'Ask the AI (optional)' }
	])
	.catch(() => {});

startReminderLoop(bot);

bot.launch().catch((err) => {
	console.error('Failed to start Otto:', err);
	process.exit(1);
});

console.log(`🤖 Otto is running${hasAi ? ' (AI on)' : ''}. Open your bot in Telegram and send /start.`);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
