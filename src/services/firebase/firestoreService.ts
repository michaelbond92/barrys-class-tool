// ============================================================================
// Firestore Service
// CRUD operations for Barry's Class Tool data in Firestore
// ============================================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  DocumentData,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { getDb, getUserCollection, COLLECTIONS, isFirebaseConfigured } from './firebaseConfig';
import {
  ClassMetadata,
  RoundMetadata,
  BlockMetadata,
  TreadBlockMetadata,
  UsageRecord,
  PositionOverride,
} from '../../types/hierarchyTypes';

// ============================================================================
// TYPE HELPERS
// ============================================================================

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

function toFirestoreDate(date: string | Date | null): Timestamp | null {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return Timestamp.fromDate(d);
}

function fromFirestoreDate(timestamp: FirestoreTimestamp | Timestamp | null): string | null {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return new Date(timestamp.seconds * 1000).toISOString();
}

// ============================================================================
// CLASS OPERATIONS
// ============================================================================

/**
 * Save a class to Firestore
 */
export async function saveClass(userId: string, classData: ClassMetadata): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'CLASSES');
  const docRef = doc(db, collectionPath, classData.id);

  const data = {
    ...classData,
    lastUsed: toFirestoreDate(classData.lastUsed),
    updatedAt: Timestamp.now(),
  };

  await setDoc(docRef, data);
}

/**
 * Get a class from Firestore
 */
export async function getClass(userId: string, classId: string): Promise<ClassMetadata | null> {
  if (!isFirebaseConfigured()) return null;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'CLASSES');
  const docRef = doc(db, collectionPath, classId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    ...data,
    lastUsed: fromFirestoreDate(data.lastUsed),
  } as ClassMetadata;
}

/**
 * Get all classes for a user
 */
export async function getAllClasses(userId: string): Promise<ClassMetadata[]> {
  if (!isFirebaseConfigured()) return [];

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'CLASSES');
  const q = query(collection(db, collectionPath), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      lastUsed: fromFirestoreDate(data.lastUsed),
    } as ClassMetadata;
  });
}

// ============================================================================
// ROUND OPERATIONS
// ============================================================================

/**
 * Save a round to Firestore
 */
export async function saveRound(userId: string, round: RoundMetadata): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'ROUNDS');
  const docRef = doc(db, collectionPath, round.id);

  const data = {
    ...round,
    lastUsed: toFirestoreDate(round.lastUsed),
    useDates: round.useDates.map(d => toFirestoreDate(d)),
    updatedAt: Timestamp.now(),
  };

  await setDoc(docRef, data);
}

/**
 * Get all rounds for a user
 */
export async function getAllRounds(userId: string): Promise<RoundMetadata[]> {
  if (!isFirebaseConfigured()) return [];

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'ROUNDS');
  const snapshot = await getDocs(collection(db, collectionPath));

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      lastUsed: fromFirestoreDate(data.lastUsed),
      useDates: (data.useDates || []).map((d: unknown) => fromFirestoreDate(d as FirestoreTimestamp)),
    } as RoundMetadata;
  });
}

// ============================================================================
// BLOCK OPERATIONS
// ============================================================================

/**
 * Save a floor block to Firestore
 */
export async function saveFloorBlock(userId: string, block: BlockMetadata): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'FLOOR_BLOCKS');
  const docRef = doc(db, collectionPath, block.id);

  const data = {
    ...block,
    lastUsed: toFirestoreDate(block.lastUsed),
    useDates: block.useDates.map(d => toFirestoreDate(d)),
    updatedAt: Timestamp.now(),
  };

  await setDoc(docRef, data);
}

/**
 * Get all floor blocks for a user
 */
export async function getAllFloorBlocks(userId: string): Promise<BlockMetadata[]> {
  if (!isFirebaseConfigured()) return [];

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'FLOOR_BLOCKS');
  const snapshot = await getDocs(collection(db, collectionPath));

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      lastUsed: fromFirestoreDate(data.lastUsed),
      useDates: (data.useDates || []).map((d: unknown) => fromFirestoreDate(d as FirestoreTimestamp)),
    } as BlockMetadata;
  });
}

/**
 * Save a tread block to Firestore
 */
export async function saveTreadBlock(userId: string, block: TreadBlockMetadata): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'TREAD_BLOCKS');
  const docRef = doc(db, collectionPath, block.id);

  const data = {
    ...block,
    lastUsed: toFirestoreDate(block.lastUsed),
    updatedAt: Timestamp.now(),
  };

  await setDoc(docRef, data);
}

/**
 * Get all tread blocks for a user
 */
export async function getAllTreadBlocks(userId: string): Promise<TreadBlockMetadata[]> {
  if (!isFirebaseConfigured()) return [];

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'TREAD_BLOCKS');
  const snapshot = await getDocs(collection(db, collectionPath));

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      lastUsed: fromFirestoreDate(data.lastUsed),
    } as TreadBlockMetadata;
  });
}

// ============================================================================
// USAGE HISTORY OPERATIONS
// ============================================================================

/**
 * Save a usage record
 */
export async function saveUsageRecord(userId: string, record: UsageRecord): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'USAGE_HISTORY');
  const docId = `${record.entityId}_${record.usedAt}`;
  const docRef = doc(db, collectionPath, docId);

  const data = {
    ...record,
    usedAt: toFirestoreDate(record.usedAt),
  };

  await setDoc(docRef, data);
}

/**
 * Get usage history for a user
 */
