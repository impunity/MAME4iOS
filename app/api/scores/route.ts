import { timingSafeEqual } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_GAME, gameSchema, getTopScores, insertScore, submitScoreSchema } from '@/lib/scores'

function isAuthorized(request: NextRequest) {
  const expected = process.env.HIGHSCORE_API_KEY
  if (!expected) return true
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const game = gameSchema.safeParse(params.get('game') ?? DEFAULT_GAME)
  if (!game.success) {
    return NextResponse.json({ error: 'Invalid game' }, { status: 400 })
  }
  const limit = Math.min(Math.max(Number(params.get('limit')) || 10, 1), 100)
  const scores = await getTopScores(game.data, limit)
  return NextResponse.json(
    { game: game.data, scores: scores.map((s, i) => ({ rank: i + 1, ...s })) },
    { headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60' } },
  )
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 })
  }

  const parsed = submitScoreSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid score', issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) },
      { status: 422 },
    )
  }

  const saved = await insertScore(parsed.data)
  return NextResponse.json({ score: saved }, { status: 201 })
}
