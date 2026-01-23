// Exercise blocks extracted from real Barry's Total Body classes
// Each block is a self-contained unit with hero moment at the end

export interface BlockExercise {
  minute: number;
  floor: string;
  tread: string;
  treadPattern: 'recover' | 'build' | 'push' | 'incline' | 'sprint';
}

export interface ExerciseBlock {
  name: string;
  focus: string;
  position: 'lying' | 'bent_over' | 'standing' | 'floor';
  duration: number;
  exercises: BlockExercise[];
}

// ============================================
// ROUND 1 WARMUPS (Bodyweight, end with hero moment)
// ============================================
export const ROUND1_WARMUPS: ExerciseBlock[] = [
  {
    name: 'WGS to Pushup...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'WGS to Pushup'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'Good Morning to Squat to Lunges'	, tread: '6, 7, 8 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Fast Feet | Burpees'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: '3 Good Morning to 3 Squat...',
    focus: 'squat',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: '3 Good Morning to 3 Squat'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '4 Pushups 2 Commandos to 1 Pike'	, tread: '6, 7, 8 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Leg Lift | Plank Jacks'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: 'WGS | BW Squat to Lunge...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'WGS | BW Squat to Lunge'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '1 DB Squat to Lunge'	, tread: '6.5, 7.5, 8.5 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Commandos | Mountain Climbers'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: 'WGS...',
    focus: 'squat',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'WGS'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '5 Pushups 5 Plank Jacks X Human'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: '3 Good Morning to 3 Squat'	, tread: '6.5, 7.5, 8.5 | 6, 7, 8', treadPattern: 'push' },
      { minute: 3, floor: 'Squat | Hold : Pulse'	, tread: '5, 6, 7 | 8, 9, 10', treadPattern: 'build' }
    ]
  },
  {
    name: 'WGS to 4 Puhups...',
    focus: 'squat',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'WGS to 4 Puhups'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '2 GM to 2 Squat'	, tread: '6, 7, 8 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Squat with 3 Hold | Burpees'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: 'WGS Add Pushups...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'WGS Add Pushups'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'GM to Squat to Lunge'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: '1 DB Squat | Hold : Rep'	, tread: '6, 7, 8 | 8.5, 9.5, 10.5', treadPattern: 'push' }
    ]
  },
  {
    name: 'GM to Squat to Lunges...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'GM to Squat to Lunges'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'WGS (pushup ladder)'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Shoulder Taps | MC'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: '2 GM 2 Squats 2 Lunges...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: '2 GM 2 Squats 2 Lunges'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'WGS to Pushups'	, tread: '7, 8, 9 | 6, 7, 8', treadPattern: 'push' },
      { minute: 2, floor: 'Pushup to DD | Mountain Climbers'	, tread: '3% 6, 7, 8 | 3% 8, 9, 10', treadPattern: 'incline' }
    ]
  },
  {
    name: 'GM to WGS...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'GM to WGS'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'Pushup to Shoulder Taps | Reverse Lunges'	, tread: '7.5, 8.5, 9.5 | 6.5, 7.5, 8.5', treadPattern: 'push' },
      { minute: 2, floor: 'Squats : Hold | Burpees'	, tread: '5.5, 6.5, 7.5 | 8, 9, 10', treadPattern: 'build' }
    ]
  },
  {
    name: 'WGS to Pushup...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'WGS to Pushup'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '2 GM to Squats to Lunges'	, tread: '7, 8, 9 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Squat : Hold | Burpees'	, tread: '7, 8, 9 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: 'WGS to Pushup...',
    focus: 'squat',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'WGS to Pushup'	, tread: '5, 6. 7', treadPattern: 'build' },
      { minute: 1, floor: '3 Good Morning to 3 Squat'	, tread: '7, 8 9', treadPattern: 'push' },
      { minute: 2, floor: '1 DB Tempo Squat | 1 DB Squat to Press'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: '2 Good Morning to 2 Squat to 2...',
    focus: 'lunge',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: '2 Good Morning to 2 Squat to 2 Lunges'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'WGS to 4 Shoulder Taps'	, tread: '6, 7, 8 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: '3 Pushups 6 Hip Dips'	, tread: '2% 6, 7, 8 | 7, 8 9', treadPattern: 'incline' },
      { minute: 3, floor: '1 DB Squat with 3 Pulses | Squat to Press'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: '3 GM 3 Squats 3 Pushups...',
    focus: 'squat',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: '3 GM 3 Squats 3 Pushups'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'WGS | Cat Cow'	, tread: '4% 6, 7, 8', treadPattern: 'incline' },
      { minute: 2, floor: '1 DB Tempo Squat | Squat to Press'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: 'Good Morning to WGS...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Good Morning to WGS'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '2 Lunges to 3 Sauts to 4 Pushups'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'X Human | Mountain Climbers'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  },
  {
    name: 'WGS to Pushup...',
    focus: 'squat',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'WGS to Pushup'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '3 GM to 3 Squats | 1 and 1'	, tread: '6, 7, 8 2% | 4%', treadPattern: 'incline' },
      { minute: 2, floor: 'Tempo Squat : Hold | Burpees'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' }
    ]
  }
];

