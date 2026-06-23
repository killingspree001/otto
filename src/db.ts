import { mkdirSync } from 'node:fs';
import { JSONFilePreset } from 'lowdb/node';
import type { Data, Todo } from './types';

mkdirSync('data', { recursive: true });

const defaultData: Data = { reminders: [], todos: {}, seq: 100 };

export const db = await JSONFilePreset<Data>('data/otto.json', defaultData);

export function nextId(): number {
	db.data.seq += 1;
	return db.data.seq;
}

export function todosFor(chatId: number): Todo[] {
	const key = String(chatId);
	if (!db.data.todos[key]) db.data.todos[key] = [];
	return db.data.todos[key];
}
