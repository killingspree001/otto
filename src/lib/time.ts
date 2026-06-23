const UNIT_MS: Record<string, number> = {
	s: 1000,
	m: 60_000,
	h: 3_600_000,
	d: 86_400_000
};

export type ParsedReminder = { dueAt: number; text: string } | { error: string };

// Understands two shapes:
//   "in 2h call mum"        -> relative (supports 1h30m, 45m, 90s, 3d…)
//   "at 18:30 take medicine" -> next time that clock time comes around
export function parseReminder(input: string): ParsedReminder {
	const trimmed = input.trim();

	const relative = trimmed.match(/^in\s+((?:\d+\s*[smhd]\s*)+)\s+(.+)$/i);
	if (relative) {
		const tokens = relative[1].match(/\d+\s*[smhd]/gi) ?? [];
		let ms = 0;
		for (const token of tokens) {
			const value = parseInt(token, 10);
			const unit = token.replace(/[\d\s]/g, '').toLowerCase();
			ms += value * (UNIT_MS[unit] ?? 0);
		}
		if (ms <= 0) return { error: 'That duration looks off. Try "in 10m" or "in 2h".' };
		return { dueAt: Date.now() + ms, text: relative[2].trim() };
	}

	const clock = trimmed.match(/^at\s+(\d{1,2}):(\d{2})\s+(.+)$/i);
	if (clock) {
		const hour = parseInt(clock[1], 10);
		const minute = parseInt(clock[2], 10);
		if (hour > 23 || minute > 59) return { error: 'That clock time looks off. Try "at 18:30".' };
		const due = new Date();
		due.setHours(hour, minute, 0, 0);
		if (due.getTime() <= Date.now()) due.setDate(due.getDate() + 1);
		return { dueAt: due.getTime(), text: clock[3].trim() };
	}

	return {
		error:
			"I couldn't read that time. Try:\n• /remind in 2h call mum\n• /remind at 18:30 take medicine"
	};
}

export function formatWhen(dueAt: number): string {
	const date = new Date(dueAt);
	const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	const today = new Date().toDateString();
	const tomorrow = new Date(Date.now() + UNIT_MS.d).toDateString();

	if (date.toDateString() === today) return `today at ${time}`;
	if (date.toDateString() === tomorrow) return `tomorrow at ${time}`;
	return date.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
}
