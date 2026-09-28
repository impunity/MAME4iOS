import { and, asc, count, desc, eq, gt, max } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { highScores } from '@/lib/db/schema'

export const DEFAULT_GAME = 'robotron'

export const gameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{1,16}$/, 'game must be a MAME romset name')

export const submitScoreSchema = z.object({
  game: gameSchema.default(DEFAULT_GAME),
  initials: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9 .]{1,3}$/, 'initials must be 1-3 letters or digits'),
  score: z.number().int().min(0).max(99_999_999),
  wave: z.number().int().min(0).max(9999).optional(),
  deviceId: z.string().trim().max(64).optional(),
  platform: z.enum(['ios', 'tvos', 'macos', 'other']).optional(),
})

export type SubmitScoreInput = z.infer<typeof submitScoreSchema>

const publicColumns = {
  id: highScores.id,
  game: highScores.game,
  initials: highScores.initials,
  score: highScores.score,
  wave: highScores.wave,
  platform: highScores.platform,
  createdAt: highScores.createdAt,
}

export type PublicScore = Awaited<ReturnType<typeof getTopScores>>[number]

export async function getTopScores(game = DEFAULT_GAME, limit = 10) {
  return db
    .select(publicColumns)
    .from(highScores)
    .where(eq(highScores.game, game))
    .orderBy(desc(highScores.score), asc(highScores.createdAt))
    .limit(limit)
}

export async function getRecentScores(game = DEFAULT_GAME, limit = 8) {
  return db
    .select(publicColumns)
    .from(highScores)
    .where(eq(highScores.game, game))
    .orderBy(desc(highScores.createdAt))
    .limit(limit)
}

export async function getStats(game = DEFAULT_GAME) {
  const [row] = await db
    .select({ total: count(), best: max(highScores.score) })
    .from(highScores)
    .where(eq(highScores.game, game))
  return { total: row?.total ?? 0, best: row?.best ?? 0 }
}

export async function insertScore(input: SubmitScoreInput) {
  const [row] = await db
    .insert(highScores)
    .values({
      game: input.game,
      initials: input.initials,
      score: input.score,
      wave: input.wave,
      deviceId: input.deviceId,
      platform: input.platform,
    })
    .returning(publicColumns)

  const [{ higher }] = await db
    .select({ higher: count() })
    .from(highScores)
    .where(and(eq(highScores.game, input.game), gt(highScores.score, input.score)))

  return { ...row, rank: higher + 1 }
}
