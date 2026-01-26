// ============================================================================
// Embedding Service
// Generate embeddings using OpenAI text-embedding-3-small
// ============================================================================

import {
  BlockMetadata,
  RoundMetadata,
  ExerciseMetadata,
  MovementPattern,
  MuscleGroup,
  ExercisePosition,
  FinisherType,
} from '../types/hierarchyTypes';

// ============================================================================
// Configuration
// ============================================================================

const OPENAI_API_URL = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 768;

// Get API key from environment
function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key not configured. Set VITE_OPENAI_API_KEY in .env');
  }
  return key;
}

// ============================================================================
// Types
// ============================================================================

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface EmbeddingResult {
  id: string;
  embedding: number[];
  text: string;
  tokenCount: number;
}

// ============================================================================
// Core Embedding Functions
// ============================================================================

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = getApiKey();

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
  }

  const data: EmbeddingResponse = await response.json();
  return data.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts in a batch
 */
export async function batchGenerateEmbeddings(
  texts: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<EmbeddingResult[]> {
  const apiKey = getApiKey();
  const results: EmbeddingResult[] = [];

  // OpenAI allows up to 2048 items per batch, but we'll use smaller batches
  // to avoid rate limits and provide progress feedback
  const BATCH_SIZE = 50;
  const batches = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    batches.push(texts.slice(i, i + BATCH_SIZE));
  }

  let completed = 0;

  for (const batch of batches) {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: batch,
        dimensions: EMBEDDING_DIMENSIONS,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
    }

    const data: EmbeddingResponse = await response.json();

    for (const item of data.data) {
      const globalIndex = completed + item.index;
      results.push({
        id: `embedding_${globalIndex}`,
        embedding: item.embedding,
        text: texts[globalIndex],
        tokenCount: Math.ceil(texts[globalIndex].length / 4), // Rough estimate
      });
    }

    completed += batch.length;
    onProgress?.(completed, texts.length);

    // Add small delay between batches to avoid rate limits
    if (completed < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}

// ============================================================================
// Text Preparation Functions
// ============================================================================

/**
 * Prepare block text for embedding
 * Combines content with metadata for richer semantic representation
 */
export function prepareBlockEmbeddingText(block: BlockMetadata): string {
  const parts: string[] = [];

  // Add content
  parts.push(`Exercises: ${block.content.join(', ')}`);

  // Add body focus
  if (block.bodyFocus.length > 0) {
    parts.push(`Body focus: ${block.bodyFocus.join(', ')}`);
  }

  // Add movement patterns
  if (block.movementPatterns.length > 0) {
    parts.push(`Movement patterns: ${block.movementPatterns.join(', ')}`);
  }

  // Add position info
  if (block.dominantPosition) {
    parts.push(`Primary position: ${formatPosition(block.dominantPosition)}`);
  }

  // Add structure tags
  if (block.structure.length > 0) {
    parts.push(`Structure: ${block.structure.join(', ')}`);
  }

  // Add intensity
  if (block.intensity) {
    parts.push(`Intensity: ${block.intensity}`);
  }

  // Add flow score context
  if (block.flowScore >= 80) {
    parts.push('Flow: smooth transitions, minimal position changes');
  } else if (block.flowScore <= 50) {
    parts.push('Flow: varied positions, more transitions');
  }

  return parts.join('. ');
}

/**
 * Prepare round text for embedding
 */
export function prepareRoundEmbeddingText(round: RoundMetadata): string {
  const parts: string[] = [];

  // Add duration
  parts.push(`${round.duration} minute round`);

  // Add body focus
  if (round.primaryBodyFocus.length > 0) {
    parts.push(`Body focus: ${round.primaryBodyFocus.join(', ')}`);
  }

  // Add movement patterns
  if (round.movementPatterns.length > 0) {
    parts.push(`Movement patterns: ${round.movementPatterns.join(', ')}`);
  }

  // Add finisher
  if (round.finisherType) {
    parts.push(`Finisher: ${formatFinisher(round.finisherType)}`);
  }

  // Add tread info
  parts.push(`Tread: ${round.treadPattern}, average speed ${round.treadAverage.toFixed(1)}`);
  if (round.sprintCount > 0) {
    parts.push(`${round.sprintCount} sprints`);
  }

  // Add position flow
  parts.push(`Dominant position: ${formatPosition(round.dominantPosition)}`);
  if (round.flowScore >= 80) {
    parts.push('Smooth floor transitions');
  } else if (round.flowScore <= 50) {
    parts.push('Varied floor positions');
  }

  return parts.join('. ');
}

/**
 * Prepare exercise text for embedding
 */
export function prepareExerciseEmbeddingText(exercise: ExerciseMetadata): string {
  const parts: string[] = [];

  // Add raw text
  parts.push(exercise.rawText);

  // Add muscle info
  parts.push(`Works ${formatMuscle(exercise.primaryMuscle)}`);
  if (exercise.secondaryMuscles.length > 0) {
    parts.push(`Also targets ${exercise.secondaryMuscles.map(formatMuscle).join(', ')}`);
  }

  // Add movement pattern
  parts.push(`${formatMovement(exercise.movementPattern)} movement`);

  // Add position
  parts.push(`Performed ${formatPosition(exercise.primaryPosition)}`);

  // Add rep classification
  if (exercise.repClassification !== 'fixed') {
    parts.push(`Rep style: ${exercise.repClassification}`);
  }

  // Add modifiers
  const modifiers: string[] = [];
  if (exercise.modifiers.tempo) modifiers.push('tempo');
  if (exercise.modifiers.alternating) modifiers.push('alternating');
  if (exercise.modifiers.hold) modifiers.push('hold');
  if (exercise.modifiers.pulse) modifiers.push('pulse');
  if (modifiers.length > 0) {
    parts.push(`Modifiers: ${modifiers.join(', ')}`);
  }

  return parts.join('. ');
}

// ============================================================================
// Formatting Helpers
// ============================================================================

function formatPosition(position: ExercisePosition): string {
  return position.replace(/_/g, ' ');
}

function formatMuscle(muscle: MuscleGroup): string {
  return muscle.replace(/_/g, ' ');
}

function formatMovement(pattern: MovementPattern): string {
  return pattern;
}

function formatFinisher(finisher: FinisherType): string {
  return finisher.replace(/_/g, ' ');
}

// ============================================================================
// Similarity Functions
// ============================================================================

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have same dimensions');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (normA * normB);
}

