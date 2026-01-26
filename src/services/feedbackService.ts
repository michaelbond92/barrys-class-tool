// ============================================================================
// Feedback Service
// Stores and retrieves user feedback on generated classes for RLHF-style learning
// ============================================================================

export type PromptMatchRating = 'nailed' | 'close' | 'missed';
export type BarryVibesRating = 'definitely' | 'maybe' | 'no_way';

export interface GenerationFeedback {
  id: string;
  prompt: string;
  generatedClass: {
    rounds: Array<{
      roundNumber: number;
      duration: number;
      minutes: Array<{
        floor: string;
        tread: string;
      }>;
    }>;
  };
  promptMatch: PromptMatchRating;
  barryVibes: BarryVibesRating;
  notes?: string;
  timestamp: string;
  // Parsed constraints for analysis
  parsedConstraints?: {
    round1?: Record<string, unknown>;
    round2?: Record<string, unknown>;
  };
}

export interface FeedbackStats {
  total: number;
  promptMatch: {
    nailed: number;
    close: number;
    missed: number;
  };
  barryVibes: {
    definitely: number;
    maybe: number;
    no_way: number;
  };
  // Patterns we can learn from
  successfulPromptPatterns: string[];
  problematicPromptPatterns: string[];
}

const FEEDBACK_STORAGE_KEY = 'barrys_generation_feedback';

// ============================================================================
// STORAGE
// ============================================================================

export function saveFeedback(feedback: GenerationFeedback): void {
  const existing = loadAllFeedback();
  existing.push(feedback);
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existing));
}

export function loadAllFeedback(): GenerationFeedback[] {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function clearAllFeedback(): void {
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);
}

// ============================================================================
// ANALYSIS
// ============================================================================

export function calculateFeedbackStats(): FeedbackStats {
  const feedback = loadAllFeedback();

  const stats: FeedbackStats = {
    total: feedback.length,
    promptMatch: { nailed: 0, close: 0, missed: 0 },
    barryVibes: { definitely: 0, maybe: 0, no_way: 0 },
    successfulPromptPatterns: [],
    problematicPromptPatterns: [],
  };

  for (const f of feedback) {
    stats.promptMatch[f.promptMatch]++;
    stats.barryVibes[f.barryVibes]++;

    // Track successful patterns (nailed + definitely)
    if (f.promptMatch === 'nailed' && f.barryVibes === 'definitely') {
      stats.successfulPromptPatterns.push(f.prompt);
    }

    // Track problematic patterns (missed or no_way)
    if (f.promptMatch === 'missed' || f.barryVibes === 'no_way') {
      stats.problematicPromptPatterns.push(f.prompt);
    }
  }

  return stats;
}

// ============================================================================
// SAMPLE PROMPTS
// ============================================================================

