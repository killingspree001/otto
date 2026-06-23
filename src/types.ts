export type Reminder = {
	id: number;
	chatId: number;
	text: string;
	dueAt: number; // epoch milliseconds
	createdAt: number;
};

export type Todo = {
	id: number;
	text: string;
	done: boolean;
};

export type Data = {
	reminders: Reminder[];
	todos: Record<string, Todo[]>;
	seq: number;
};
