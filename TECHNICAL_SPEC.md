# Barry's Class Programming Tool - Technical Specification

> **Purpose**: Detailed technical reference for data models, taxonomies, detection patterns, and algorithms.
>
> **Related Docs:**
> - `PRD.md` — Product requirements and user stories
> - `PROJECT_HANDOFF.md` — Priorities and implementation roadmap
> - `IMPLEMENTATION_GUIDE.md` — Current implementation details

---

## Table of Contents
1. [Three-Level Data Hierarchy](#three-level-data-hierarchy)
2. [Position Taxonomy](#position-taxonomy)
3. [Equipment Taxonomy](#equipment-taxonomy)
4. [Rep Classification](#rep-classification)
5. [TypeScript Interfaces](#typescript-interfaces)
6. [Detection Patterns](#detection-patterns)
7. [Flow Scoring Algorithm](#flow-scoring-algorithm)
8. [Data Analysis Results](#data-analysis-results)

---

## Three-Level Data Hierarchy

### Overview

The data model has three levels, each capturing different granularity:

| Level | Unit | Duration | What It Captures |
|-------|------|----------|------------------|
| **Round** | Class section | 8-14 min | Overall vibe, theme, finisher, tread profile |
| **Block** | Mini-arc | 2-4 min | Flow pattern, structure, body focus |
| **Exercise** | Single minute | 1 min | Specific movement, modifiers, position |

### How They Relate

```
ROUND (10 minutes, Push/Pull focused, ends with Snatches)
├── BLOCK 1 - Warmup (3 min, floor_laying dominant)
│   ├── Minute 0-1: WGS to Pushup (floor_laying)
│   ├── Minute 1-2: Good Morning to Squat (floor_standing)
│   └── Minute 2-3: Fast Feet | Burpees (floor_standing → floor_laying)
├── BLOCK 2 - Chest Focus (4 min, bench_laying dominant)
│   ├── Minute 3-4: R/L/D Chest Press (bench_laying)
│   ├── Minute 4-5: Wide to Hammer | Just Hammer (bench_laying)
│   ├── Minute 5-6: Tempo Chest Press (bench_laying)
│   └── Minute 6-7: Chest Press Burnout (bench_laying)
└── BLOCK 3 - Finisher (3 min, floor_standing dominant)
    ├── Minute 7-8: Heavy Deadlift (floor_standing)
    ├── Minute 8-9: 3 Deadlift 1 Squat (floor_standing)
    └── Minute 9-10: Squat to Hi Pull | Snatches (floor_standing) ← FINISHER
```

### Benefits

1. **Multi-granularity search**: Query at round, block, or exercise level
2. **Precise filtering**: "Find a round with a tempo deadlift BLOCK in the middle"
3. **Grip load tracking**: Sum grip demand at exercise → block → round
4. **Freshness at every level**: Track usage of exercises, blocks, AND rounds
5. **Embeddings at right level**: Match "vibe" at round or block level

---

## Position Taxonomy

### Position Types

```typescript
type ExercisePosition = 
  // FLOOR (left side of bench)
  | 'floor_standing'     // 61.5% - Most exercises: squats, lunges, curls, deadlifts
  | 'floor_laying'       // 20.4% - Planks, pushups, mountain climbers, WGS
  
  // BENCH
  | 'bench_laying'       // 14.3% - Chest press, skull crushers, toe touches, crunches
  | 'bench_sitting'      // 2.7%  - Russian twists, boat pose, situps
  | 'bench_front'        // 0.2%  - Box squats, hip thrusts, concentration curls
  | 'bench_back'         // 0.5%  - Spider crunches, spiderman pushups
  | 'bench_straddling'   // 0.5%  - Bent over rows straddling bench
  | 'bench_standing';    // Rare  - Elevated lunges, step ups
```

### Position Frequency (from 49 Total Body classes)

| Position | Count | % |
|----------|-------|---|
| floor_standing | 785 | 61.5% |
| floor_laying | 260 | 20.4% |
| bench_laying | 182 | 14.3% |
| bench_sitting | 35 | 2.7% |
| bench_back | 6 | 0.5% |
| bench_straddling | 6 | 0.5% |
| bench_front | 3 | 0.2% |

### Transition Cost Matrix

Transitions are weighted by physical disruption:
- **0** = Same position or negligible movement
- **1** = Minor adjustment (same zone)
- **2** = Moderate transition
- **3** = Major transition (disruptive)

```typescript
const TRANSITION_COSTS: Record<ExercisePosition, Record<ExercisePosition, number>> = {
  bench_laying: {
    bench_laying: 0,
    bench_sitting: 1,      // Just sit up
    bench_front: 1,        // Swing legs around
    bench_back: 2,         // Flip over, move to back
    bench_straddling: 2,   // Get up, straddle
    bench_standing: 3,     // Stand ON bench - awkward
    floor_laying: 2,       // Get off bench, get on floor
    floor_standing: 2,     // Get off bench, stand
  },
  bench_sitting: {
    bench_laying: 1,       // Lay back down
    bench_sitting: 0,
    bench_front: 1,        // Scoot to front
    bench_back: 2,         // Move to back
    bench_straddling: 1,   // Swing legs over
    bench_standing: 3,     // Stand ON bench
    floor_laying: 2,       // Get off, get down
    floor_standing: 2,     // Get off, stand
  },
  bench_front: {
    bench_laying: 1,
    bench_sitting: 1,
    bench_front: 0,
    bench_back: 2,
    bench_straddling: 2,
    bench_standing: 3,
    floor_laying: 2,
    floor_standing: 1,     // Just step back
  },
  bench_back: {
    bench_laying: 2,
    bench_sitting: 2,
    bench_front: 2,
    bench_back: 0,
    bench_straddling: 1,   // Nearby position
    bench_standing: 3,
    floor_laying: 1,       // Already near floor
    floor_standing: 1,     // Stand up from back
  },
  bench_straddling: {
    bench_laying: 2,
    bench_sitting: 1,
    bench_front: 2,
    bench_back: 1,
    bench_straddling: 0,
    bench_standing: 3,
    floor_laying: 2,
    floor_standing: 1,     // Just stand up
  },
  bench_standing: {
    bench_laying: 3,
    bench_sitting: 3,
    bench_front: 2,
    bench_back: 3,
    bench_straddling: 3,
    bench_standing: 0,
    floor_laying: 3,
    floor_standing: 2,     // Just step down
  },
  floor_laying: {
    bench_laying: 2,
    bench_sitting: 2,
    bench_front: 2,
    bench_back: 1,         // Already near bench back
    bench_straddling: 2,
    bench_standing: 3,
    floor_laying: 0,
    floor_standing: 1,     // Just stand up
  },
  floor_standing: {
    bench_laying: 2,
    bench_sitting: 2,
    bench_front: 1,        // Step to bench front
    bench_back: 1,         // Step to bench back
    bench_straddling: 2,
    bench_standing: 3,     // Step onto bench - most disruptive
    floor_laying: 1,       // Get down
    floor_standing: 0,
  },
};
```

### Key Transition Rules

1. **Cheap transitions (cost 0-1)**:
   - Within same zone (floor ↔ floor, bench ↔ bench nearby)
   - bench_laying ↔ bench_sitting (just sitting up/lying down)
   - floor_laying ↔ floor_standing (just standing up/getting down)

2. **Moderate transitions (cost 2)**:
   - floor ↔ bench (getting on/off the bench)
   - Across bench positions (front ↔ back)

3. **Expensive transitions (cost 3)**:
   - Anything → bench_standing (stepping onto bench)
   - bench_standing → anything except floor_standing

---

## Equipment Taxonomy

### Weight Equipment

```typescript
type WeightType = 'heavy' | 'medium' | 'light';
type WeightCount = 1 | 2;

interface WeightEquipment {
  type: WeightType;
  count: WeightCount;
}
```

### Bench Setup

```typescript
type BenchSetup = 
  | 'flat'      // Standard bench position
  | 'incline'   // +1 riser at back
  | 'mega';     // +2 risers at back
```

### Accessories

```typescript
type Accessory = 'booty_band' | 'long_band' | 'mini_band';
```

### Complete Equipment Set (Round-Level)

```typescript
interface EquipmentSet {
  primary: WeightEquipment;           // e.g., { type: 'heavy', count: 2 }
  secondary?: WeightEquipment;        // e.g., { type: 'medium', count: 1 }
  accessory?: Accessory;
  benchSetup: BenchSetup;
}
```

### Equipment Variations (from data)

| Equipment | Occurrences |
|-----------|-------------|
| 2 Heavies | 47 |
| 2 Heavy Dumbbells | 15 |
| 2 Mediums | 7 |
| 1 Heavy DB | 6 |
| 2 Heavy Dumbbells + 1 Long Band | 5 |
| 1 Heavy + 2 Mediums | 2 |
| 2 Heavies + 1 Mini Band | 2 |

### Equipment Rules

1. **Equipment is set at round level** — all blocks in a round use the same equipment
2. **Bench setup is set at round start** — cannot change mid-round
3. **Blocks are filtered by equipment compatibility**

---

## Rep Classification

### Rep Structure Types

```typescript
type RepClassification = 
  | 'fixed'      // Fixed rep count: "12 Squats", "3 GM 3 Squats"
  | 'amrap'      // As Many Rounds As Possible
  | 'burnout'    // Rep out / burn out / to failure
  | 'tempo'      // Slow/controlled reps
  | 'hold'       // Isometric hold
  | 'ladder'     // Progressive reps (+1, -1, pyramid)
  | 'timed';     // Time-based (e.g., "30 seconds")
```

### Rep Classification Frequency (from data)

| Classification | Count | % |
|----------------|-------|---|
| fixed | 758 | 72% |
| burnout | 121 | 12% |
| tempo | 64 | 6% |
| hold | 59 | 6% |
| ladder | 42 | 4% |
| amrap | 6 | <1% |

### Rep Scheme Structure

```typescript
interface RepScheme {
  type: 'fixed' | 'descending' | 'ascending' | 'ladder' | 'triplet';
  pattern: string;    // "3-3-3", "6-4-2", "12", "+1"
  totalReps?: number;
}
```

---

## TypeScript Interfaces

### Level 1: Round Metadata

```typescript
interface RoundMetadata {
  // ===== IDENTITY =====
  id: string;
  sourceDate: string;
  sourceSheet: string;
  roundNumber: 1 | 2;
  
  // ===== STRUCTURE =====
  duration: number;                    // 8-14 minutes
  equipment: EquipmentSet;
  blockIds: string[];
  blockCount: number;
  
  // ===== TREAD PROFILE =====
  treadPattern: TreadPattern;
  sprintCount: number;
  recoverCount: number;
  hasIncline: boolean;
  maxIncline: number;
  treadAverage: number;
  
  // ===== FLOOR PROFILE (aggregated) =====
  primaryBodyFocus: BodyFocus[];
  movementPatterns: MovementPattern[];
  dominantPosition: ExercisePosition;
  positionSequence: ExercisePosition[];
  flowScore: number;
  gripLoadScore: number;
  hasGripBreaks: boolean;
  finisherType: FinisherType;
  finisherExercise: string;
  
  // ===== FOR EMBEDDINGS =====
  exerciseSequence: string;
  embedding?: number[];
  
  // ===== FRESHNESS =====
  lastUsed: Date | null;
  useCount: number;
  useDates: Date[];
}

type TreadPattern = 
  | 'progressive_build'
  | 'slingshot'
  | 'intervals'
  | 'incline_heavy'
  | 'recovery_heavy'
  | 'sprint_focused'
  | 'balanced';

type FinisherType = 
  | 'snatches'
  | 'burpees'
  | 'weighted_burpees'
  | 'squat_to_hi_pull'
  | 'deadlift_clean_squat'
  | 'db_swings'
  | 'amrap'
  | 'choice';
```

### Level 2: Block Metadata

```typescript
interface BlockMetadata {
  // ===== IDENTITY =====
  id: string;
  content: string[];
  length: 2 | 3 | 4;
  category: 'warmups' | 'workouts';
  
  // ===== EXISTING TAGS =====
  structure: StructureTag[];
  movement: MovementTag[];
  bodyFocus: BodyFocus[];
  intensity: Intensity;
  
  // ===== POSITION =====
  positions: ExercisePosition[];       // All positions in this block
  dominantPosition: ExercisePosition;  // Most common position
  positionSequence: ExercisePosition[];
  
  // ===== FLOW =====
  flowScore: number;
  totalTransitionCost: number;
  hasExcessiveTransitions: boolean;
  
  // ===== CHARACTERISTICS =====
  typicalPosition: 'early' | 'middle' | 'late' | 'finisher';
  arcType: 'build' | 'steady' | 'peak' | 'recovery';
  isRightSideBlock: boolean;
  isLeftSideBlock: boolean;
  hasSameKeyword: boolean;
  hasChoiceKeyword: boolean;
  
  // ===== LOAD =====
  movementPatterns: MovementPattern[];
  gripLoadScore: number;
  gripIntensiveMinutes: number;
  
  // ===== EQUIPMENT =====
  requiredEquipment: BlockEquipment;
  
  // ===== FOR EMBEDDINGS =====
  exerciseSequence: string;
  embedding?: number[];
  
  // ===== FRESHNESS =====
  lastUsed: Date | null;
  useCount: number;
}

type StructureTag = 'amrap' | 'tempo' | 'drop_set' | 'hold_pulse' | 
                    'superset' | 'ladder' | 'rep_scheme' | 'same_side';

type MovementTag = 'compound' | 'isolation' | 'power_explosive' | 'mobility';

type BodyFocus = 'upper' | 'lower' | 'core' | 'full_body' | 
                 'chest' | 'back' | 'shoulders' | 'arms';

type Intensity = 'high' | 'medium' | 'low';
```

### Level 3: Exercise Metadata

```typescript
interface ExerciseMetadata {
  // ===== IDENTITY =====
  id: string;
  rawText: string;
  exercises: string[];
  
  // ===== POSITIONS (Option B: All positions) =====
  positions: ExercisePosition[];
  primaryPosition: ExercisePosition;
  hasPositionTransition: boolean;
  
  // ===== BODY TARGETING =====
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  movementPattern: MovementPattern;
  
  // ===== MODIFIERS =====
  modifiers: ExerciseModifiers;
  
  // ===== REP STRUCTURE =====
  repClassification: RepClassification;
  repScheme?: RepScheme;
  
  // ===== LOAD =====
  gripDemand: 'high' | 'medium' | 'low' | 'none';
  isFinisherMove: boolean;
  isPowerMove: boolean;
  hasComboMovement: boolean;  // Chains 2+ movements (e.g., "Squat to Press")

  // ===== TIMING STRUCTURE =====
  isEMOM: boolean;                    // Every Minute On the Minute format
  emomNotation?: 'double_slash' | 'parentheses';
  splitType?: '30_30' | '45_15';      // Split timing between exercises
  ladder?: {
    type: 'ascending' | 'descending';
    increment: number;
    target?: string;
    isTargeted: boolean;
  };

  // ===== CONTEXT =====
  minuteInBlock: number;
  isBlockFinisher: boolean;
  
  // ===== FRESHNESS =====
  lastUsed: Date | null;
  useCount: number;
}

interface ExerciseModifiers {
  tempo: boolean;
  alternating: boolean;
  burnout: boolean;
  hold: boolean;
  pulse: boolean;
  heavy: boolean;
  wide: boolean;
  narrow: boolean;
  singleArm: boolean;
  incline: boolean;
  unilateral: 'right' | 'left' | 'both' | null;
}

type MovementPattern = 
  | 'push'       // Chest Press, Pushups, Shoulder Press, Tricep
  | 'pull'       // Row, Curl, Pullover, High Pull
  | 'hinge'      // Deadlift, Good Morning, RDL, Swing
  | 'squat'      // Squat, Goblet, Sumo
  | 'lunge'      // Lunges, Curtsy, Reverse Lunge
  | 'rotation'   // Russian Twist, Woodchop
  | 'carry'      // Farmer carry, Suitcase carry
  | 'plank'      // Plank, Mountain Climbers, Commandos
  | 'power';     // Snatch, Clean, Burpee, Jump

type MuscleGroup = 
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves'
  | 'core' | 'obliques'
  | 'full_body';
```

---

## Detection Patterns

### Position Detection

```typescript
const POSITION_PATTERNS: Record<ExercisePosition, RegExp[]> = {
  bench_laying: [
    /chest\s*press/i,
    /skull\s*crush/i,
    /pullover/i,
    /lat\s*pull/i,
    /\bfly\b/i,
    /incline.*press/i,
    /close\s*grip.*press/i,
    /wide.*press/i,
    /hammer.*press/i,
    /toe\s*touch/i,
    /jackknife/i,
    /jacknife/i,
    /suitcase\s*crunch/i,
    /leg\s*raise/i,
    /leg\s*lift/i,
    /crunch(?!.*spider)/i,
    /dead\s*bug/i,
    /hollow/i,
  ],
  
  bench_sitting: [
    /russian\s*twist/i,
    /boat\s*pose/i,
    /v\s*sit/i,
    /sit\s*up/i,
    /situp/i,
  ],
  
  bench_front: [
    /box\s*squat/i,
    /hip\s*thrust/i,
    /concentration\s*curl/i,
    /bench\s*squat/i,
  ],
  
  bench_back: [
    /spider/i,
    /spiderman/i,
  ],
  
  bench_straddling: [
    /straddle/i,
    /bench.*row/i,
  ],
  
  bench_standing: [
    /elevated.*lunge/i,
    /step\s*up/i,
  ],
  
  floor_laying: [
    /plank/i,
    /push\s*up/i,
    /pushup/i,
    /commando/i,
    /x\s*human/i,
    /mountain\s*climber/i,
    /\bmc\b/i,
    /hip\s*dip/i,
    /bird\s*dog/i,
    /cat\s*cow/i,
    /wgs/i,
    /world.*greatest/i,
    /down\s*dog/i,
    /\bdd\b/i,
    /shoulder\s*tap/i,
    /sprawl/i,
    /renegade/i,
    /\brr\b/i,
  ],
  
  floor_standing: [
    /squat(?!.*box|.*bench)/i,
    /deadlift/i,
    /\bdl\b/i,
    /lunge(?!.*elevated)/i,
    /snatch/i,
    /clean/i,
    /swing/i,
    /curl(?!.*concentration)/i,
    /bicep/i,
    /tricep.*ext/i,
    /\boh\b.*ext/i,
    /overhead.*ext/i,
    /shoulder.*press/i,
    /row(?!.*bench|.*renegade)/i,
    /good\s*morning/i,
    /\bgm\b/i,
    /rdl/i,
    /sdl/i,
    /high\s*pull/i,
    /hi\s*pull/i,
    /thruster/i,
    /lateral\s*raise/i,
    /front\s*raise/i,
    /upright.*row/i,
    /shrug/i,
    /reverse.*fly/i,
    /burpee/i,
  ],
};
```

### Movement Pattern Detection

```typescript
const MOVEMENT_PATTERNS: Record<MovementPattern, RegExp[]> = {
  push: [
    /chest\s*press/i,
    /push\s*up/i,
    /pushup/i,
    /shoulder\s*press/i,
    /tricep/i,
    /skull\s*crush/i,
    /close\s*grip/i,
    /incline\s*press/i,
    /overhead\s*press/i,
    /oh\s*press/i,
  ],
  
  pull: [
    /row/i,
    /curl/i,
    /pullover/i,
    /pull\s*over/i,
    /high\s*pull/i,
    /hi\s*pull/i,
    /lat\s*pull/i,
    /reverse\s*fly/i,
  ],
  
  hinge: [
    /deadlift/i,
    /\bdl\b/i,
    /rdl/i,
    /sdl/i,
    /good\s*morning/i,
    /\bgm\b/i,
    /swing/i,
    /hip\s*hinge/i,
  ],
  
  squat: [
    /squat/i,
    /goblet/i,
    /sumo/i,
    /front\s*rack/i,
  ],
  
  lunge: [
    /lunge/i,
    /curtsy/i,
    /split\s*squat/i,
    /step\s*up/i,
  ],
  
  rotation: [
    /russian\s*twist/i,
    /woodchop/i,
    /twist/i,
    /rotate/i,
  ],
  
  plank: [
    /plank/i,
    /mountain\s*climber/i,
    /\bmc\b/i,
    /commando/i,
    /shoulder\s*tap/i,
    /hip\s*dip/i,
  ],
  
  power: [
    /snatch/i,
    /clean/i,
    /burpee/i,
    /jump/i,
    /explosive/i,
    /power/i,
  ],
};
```

### Grip-Intensive Detection

```typescript
const GRIP_INTENSIVE_PATTERNS: RegExp[] = [
  /row/i,
  /deadlift/i,
  /\bdl\b/i,
  /rdl/i,
  /swing/i,
  /snatch/i,
  /clean/i,
  /curl/i,
  /pull/i,
  /carry/i,
  /farmer/i,
  /shrug/i,
];
```

### Finisher Detection

```typescript
const FINISHER_PATTERNS: { pattern: RegExp; type: FinisherType }[] = [
  { pattern: /burpee\s*snatch/i, type: 'snatches' },
  { pattern: /snatch/i, type: 'snatches' },
  { pattern: /weighted\s*burpee/i, type: 'weighted_burpees' },
  { pattern: /burpee/i, type: 'burpees' },
  { pattern: /hi\s*pull.*snatch|squat.*hi\s*pull/i, type: 'squat_to_hi_pull' },
  { pattern: /deadlift\s*clean\s*squat/i, type: 'deadlift_clean_squat' },
  { pattern: /db\s*swing|dumbbell\s*swing/i, type: 'db_swings' },
  { pattern: /amrap/i, type: 'amrap' },
  { pattern: /choice/i, type: 'choice' },
];
```

### Rep Classification Detection

```typescript
const REP_CLASSIFICATION_PATTERNS: Record<RepClassification, RegExp[]> = {
  amrap: [/amrap/i, /as\s*many/i],
  burnout: [/burn\s*out/i, /\bbo\b/i, /rep\s*out/i, /when\s*done/i],
  tempo: [/tempo/i, /slow/i, /controlled/i],
  hold: [/hold/i, /pause/i, /isometric/i, /:\s*hold/i],
  ladder: [/\+\d/, /-\d/, /\(\+/, /\(-/, /ladder/i, /pyramid/i],
  timed: [/\d+\s*sec/i, /\d+\s*seconds/i],
  fixed: [/^\d+\s+\w/],
};
```

### Modifier Detection

```typescript
const MODIFIER_PATTERNS: Record<keyof ExerciseModifiers, RegExp> = {
  tempo: /tempo/i,
  alternating: /\balt\b|alternating/i,
  burnout: /\bbo\b|burn\s*out|rep\s*out/i,
  hold: /hold|pause/i,
  pulse: /pulse/i,
  heavy: /heavy/i,
  wide: /wide/i,
  narrow: /narrow|close\s*grip/i,
  singleArm: /single\s*arm|\b1\s*arm/i,
  incline: /incline/i,
};
```

### Combo Movement Detection

A **combo movement** chains 2+ movements into one flowing exercise (e.g., "Squat to Press", "Deadlift to Squat to Lunge").

#### Detection Algorithm

1. **Clean the text first:**
   - Remove `(+1)`, `(-1)`, etc. patterns: `/\s*\([+-]\d+\)\s*/g`
   - Extract content from `(X when done)` parentheses and include it in detection (combos can be conditional)

2. **Split into segments** using: `|`, `/` (but NOT `when done` since handled above)

3. **For each segment**, check for combo pattern: `/\b\w+\s+to\s+\w+\b/i`

4. **Exclude false positives** — these are NOT combos:

```typescript
const COMBO_FALSE_POSITIVES: RegExp[] = [
  /toe\s*touch/i,           // toe touch / toe touches
  /side\s+to\s+side/i,      // side to side
  /back\s+to\s+back/i,      // back to back
  /up\s+to\s+\d/i,          // up to [number]
  /down\s+to\s+\d/i,        // down to [number]
  /go\s+to\b/i,             // go to
  /close\s+to\b/i,          // close to
  /to\s+failure/i,          // to failure
];
```

5. If **ANY segment** contains a valid combo pattern after exclusions, set `hasComboMovement: true`

#### Examples

| Text | Result | Reason |
|------|--------|--------|
| `"Squat to Press"` | `true` | Valid combo |
| `"Good Morning to Squat to Lunge"` | `true` | Triple combo |
| `"10 Barbell Curls (squat to press when done)"` | `true` | Combo inside parentheses |
| `"Lat Pullover (+1) to Crunch"` | `true` | Ignore the +1 |
| `"Wide Squats \| Walk out RR to Pushup"` | `true` | Combo in second segment |
| `"Chest Press \| Skull Crushers"` | `false` | No combo |
| `"Toe Touches \| Jacknifes"` | `false` | False positive (toe touch) |
| `"Side to Side Lunges"` | `false` | False positive (side to side) |

### EMOM Detection

**EMOM** (Every Minute On the Minute) format where exercises alternate each minute.

```typescript
isEMOM: boolean;
emomNotation?: 'double_slash' | 'parentheses';
```

#### Detection Logic

1. `//` = EMOM (double slash notation)
2. `Exercise (Exercise)` = EMOM when inner content is a valid exercise

#### EMOM Exclusions (NOT EMOM)

```typescript
const EMOM_EXCLUSIONS: RegExp[] = [
  /\(when\s+done\)/i,         // (when done)
  /\(finished\)/i,            // (finished)
  /\(done\)/i,                // (done)
  /\(optional[^)]*\)/i,       // (optional...)
  /\([+-]\d+\)/,              // (+1), (-2) - ladders
  /\([+-]\d+\s+to\s+\w+\)/i,  // (+1 to Squat) - targeted ladders
  /\(hold\)/i,                // (hold)
  /\(ladder\)/i,              // (ladder)
  /\([rl]\/[ld]\)/i,          // (r/l), (R/L/D)
  /\([rl]\)/i,                // (R), (L)
  /\(\d+\s+or\s+\d+\)/i,      // (8 or 12) - rep choices
  /\(core\)/i,                // Body part labels
  /\(biceps?\)/i,
  /\([^,)]+,\s*[^,)]+\)/i,    // Choices with commas: (MC, Snatches, Burpees)
];
```

#### Examples

| Text | isEMOM | Notation |
|------|--------|----------|
| `"Chest Press // Rows"` | `true` | `double_slash` |
| `"Chest Press (Squats)"` | `true` | `parentheses` |
| `"Curls (Pushups)"` | `true` | `parentheses` |
| `"Squats (when done)"` | `false` | - |
| `"Chest Press (+1)"` | `false` | - |
| `"Squats (CORE)"` | `false` | - |
| `"Choice (MC, Snatches)"` | `false` | - |

### Split Timing Detection

Detects how a minute is split between multiple exercises.

```typescript
splitType?: '30_30' | '45_15';
```

#### Detection Logic

- `|` = 30/30 split (30 seconds each exercise)
- `/` = 45/15 split (when between exercises, NOT R/L/D notation)

#### Examples

| Text | Split Type | Notes |
|------|------------|-------|
| `"Chest Press \| Rows"` | `30_30` | Pipe separator |
| `"Squats / Lunges"` | `45_15` | Slash between exercises |
| `"Lunges R/L"` | `undefined` | R/L notation, not split |
| `"Plain Squats"` | `undefined` | No split |

### Ladder Detection

Detects progressive rep schemes that increase or decrease.

```typescript
ladder?: {
  type: 'ascending' | 'descending';
  increment: number;
  target?: string;      // Specific exercise if targeted
  isTargeted: boolean;  // Whether only one exercise changes
};
```

#### Detection Logic

- `(-X)` = descending ladder, decrement by X each round
- `(+X)` = ascending ladder, increment by X each round
- `(+X to Y)` or `(-X to Y)` = targeted ladder, only Y exercise changes

#### Examples

| Text | Type | Increment | Target | isTargeted |
|------|------|-----------|--------|------------|
| `"8 Chest Press 8 Squats (-2)"` | `descending` | 2 | - | `false` |
| `"2 Rows 2 RR (+2)"` | `ascending` | 2 | - | `false` |
| `"4 Chest Press 4 Squats (+1 to Squat)"` | `ascending` | 1 | `"Squat"` | `true` |

### Block-Level Structure Tags

Blocks inherit structure tags when ANY exercise in the block has that characteristic.

```typescript
type StructureTag =
  | 'emom'
  | 'ladder_ascending'
  | 'ladder_descending'
  | 'split_30_30'
  | 'split_45_15'
  | 'combo_movement'
  | 'amrap'
  | 'tempo'
  | 'drop_set'
  | 'hold_pulse'
  | 'superset'
  | 'rep_scheme'
  | 'same_side';
```

---

## Flow Scoring Algorithm

### Flow Score Calculation

```typescript
interface FlowScore {
  score: number;                    // 0-100
  rating: 'great' | 'good' | 'fair' | 'poor';
  totalTransitionCost: number;
  uniquePositions: number;
  warnings: string[];
}

function calculateFlowScore(positions: ExercisePosition[]): FlowScore {
  let totalCost = 0;
  const warnings: string[] = [];
  
  // Calculate total transition cost
  for (let i = 1; i < positions.length; i++) {
    const cost = TRANSITION_COSTS[positions[i-1]][positions[i]];
    totalCost += cost;
    
    if (cost === 3) {
      warnings.push(`Major transition: ${positions[i-1]} → ${positions[i]}`);
    }
  }
  
  // Flag bench_standing usage
  if (positions.includes('bench_standing')) {
    warnings.push('Includes bench_standing (standing on bench)');
    totalCost += 5; // Extra penalty
  }
  
  const uniquePositions = new Set(positions).size;
  
  // Score calculation
  let score = 100;
  score -= totalCost * 5;                           // Each cost point = -5
  score -= Math.max(0, uniquePositions - 3) * 10;   // >3 unique = -10 each
  
  score = Math.max(0, Math.min(100, score));
  
  // Rating
  let rating: FlowScore['rating'];
  if (score >= 85) rating = 'great';
  else if (score >= 70) rating = 'good';
  else if (score >= 50) rating = 'fair';
  else rating = 'poor';
  
  return { score, rating, totalTransitionCost: totalCost, uniquePositions, warnings };
}
```

### Flow Thresholds (from data analysis)

| Metric | Great | Good | Fair | Poor |
|--------|-------|------|------|------|
| Flow Score | 85+ | 70-84 | 50-69 | <50 |
| Unique Positions | 1-2 | 3 | 4 | 5+ |
| Total Transition Cost | 0-4 | 5-8 | 9-12 | 13+ |

---

## Data Analysis Results

### From 49 Total Body Classes

**Round Duration Patterns:**
| Duration | Count | % |
|----------|-------|---|
| R1=12min, R2=8min | 23 | 47% |
| R1=11min, R2=9min | 17 | 35% |
| R1=14min, R2=6min | 4 | 8% |
| R1=13min, R2=7min | 4 | 8% |

**Unique Positions per Round:**
| Unique | Count | % |
|--------|-------|---|
| 1 | 15 | 11% |
| 2 | 69 | 53% |
| 3 | 44 | 34% |
| 4+ | 3 | 2% |

**Multi-Position Minutes:**
- 217 exercises (17%) have transitions within a single minute
- Most common: `floor_laying → floor_standing` (pushups to squats)

**Exercise Modifier Frequency:**
| Modifier | Count |
|----------|-------|
| Alternating | 107 |
| Tempo | 91 |
| Burnout | 81 |
| Just (isolate) | 63 |
| Pulse | 57 |
| Hold | 55 |
| Close/Narrow | 45 |
| Heavy | 32 |
| Single Arm | 30 |
| Wide | 23 |

---

## localStorage Keys

**Current:**
```
barrys_custom_blocks      — User's custom blocks
barrys_block_manual_tags  — Manually added tags
```

**To Add:**
```
barrys_round_index        — Indexed round metadata
barrys_block_index        — Enhanced block metadata  
barrys_exercise_index     — Exercise-level metadata
barrys_usage_history      — Usage tracking at all levels
barrys_version_history    — Version history for edits
barrys_embeddings         — Cached embeddings (future)
```

---

*Document Version: 1.0*
*Last Updated: January 2025*
