import { Telegraf } from 'telegraf';
import { getBotToken } from './config.js';
import { registerBasic } from './commands/basic.js';
import { registerInfo } from './commands/info.js';
import { registerReminders } from './commands/reminders.js';
import { registerTodos } from './commands/todos.js';
import { registerAi } from './commands/ai.js';

export const COMMAND_MENU = [
	{ command: 'help', description: 'Show what Otto can do' },
	{ command: 'weather', description: 'Weather for a city' },
	{ command: 'price', description: 'Crypto price' },
	{ command: 'convert', description: 'Convert currency' },
	{ command: 'define', description: 'Define a word' },
	{ command: 'remind', description: 'Set a reminder' },
	{ command: 'reminders', description: 'List your reminders' },
	{ command: 'todo', description: 'Manage your to-do list' },
	{ command: 'ask', description: 'Ask the AI (optional)' }
];

export function createBot(): Telegraf {
	const bot = new Telegraf(getBotToken());

	registerBasic(bot);
	registerInfo(bot);
	registerReminders(bot);
	registerTodos(bot);
	registerAi(bot);

	bot.catch((err) => console.error('Otto error:', err));
	return bot;
}
