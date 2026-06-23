export function getBotToken(): string {
	const token = process.env.BOT_TOKEN;
	if (!token) throw new Error('BOT_TOKEN is not set');
	return token;
}

export function geminiKey(): string {
	return process.env.GEMINI_API_KEY ?? '';
}

export function hasAi(): boolean {
	return Boolean(process.env.GEMINI_API_KEY);
}

export function deliverSecret(): string {
	return process.env.DELIVER_SECRET ?? 'otto-dev-secret';
}
