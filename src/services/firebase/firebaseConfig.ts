// ============================================================================
// Firebase Configuration
// Configure Firebase for the Barry's Class Tool
// ============================================================================

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// ============================================================================
// CONFIGURATION
// ============================================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// ============================================================================
// INITIALIZATION
// ============================================================================

let app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;
let initialized = false;

// Proxy exports that initialize on first access
export const db: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!_db) {
      throw new Error('Firebase not initialized. Call initializeFirebase() first.');
    }
    return (_db as any)[prop];
  }
});

export const auth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!_auth) {
      throw new Error('Firebase not initialized. Call initializeFirebase() first.');
    }
    return (_auth as any)[prop];
  }
});

/**
 * Check if Firebase is configured
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

/**
 * Initialize Firebase
 */
export async function initializeFirebase(): Promise<{
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
}> {
  if (initialized && app && _db && _auth) {
    return { app, db: _db, auth: _auth };
  }

  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Please set the VITE_FIREBASE_* environment variables.'
    );
  }

  try {
    app = initializeApp(firebaseConfig);
    _db = getFirestore(app);
    _auth = getAuth(app);

    // Enable offline persistence
    try {
      await enableIndexedDbPersistence(_db);
      console.log('Firebase offline persistence enabled');
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (error.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      } else {
        console.error('Error enabling persistence:', err);
      }
    }

    initialized = true;
    console.log('Firebase initialized successfully');

    return { app, db: _db, auth: _auth };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

/**
 * Get the Firestore instance
 */
export function getDb(): Firestore {
  if (!_db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return _db;
}

/**
 * Get the Auth instance
 */
export function getAuthInstance(): Auth {
  if (!_auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return _auth;
}

/**
 * Get the Firebase App instance
 */
export function getAppInstance(): FirebaseApp {
  if (!app) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return app;
}

// ============================================================================
// COLLECTION PATHS
// ============================================================================

export const COLLECTIONS = {
  USERS: 'users',
  CLASSES: 'classes',
  ROUNDS: 'rounds',
  FLOOR_BLOCKS: 'floorBlocks',
  TREAD_BLOCKS: 'treadBlocks',
  USAGE_HISTORY: 'usageHistory',
  POSITION_OVERRIDES: 'positionOverrides',
  FAVORITES: 'favorites',
  HIDDEN: 'hidden',
  EMBEDDINGS: 'embeddings',
} as const;

/**
 * Get user-specific collection path
 */
export function getUserCollection(userId: string, collection: keyof typeof COLLECTIONS): string {
  return `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS[collection]}`;
}

/**
 * Get shared collection path (for pre-computed data like embeddings)
 */
export function getSharedCollection(collection: 'EMBEDDINGS'): string {
  return `shared${COLLECTIONS[collection]}`;
}

/**
 * Collection path helpers for different data types
 */
export const COLLECTION_PATHS = {
  // User-specific collections
  classes: (userId: string) => `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.CLASSES}`,
  rounds: (userId: string) => `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ROUNDS}`,
  floorBlocks: (userId: string) => `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.FLOOR_BLOCKS}`,
  treadBlocks: (userId: string) => `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.TREAD_BLOCKS}`,
  usageHistory: (userId: string) => `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.USAGE_HISTORY}`,
  positionOverrides: (userId: string) => `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.POSITION_OVERRIDES}`,
  favorites: (userId: string) => `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.FAVORITES}`,
  hidden: (userId: string) => `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.HIDDEN}`,

  // Embedding collections
  blockEmbeddings: (userId: string) => `${COLLECTIONS.USERS}/${userId}/blockEmbeddings`,
  roundEmbeddings: (userId: string) => `${COLLECTIONS.USERS}/${userId}/roundEmbeddings`,

  // Shared embeddings (pre-computed for all users)
  sharedEmbeddings: 'sharedEmbeddings',
} as const;
