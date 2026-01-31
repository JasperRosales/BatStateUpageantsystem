import { db } from '../drizzle/db.js';
import { scores, criteria } from '../drizzle/schema.js';
import { eq, asc, desc, and } from 'drizzle-orm';

export async function createScore(scoreData) {
  const [score] = await db.insert(scores).values(scoreData).returning();
  return score;
}

export async function getScoreById(id) {
  const [score] = await db.select().from(scores).where(eq(scores.id, id));
  return score || null;
}

export async function getAllScores(options = {}) {
  const { orderByDesc = false } = options;

  let query = db.select().from(scores);

  if (orderByDesc) {
    query = query.orderBy(desc(scores.createdAt));
  } else {
    query = query.orderBy(asc(scores.createdAt));
  }

  return await query;
}

export async function getScoresByParticipantId(participantId) {
  return await db
    .select()
    .from(scores)
    .where(eq(scores.participantId, participantId))
    .orderBy(asc(scores.criteriaId));
}

export async function getScoresByCriteriaId(criteriaId) {
  return await db
    .select()
    .from(scores)
    .where(eq(scores.criteriaId, criteriaId))
    .orderBy(asc(scores.participantId));
}

export async function getScoreByParticipantAndCriteria(participantId, criteriaId) {
  const [score] = await db
    .select()
    .from(scores)
    .where(and(
      eq(scores.participantId, participantId),
      eq(scores.criteriaId, criteriaId)
    ));
  return score || null;
}

export async function updateScore(id, data) {
  const [score] = await db.update(scores)
    .set(data)
    .where(eq(scores.id, id))
    .returning();
  return score || null;
}

export async function upsertScore(participantId, criteriaId, score) {
  const [result] = await db.insert(scores)
    .values({ participantId, criteriaId, score })
    .onConflictDoUpdate({
      target: [scores.participantId, scores.criteriaId],
      set: { score },
    })
    .returning();
  return result;
}

export async function deleteScore(id) {
  const result = await db.delete(scores).where(eq(scores.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function deleteScoresByParticipantId(participantId) {
  const result = await db.delete(scores).where(eq(scores.participantId, participantId));
  return result.rowCount ?? 0;
}

export async function deleteScoresByCriteriaId(criteriaId) {
  const result = await db.delete(scores).where(eq(scores.criteriaId, criteriaId));
  return result.rowCount ?? 0;
}

export async function getScoresByUserIdAndSegmentId(userId, segmentId) {
  return await db
    .select({
      score: scores,
      criteria: criteria,
    })
    .from(scores)
    .innerJoin(criteria, eq(scores.criteriaId, criteria.id))
    .where(and(
      eq(scores.userId, userId),
      eq(criteria.segmentId, segmentId)
    ))
    .orderBy(asc(scores.participantId), asc(criteria.id));
}

export async function getScoresByUserAndSegment(userId, segmentId) {
  const results = await db
    .select({
      participantId: scores.participantId,
      criteriaId: scores.criteriaId,
      score: scores.score,
      criteria: criteria,
    })
    .from(scores)
    .innerJoin(criteria, eq(scores.criteriaId, criteria.id))
    .where(and(
      eq(scores.userId, userId),
      eq(criteria.segmentId, segmentId)
    ))
    .orderBy(asc(scores.participantId), asc(criteria.id));
  
  return results;
}

export default {
  createScore,
  getScoreById,
  getAllScores,
  getScoresByParticipantId,
  getScoresByCriteriaId,
  getScoreByParticipantAndCriteria,
  updateScore,
  upsertScore,
  deleteScore,
  deleteScoresByParticipantId,
  deleteScoresByCriteriaId,
};

