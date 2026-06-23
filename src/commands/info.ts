import type { Telegraf } from 'telegraf';
import { commandArgs } from '../lib/args.js';
import { getWeather } from '../services/weather.js';
import { getCryptoPrice } from '../services/crypto.js';
import { convertCurrency } from '../services/currency.js';
import { defineWord } from '../services/dictionary.js';

export function registerInfo(bot: Telegraf) {
	bot.command('weather', async (ctx) => {
		const city = commandArgs(ctx);
		if (!city) return ctx.reply('Usage: /weather <city>\nExample: /weather Lagos');
		await ctx.reply(await getWeather(city), { parse_mode: 'Markdown' });
	});

	bot.command('price', async (ctx) => {
		const symbol = commandArgs(ctx).split(/\s+/)[0];
		if (!symbol) return ctx.reply('Usage: /price <coin>\nExample: /price btc');
		await ctx.reply(await getCryptoPrice(symbol), { parse_mode: 'Markdown' });
	});

	bot.command('convert', async (ctx) => {
		const [amountRaw, from, to] = commandArgs(ctx).split(/\s+/);
		const amount = Number(amountRaw);
		if (!amount || !from || !to) {
			return ctx.reply('Usage: /convert <amount> <from> <to>\nExample: /convert 100 usd ngn');
		}
		await ctx.reply(await convertCurrency(amount, from, to), { parse_mode: 'Markdown' });
	});

	bot.command('define', async (ctx) => {
		const word = commandArgs(ctx).split(/\s+/)[0];
		if (!word) return ctx.reply('Usage: /define <word>\nExample: /define ephemeral');
		await ctx.reply(await defineWord(word));
	});
}
