import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const table = pgTable('users',{
    id: integer('user_id').primaryKey().generatedByDefaultAsIdentity(),
    name: varchar('name').notNull(),
    username: varchar('username').notNull(),
    email: varchar('email').notNull(),
    password: varchar('password').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
})

export default table;