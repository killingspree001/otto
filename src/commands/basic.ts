import type { Telegraf } from 'telegraf';

const HELP = `*Otto* — your pocket assistant 🤖

*Quick answers*
/weather <city> — current weather + forecast
/price <coin> — live crypto price
/convert <amount> <from> <to> — currency
/define <word> — dictionary meaning

*Reminders & lists*
/remind in 2h call mum — set a reminder
/remind at 18:30 take meds — time-based
/reminders — see them · /cancel <id>
/todo add <thing> — to-do list
/todo list · /todo done <n> · /todo clear

*AI*
/ask <question> — an AI answer (optional)

Try: \`/weather Lagos\` or \`/remind in 1m wave back\``;

export function registerBasic(bot: Telegraf) {
	bot.start((ctx) => ctx.reply(HELP, { parse_mode: 'Markdown' }));
	bot.help((ctx) => ctx.reply(HELP, { parse_mode: 'Markdown' }));
}
