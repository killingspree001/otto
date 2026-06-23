import type { Telegraf } from 'telegraf';
import { commandArgs } from '../lib/args.js';
import { askAi } from '../services/ai.js';

export function registerAi(bot: Telegraf) {
	bot.command('ask', async (ctx) => {
		const question = commandArgs(ctx);
		if (!question) {
			return ctx.reply('Usage: /ask <question>\nExample: /ask give me 3 quick productivity tips');
		}
		await ctx.sendChatAction('typing');
		await ctx.reply(await askAi(question));
	});
}
