import type { Telegraf } from 'telegraf';
import { db, nextId, todosFor } from '../db';
import { commandArgs } from '../lib/args';

export function registerTodos(bot: Telegraf) {
	bot.command('todo', async (ctx) => {
		const [sub, ...rest] = commandArgs(ctx).split(/\s+/);
		const list = todosFor(ctx.chat.id);
		const text = rest.join(' ').trim();

		if (sub === 'add') {
			if (!text) return ctx.reply('Usage: /todo add <thing to do>');
			list.push({ id: nextId(), text, done: false });
			await db.write();
			return ctx.reply(`📝 Added: ${text}`);
		}

		if (sub === 'done') {
			const item = list[Number(rest[0]) - 1];
			if (!item) return ctx.reply('Which one? Check /todo list');
			item.done = true;
			await db.write();
			return ctx.reply(`✅ Done: ${item.text}`);
		}

		if (sub === 'clear') {
			db.data.todos[String(ctx.chat.id)] = list.filter((t) => !t.done);
			await db.write();
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