/**
 * Find most similar items from a collection
 */
export function findMostSimilar<T extends { id: string; embedding: number[] }>(
  queryEmbedding: number[],
  candidates: T[],
  limit: number = 10
): Array<T & { similarity: number }> {
  const withSimilarity = candidates.map(candidate => ({
    ...candidate,
    similarity: cosineSimilarity(queryEmbedding, candidate.embedding),
  }));

  return withSimilarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Find most different items from a collection
 * Useful for "surprise me" / variety mode
 */
export function findMostDifferent<T extends { id: string; embedding: number[] }>(
  queryEmbedding: number[],
  candidates: T[],
  limit: number = 10
): Array<T & { similarity: number }> {
  const withSimilarity = candidates.map(candidate => ({
    ...candidate,
    similarity: cosineSimilarity(queryEmbedding, candidate.embedding),
  }));

  // Sort by lowest similarity (most different)
  return withSimilarity
    .sort((a, b) => a.similarity - b.similarity)
    .slice(0, limit);
}

/**
 * Find items in a specific similarity range
 * Useful for finding "similar but different" options
 */
export function findInSimilarityRange<T extends { id: string; embedding: number[] }>(
  queryEmbedding: number[],
  candidates: T[],
  minSimilarity: number = 0.3,
  maxSimilarity: number = 0.7,
  limit: number = 10
): Array<T & { similarity: number }> {
  const withSimilarity = candidates.map(candidate => ({
    ...candidate,
    similarity: cosineSimilarity(queryEmbedding, candidate.embedding),
  }));

  return withSimilarity
    .filter(item => item.similarity >= minSimilarity && item.similarity <= maxSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// ============================================================================
// Caching
// ============================================================================

const embeddingCache = new Map<string, number[]>();

/**
 * Generate embedding with caching
 */
export async function generateEmbeddingCached(text: string): Promise<number[]> {
  const cacheKey = text.trim().toLowerCase();

  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }

  const embedding = await generateEmbedding(text);
  embeddingCache.set(cacheKey, embedding);

  return embedding;
}

/**
 * Clear embedding cache
 */
export function clearEmbeddingCache(): void {
  embeddingCache.clear();
}

/**
 * Get cache statistics
 */
export function getEmbeddingCacheStats(): { size: number; estimatedMemoryMB: number } {
  const size = embeddingCache.size;
  // Each embedding is 768 floats * 8 bytes = ~6KB
  const estimatedMemoryMB = (size * EMBEDDING_DIMENSIONS * 8) / (1024 * 1024);

  return { size, estimatedMemoryMB };
}