export async function getUsageHistory(
  userId: string,
  options?: {
    entityId?: string;
    entityType?: string;
    limit?: number;
  }
): Promise<UsageRecord[]> {
  if (!isFirebaseConfigured()) return [];

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'USAGE_HISTORY');

  const constraints: QueryConstraint[] = [];

  if (options?.entityId) {
    constraints.push(where('entityId', '==', options.entityId));
  }
  if (options?.entityType) {
    constraints.push(where('entityType', '==', options.entityType));
  }

  constraints.push(orderBy('usedAt', 'desc'));

  if (options?.limit) {
    constraints.push(limit(options.limit));
  }

  const q = query(collection(db, collectionPath), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      usedAt: fromFirestoreDate(data.usedAt),
    } as UsageRecord;
  });
}

// ============================================================================
// POSITION OVERRIDE OPERATIONS
// ============================================================================

/**
 * Save a position override
 */
export async function savePositionOverride(userId: string, override: PositionOverride): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'POSITION_OVERRIDES');
  const docRef = doc(db, collectionPath, override.exerciseId);

  const data = {
    ...override,
    createdAt: toFirestoreDate(override.createdAt),
  };

  await setDoc(docRef, data);
}

/**
 * Get all position overrides for a user
 */
export async function getPositionOverrides(userId: string): Promise<PositionOverride[]> {
  if (!isFirebaseConfigured()) return [];

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'POSITION_OVERRIDES');
  const snapshot = await getDocs(collection(db, collectionPath));

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: fromFirestoreDate(data.createdAt),
    } as PositionOverride;
  });
}

/**
 * Delete a position override
 */
export async function deletePositionOverride(userId: string, exerciseId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'POSITION_OVERRIDES');
  const docRef = doc(db, collectionPath, exerciseId);

  await deleteDoc(docRef);
}

// ============================================================================
// FAVORITES & HIDDEN OPERATIONS
// ============================================================================

/**
 * Add a block to favorites
 */
export async function addToFavorites(userId: string, blockId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'FAVORITES');
  const docRef = doc(db, collectionPath, blockId);

  await setDoc(docRef, {
    blockId,
    addedAt: Timestamp.now(),
  });
}

/**
 * Remove a block from favorites
 */
export async function removeFromFavorites(userId: string, blockId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'FAVORITES');
  const docRef = doc(db, collectionPath, blockId);

  await deleteDoc(docRef);
}

/**
 * Get all favorite block IDs
 */
export async function getFavorites(userId: string): Promise<string[]> {
  if (!isFirebaseConfigured()) return [];

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'FAVORITES');
  const snapshot = await getDocs(collection(db, collectionPath));

  return snapshot.docs.map(doc => doc.id);
}

/**
 * Add a block to hidden
 */
export async function addToHidden(userId: string, blockId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'HIDDEN');
  const docRef = doc(db, collectionPath, blockId);

  await setDoc(docRef, {
    blockId,
    hiddenAt: Timestamp.now(),
  });
}

/**
 * Remove a block from hidden
 */
export async function removeFromHidden(userId: string, blockId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'HIDDEN');
  const docRef = doc(db, collectionPath, blockId);

  await deleteDoc(docRef);
}

/**
 * Get all hidden block IDs
 */
export async function getHidden(userId: string): Promise<string[]> {
  if (!isFirebaseConfigured()) return [];

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'HIDDEN');
  const snapshot = await getDocs(collection(db, collectionPath));

  return snapshot.docs.map(doc => doc.id);
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Save multiple classes in a batch
 */
export async function batchSaveClasses(userId: string, classes: ClassMetadata[]): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const batch = writeBatch(db);
  const collectionPath = getUserCollection(userId, 'CLASSES');

  for (const classData of classes) {
    const docRef = doc(db, collectionPath, classData.id);
    const data = {
      ...classData,
      lastUsed: toFirestoreDate(classData.lastUsed),
      updatedAt: Timestamp.now(),
    };
    batch.set(docRef, data);
  }

  await batch.commit();
}

/**
 * Save multiple floor blocks in a batch
 */
export async function batchSaveFloorBlocks(userId: string, blocks: BlockMetadata[]): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const collectionPath = getUserCollection(userId, 'FLOOR_BLOCKS');

  // Firestore batches are limited to 500 operations
  const batchSize = 500;

  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = blocks.slice(i, i + batchSize);

    for (const block of chunk) {
      const docRef = doc(db, collectionPath, block.id);
      const data = {
        ...block,
        lastUsed: toFirestoreDate(block.lastUsed),
        useDates: block.useDates.map(d => toFirestoreDate(d)),
        updatedAt: Timestamp.now(),
      };
      batch.set(docRef, data);
    }

    await batch.commit();
  }
}

/**
 * Sync all data to Firestore
 */
export async function syncToFirestore(
  userId: string,
  data: {
    classes?: ClassMetadata[];
    rounds?: RoundMetadata[];
    floorBlocks?: BlockMetadata[];
    treadBlocks?: TreadBlockMetadata[];
  }
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  if (data.classes) {
    await batchSaveClasses(userId, data.classes);
  }

  if (data.floorBlocks) {
    await batchSaveFloorBlocks(userId, data.floorBlocks);
  }

  // TODO: Add batch operations for rounds and tread blocks
}

/**
 * Load all data from Firestore
 */
export async function loadFromFirestore(userId: string): Promise<{
  classes: ClassMetadata[];
  rounds: RoundMetadata[];
  floorBlocks: BlockMetadata[];
  treadBlocks: TreadBlockMetadata[];
}> {
  if (!isFirebaseConfigured()) {
    return {
      classes: [],
      rounds: [],
      floorBlocks: [],
      treadBlocks: [],
    };
  }

  const [classes, rounds, floorBlocks, treadBlocks] = await Promise.all([
    getAllClasses(userId),
    getAllRounds(userId),
    getAllFloorBlocks(userId),
    getAllTreadBlocks(userId),
  ]);

  return { classes, rounds, floorBlocks, treadBlocks };
}
