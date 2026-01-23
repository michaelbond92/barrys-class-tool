// Exercise blocks based on analysis of real Barry's classes
// Each block maintains position consistency (no awkward transitions)

export type BlockType =
  | 'warmup_bodyweight'  // Round 1 only - no weights
  | 'warmup_weighted'    // Round 2+ - can have weights
  | 'chest'              // Lying on bench
  | 'back_rows'          // Bent over position
  | 'deadlift'           // Standing, hinge pattern
  | 'squat'              // Standing, squat pattern
  | 'lunge'              // Standing, single leg
  | 'core'               // On back/bench
  | 'arms'               // Standing or seated
  | 'power_finisher';    // Standing, explosive

export interface ExerciseBlock {
  type: BlockType;
  name: string;
  position: 'lying' | 'bent_over' | 'standing' | 'floor';
  duration: number; // minutes
  exercises: BlockExercise[];
  startsOnRecover: boolean; // Does this block start with a RECOVER on tread?
}

export interface BlockExercise {
  minute: number; // relative minute within block (0, 1, 2...)
  floor: string;
  treadPattern: 'recover' | 'build' | 'push' | 'incline' | 'sprint';
  notes?: string;
}

// ============================================
// WARMUP BLOCKS (Round 1 - Bodyweight Only)
// ============================================

export const WARMUP_BODYWEIGHT_BLOCKS: ExerciseBlock[] = [
  {
    type: 'warmup_bodyweight',
    name: 'WGS Flow',
    position: 'floor',
    duration: 3,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'WGS to Pushup', treadPattern: 'build' },
      { minute: 1, floor: 'Good Morning to Squat to Lunges', treadPattern: 'build' },
      { minute: 2, floor: 'Shoulder Taps | Mountain Climbers', treadPattern: 'push' }
    ]
  },
  {
    type: 'warmup_bodyweight',
    name: 'GM Squat Flow',
    position: 'floor',
    duration: 3,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: '3 Good Morning to 3 Squat', treadPattern: 'build' },
      { minute: 1, floor: 'WGS Add Pushups', treadPattern: 'build' },
      { minute: 2, floor: 'Plank Jacks | Burpees', treadPattern: 'push' }
    ]
  },
  {
    type: 'warmup_bodyweight',
    name: 'Pushup Ladder',
    position: 'floor',
    duration: 3,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: '2 GM 2 Squats 2 Lunges', treadPattern: 'build' },
      { minute: 1, floor: '4 Pushups 2 Commandos to 1 Pike', treadPattern: 'build' },
      { minute: 2, floor: 'Fast Feet | Burpees', treadPattern: 'push' }
    ]
  },
  {
    type: 'warmup_bodyweight',
    name: 'Squat Hold Flow',
    position: 'floor',
    duration: 3,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'WGS to Pushup', treadPattern: 'build' },
      { minute: 1, floor: '2 GM to Squats to Lunges', treadPattern: 'build' },
      { minute: 2, floor: 'Squat : Hold | Burpees', treadPattern: 'push' }
    ]
  },
  {
    type: 'warmup_bodyweight',
    name: 'Core Warmup',
    position: 'floor',
    duration: 3,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'Good Morning to WGS', treadPattern: 'build' },
      { minute: 1, floor: '2 Lunges to 3 Squats to 4 Pushups', treadPattern: 'build' },
      { minute: 2, floor: 'X Human | Mountain Climbers', treadPattern: 'push' }
    ]
  }
];

// ============================================
// WARMUP BLOCKS (Round 2+ - Can Have Weights)
// ============================================

export const WARMUP_WEIGHTED_BLOCKS: ExerciseBlock[] = [
  {
    type: 'warmup_weighted',
    name: 'Row Start',
    position: 'bent_over',
    duration: 2,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Alt Rows', treadPattern: 'recover' },
      { minute: 1, floor: '4 Rows 4 Offset Pushups', treadPattern: 'push' }
    ]
  },
  {
    type: 'warmup_weighted',
    name: 'Chest Start',
    position: 'lying',
    duration: 2,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Alt Chest Press', treadPattern: 'recover' },
      { minute: 1, floor: '8 Chest Press 4 Suitcase Squats', treadPattern: 'push' }
    ]
  },
  {
    type: 'warmup_weighted',
    name: 'Curl Start',
    position: 'standing',
    duration: 2,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Bicep Curl to Cross Body Curls', treadPattern: 'recover' },
      { minute: 1, floor: '12 Curls (Squat to Press when done)', treadPattern: 'incline' }
    ]
  },
  {
    type: 'warmup_weighted',
    name: 'SDL Start',
    position: 'standing',
    duration: 2,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'L SDL to Reverse Lunge', treadPattern: 'build' },
      { minute: 1, floor: '3 Rows 3 Offset Pushups 3 Hi Pulls', treadPattern: 'push' }
    ]
  },
  {
    type: 'warmup_weighted',
    name: 'Deadlift Start',
    position: 'standing',
    duration: 2,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'Tempo Deadlift', treadPattern: 'build' },
      { minute: 1, floor: '1.5 Deadlift | Deadlift BO', treadPattern: 'push' }
    ]
  }
];

