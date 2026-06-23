import { geminiKey, hasAi } from '../config.js';

export async function askAi(question: string): Promise<string> {
	if (!hasAi()) {
		return 'AI answers are off. Add a free GEMINI_API_KEY to enable /ask.';
	}
	try {
		const res = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey()}`,
			{
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ contents: [{ parts: [{ text: question }] }] })
			}
		);
		if (!res.ok) throw new Error(`gemini ${res.status}`);

		const data: any = await res.json();
		const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
		return text?.trim() || 'I had nothing to say to that one.';
	} catch {
		return 'The AI service is unavailable right now. Try again later.';
	}
}
