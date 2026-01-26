// ============================================================================
// Vector Search Service
// Firebase Firestore vector search for similarity queries
// ============================================================================

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import { db, COLLECTION_PATHS } from './firebaseConfig';
import {
  cosineSimilarity,
  findMostSimilar,
  findMostDifferent,
  generateEmbedding,
  prepareBlockEmbeddingText,
  prepareRoundEmbeddingText,
} from '../embeddingService';
import { BlockMetadata, RoundMetadata } from '../../types/hierarchyTypes';

// ============================================================================
// Types
// ============================================================================

export interface StoredEmbedding {
  id: string;
  type: 'block' | 'round' | 'exercise';
  embedding: number[];
  sourceText: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimilarityResult<T> {
  item: T;
  similarity: number;
  explanation?: string;
}

// ============================================================================
// Storage Functions
// ============================================================================

/**
 * Store embedding for a block
 */
export async function storeBlockEmbedding(
  userId: string,
  block: BlockMetadata,
  embedding: number[]
): Promise<void> {
  const docRef = doc(db, COLLECTION_PATHS.blockEmbeddings(userId), block.id);

  await setDoc(docRef, {
    id: block.id,
    type: 'block',
    embedding,
    sourceText: prepareBlockEmbeddingText(block),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

/**
 * Store embedding for a round
 */
export async function storeRoundEmbedding(
  userId: string,
  round: RoundMetadata,
  embedding: number[]
): Promise<void> {
  const docRef = doc(db, COLLECTION_PATHS.roundEmbeddings(userId), round.id);

  await setDoc(docRef, {
    id: round.id,
    type: 'round',
    embedding,
    sourceText: prepareRoundEmbeddingText(round),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

/**
 * Store multiple embeddings in batch
 */
export async function batchStoreEmbeddings(
  userId: string,
  embeddings: Array<{ id: string; type: 'block' | 'round'; embedding: number[]; sourceText: string }>
): Promise<void> {
  const batch = writeBatch(db);

  for (const item of embeddings) {
    const collectionPath = item.type === 'block'
      ? COLLECTION_PATHS.blockEmbeddings(userId)
      : COLLECTION_PATHS.roundEmbeddings(userId);

    const docRef = doc(db, collectionPath, item.id);

    batch.set(docRef, {
      id: item.id,
      type: item.type,
      embedding: item.embedding,
      sourceText: item.sourceText,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await batch.commit();
}

/**
 * Get embedding by ID
 */
export async function getEmbedding(
  userId: string,
  id: string,
  type: 'block' | 'round'
): Promise<StoredEmbedding | null> {
  const collectionPath = type === 'block'
    ? COLLECTION_PATHS.blockEmbeddings(userId)
    : COLLECTION_PATHS.roundEmbeddings(userId);

  const docRef = doc(db, collectionPath, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  } as StoredEmbedding;
}

/**
 * Get all embeddings of a type
 */
export async function getAllEmbeddings(
  userId: string,
  type: 'block' | 'round'
): Promise<StoredEmbedding[]> {
  const collectionPath = type === 'block'
    ? COLLECTION_PATHS.blockEmbeddings(userId)
    : COLLECTION_PATHS.roundEmbeddings(userId);

  const snapshot = await getDocs(collection(db, collectionPath));

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as StoredEmbedding;
  });
}

/**
 * Delete embedding
 */
export async function deleteEmbedding(
  userId: string,
  id: string,
  type: 'block' | 'round'
): Promise<void> {
  const collectionPath = type === 'block'
    ? COLLECTION_PATHS.blockEmbeddings(userId)
    : COLLECTION_PATHS.roundEmbeddings(userId);

  await deleteDoc(doc(db, collectionPath, id));
}

// ============================================================================
// Search Functions
// ============================================================================

/**
 * Find similar blocks using embeddings
 */
export async function findSimilarBlocks(
  userId: string,
  blocks: BlockMetadata[],
  queryBlock: BlockMetadata,
  resultLimit: number = 10
): Promise<SimilarityResult<BlockMetadata>[]> {
  // Get all embeddings
  const embeddings = await getAllEmbeddings(userId, 'block');

  if (embeddings.length === 0) {
    // Fall back to generating embedding on the fly
    return findSimilarBlocksDirectly(blocks, queryBlock, resultLimit);
  }

  // Get or generate query embedding
  let queryEmbedding: number[];
  const existingEmbedding = embeddings.find(e => e.id === queryBlock.id);

  if (existingEmbedding) {
    queryEmbedding = existingEmbedding.embedding;
  } else {
    const text = prepareBlockEmbeddingText(queryBlock);
    queryEmbedding = await generateEmbedding(text);
  }

  // Find similar embeddings
  const candidates = embeddings
    .filter(e => e.id !== queryBlock.id)
    .map(e => ({ id: e.id, embedding: e.embedding }));

  const similarEmbeddings = findMostSimilar(queryEmbedding, candidates, resultLimit);

  // Map back to blocks
  const results: SimilarityResult<BlockMetadata>[] = [];
  for (const result of similarEmbeddings) {
    const block = blocks.find(b => b.id === result.id);
    if (block) {
      results.push({
        item: block,
        similarity: result.similarity,
        explanation: generateSimilarityExplanation(queryBlock, block, result.similarity),
      });
    }
  }
  return results;
}

/**
 * Find similar blocks directly without stored embeddings
 * More expensive but works without pre-computed embeddings
 */
async function findSimilarBlocksDirectly(
  blocks: BlockMetadata[],
  queryBlock: BlockMetadata,
  resultLimit: number
): Promise<SimilarityResult<BlockMetadata>[]> {
  // Generate query embedding
  const queryText = prepareBlockEmbeddingText(queryBlock);
  const queryEmbedding = await generateEmbedding(queryText);

  // Generate embeddings for all candidates and compute similarity
  const results: SimilarityResult<BlockMetadata>[] = [];

  for (const block of blocks) {
    if (block.id === queryBlock.id) continue;

    const blockText = prepareBlockEmbeddingText(block);
    const blockEmbedding = await generateEmbedding(blockText);
    const similarity = cosineSimilarity(queryEmbedding, blockEmbedding);

    results.push({
      item: block,
      similarity,
      explanation: generateSimilarityExplanation(queryBlock, block, similarity),
    });
  }

  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, resultLimit);
}

/**
 * Find similar rounds using embeddings
 */
export async function findSimilarRounds(
  userId: string,
  rounds: RoundMetadata[],
  queryRound: RoundMetadata,
  resultLimit: number = 10
): Promise<SimilarityResult<RoundMetadata>[]> {
  const embeddings = await getAllEmbeddings(userId, 'round');

  if (embeddings.length === 0) {
    return findSimilarRoundsDirectly(rounds, queryRound, resultLimit);
  }

  let queryEmbedding: number[];
  const existingEmbedding = embeddings.find(e => e.id === queryRound.id);

  if (existingEmbedding) {
    queryEmbedding = existingEmbedding.embedding;
  } else {
    const text = prepareRoundEmbeddingText(queryRound);
    queryEmbedding = await generateEmbedding(text);
  }

  const candidates = embeddings
    .filter(e => e.id !== queryRound.id)
    .map(e => ({ id: e.id, embedding: e.embedding }));

  const similarEmbeddings = findMostSimilar(queryEmbedding, candidates, resultLimit);

  const results: SimilarityResult<RoundMetadata>[] = [];
  for (const result of similarEmbeddings) {
    const round = rounds.find(r => r.id === result.id);
    if (round) {
      results.push({
        item: round,
        similarity: result.similarity,
        explanation: generateRoundSimilarityExplanation(queryRound, round, result.similarity),
      });
    }
  }
  return results;
}

/**
 * Find similar rounds directly without stored embeddings
 */
async function findSimilarRoundsDirectly(
  rounds: RoundMetadata[],
  queryRound: RoundMetadata,
  resultLimit: number
): Promise<SimilarityResult<RoundMetadata>[]> {
  const queryText = prepareRoundEmbeddingText(queryRound);
  const queryEmbedding = await generateEmbedding(queryText);

  const results: SimilarityResult<RoundMetadata>[] = [];

  for (const round of rounds) {
    if (round.id === queryRound.id) continue;

    const roundText = prepareRoundEmbeddingText(round);
    const roundEmbedding = await generateEmbedding(roundText);
    const similarity = cosineSimilarity(queryEmbedding, roundEmbedding);

    results.push({
      item: round,
      similarity,
      explanation: generateRoundSimilarityExplanation(queryRound, round, similarity),
    });
  }

  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, resultLimit);
}

/**
 * Find different blocks (for "surprise me" feature)
 */
export async function findDifferentBlocks(
  userId: string,
  blocks: BlockMetadata[],
  recentBlockIds: string[],
  resultLimit: number = 10
): Promise<SimilarityResult<BlockMetadata>[]> {
  const embeddings = await getAllEmbeddings(userId, 'block');

  if (embeddings.length === 0 || recentBlockIds.length === 0) {
    // Return random blocks if no embeddings or no recent history
    return blocks
      .filter(b => !recentBlockIds.includes(b.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, resultLimit)
      .map(block => ({
        item: block,
        similarity: 0,
        explanation: 'Random selection',
      }));
  }

  // Compute average embedding of recent blocks
  const recentEmbeddings = embeddings.filter(e => recentBlockIds.includes(e.id));
  if (recentEmbeddings.length === 0) {
    return [];
  }

  const avgEmbedding = computeAverageEmbedding(recentEmbeddings.map(e => e.embedding));

  // Find blocks most different from the average
  const candidates = embeddings
    .filter(e => !recentBlockIds.includes(e.id))
    .map(e => ({ id: e.id, embedding: e.embedding }));

  const differentEmbeddings = findMostDifferent(avgEmbedding, candidates, resultLimit);

  const results: SimilarityResult<BlockMetadata>[] = [];
  for (const result of differentEmbeddings) {
    const block = blocks.find(b => b.id === result.id);
    if (block) {
      results.push({
        item: block,
        similarity: result.similarity,
        explanation: `Different from your recent selections (${Math.round((1 - result.similarity) * 100)}% variety)`,
      });
    }
  }
  return results;
}

/**
 * Search by natural language query
 */
export async function searchByQuery(
  userId: string,
  blocks: BlockMetadata[],
  query: string,
  resultLimit: number = 10
): Promise<SimilarityResult<BlockMetadata>[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Get stored embeddings
  const embeddings = await getAllEmbeddings(userId, 'block');

  if (embeddings.length === 0) {
    // Fall back to keyword matching if no embeddings
    const lowerQuery = query.toLowerCase();
    return blocks
      .filter(b => b.content.some(c => c.toLowerCase().includes(lowerQuery)))
      .slice(0, resultLimit)
      .map(block => ({
        item: block,
        similarity: 0.5,
        explanation: 'Keyword match',
      }));
  }

  const candidates = embeddings.map(e => ({ id: e.id, embedding: e.embedding }));
  const similarEmbeddings = findMostSimilar(queryEmbedding, candidates, resultLimit);

  const results: SimilarityResult<BlockMetadata>[] = [];
  for (const result of similarEmbeddings) {
    const block = blocks.find(b => b.id === result.id);
    if (block) {
      results.push({
        item: block,
        similarity: result.similarity,
        explanation: `${Math.round(result.similarity * 100)}% match to "${query}"`,
      });
    }
  }
  return results;
}

// ============================================================================
// Helper Functions
// ============================================================================

function computeAverageEmbedding(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return [];

  const dimensions = embeddings[0].length;
  const avg = new Array(dimensions).fill(0);

  for (const embedding of embeddings) {
    for (let i = 0; i < dimensions; i++) {
      avg[i] += embedding[i];
    }
  }

  for (let i = 0; i < dimensions; i++) {
    avg[i] /= embeddings.length;
  }

  return avg;
}

function generateSimilarityExplanation(
  queryBlock: BlockMetadata,
  resultBlock: BlockMetadata,
  similarity: number
): string {
  const reasons: string[] = [];

  // Check shared body focus
  const sharedFocus = queryBlock.bodyFocus.filter(f => resultBlock.bodyFocus.includes(f));
  if (sharedFocus.length > 0) {
    reasons.push(`Same ${sharedFocus.join(', ')} focus`);
  }

  // Check shared movement patterns
  const sharedPatterns = queryBlock.movementPatterns.filter(p => resultBlock.movementPatterns.includes(p));
  if (sharedPatterns.length > 0) {
    reasons.push(`Same ${sharedPatterns.join(', ')} patterns`);
  }

  // Check position similarity
  if (queryBlock.dominantPosition === resultBlock.dominantPosition) {
    reasons.push(`Same ${queryBlock.dominantPosition.replace(/_/g, ' ')} position`);
  }

  // Check intensity
  if (queryBlock.intensity === resultBlock.intensity) {
    reasons.push(`Same ${queryBlock.intensity} intensity`);
  }

  if (reasons.length === 0) {
    return `${Math.round(similarity * 100)}% semantic similarity`;
  }

  return reasons.slice(0, 2).join(', ');
}

function generateRoundSimilarityExplanation(
  queryRound: RoundMetadata,
  resultRound: RoundMetadata,
  similarity: number
): string {
  const reasons: string[] = [];

  // Check duration
  if (queryRound.duration === resultRound.duration) {
    reasons.push(`Same ${queryRound.duration}min duration`);
  }

  // Check finisher
  if (queryRound.finisherType === resultRound.finisherType) {
    reasons.push(`Same ${queryRound.finisherType} finisher`);
  }

  // Check body focus
  const sharedFocus = queryRound.primaryBodyFocus.filter(f => resultRound.primaryBodyFocus.includes(f));
  if (sharedFocus.length > 0) {
    reasons.push(`Similar body focus`);
  }

  // Check tread pattern
  if (queryRound.treadPattern === resultRound.treadPattern) {
    reasons.push(`Same tread style`);
  }

  if (reasons.length === 0) {
    return `${Math.round(similarity * 100)}% overall similarity`;
  }

  return reasons.slice(0, 2).join(', ');
}

// ============================================================================
// Batch Operations
// ============================================================================

/**
 * Generate and store embeddings for all blocks
 */
export async function generateAllBlockEmbeddings(
  userId: string,
  blocks: BlockMetadata[],
  onProgress?: (completed: number, total: number) => void
): Promise<void> {
  const batchSize = 50;
  let completed = 0;

  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);
    const embeddings: Array<{ id: string; type: 'block' | 'round'; embedding: number[]; sourceText: string }> = [];

    for (const block of batch) {
      const text = prepareBlockEmbeddingText(block);
      const embedding = await generateEmbedding(text);

      embeddings.push({
        id: block.id,
        type: 'block',
        embedding,
        sourceText: text,
      });
    }

    await batchStoreEmbeddings(userId, embeddings);

    completed += batch.length;
    onProgress?.(completed, blocks.length);

    // Small delay between batches
    if (completed < blocks.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

/**
 * Generate and store embeddings for all rounds
 */
export async function generateAllRoundEmbeddings(
  userId: string,
  rounds: RoundMetadata[],
  onProgress?: (completed: number, total: number) => void
): Promise<void> {
  const batchSize = 50;
  let completed = 0;

  for (let i = 0; i < rounds.length; i += batchSize) {
    const batch = rounds.slice(i, i + batchSize);
    const embeddings: Array<{ id: string; type: 'block' | 'round'; embedding: number[]; sourceText: string }> = [];

    for (const round of batch) {
      const text = prepareRoundEmbeddingText(round);
      const embedding = await generateEmbedding(text);

      embeddings.push({
        id: round.id,
        type: 'round',
        embedding,
        sourceText: text,
      });
    }

    await batchStoreEmbeddings(userId, embeddings);

    completed += batch.length;
    onProgress?.(completed, rounds.length);

    if (completed < rounds.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}
