import { pgTable, uuid, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const runsTable = pgTable('runs', {
	id: uuid().primaryKey().defaultRandom(),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
	accepted: boolean().default(false),
	data: jsonb('data')
		.$type<{
			duration: number;
			rate: number;
			volume: number;
		}>()
		.notNull(),
	image: text().notNull(),
	createdAt: timestamp('created_at')
		.$defaultFn(() => new Date())
		.notNull(),
	deleted: boolean().default(false)
});
