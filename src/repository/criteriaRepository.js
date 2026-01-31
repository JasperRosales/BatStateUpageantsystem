import { db } from '../drizzle/db.js';
import { criteria } from '../drizzle/schema.js';
import { eq, asc, desc } from 'drizzle-orm';

export async function createCriteria(criteriaData) {
  const [criterion] = await db.insert(criteria).values(criteriaData).returning();
  return criterion;
}

export async function getCriteriaById(id) {
  const [criterion] = await db.select().from(criteria).where(eq(criteria.id, id));
  return criterion || null;
}

export async function getAllCriteria(options = {}) {
  const { orderByDesc = false } = options;

  let query = db.select().from(criteria);

  if (orderByDesc) {
    query = query.orderBy(desc(criteria.createdAt));
  } else {
    query = query.orderBy(asc(criteria.createdAt));
  }

  return await query;
}

export async function getCriteriaBySegmentId(segmentId) {
  return await db
    .select()
    .from(criteria)
    .where(eq(criteria.segmentId, segmentId))
    .orderBy(asc(criteria.createdAt));
}

export async function updateCriteria(id, data) {
  const [criterion] = await db.update(criteria)
    .set(data)
    .where(eq(criteria.id, id))
    .returning();
  return criterion || null;
}

export async function deleteCriteria(id) {
  const result = await db.delete(criteria).where(eq(criteria.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function deleteCriteriaBySegmentId(segmentId) {
  const result = await db.delete(criteria).where(eq(criteria.segmentId, segmentId));
  return result.rowCount ?? 0;
}

export default {
  createCriteria,
  getCriteriaById,
  getAllCriteria,
  getCriteriaBySegmentId,
  updateCriteria,
  deleteCriteria,
  deleteCriteriaBySegmentId,
};

