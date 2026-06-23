import 'dotenv/config';

export const config = {
	botToken: process.env.BOT_TOKEN ?? '',
	geminiKey: process.env.GEMINI_API_KEY ?? ''
};

if (!config.botToken) {
	console.error(
		'\n  Missing BOT_TOKEN.\n' +
			'  1. Open Telegram and message @BotFather, send /newbot, follow the prompts.\n' +
			'  2. Copy .env.example to .env and paste the token it gives you.\n'
	);
	process.exit(1);
}

export const hasAi = Boolean(config.geminiKey);
