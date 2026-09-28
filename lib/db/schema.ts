import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const highScores = pgTable('high_scores', {
  id: serial('id').primaryKey(),
  game: text('game').notNull().default('robotron'),
  initials: varchar('initials', { length: 3 }).notNull(),
  score: integer('score').notNull(),
  wave: integer('wave'),
  deviceId: text('device_id'),
  platform: text('platform'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type HighScore = typeof highScores.$inferSelect
