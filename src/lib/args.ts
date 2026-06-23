import type { Context } from 'telegraf';

// Everything after the "/command" in a message.
export function commandArgs(ctx: Context): string {
	const text = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
	const space = text.indexOf(' ');
	return space === -1 ? '' : text.slice(space + 1).trim();
}
