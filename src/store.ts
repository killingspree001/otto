import { Redis } from '@upstash/redis';
import type { Reminder, Todo } from './types';

// Works with either Upstash's own env names or Vercel's KV integration names.
const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? '',
	token: process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? ''
});

export async function nextId(): Promise<number> {
	return redis.incr('otto:seq');
}

// --- Reminders -------------------------------------------------------------
// rem:<id>            -> the reminder object
// rem:chat:<chatId>   -> set of that chat's reminder ids
// rem:due             -> sorted set (score = dueAt) for local polling

export async function addReminder(r: Reminder): Promise<void> {
	await Promise.all([
		redis.set(`otto:rem:${r.id}`, r),
		redis.sadd(`otto:rem:chat:${r.chatId}`, r.id),
		redis.zadd('otto:rem:due', { score: r.dueAt, member: r.id })
	]);
}

export async function listReminders(chatId: number): Promise<Reminder[]> {
	const ids = await redis.smembers(`otto:rem:chat:${chatId}`);
	if (ids.length === 0) return [];
	const items = await Promise.all(ids.map((id) => redis.get<Reminder>(`otto:rem:${id}`)));
	return items.filter((r): r is Reminder => Boolean(r)).sort((a, b) => a.dueAt - b.dueAt);
}

export async function getReminder(id: number): Promise<Reminder | null> {
	return (await redis.get<Reminder>(`otto:rem:${id}`)) ?? null;
}

// Fetch and remove a reminder in one go (used when it fires or is cancelled).
export async function takeReminder(id: number): Promise<Reminder | null> {
	const reminder = await redis.get<Reminder>(`otto:rem:${id}`);
	if (!reminder) return null;
	await Promise.all([
		redis.del(`otto:rem:${id}`),
		redis.srem(`otto:rem:chat:${reminder.chatId}`, id),
		redis.zrem('otto:rem:due', id)
	]);
	return reminder;
}

export async function dueReminderIds(now: number): Promise<number[]> {
	const ids = await redis.zrange<(string | number)[]>('otto:rem:due', 0, now, { byScore: true });
	return ids.map((id) => Number(id));
}

// --- Todos -----------------------------------------------------------------

export async function getTodos(chatId: number): Promise<Todo[]> {
	return (await redis.get<Todo[]>(`otto:todos:${chatId}`)) ?? [];
}

export async function saveTodos(chatId: number, todos: Todo[]): Promise<void> {
	await redis.set(`otto:todos:${chatId}`, todos);
}

// --- Base URL (where QStash should call back) ------------------------------

export async function rememberBaseUrl(url: string): Promise<void> {
	await redis.set('otto:base-url', url);
}

export async function getBaseUrl(): Promise<string> {
	return (await redis.get<string>('otto:base-url')) ?? '';
}
