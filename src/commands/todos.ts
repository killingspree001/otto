import type { Telegraf } from 'telegraf';
import { commandArgs } from '../lib/args.js';
import { getTodos, nextId, saveTodos } from '../store.js';

export function registerTodos(bot: Telegraf) {
	bot.command('todo', async (ctx) => {
		const [sub, ...rest] = commandArgs(ctx).split(/\s+/);
		const chatId = ctx.chat.id;
		const list = await getTodos(chatId);
		const text = rest.join(' ').trim();

		if (sub === 'add') {
			if (!text) return ctx.reply('Usage: /todo add <thing to do>');
			list.push({ id: await nextId(), text, done: false });
			await saveTodos(chatId, list);
			return ctx.reply(`📝 Added: ${text}`);
		}

		if (sub === 'done') {
			const item = list[Number(rest[0]) - 1];
			if (!item) return ctx.reply('Which one? Check /todo list');
			item.done = true;
			await saveTodos(chatId, list);
			return ctx.reply(`✅ Done: ${item.text}`);
		}

		if (sub === 'clear') {
			await saveTodos(
				chatId,
				list.filter((t) => !t.done)
			);
			return ctx.reply('🧹 Cleared completed items.');
		}

		if (list.length === 0) return ctx.reply('Your list is empty. Add one: /todo add buy milk');

		const lines = list.map((t, i) => `${t.done ? '✅' : '⬜'} *${i + 1}.* ${t.text}`);
		await ctx.reply(
			`📋 *Your to-dos*\n${lines.join('\n')}\n\n/todo add … · /todo done <n> · /todo clear`,
			{ parse_mode: 'Markdown' }
		);
	});
}