export const SAMPLE_PROMPTS: string[] = [
  // Full structured prompts - rounds sum to 20-21 min (×2 for swap = 40-42 min class)
  "Generate me a program, 2 rounds 12 minutes and 8 minutes, first round is a push and second is pull. I want to do deadlifts, back and snatches in the second round and I want to do incline on round 1 and not on round two.",

  "Generate me a program, 2 rounds 14 minutes and 6 minutes, Heavies in Round 1 and Mediums in Round 2. Chest back and legs in round 1 and round 2 I want to be compound movement focused. On the tread, incline round 2, endurance runs for round 1",

  "2 rounds, 10 minutes and 10 minutes. Push in round 1 with chest and shoulders. Pull in round 2 with back and biceps. Heavies throughout. Incline on both rounds.",

  "Generate a class, 2 rounds 13 minutes and 8 minutes. First round is legs with squats and lunges, second round is power focused with snatches and cleans. Endurance runs for round 1, sprints for round 2.",

  "2 rounds 12 minutes and 9 minutes. Round 1 is hinge focused with deadlifts and RDLs, round 2 is push with chest press and shoulder work. Mediums in round 1, heavies in round 2. Incline round 1 only.",

  "Generate me a program, 2 rounds 11 minutes and 9 minutes. First round push with chest and triceps. Second round pull with back and rows. I want burpees in the second round. Endurance tread round 1, incline round 2.",

  "2 rounds, 14 minutes and 7 minutes. Legs in round 1 with goblet squats and lunges. Core and arms in round 2. Mediums in round 1, lights in round 2. Flat tread both rounds.",

  "Generate a class, 2 rounds 11 minutes and 10 minutes. Push focused round 1 with incline press and shoulder press. Pull focused round 2 with rows and curls. Compound movements in round 1. Incline tread round 1, not on round 2.",

  "2 rounds 15 minutes and 6 minutes. First round is full body with chest back and legs. Second round is compound movement focused with clean to press and squat to press. Heavies round 1, mediums round 2. Endurance runs round 1.",

  "Generate me a program, 2 rounds 12 minutes and 8 minutes. Round 1 is pull with back and biceps, round 2 is push with chest and triceps. I want snatches in round 1 and burpees in round 2. Incline both rounds.",

  "2 rounds, 14 minutes and 6 minutes. Legs and glutes in round 1 with squats, lunges, and deadlifts. Power finisher in round 2 with thrusters and snatches. Heavies in round 1. Incline round 1, sprints round 2.",

  "Generate a class, 2 rounds 10 minutes and 10 minutes. Push in round 1 with heavies, pull in round 2 with mediums. Chest and shoulders round 1, back and arms round 2. Compound focus in both rounds. Endurance tread round 1, incline round 2.",

  "2 rounds 13 minutes and 8 minutes. First round hinge and pull with deadlifts and rows. Second round push and legs with press and squats. Mediums throughout. Incline on round 1 and not on round two.",

  "Generate me a program, 2 rounds 14 minutes and 7 minutes. Round 1 is upper body push with chest press and shoulder work. Round 2 is upper body pull with rows and curls. I want clean to press in round 2. Heavies round 1, mediums round 2. Endurance runs for round 1.",

  "2 rounds, 12 minutes and 8 minutes. Legs in round 1 with squats, lunges, and glute bridges. Arms and core in round 2 with biceps, triceps, and planks. Mediums in round 1, lights in round 2. Incline round 1, flat round 2.",

  "Generate a class, 2 rounds 15 minutes and 6 minutes. Full body compound in round 1 with squat to press and deadlift to row. Power focused round 2 with snatches and burpees. Heavies in round 1. Endurance tread round 1, sprints round 2.",

  "2 rounds 11 minutes and 9 minutes. Push workout round 1 with chest and triceps focus. Pull workout round 2 with back and bicep focus. Compound movements in round 1. Incline on round 1 and not on round two.",

  "Generate me a program, 2 rounds 13 minutes and 7 minutes. First round is hinge focused with RDLs and deadlifts. Second round is power focused with clean to press and KB swings. Heavies round 1, mediums round 2. Incline tread round 1.",

  "2 rounds, 11 minutes and 10 minutes. Chest back and shoulders in round 1. Legs and core in round 2. I want rows and chest press in round 1. Mediums throughout. Endurance runs round 1, incline round 2.",

  "Generate a class, 2 rounds 12 minutes and 9 minutes. Push in round 1 with heavies and compound focus. Pull in round 2 with mediums and isolation work. Incline both rounds. I want snatches as finisher in round 2.",
];

export function getRandomPrompt(): string {
  return SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
}

// ============================================================================
// FEEDBACK EXPORT (for analysis)
// ============================================================================

export function exportFeedbackAsJSON(): string {
  const feedback = loadAllFeedback();
  return JSON.stringify(feedback, null, 2);
}

export function exportFeedbackAsCSV(): string {
  const feedback = loadAllFeedback();
  if (feedback.length === 0) return '';

  const headers = ['id', 'timestamp', 'prompt', 'promptMatch', 'barryVibes', 'notes'];
  const rows = feedback.map(f => [
    f.id,
    f.timestamp,
    `"${f.prompt.replace(/"/g, '""')}"`,
    f.promptMatch,
    f.barryVibes,
    f.notes ? `"${f.notes.replace(/"/g, '""')}"` : '',
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