// ============================================
// ROUND 2 STARTERS (Can have weights)
// ============================================
export const ROUND2_STARTERS: ExerciseBlock[] = [
  {
    name: 'Alt Rows...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Alt Rows'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '4 Rows 4 Squats'	, tread: '7.5, 8.5, 9.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Tempo Squats | Just Rows'	, tread: '7, 8, 9 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Rev Lunge to Bicep Curls...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Rev Lunge to Bicep Curls'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '2 Curls 2 Lunges 2 Squats'	, tread: '8% 6.5, 7.5, 8.5 | 4% 6.5, 7.5, 8.5', treadPattern: 'incline' },
      { minute: 2, floor: 'Same | HOLD: Squat to Press'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Rows...',
    focus: 'back',
    position: 'bent_over',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Rows'	, tread: 'DM | DM RUN', treadPattern: 'push' },
      { minute: 1, floor: '4 RR 4 Pushups 4 Squats'	, tread: 'REST | DM SPRINT', treadPattern: 'sprint' },
      { minute: 2, floor: 'Beastmakers'	, tread: 'REST | DM SPRINT', treadPattern: 'sprint' },
      { minute: 3, floor: 'Tempo Pushups | Double Rows'	, tread: 'REST | DM SPRINT', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Chest Press...',
    focus: 'chest',
    position: 'lying',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Chest Press'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '8 Chest Press 4 Suitcase Squats'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: '4 Chest Press 8 Suitcase Squats'	, tread: '8, 9, 10 | 5, 6, 7', treadPattern: 'push' },
      { minute: 3, floor: 'Suitcase Squats | Chest Press BO'	, tread: '4% 6, 7, 8  | 4% Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: '2 R 2 L Shoulder Press...',
    focus: 'core',
    position: 'lying',
    duration: 4,
    exercises: [
      { minute: 0, floor: '2 R 2 L Shoulder Press'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'Alt Skull Crusher | Both Arms'	, tread: '4% 5, 6, 7 | 8% 5, 6, 7', treadPattern: 'incline' },
      { minute: 2, floor: 'V Sit | Russian Twists'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 3, floor: 'Toe Touches | Jacknifes'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '2 Cleans 2 Squats...',
    focus: 'squat',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: '2 Cleans 2 Squats'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'Just Squats | Just Cleans'	, tread: '8, 9, 10 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'SHAKE Tempo Squat | Squat to Press'	, tread: '5, 6, 7 | Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Curtsy Lunges with 3 Pulse...',
    focus: 'lunge',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Curtsy Lunges with 3 Pulses'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: 'Lungster'	, tread: '7.5, 8,5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: 'Lungster | Just Bicep Curls'	, tread: '5, 6, 7 | 6, 7, 8', treadPattern: 'build' },
      { minute: 3, floor: 'Bicep Curls : Hold | Squat to Press'	, tread: '7, 8, 9 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Chest Press (r/ld)...',
    focus: 'chest',
    position: 'lying',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Chest Press (r/ld)'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '6 Chest Press 6 Suitcase Rows (-1)'	, tread: '4% 5.5, 6.5, 7.5 | 5% 6, 7, 8', treadPattern: 'incline' },
      { minute: 2, floor: 'Same'	, tread: '6% 6.5, 7.5, 8.5', treadPattern: 'incline' },
      { minute: 3, floor: 'Tempo Chest Press | Hold: Chest Press BO'	, tread: '5. 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Rows...',
    focus: 'back',
    position: 'bent_over',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Rows'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '6 Alt Rows 4 Pushups 2 Squat'	, tread: '7, 8, 9 / 7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: '3 Double Rows 2 Pushups 1 Squat'	, tread: '7.5, 8.5 9.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 3, floor: 'Tempo Pushups | Rows'	, tread: '5, 6 7 / Sprint (45 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '2 Cleans 2 Squats...',
    focus: 'lunge',
    position: 'standing',
    duration: 2,
    exercises: [
      { minute: 0, floor: '2 Cleans 2 Squats'	, tread: '5, 6, 7 | 7.5, 8.5, 9.5', treadPattern: 'build' },
      { minute: 1, floor: '4 Lunges 2 Cleans 2 Squat to Press'	, tread: '5, 6, 7 | (Sprint 30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Chest Press with 3 Pulses...',
    focus: 'chest',
    position: 'lying',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Chest Press with 3 Pulses'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '10 Hammer (suticase crucnh when done)'	, tread: '6, 7, 8 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: '10 Close Grip (russian twists when done)'	, tread: '8, 9, 10 | 7, 8, 9', treadPattern: 'push' },
      { minute: 3, floor: 'CP DB | Both Arms Both Legs'	, tread: '5, 6, 7 | Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Lunges with 3 Pulses...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Alt Lunges with 3 Pulses'	, tread: '6, 7, 8 | 6.5, 7.5, 8.5', treadPattern: 'push' },
      { minute: 1, floor: 'Add 2 Bicep Curls at Bottom | Just 1'	, tread: '7, 8, 9 | 6% 7, 8, 9', treadPattern: 'incline' },
      { minute: 2, floor: 'Halfway Hold | Bicep Curl BO'	, tread: '6% 5, 6, 7 | 6% Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// CHEST BLOCKS
// ============================================
export const CHEST_BLOCKS: ExerciseBlock[] = [
  {
    name: 'Wide to Close Grip (+1)...',
    focus: 'chest',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Wide to Close Grip (+1)'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: 'Close Grip BO | Situp To Twist'	, tread: '7.5, 8.5, 9.5 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Chest Press Deadbug | Both Arms Both Legs'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'R/L/D Chest Press...',
    focus: 'chest',
    position: 'lying',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'R/L/D Chest Press'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Chest Press BO | Suicase Crunch'	, tread: '7.5, 8.5, 9.5 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Suitcase to Jacknige | JAcknifes'	, tread: '6.5, 7.5, 8.5 | 6, 7, 8', treadPattern: 'push' },
      { minute: 3, floor: 'Chest Press with Pulse | Chest Press BO'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Chest Press...',
    focus: 'chest',
    position: 'lying',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Chest Press'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '8 Chest Press 8 Suitcase Squats (-1)'	, tread: '6.5, 7.5, 8.5  | 4% (or same inclines)', treadPattern: 'incline' },
      { minute: 2, floor: 'Same'	, tread: '6% | 8%', treadPattern: 'incline' },
      { minute: 3, floor: 'Suitcase Squats Only | Burn Out Chest Press'	, tread: '6.5,7.5, 8.5 | Sprint (30 Seocnds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Suitcase Squat (+1) to Hammer ...',
    focus: 'chest',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Suitcase Squat (+1) to Hammer Curl'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '4 Pushups 4 Suitcase Squats 4 Curl to Press (-1)'	, tread: '8.5, 9.5, 10.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Shoulder Press Hold | Double Snatch or Burpee'	, tread: '8.5, 9.5, 10.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Goblet Squat...',
    focus: 'chest',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Goblet Squat'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '6 Chest Press 6 Front Squat'	, tread: '7.5, 8.5, 9.5 | 8, 9, 10', treadPattern: 'push' },
      { minute: 2, floor: 'Tempo Front Rack | Rep Out'	, tread: '5, 6 7, | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Wide to Close Grip...',
    focus: 'chest',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Wide to Close Grip'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '6 Close Grip 6 Suitcase Squats'	, tread: '8, 9, 10 | 8.5, 9.5, 10.5', treadPattern: 'push' },
      { minute: 2, floor: 'Tempo Chest Press | Rep Out'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Chest Press with 3 Pulses...',
    focus: 'chest',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Alt Chest Press with 3 Pulses'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '10-12 Chest Press (cherry pickers when done)'	, tread: '3% 7, 8, 9 | 8, 9, 10', treadPattern: 'incline' },
      { minute: 2, floor: '1 Close Grip 1 Leg Lift | Same Tiime'	, tread: '5, 6, 7 | Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: '2 Suticase Squat 2 Hammer Curl...',
    focus: 'chest',
    position: 'standing',
    duration: 2,
    exercises: [
      { minute: 0, floor: '2 Suticase Squat 2 Hammer Curl to Press'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Shoulder Press Hold | Double Snatch or Burpees'	, tread: '7, 8, 9 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Tempo Alt Chest Press...',
    focus: 'chest',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Tempo Alt Chest Press'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '6 Chest Press 6 Goblet Squats'	, tread: '5% 5 ,6 7 | 7, 8, 9', treadPattern: 'incline' },
      { minute: 2, floor: 'Tempo Chest Press | Rep Out'	, tread: '7, 8, 9 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Tempo Goblet Squat...',
    focus: 'chest',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Tempo Goblet Squat'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '6 Close Grip 6 Suitcase Squats'	, tread: '4% 5, 6, 7 | 4% 7.5, 7.5, 9.5', treadPattern: 'incline' },
      { minute: 2, floor: 'Tempo Front Rack Squat | Rep Out'	, tread: '7.5, 8.5, 9.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Chest Press with 3 Pulses...',
    focus: 'chest',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Alt Chest Press with 3 Pulses'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Chest Press BO | V Sit : Russian Twists'	, tread: '7.5, 8.5, 9.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Close Grip 3 Pulses | Close Grip BO'	, tread: '7.5, 8.5, 9.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Suitcase Squat...',
    focus: 'chest',
    position: 'lying',
    duration: 2,
    exercises: [
      { minute: 0, floor: 'Suitcase Squat'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Tempo Chest Press | Chest Press BO'	, tread: '3% 5, 6, 7 | 3% Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// BACK/ROW BLOCKS
// ============================================
export const BACK_BLOCKS: ExerciseBlock[] = [
  {
    name: 'Alt Rows...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Alt Rows'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: '4 Alt Rows 4 RR 4 Pushups'	, tread: '6.5, 7.5, 8.5 | 7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: 'Just RR | Double Rows'	, tread: '6, 7 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Chest...',
    focus: 'back',
    position: 'bent_over',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Chest'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Chest'	, tread: '6, 7, 8 | 8, 9, 10', treadPattern: 'push' },
      { minute: 2, floor: 'Row to Squat to Hi Pull to Snatch'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 3, floor: 'Snatches | Burpee Snatches'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'L SDL to Cursty Lunge...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'L SDL to Cursty Lunge'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '3 Rows 3 Offset Pushups 3 Hi Pulls'	, tread: '7.5, 8.5, 9.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Same | L Snatches'	, tread: '7.5, 8.5, 9.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'R SDL to Cursy Lunge...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'R SDL to Cursy Lunge'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '3 Rows 3 Offset Pushups 3 Hi Pulls'	, tread: '8, 9, 10 | 5, 6 7', treadPattern: 'push' },
      { minute: 2, floor: 'Same | R Snatches'	, tread: '7, 8, 9 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '3 BO Rows each side...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: '3 BO Rows each side'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '2 Push Ups to Alt Squat to Hi Pull'	, tread: '8.5, 9.5, 10.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Just Squat to Hi Pull | Snatch'	, tread: '8, 9, 10 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Heavy Rows...',
    focus: 'back',
    position: 'bent_over',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Heavy Rows'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: '6 Double Rows 6 Squats (-1)'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Same'	, tread: '8% | 8% (5, 6, 7)', treadPattern: 'incline' },
      { minute: 3, floor: 'Squat to Hi Pull | Snatches'	, tread: '0% (5, 6, 7) | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'R Bulgarian Split Squat...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'R Bulgarian Split Squat'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '4 Rows 4 Offset Pushups'	, tread: '7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: 'R Tempo Squat | R Squat to Press'	, tread: '6, 7, 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'L Bulgarian Split Squat...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'L Bulgarian Split Squat'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '4 Offset Pushups 4 Rows'	, tread: '8, 9, 10 / 5.5, 6.5, 7.5', treadPattern: 'push' },
      { minute: 2, floor: 'L Tempo Squat | L Squat to Press'	, tread: '/ Sprint (45 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'L Arm Row...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'L Arm Row'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '4 Offset Pushups 4 Rows'	, tread: '4% 6, 7, 8 | 7, 8, 9', treadPattern: 'incline' },
      { minute: 2, floor: 'R Squat to Hi Pull | Just Snatch'	, tread: '7, 8, 9 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'R Arm Row...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'R Arm Row'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '4 Offset Pushups 4 Rows'	, tread: '3% 6, 7, 8 | 2% 7.5, 7.5, 9.5', treadPattern: 'incline' },
      { minute: 2, floor: 'L Squat to Hi Pull | L Just Snatch'	, tread: '7.5, 8.5, 9.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '3 Gorrila Rows e/s...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: '3 Gorrila Rows e/s'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '8-10 Squat to Hi Pulls (plank when done)'	, tread: '2% 7.5, 8.5, 9.5 | 8, 9, 10', treadPattern: 'incline' },
      { minute: 2, floor: 'Alt Snatches | Burpee Snatches'	, tread: '5, 6, 7 | Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: '3 Bent Over Rows e/s...',
    focus: 'back',
    position: 'bent_over',
    duration: 3,
    exercises: [
      { minute: 0, floor: '3 Bent Over Rows e/s'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '2 Squat to Hi Pulls to 1 Snatch'	, tread: '8.5, 9.5, 10. 5 / 5, 67', treadPattern: 'push' },
      { minute: 2, floor: 'SHAKE? / Just Snatches | Burpee Snatches'	, tread: '5, 6, 7 / Sprint (45 Seconds)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// DEADLIFT BLOCKS
// ============================================
export const DEADLIFT_BLOCKS: ExerciseBlock[] = [
  {
    name: 'Heavy Deadlift...',
    focus: 'deadlift',
    position: 'bent_over',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Heavy Deadlift'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '3 Deadlift 1 Squats | Deadlift Clean Squat'	, tread: '6, 7, 8, | 8, 9, 10', treadPattern: 'push' },
      { minute: 2, floor: '3 BO Rows'	, tread: '6, 7, 8 | 8.5, 9.5, 10.5', treadPattern: 'push' },
      { minute: 3, floor: 'Squat to Hi Pull | Snatches'	, tread: '6, 7, 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Heavy Deadlift...',
    focus: 'deadlift',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Heavy Deadlift'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: 'Side to Side | Heavy Squat'	, tread: '2% 6.5, 7.5, 8.5 | 4%', treadPattern: 'incline' },
      { minute: 2, floor: 'Heavy Squat | Side to Side'	, tread: '6% | 8%', treadPattern: 'incline' },
      { minute: 3, floor: 'Deadlift | Deadlift Clean Squat'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Rows with Pulse...',
    focus: 'deadlift',
    position: 'bent_over',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Rows with Pulse'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: '2 Double Rows 2 Squats (+1)'	, tread: '7, 8, 9 | 8, 9, 10', treadPattern: 'push' },
      { minute: 2, floor: 'Cont.'	, tread: '8% 5, 6, 7', treadPattern: 'incline' },
      { minute: 3, floor: 'Tempo Wide Squat | DB Swings'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Heavy Deadlift...',
    focus: 'deadlift',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Heavy Deadlift'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: '1 DB Switch with 3 Pulses'	, tread: '8.5, 9,5, 10.5 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Squat to Hi Pull | Snatches'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Tempo Deadlift...',
    focus: 'deadlift',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Tempo Deadlift'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '8 DB Swings 4 Goblet Squats'	, tread: '8, 9,10 | 7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: 'Same | Plank'	, tread: '7, 8, 9 | 6.5, 7.5, 8.5', treadPattern: 'push' },
      { minute: 3, floor: 'Heavy Deadlift | Deadlift Clean Squat'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Tempo Deadlift...',
    focus: 'deadlift',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Tempo Deadlift'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '3 Deadift to 1 Squat'	, tread: '6, 7, 8 | 7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: '6 Swings 6 OH Tricep Ext'	, tread: '3% 6, 7, 8 | 7.5, 8.5, 9.5', treadPattern: 'incline' },
      { minute: 3, floor: 'Just OH Tricep Ext | Just Swings'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Tempo Heavy Deadlift...',
    focus: 'deadlift',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Tempo Heavy Deadlift'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '8 Squats (Pushups when done)'	, tread: '6, 7, 8 | 7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: '8 Squats (Pushups when done)'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 3, floor: 'Deadlift | Deadlift Clean Squat'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Heavy Deadlift...',
    focus: 'deadlift',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Heavy Deadlift'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '3 Deadlifts 1 Squat'	, tread: '5.5, 6.5, 7.5 | 7, 8, 9', treadPattern: 'build' },
      { minute: 2, floor: 'Alt Reverse Lunge | Stay Low'	, tread: '8.5, 9.5, 10.5  | 7, 8, 9', treadPattern: 'push' },
      { minute: 3, floor: 'DB Pulse Switch | DB SWINGS'	, tread: '5.5, 6.5, 7.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '1 DB Reverse Lunges...',
    focus: 'deadlift',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: '1 DB Reverse Lunges'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Deadlift | Deadlft to Reverse Lunges'	, tread: '8, 9, 10 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Same | Just Heavy Lunges'	, tread: '6, 7, 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'OH Tricep Ext...',
    focus: 'deadlift',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'OH Tricep Ext'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '12 Sumo Squats (DB Swings when done)'	, tread: '6, 7, 8 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Tempo Sumo Squat | DB Swings'	, tread: '8, 9, 10 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// SQUAT BLOCKS
// ============================================
export const SQUAT_BLOCKS: ExerciseBlock[] = [
  {
    name: 'Plank Taps...',
    focus: 'squat',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Plank Taps'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: 'Squat to Hi Pull'	, tread: '7.5, 8.5, 9.5 | 8.5, 9.5, 10.5', treadPattern: 'push' },
      { minute: 2, floor: 'Snatches | Burpee Snatches'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Plank Taps...',
    focus: 'squat',
    position: 'standing',
    duration: 2,
    exercises: [
      { minute: 0, floor: 'Plank Taps'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Squat to Hi Pull | Snatches'	, tread: '6, 7, 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Squat to Hi Pull...',
    focus: 'squat',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Squat to Hi Pull'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Plank | Snatches'	, tread: '8.5, 9.5, 10.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Plank | Snatches'	, tread: '7, 8, 9 | Sprint (30 Sconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'SAME...',
    focus: 'squat',
    position: 'standing',
    duration: 2,
    exercises: [
      { minute: 0, floor: 'SAME'	, tread: 'RECOVER | 5% 7, 8, 9', treadPattern: 'recover' },
      { minute: 1, floor: 'Squat with Pause | Squat to Press'	, tread: '5.5, 6.5, 7.5 | 5% Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Plank | Squat to Press or Doub...',
    focus: 'squat',
    position: 'standing',
    duration: 2,
    exercises: [
      { minute: 0, floor: 'Plank | Squat to Press or Double Snatch'	, tread: 'RECOVER | 4% 7, 8, 9', treadPattern: 'recover' },
      { minute: 1, floor: 'Shoulder Press Hold | Double Snatch, Burpees, Weighted Burpees'	, tread: '5, 6, 7 | 4% Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: '2 Pushups to Squat to Hi Pull...',
    focus: 'squat',
    position: 'standing',
    duration: 2,
    exercises: [
      { minute: 0, floor: '2 Pushups to Squat to Hi Pull'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Snatches | Burpee Snatches'	, tread: '2% 8, 9, 10 | 2% Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'X Human with DB...',
    focus: 'squat',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'X Human with DB'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Hip Dips | 6 Sumo Squats 6 Pushups (-1)'	, tread: '8, 9, 10', treadPattern: 'push' },
      { minute: 2, floor: 'Ladder Cont.'	, tread: '5.5, 6.5, 7.5, | 6.5, 7.5, 8.5', treadPattern: 'build' },
      { minute: 3, floor: 'Shoulder Press Hold | Double Snatch, Burpee, MC'	, tread: '7.5, 8.5, 9.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Squat to Hi Pulls...',
    focus: 'squat',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Squat to Hi Pulls'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: '10-12 Snatches (Plank Jacks when done)'	, tread: '7, 8, 9 / 8, 9, 10', treadPattern: 'push' },
      { minute: 2, floor: '10-12 Snatches (MC when done)'	, tread: '8, 9, 10 | 5, 6, 7', treadPattern: 'push' },
      { minute: 3, floor: 'Snatches | Burpee Snatches'	, tread: '5, 6 7 / Sprint (45 Seconds)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// LUNGE BLOCKS
// ============================================
export const LUNGE_BLOCKS: ExerciseBlock[] = [
  {
    name: 'AMRAP: 6 Lunges 4 RR 2 Pushups...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'AMRAP: 6 Lunges 4 RR 2 Pushups'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: 'AMRAP: 6 Lunges 4 RR 2 Pushups'	, tread: '2% 5, 6, 7 | 2% 7.5, 8.5, 9.5', treadPattern: 'incline' },
      { minute: 2, floor: 'AMRAP/Shake | CHOICE'	, tread: '7.5, 8.5, 9.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'L SDL to Reverse Lunge...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'L SDL to Reverse Lunge'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Cursty Lunge | Windshield Wiper'	, tread: '8, 9, 10 | 5% 5, 6, 7', treadPattern: 'incline' },
      { minute: 2, floor: 'L Squat with Pulse | Squat to Press'	, tread: '5% 6, 7, 8 | 5% Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'R SDL to Reverse Lunge...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'R SDL to Reverse Lunge'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Cursty Lunge | Windshield Wiper'	, tread: '8.5, 9.5, 10.5 | 6% 5, 6, 7', treadPattern: 'incline' },
      { minute: 2, floor: 'R Squat with Pulse | Squat to Press'	, tread: '6% 6, 7, 8 | 6% Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Alt Lunges with 3 Pulses...',
    focus: 'lunge',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Alt Lunges with 3 Pulses'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'AMRAP  4 Curl to Press 4 Lunges'	, tread: '5 % 5, 6, 7 | 10% 5, 6, 7', treadPattern: 'incline' },
      { minute: 2, floor: 'AMRAP'	, tread: '7, 8, 9', treadPattern: 'push' },
      { minute: 3, floor: 'TEMPO. Front Squat | Squat to Press'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'BW Lunges with 3 Pulses...',
    focus: 'lunge',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'BW Lunges with 3 Pulses'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '4 Lunges 4 Squat to Press'	, tread: '8, 9, 10 / 5.5, 6.5, 7.5', treadPattern: 'push' },
      { minute: 2, floor: 'Just Lunges | Squat to Press'	, tread: '5.5, 6.5, 7.5\ Sprint (45 seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Plank Hip Dips...',
    focus: 'lunge',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Plank Hip Dips'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '3 Squats 2 Lunges 1 Snatch e/s'	, tread: '3% 6, 7, 8 | 4% 6.5, 7.5, 8.5', treadPattern: 'incline' },
      { minute: 2, floor: 'Same'	, tread: '5% 7, 8, 9', treadPattern: 'incline' },
      { minute: 3, floor: 'Shake : _______ | Snatches, Burpees, MC'	, tread: '5. 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '2 Lunges 1 Clean 1 Squat to Pr...',
    focus: 'lunge',
    position: 'standing',
    duration: 2,
    exercises: [
      { minute: 0, floor: '2 Lunges 1 Clean 1 Squat to Press'	, tread: 'RECOVER | 8, 9, 10', treadPattern: 'recover' },
      { minute: 1, floor: 'Lunges | Squat to Press'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Plank Hip Dips...',
    focus: 'lunge',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Plank Hip Dips'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '3 Squats 2 Lunges 1 Snatch e/s'	, tread: '6, 7, 8, | 8, 9, 10', treadPattern: 'push' },
      { minute: 2, floor: 'Same'	, tread: '6, 7, 8 | 8.5, 9.5, 10.5', treadPattern: 'push' },
      { minute: 3, floor: 'Plank | Snatches, Burpees, MC'	, tread: '6, 7, 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// ARMS BLOCKS
// ============================================
export const ARMS_BLOCKS: ExerciseBlock[] = [
  {
    name: 'Bicep Curl to Cross Body Curls...',
    focus: 'arms',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Bicep Curl to Cross Body Curls'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: '10-12 Curls (Squat to Press when finished)'	, tread: '6% 5, 6, 7 | 6.5, 7.5, 8.5', treadPattern: 'incline' },
      { minute: 2, floor: 'Tempo Squat | Squat to Press'	, tread: '6.5, 7.5, 8.5  | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '8 Waiter Curls 8 OH Tricep Ext...',
    focus: 'arms',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: '8 Waiter Curls 8 OH Tricep Ext (-1)'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: 'Cont.'	, tread: '7, 8, 9 | 8, 9, 10', treadPattern: 'push' },
      { minute: 2, floor: 'Shoulder Press Hold | Squat to Press'	, tread: '5.5, 6.5, 7.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Plank DB Drag...',
    focus: 'arms',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Plank DB Drag'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '2 Curls 2 Squat to Press | Curl Squat Press'	, tread: '8.5, 9.5, 10.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Shoulder Press Hold | Choice (MC, Snatches, Burpees)'	, tread: '6, 7, 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Bicep Curl to Cross Body Curls...',
    focus: 'arms',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Bicep Curl to Cross Body Curls'	, tread: '5, 6, 7', treadPattern: 'build' },
      { minute: 1, floor: '12 Bicep Curls (alt shoulder press when done)'	, tread: '7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: 'Bicep Hold | Curl to Press'	, tread: '6, 7, 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Plank DB Drag...',
    focus: 'arms',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Plank DB Drag'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '1 DB 21s (Biceps)'	, tread: '8, 9, 10 / 5.5, 6.5, 7.5', treadPattern: 'push' },
      { minute: 2, floor: 'Tempo Bicep Curl | Bicep BO'	, tread: '5.5, 6.5, 7.5 / Sprint 45 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'OH Tricep Ext...',
    focus: 'arms',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'OH Tricep Ext'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '2 Snatches e/s 2 Pushups'	, tread: '8.5, 9.5, 10.5 | 7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: 'Same : SHAKE | CHOICE'	, tread: '5, 6 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'RR...',
    focus: 'arms',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'RR'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '6 Pushups 6 Curls 6 Squat to Press (-1)'	, tread: '6.5, 7.5, 8.5 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: '6 Pushups 6 Curls 6 Squat to Press (-1)'	, tread: '7.5, 8.5, 9.5 | 4% 7.5, 8.5, 9.5', treadPattern: 'incline' },
      { minute: 3, floor: 'Plank | Weighted Burpee or Burpee'	, tread: '4% 5, 6, 7 | 4% Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Seated Alt Bicep Curl...',
    focus: 'arms',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Seated Alt Bicep Curl'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Bicep BO | Toe Touches'	, tread: '8, 9, 10 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Single Leg Lift | Single Jacknifes'	, tread: '7.5, 8.5, 9.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// CORE BLOCKS
// ============================================
export const CORE_BLOCKS: ExerciseBlock[] = [
  {
    name: 'Suitcase Crunch...',
    focus: 'core',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Suitcase Crunch'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: 'Toe Touches | Jacknifes'	, tread: '4% 5, 6, 7 | 7, 8, 9', treadPattern: 'incline' },
      { minute: 2, floor: 'Boat Pose | Russian Twists'	, tread: '7, 8, 9 |  Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Lat Pullover | Add Crunch...',
    focus: 'core',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Lat Pullover | Add Crunch'	, tread: 'Recover', treadPattern: 'recover' },
      { minute: 1, floor: 'Knee Tucks | Russian Twists'	, tread: '8, 9, 10 | 7, 8, 9', treadPattern: 'push' },
      { minute: 2, floor: 'Toe Touches | Jacknifes'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Lat Pullover to Crunch...',
    focus: 'core',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Lat Pullover to Crunch'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Toe Touches | Jacknifes'	, tread: '8, 9, 10 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Boat Pose | Russian Twists'	, tread: '7, 8, 9 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Crunch to Half to Full Situp...',
    focus: 'core',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Crunch to Half to Full Situp'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Just Situp | HOLD: Russian Twists'	, tread: '6% 7, 8, 9 | 3% 7, 8, 9', treadPattern: 'incline' },
      { minute: 2, floor: 'Leg Lifts | Jacknifes'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Leg Lift to Hip Raise...',
    focus: 'core',
    position: 'lying',
    duration: 2,
    exercises: [
      { minute: 0, floor: 'Leg Lift to Hip Raise'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Toe Touches | Jack Knifes'	, tread: '3% 7, 8, 9  | 3% Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Suitcase Crunch (CORE)...',
    focus: 'core',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Suitcase Crunch (CORE)'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Lat Pullover to Power Situp'	, tread: '8.5, 9.5, 10.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Toe Touches | Jacknifes'	, tread: '8, 9, 10 | Sprint (30 Seonds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '4 Toe Touches 4 Single Leg Lif...',
    focus: 'core',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: '4 Toe Touches 4 Single Leg Lifts'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Just Leg Lift | Jacknifes'	, tread: '8.5, 9.5, 10.5 | 7.5, 8.5, 9.5', treadPattern: 'push' },
      { minute: 2, floor: 'V Sit Hold | Russian Twists'	, tread: '5, 6, 7 | Sprint', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Situp to Shoulder Press (+1)...',
    focus: 'core',
    position: 'lying',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Situp to Shoulder Press (+1)'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Shoulder Press Rep Out | 4 Cherry Pickers 4 Alt Leg Lifts'	, tread: '8, 9, 10 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Same | Jacknifes'	, tread: '7.5, 8.5 9.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// POWER FINISHER BLOCKS
// ============================================
export const POWER_BLOCKS: ExerciseBlock[] = [
  {
    name: '4 RR 4 Pushups 4 X Human...',
    focus: 'power',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: '4 RR 4 Pushups 4 X Human'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '4 RR 4 Pushups 4 X Human'	, tread: '4% 7.5, 8.5, 9.5 | 2% 7.5, 8.5, 9.5', treadPattern: 'incline' },
      { minute: 2, floor: 'Shoulder Press Hold | Burpees or Weighted Burpees'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Commandos...',
    focus: 'power',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Commandos'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: '3 Hi Pull to 1 Snatch'	, tread: '5, 6, 7 | 9, 10, 11', treadPattern: 'build' },
      { minute: 2, floor: 'Just Hi Pull | Just Snatches'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: '4 RR to 2 Pushup...',
    focus: 'power',
    position: 'standing',
    duration: 2,
    exercises: [
      { minute: 0, floor: '4 RR to 2 Pushup'	, tread: 'RECOVER | 8.5, 9.5, 10.5', treadPattern: 'recover' },
      { minute: 1, floor: 'Plank | Weighted Burpee'	, tread: '5, 6, 7 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Plank DB Drag...',
    focus: 'power',
    position: 'standing',
    duration: 4,
    exercises: [
      { minute: 0, floor: 'Plank DB Drag'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Alt Hi Pull | Plank DB Drag'	, tread: '5.5, 6.5, 7.5 | 7, 8, 9', treadPattern: 'build' },
      { minute: 2, floor: 'Snatch | Plank DB Drag'	, tread: '8.5, 9.5, 10.5  | 7, 8, 9', treadPattern: 'push' },
      { minute: 3, floor: 'Snatches | Burpee Snatch'	, tread: '5.5, 6.5, 7.5 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'Plank DB Drag add Pushup...',
    focus: 'power',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'Plank DB Drag add Pushup'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Alt Snatches | Pushups'	, tread: '8.5, 9.5, 10.5 | 5, 6, 7', treadPattern: 'push' },
      { minute: 2, floor: 'Alt Snatches | Burpee Snatches'	, tread: '5% 6, 7, 8 | Sprint (30 Seconds)', treadPattern: 'sprint' }
    ]
  },
  {
    name: 'CORE...',
    focus: 'power',
    position: 'standing',
    duration: 3,
    exercises: [
      { minute: 0, floor: 'CORE'	, tread: 'RECOVER', treadPattern: 'recover' },
      { minute: 1, floor: 'Alt Snatches | CORE'	, tread: '8.5, 9.5, 10.5 | 2% 5, 6, 7', treadPattern: 'incline' },
      { minute: 2, floor: 'Alt Snatches | Burpee Snatches'	, tread: '2% 6, 7, 8 | SPRINT (30)', treadPattern: 'sprint' }
    ]
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getRandomBlock(blocks: ExerciseBlock[]): ExerciseBlock {
  return blocks[Math.floor(Math.random() * blocks.length)];
}

export function getAllMiddleBlocks(): ExerciseBlock[] {
  return [
    ...CHEST_BLOCKS,
    ...BACK_BLOCKS,
    ...DEADLIFT_BLOCKS,
    ...SQUAT_BLOCKS,
    ...LUNGE_BLOCKS,
    ...ARMS_BLOCKS,
    ...CORE_BLOCKS,
    ...POWER_BLOCKS
  ];
}

export function getBlocksByFocus(focus: string): ExerciseBlock[] {
  switch (focus) {
    case 'chest': return CHEST_BLOCKS;
    case 'back': return BACK_BLOCKS;
    case 'deadlift': return DEADLIFT_BLOCKS;
    case 'squat': return SQUAT_BLOCKS;
    case 'lunge': return LUNGE_BLOCKS;
    case 'arms': return ARMS_BLOCKS;
    case 'core': return CORE_BLOCKS;
    case 'power': return POWER_BLOCKS;
    default: return [];
  }
}

