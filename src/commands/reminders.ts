import type { Telegraf } from 'telegraf';
import { db, nextId } from '../db';
import { commandArgs } from '../lib/args';
import { parseReminder, formatWhen } from '../lib/time';

export function registerReminders(bot: Telegraf) {
	bot.command('remind', async (ctx) => {
		const input = commandArgs(ctx);
		if (!input) {
			return ctx.reply('Usage:\n/remind in 2h call mum\n/remind at 18:30 take medicine');
		}

		const parsed = parseReminder(input);
		if ('error' in parsed) return ctx.reply(parsed.error);
		if (!parsed.text) return ctx.reply('What should I remind you about?');

		const id = nextId();
		db.data.reminders.push({
			id,
			chatId: ctx.chat.id,
			text: parsed.text,
			dueAt: parsed.dueAt,
			createdAt: Date.now()
		});
		await db.write();

		await ctx.reply(`✅ I'll remind you *${formatWhen(parsed.dueAt)}*:\n“${parsed.text}”  (#${id})`, {
			parse_mode: 'Markdown'
		});
	});

	bot.command('reminders', async (ctx) => {
		const mine = db.data.reminders
			.filter((r) => r.chatId === ctx.chat.id)
			.sort((a, b) => a.dueAt - b.dueAt);

		if (mine.length === 0) return ctx.reply('No reminders set. Add one: /remind in 1h stretch');

		const lines = mine.map((r) => `*#${r.id}* — ${formatWhen(r.dueAt)} — ${r.text}`);
		await ctx.reply(`⏰ *Your reminders*\n${lines.join('\n')}\n\nCancel with /cancel <id>`, {
			parse_mode: 'Markdown'
		});
	});

	bot.command('cancel', async (ctx) => {
		const id = Number(commandArgs(ctx));
		if (!id) return ctx.reply('Usage: /cancel <id>   (see /reminders)');

		const before = db.data.reminders.length;
		db.data.reminders = db.data.reminders.filter(
			(r) => !(r.id === id && r.chatId === ctx.chat.id)
		);
		if (db.data.reminders.length === before) return ctx.reply(`No reminder #${id} found.`);

		await db.write();
		await ctx.reply(`🗑️ Cancelled reminder #${id}.`);
	});
}
