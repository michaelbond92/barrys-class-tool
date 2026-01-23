import { Exercise } from '../types';

export const defaultExercises: Exercise[] = [
  // ===== CHEST =====
  {
    id: 'chest-press',
    name: 'Chest Press',
    category: 'chest',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'chest-fly',
    name: 'Chest Fly',
    category: 'chest',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'incline-press',
    name: 'Incline Press',
    category: 'chest',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'push-ups',
    name: 'Push-Ups',
    category: 'chest',
    isCompound: true,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'decline-push-ups',
    name: 'Decline Push-Ups',
    category: 'chest',
    isCompound: true,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'single-arm-chest-press',
    name: 'Single Arm Chest Press',
    category: 'chest',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },

  // ===== BACK =====
  {
    id: 'bent-over-row',
    name: 'Bent Over Row',
    category: 'back',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'single-arm-row',
    name: 'Single Arm Row',
    category: 'back',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'reverse-fly',
    name: 'Reverse Fly',
    category: 'back',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'renegade-row',
    name: 'Renegade Row',
    category: 'back',
    isCompound: true,
    isPowerMove: true,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'superman',
    name: 'Superman',
    category: 'back',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'pullover',
    name: 'Pullover',
    category: 'back',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },

  // ===== SHOULDERS =====
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    category: 'shoulders',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    category: 'shoulders',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    category: 'shoulders',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press',
    category: 'shoulders',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums'],
    usageHistory: []
  },
  {
    id: 'upright-row',
    name: 'Upright Row',
    category: 'shoulders',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'high-pull',
    name: 'High Pull',
    category: 'shoulders',
    isCompound: true,
    isPowerMove: true,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },

  // ===== ARMS =====
  {
    id: 'bicep-curl',
    name: 'Bicep Curl',
    category: 'arms',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    category: 'arms',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'tricep-kickback',
    name: 'Tricep Kickback',
    category: 'arms',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'tricep-extension',
    name: 'Tricep Extension',
    category: 'arms',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'skull-crusher',
    name: 'Skull Crusher',
    category: 'arms',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'close-grip-push-up',
    name: 'Close Grip Push-Up',
    category: 'arms',
    isCompound: true,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'dips',
    name: 'Dips',
    category: 'arms',
    isCompound: true,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'concentration-curl',
    name: 'Concentration Curl',
    category: 'arms',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },

  // ===== LEGS =====
  {
    id: 'squat',
    name: 'Squat',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells'],
    usageHistory: []
  },
  {
    id: 'sumo-squat',
    name: 'Sumo Squat',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'lunge',
    name: 'Lunge',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'lateral-lunge',
    name: 'Lateral Lunge',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'rdl',
    name: 'Romanian Deadlift (RDL)',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'single-leg-rdl',
    name: 'Single Leg RDL',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Mediums', '2 Light Dumbbells'],
    usageHistory: []
  },
  {
    id: 'step-up',
    name: 'Step Up',
    category: 'legs',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    category: 'legs',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    category: 'legs',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'legs',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    category: 'legs',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', 'Bodyweight'],
    usageHistory: []
  },

  // ===== CORE =====
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunch',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['2 Mediums', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'leg-raise',
    name: 'Leg Raise',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    category: 'core',
    isCompound: true,
    isPowerMove: true,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'v-up',
    name: 'V-Up',
    category: 'core',
    isCompound: false,
    isPowerMove: true,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'flutter-kick',
    name: 'Flutter Kick',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'toe-touch',
    name: 'Toe Touch',
    category: 'core',
    isCompound: false,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },

  // ===== POWER =====
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'squat-jump',
    name: 'Squat Jump',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'jump-lunge',
    name: 'Jump Lunge',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'box-jump',
    name: 'Box Jump',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'thruster',
    name: 'Thruster',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'clean-press',
    name: 'Clean to Press',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'snatch',
    name: 'Snatch',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'devil-press',
    name: 'Devil Press',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'man-maker',
    name: 'Man Maker',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'plyo-push-up',
    name: 'Plyo Push-Up',
    category: 'power',
    isCompound: true,
    isPowerMove: true,
    equipment: ['Bodyweight'],
    usageHistory: []
  },

  // ===== COMPOUND =====
  {
    id: 'squat-curl-press',
    name: 'Squat to Curl to Press',
    category: 'compound',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Mediums'],
    usageHistory: []
  },
  {
    id: 'lunge-curl',
    name: 'Lunge with Curl',
    category: 'compound',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Mediums'],
    usageHistory: []
  },
  {
    id: 'deadlift-row',
    name: 'Deadlift to Row',
    category: 'compound',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'squat-press',
    name: 'Squat to Press',
    category: 'compound',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    usageHistory: []
  },
  {
    id: 'reverse-lunge-twist',
    name: 'Reverse Lunge with Twist',
    category: 'compound',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Mediums', 'Bodyweight'],
    usageHistory: []
  },
  {
    id: 'inchworm',
    name: 'Inchworm',
    category: 'compound',
    isCompound: true,
    isPowerMove: false,
    equipment: ['Bodyweight'],
    usageHistory: []
  },
  {
    id: 'turkish-getup',
    name: 'Turkish Get-Up',
    category: 'compound',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Mediums'],
    usageHistory: []
  },
  {
    id: 'woodchop',
    name: 'Woodchop',
    category: 'compound',
    isCompound: true,
    isPowerMove: false,
    equipment: ['2 Mediums'],
    usageHistory: []
  }
];

export const CLASS_TYPE_CATEGORIES: Record<string, string[]> = {
  total_body: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'],
  chest_back_abs: ['chest', 'back', 'core'],
  arms_abs: ['arms', 'shoulders', 'core'],
  legs_core: ['legs', 'core']
};