// ============================================
// CHEST BLOCKS (Lying Position)
// ============================================

export const CHEST_BLOCKS: ExerciseBlock[] = [
  {
    type: 'chest',
    name: 'Chest Press to Core',
    position: 'lying',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'R/L/D Chest Press', treadPattern: 'recover' },
      { minute: 1, floor: 'Wide to Close Grip | Rep Out', treadPattern: 'build' },
      { minute: 2, floor: 'Suitcase Crunch | Leg Lift', treadPattern: 'push' }
    ]
  },
  {
    type: 'chest',
    name: 'Chest Press Tempo',
    position: 'lying',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: '4 Alt 2 Double Chest Press', treadPattern: 'recover' },
      { minute: 1, floor: 'Tempo Chest Press | Burn Out', treadPattern: 'build' },
      { minute: 2, floor: 'Close Grip Leg Lift | Close Grip BO', treadPattern: 'push' }
    ]
  },
  {
    type: 'chest',
    name: 'Chest to Lat Pullover',
    position: 'lying',
    duration: 4,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'R/L/D Chest Press', treadPattern: 'recover' },
      { minute: 1, floor: 'Close Grip to Reverse Grip | Rep Out', treadPattern: 'build' },
      { minute: 2, floor: 'Lat Pullover to Situp to OH Tricep Ext', treadPattern: 'build' },
      { minute: 3, floor: 'Just Lat Pullover | Just OH Tricep Ext', treadPattern: 'push' }
    ]
  },
  {
    type: 'chest',
    name: 'Chest Press BO',
    position: 'lying',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Alt Chest Press', treadPattern: 'recover' },
      { minute: 1, floor: 'Chest Press BO | Suitcase Crunch', treadPattern: 'build' },
      { minute: 2, floor: 'Chest Press with Pulse | Rep Out', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// BACK/ROW BLOCKS (Bent Over Position)
// ============================================

export const BACK_BLOCKS: ExerciseBlock[] = [
  {
    type: 'back_rows',
    name: 'Rows to Pushups',
    position: 'bent_over',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Alt Rows', treadPattern: 'recover' },
      { minute: 1, floor: '4 Alt Rows 4 RR 4 Pushups', treadPattern: 'build' },
      { minute: 2, floor: 'Just RR | Double Rows', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'back_rows',
    name: 'Gorilla Rows',
    position: 'bent_over',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: '3 Gorilla Rows e/s', treadPattern: 'recover' },
      { minute: 1, floor: '8-10 Squat to Hi Pulls (plank when done)', treadPattern: 'incline' },
      { minute: 2, floor: 'Alt Snatches | Burpee Snatches', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'back_rows',
    name: 'Row to Squat Flow',
    position: 'bent_over',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Alt Rows with Pulse', treadPattern: 'recover' },
      { minute: 1, floor: '2 Double Rows 2 Squats (+1)', treadPattern: 'build' },
      { minute: 2, floor: 'Tempo Wide Squat | DB Swings', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'back_rows',
    name: 'Single Arm Row Series',
    position: 'bent_over',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'L Arm Row', treadPattern: 'recover' },
      { minute: 1, floor: '4 Offset Pushups 4 Rows', treadPattern: 'incline' },
      { minute: 2, floor: 'R Squat to Hi Pull | Snatches', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// DEADLIFT BLOCKS (Standing Hinge)
// ============================================

export const DEADLIFT_BLOCKS: ExerciseBlock[] = [
  {
    type: 'deadlift',
    name: 'Deadlift to Squat',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Heavy Deadlift', treadPattern: 'recover' },
      { minute: 1, floor: '3 Deadlift 1 Squats | Deadlift Clean Squat', treadPattern: 'build' },
      { minute: 2, floor: '3 BO Rows', treadPattern: 'push' }
    ]
  },
  {
    type: 'deadlift',
    name: 'Deadlift Power',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Tempo Deadlift', treadPattern: 'recover' },
      { minute: 1, floor: '8 DB Swings 4 Goblet Squats', treadPattern: 'build' },
      { minute: 2, floor: 'Deadlift | Deadlift Clean Squat', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'deadlift',
    name: 'Deadlift to Lunge',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Heavy Deadlift', treadPattern: 'recover' },
      { minute: 1, floor: 'Deadlift | Deadlift to Reverse Lunges', treadPattern: 'build' },
      { minute: 2, floor: 'Same | Just Heavy Lunges', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'deadlift',
    name: 'Deadlift Row Combo',
    position: 'standing',
    duration: 4,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Tempo Deadlift', treadPattern: 'recover' },
      { minute: 1, floor: 'Alt Rows | R/L Double', treadPattern: 'build' },
      { minute: 2, floor: 'Wide Squats | Hold : Rep Out', treadPattern: 'build' },
      { minute: 3, floor: 'Squat Pulse Switch | DB Swings', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// SQUAT BLOCKS (Standing)
// ============================================

export const SQUAT_BLOCKS: ExerciseBlock[] = [
  {
    type: 'squat',
    name: 'Squat to Swings',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Heavy Squat with 3 second pause', treadPattern: 'recover' },
      { minute: 1, floor: '8-10 Squats (Deadlift when done)', treadPattern: 'incline' },
      { minute: 2, floor: '1 DB Squat Hold | DB Swings', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'squat',
    name: 'Goblet Flow',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Front Rack Squat', treadPattern: 'recover' },
      { minute: 1, floor: '4 Goblet Squats 8 DB Swings', treadPattern: 'build' },
      { minute: 2, floor: 'Squat Pulse Switch | DB Swings', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'squat',
    name: 'Sumo Swing',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'OH Tricep Ext', treadPattern: 'recover' },
      { minute: 1, floor: '12 Sumo Squats (DB Swings when done)', treadPattern: 'build' },
      { minute: 2, floor: 'Tempo Sumo Squat | DB Swings', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// CORE BLOCKS (Lying Position)
// ============================================

export const CORE_BLOCKS: ExerciseBlock[] = [
  {
    type: 'core',
    name: 'Suitcase Series',
    position: 'lying',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Suitcase Crunch', treadPattern: 'recover' },
      { minute: 1, floor: 'Toe Touches | Jacknifes', treadPattern: 'incline' },
      { minute: 2, floor: 'Boat Pose | Russian Twists', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'core',
    name: 'Lat Pullover Core',
    position: 'lying',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Lat Pullover | Add Crunch', treadPattern: 'recover' },
      { minute: 1, floor: 'Knee Tucks | Russian Twists', treadPattern: 'build' },
      { minute: 2, floor: 'Toe Touches | Jacknifes', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'core',
    name: 'Situp Press',
    position: 'lying',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Situp to Shoulder Press (+1)', treadPattern: 'recover' },
      { minute: 1, floor: 'Shoulder Press Rep Out | 4 Cherry Pickers', treadPattern: 'build' },
      { minute: 2, floor: 'Same | Jacknifes', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// ARMS BLOCKS (Standing/Seated)
// ============================================

export const ARMS_BLOCKS: ExerciseBlock[] = [
  {
    type: 'arms',
    name: 'Curl to Press',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: '8 Waiter Curls 8 OH Tricep Ext (-1)', treadPattern: 'recover' },
      { minute: 1, floor: 'Cont.', treadPattern: 'build' },
      { minute: 2, floor: 'Shoulder Press Hold | Squat to Press', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'arms',
    name: 'Bicep Ladder',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Bicep Curl to Cross Body Curls', treadPattern: 'recover' },
      { minute: 1, floor: '1 DB 21s (Biceps)', treadPattern: 'incline' },
      { minute: 2, floor: 'Tempo Bicep Curl | Bicep BO', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// LUNGE BLOCKS (Standing Single Leg)
// ============================================

export const LUNGE_BLOCKS: ExerciseBlock[] = [
  {
    type: 'lunge',
    name: 'Reverse Lunge Series',
    position: 'standing',
    duration: 3,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'Heavy Reverse Lunges', treadPattern: 'recover' },
      { minute: 1, floor: '1 DB Reverse to Curtsy Lunge', treadPattern: 'build' },
      { minute: 2, floor: 'Plank DB Drag', treadPattern: 'incline' }
    ]
  },
  {
    type: 'lunge',
    name: 'SDL Flow',
    position: 'standing',
    duration: 4,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'L SDL to Reverse Lunge', treadPattern: 'recover' },
      { minute: 1, floor: 'Curtsy Lunge | Windshield Wiper', treadPattern: 'build' },
      { minute: 2, floor: 'R SDL to Reverse Lunge', treadPattern: 'recover' },
      { minute: 3, floor: 'Curtsy Lunge | Windshield Wiper', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'lunge',
    name: 'Bulgarian Series',
    position: 'standing',
    duration: 4,
    startsOnRecover: true,
    exercises: [
      { minute: 0, floor: 'R Bulgarian Split Squat', treadPattern: 'build' },
      { minute: 1, floor: '4 Rows 4 Offset Pushups', treadPattern: 'push' },
      { minute: 2, floor: 'L Bulgarian Split Squat', treadPattern: 'recover' },
      { minute: 3, floor: 'L Tempo Squat | L Squat to Press', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// POWER FINISHER BLOCKS (Always ends rounds)
// ============================================

export const POWER_FINISHER_BLOCKS: ExerciseBlock[] = [
  {
    type: 'power_finisher',
    name: 'Hi Pull to Snatch',
    position: 'standing',
    duration: 2,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'Squat to Hi Pull | Snatches', treadPattern: 'push' },
      { minute: 1, floor: 'Snatches | Burpee Snatches', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'power_finisher',
    name: 'Snatch Finish',
    position: 'standing',
    duration: 2,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: '3 Hi Pull to 1 Snatch', treadPattern: 'build' },
      { minute: 1, floor: 'Just Hi Pull | Just Snatches', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'power_finisher',
    name: 'DB Swing Finish',
    position: 'standing',
    duration: 2,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'Tempo Wide Squat | DB Swings', treadPattern: 'build' },
      { minute: 1, floor: 'DB Swings | Burpees', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'power_finisher',
    name: 'Clean Squat Finish',
    position: 'standing',
    duration: 2,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'Deadlift | Deadlift Clean Squat', treadPattern: 'build' },
      { minute: 1, floor: 'Deadlift Clean Squat | Snatches', treadPattern: 'sprint' }
    ]
  },
  {
    type: 'power_finisher',
    name: 'Row to Snatch',
    position: 'standing',
    duration: 2,
    startsOnRecover: false,
    exercises: [
      { minute: 0, floor: 'Row to Squat to Hi Pull', treadPattern: 'build' },
      { minute: 1, floor: 'Snatches | Burpee Snatches', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// BLOCK SELECTION HELPERS
// ============================================

export function getRandomBlock<T>(blocks: T[]): T {
  return blocks[Math.floor(Math.random() * blocks.length)];
}

export function getBlocksByType(type: BlockType): ExerciseBlock[] {
  switch (type) {
    case 'warmup_bodyweight':
      return WARMUP_BODYWEIGHT_BLOCKS;
    case 'warmup_weighted':
      return WARMUP_WEIGHTED_BLOCKS;
    case 'chest':
      return CHEST_BLOCKS;
    case 'back_rows':
      return BACK_BLOCKS;
    case 'deadlift':
      return DEADLIFT_BLOCKS;
    case 'squat':
      return SQUAT_BLOCKS;
    case 'lunge':
      return LUNGE_BLOCKS;
    case 'core':
      return CORE_BLOCKS;
    case 'arms':
      return ARMS_BLOCKS;
    case 'power_finisher':
      return POWER_FINISHER_BLOCKS;
    default:
      return [];
  }
}

// Valid block sequences for Total Body class
export const TOTAL_BODY_BLOCK_SEQUENCES: BlockType[][] = [
  ['chest', 'deadlift', 'power_finisher'],
  ['chest', 'core', 'deadlift', 'power_finisher'],
  ['back_rows', 'squat', 'power_finisher'],
  ['deadlift', 'back_rows', 'power_finisher'],
  ['chest', 'lunge', 'back_rows', 'power_finisher'],
  ['squat', 'chest', 'power_finisher'],
  ['deadlift', 'core', 'power_finisher'],
  ['back_rows', 'arms', 'power_finisher'],
  ['lunge', 'chest', 'power_finisher'],
  ['chest', 'squat', 'power_finisher']
];

// Round 2 typically shorter, different focus
export const ROUND_2_BLOCK_SEQUENCES: BlockType[][] = [
  ['back_rows', 'power_finisher'],
  ['arms', 'core', 'power_finisher'],
  ['lunge', 'power_finisher'],
  ['squat', 'arms', 'power_finisher'],
  ['deadlift', 'power_finisher'],
  ['core', 'power_finisher']
];
