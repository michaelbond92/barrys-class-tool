// Complete blocks extracted from real Barry's Total Body classes
// Each block is a paired floor + tread sequence that stays together

export interface WorkoutBlock {
  floor: string[];  // Floor exercises for each minute
  tread: string[];  // Tread instructions for each minute
}

// ============================================
// ROUND 1 WARMUPS (Bodyweight focused)
// These are the first block of Round 1
// ============================================
export const ROUND1_WARMUPS: WorkoutBlock[] = [
  {
    "floor": [
      "WGS",
      "5 Pushups 5 Plank Jacks X Human",
      "3 Good Morning to 3 Squat",
      "Squat | Hold : Pulse"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "6.5, 7.5, 8.5 | 6, 7, 8",
      "5, 6, 7 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "WGS to 4 Puhups",
      "2 GM to 2 Squat",
      "Squat with 3 Hold | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "WGS Add Pushups",
      "GM to Squat to Lunge",
      "1 DB Squat | Hold : Rep"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "GM to Squat to Lunges",
      "WGS (pushup ladder)",
      "Shoulder Taps | MC"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 GM 2 Squats 2 Lunges",
      "WGS to Pushups",
      "Pushup to DD | Mountain Climbers"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 6, 7, 8",
      "3% 6, 7, 8 | 3% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "GM to WGS",
      "Pushup to Shoulder Taps | Reverse Lunges",
      "Squats : Hold | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "7.5, 8.5, 9.5 | 6.5, 7.5, 8.5",
      "5.5, 6.5, 7.5 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "WGS to Pushup",
      "2 GM to Squats to Lunges",
      "Squat : Hold | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 5, 6, 7",
      "7, 8, 9 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "3 GM 3 Squats 3 Pushups",
      "WGS | Cat Cow",
      "1 DB Tempo Squat | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "4% 6, 7, 8",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Good Morning to WGS",
      "2 Lunges to 3 Sauts to 4 Pushups",
      "X Human | Mountain Climbers"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "WGS",
      "WGS to Pushups",
      "Pushup to DD | Mountain Climbers"
    ],
    "tread": [
      "5, 6,7",
      "7,8, 9 | 6.5, 7.5, 8.5",
      "4% 6, 7, 8 | 4% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Cat Cow to Birddog | 3 GM",
      "3 GM 3 Squats 3 Pushups | Just Squat",
      "Pushup to DD | Plank Jacks"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "WGS to Pushup",
      "3 Good Morning to 3 Squat",
      "1 DB Tempo Squat | 1 DB Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 6, 7, 8",
      "3% 6, 7, 8 | 3% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "3 GM 3 Squats 3 Pushups",
      "WGS | Mountain Climbers",
      "1 DB Chest Press (+1)  to 1 Crunch",
      "Tempo Squat | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 6.5, 7.5, 8.5",
      "7, 8, 9",
      "5, 6, 7 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 GM 2 Squat to WGS",
      "Pushup (+1) to DD",
      "Commandos | Mountain Climbers"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "6,7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 Gm 2 Squats 2 Rev Lunges",
      "10 Mountain Climbers to WGS / 1 DL to Row",
      "Cont | Just Rows"
    ],
    "tread": [
      "5, 6, 7",
      "4% 5, 6 7 | 6, 7, 8",
      "6, 7, 8 | 8 , 9, 10"
    ]
  },
  {
    "floor": [
      "WGS to Cat Cow",
      "3 GM 3 Squats 3 Pushups",
      "Pushup to DD | MC"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "2% 5, 6, 7 | 2% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "WGS to Cat Cow",
      "2 GM 2 Squats to 2 Lunges",
      "Pushup to Shoulder Taps | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 Gm 2 Squats to WGS",
      "Mountan Climbers | 1 DL to Row",
      "Cont | Just Rows"
    ],
    "tread": [
      "5, 6,7",
      "7, 8, 9 | 6, 7, 8",
      "4% 6, 7, 8 | 4% 7.5, 8.5, 9.5"
    ]
  },
  {
    "floor": [
      "GM to Squat to WGS",
      "2 Lunges 4 Pushups 8 Mountain Climbers",
      "Pushups | 1 DB GM to Squat",
      "Just Squat 3 Pulses | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8",
      "7, 8, 9 | 5, 6, 7",
      "7,  8, 9 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "3 Good Morning to WGS",
      "2 Lunges to 3 Squats to 4 Pushups",
      "X Human | Mountain Climbers"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Cat Cow to Birddog | 3 GM",
      "3 GM 3 Squats 3 Pushups | Pushup to Sprawl",
      "Pushup to Sprawl | Plank Jacks"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 6.5, 7.5, 8.5",
      "7, 8, 9 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 GM 2 Squats 2 Pushups",
      "WGS | Mountain Climbers",
      "1 DB Chest Press (+1)  to 1 Crunch",
      "Tempo Squat | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8",
      "7, 8, 9 | 5, 6, 7",
      "7, 8, 9 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 GM 2 Squat to WGS",
      "Pushup (+1) to DD",
      "1 DB Tempo Squat | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 6, 7, 8",
      "3% 6, 7, 8 | 3% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 GM 2 Squats to WGS",
      "Pushups | OH Tricep Ext",
      "1 DB Squat | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 6.5, 7.5, 8.5",
      "7, 8, 9 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "WGS to Arm Circles",
      "2 GM 2 Squats 2 Pushups",
      "2 Pushups X Human | Mountain Climbers"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 8 | 6, 7, 8",
      "6.5, 7.5, 8.5, | 8, 9, 10"
    ]
  }
];

// ============================================
// ROUND 2 STARTERS (Can include weights)
// These are the first block of Round 2+
// ============================================
export const ROUND2_STARTERS: WorkoutBlock[] = [
  {
    "floor": [
      "R BO Row",
      "R Offset Pushup to X Human",
      "R Squat with 3 Pulses | R Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "7.5, 8.5, 9.5 | 5, 6, 7",
      "6% 5, 6, 7 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Alt Rows",
      "4 Rows 4 Squats",
      "Tempo Squats | Just Rows"
    ],
    "tread": [
      "5, 6, 7",
      "7.5, 8.5, 9.5 | 5, 6, 7",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Rev Lunge to Bicep Curls",
      "2 Curls 2 Lunges 2 Squats",
      "Same | HOLD: Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "8% 6.5, 7.5, 8.5 | 4% 6.5, 7.5, 8.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Wide Squats | Walk out RR to Pushup",
      "4 Squats to 4 RR to 4 Pushup"
    ],
    "tread": [
      "5, 6, 7 | 6% 7, 8, 9",
      "6, 7 8 | 6% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Alt Rows",
      "4 RR 4 Pushups 4 Squats",
      "Beastmakers",
      "Tempo Pushups | Double Rows"
    ],
    "tread": [
      "DM | DM RUN",
      "REST | DM SPRINT",
      "REST | DM SPRINT",
      "REST | DM SPRINT"
    ]
  },
  {
    "floor": [
      "Alt Chest Press",
      "8 Chest Press 4 Suitcase Squats",
      "4 Chest Press 8 Suitcase Squats",
      "Suitcase Squats | Chest Press BO"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "8, 9, 10 | 5, 6, 7",
      "4% 6, 7, 8  | 4% Sprint"
    ]
  },
  {
    "floor": [
      "2 R 2 L Shoulder Press",
      "Alt Skull Crusher | Both Arms",
      "V Sit | Russian Twists",
      "Toe Touches | Jacknifes"
    ],
    "tread": [
      "5, 6, 7",
      "4% 5, 6, 7 | 8% 5, 6, 7",
      "7, 8, 9",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 Cleans 2 Squats",
      "Just Squats | Just Cleans",
      "SHAKE Tempo Squat | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "8, 9, 10 | 7, 8, 9",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "Alt Curtsy Lunges with 3 Pulses",
      "Lungster",
      "Lungster | Just Bicep Curls",
      "Bicep Curls : Hold | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "7.5, 8,5, 9.5",
      "5, 6, 7 | 6, 7, 8",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Chest Press (r/ld)",
      "6 Chest Press 6 Suitcase Rows (-1)",
      "Same",
      "Tempo Chest Press | Hold: Chest Press BO"
    ],
    "tread": [
      "5, 6, 7",
      "4% 5.5, 6.5, 7.5 | 5% 6, 7, 8",
      "6% 6.5, 7.5, 8.5",
      "5. 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Rows",
      "6 Alt Rows 4 Pushups 2 Squat",
      "3 Double Rows 2 Pushups 1 Squat",
      "Tempo Pushups | Rows"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 / 7.5, 8.5, 9.5",
      "7.5, 8.5 9.5 | 5, 6, 7",
      "5, 6 7 / Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "2 Cleans 2 Squats",
      "4 Lunges 2 Cleans 2 Squat to Press"
    ],
    "tread": [
      "5, 6, 7 | 7.5, 8.5, 9.5",
      "5, 6, 7 | (Sprint 30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Rows",
      "6 Alt Rows 4 Pushups 2 Squat",
      "6 Rows 2 Squats",
      "Tempo Pushups | Rows"
    ],
    "tread": [
      "Recover",
      "6, 7, 8 | 7.5, 8.5, 9.5",
      "6, 7, 8 | 8, 9, 10",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Alt Chest Press with 3 Pulses",
      "10 Hammer (suticase crucnh when done)",
      "10 Close Grip (russian twists when done)",
      "CP DB | Both Arms Both Legs"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 7, 8, 9",
      "8, 9, 10 | 7, 8, 9",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "Alt Lunges with 3 Pulses",
      "Add 2 Bicep Curls at Bottom | Just 1",
      "Halfway Hold | Bicep Curl BO"
    ],
    "tread": [
      "6, 7, 8 | 6.5, 7.5, 8.5",
      "7, 8, 9 | 6% 7, 8, 9",
      "6% 5, 6, 7 | 6% Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Tempo DL Behind Bench",
      "8 Rows 8 Deadlifts",
      "8 Rows 8 Deadlifts",
      "Rows | Row BO"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 7, 8, 9",
      "8, 9, 10 | 7, 8, 9",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Alt Chest Press",
      "10 Chest Press 10 Suitase Squats (-2)",
      "Same",
      "Tempo Chest Press | Chest Press BO"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 / 7.5, 8.5, 9.5",
      "7.5 8.5, 9.5 | 5, 6, 7",
      "5, 6, 7 / Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "Tempo Wide Squat",
      "4 Wide Squats 4 DB Swings 4 Pushups",
      "Same",
      "RR to Pushup | Just Pushups"
    ],
    "tread": [
      "5, 6, 7",
      "8, 9, 10, | 7, 8, 9",
      "6, 7, 8 | 5, 6, 7",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Bicep Curls to Cross Body Curls",
      "6 Pushups 6 Bicep Curls 6 Squat to Press",
      "Same",
      "Same : Shake | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "8, 9, 10 | 5, 6, 7",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Tempo Deadlift to Row",
      "4 Rows 4 Curls"
    ],
    "tread": [
      "5, 6, 7",
      "8.7, 9.7, 10.7"
    ]
  },
  {
    "floor": [
      "INC Alt Chest Press with Pulse",
      "10 Wide (leg lift to hip raise)",
      "10 Close Grip (leg lift to hip raise)",
      "CP DB | Both Arms Both Legs"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 8, 9, 10",
      "5, 6, 7 | 6, 7, 8",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 R 2 L Chest Press",
      "20-25 Chest Press",
      "Situps when done",
      "Same : Halfway Hold | Russian Twists"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 8, 9, 10",
      "6, 7, 8 | 8, 9 10",
      "2% 5, 6, 7 | 2% Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "AMRAP: 6 Lunges 6 Bicep Curls 6 Squat to Press",
      "6 Lunges 6 Bicep Curls 6 Squat to Press",
      "Bicep Curl Hold | Squat to Press"
    ],
    "tread": [
      "6% 5, 6, 7",
      "7, 8, 9 | 7.5, 8.5 9.5",
      "6% 5, 6, 7 | 6% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Alt Bench Row with Pulse",
      "3 R Bench Rows 3 R Squats, 3 L Bench Rows 3 L Squats",
      "3 Double Arm Rows 3 Bench Squats",
      "Renegde Rows | Squats"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 8, 9, 10",
      "5, 6, 7 | 5, 6, 7",
      "6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Tempo DL Behind Bench",
      "Alt Rows | 6 Rows 6 DL",
      "6 Rows 6 DL",
      "RR | Row BO"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 7.5, 8.5, 9.5",
      "5, 6, 7 | 6, 7, 8",
      "7,  8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 Bicep Curls to 2 Lunges",
      "2 Lunges to 2 Squats (optional press)",
      "Shoulder Taps | Bicep Curl BO"
    ],
    "tread": [
      "6, 7, 8 | 6.5, 7.5, 8.5",
      "7, 8, 9 | 7.5,, 8.5, 9.5",
      "5, 6, 7 |  Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Bench Row with Pulse",
      "3 R Bench Rows 3 R Squats, 3 L Bench Rows 3 L Squats",
      "3 Double Arm Rows 3 Bench Squats",
      "Spider Crunches | Squats"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 8, 9, 10",
      "5, 6, 7 | 5, 6, 7",
      "6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Tempo DL Behind Bench",
      "Alt Rows | 6 Rows 6 DL",
      "6 Rows 6 DL",
      "Spider Crunch | Row BO"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9 | 7.5, 8.5, 9.5",
      "5, 6, 7 | 6, 7, 8",
      "7,  8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Deadlift to Alt Hi Pull",
      "12 Barbell Curls (RR when done)"
    ],
    "tread": [
      "5, 6, 7 | 6% 7, 8, 9",
      "5 6, 7 | 6% 8, 9, 10"
    ]
  }
];

// ============================================
// WORKOUT BLOCKS (Middle and end blocks)
// Can be used anywhere after the opener
// ============================================
export const WORKOUT_BLOCKS: WorkoutBlock[] = [
  {
    "floor": [
      "WGS to Pushup",
      "Good Morning to Squat to Lunges",
      "Fast Feet | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "R/L/D Chest Press",
      "Wide to Hammer | Just Hammer",
      "Lat Pullover to Situp to OH Tricep Ext",
      "Just Lat Pullover | Just OH Tricep Ext"
    ],
    "tread": [
      "Recover",
      "6, 7, 8 | 7.5, 8.5, 9.5",
      "6, 7, 8 | 8, 9, 10",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Suitcase Crunch",
      "Toe Touches | Jacknifes",
      "Boat Pose | Russian Twists"
    ],
    "tread": [
      "Recover",
      "4% 5, 6, 7 | 7, 8, 9",
      "7, 8, 9 |  Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "AMRAP: 6 Lunges 4 RR 2 Pushups",
      "AMRAP: 6 Lunges 4 RR 2 Pushups",
      "AMRAP/Shake | CHOICE"
    ],
    "tread": [
      "Recover",
      "2% 5, 6, 7 | 2% 7.5, 8.5, 9.5",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "3 Good Morning to 3 Squat",
      "4 Pushups 2 Commandos to 1 Pike",
      "Leg Lift | Plank Jacks"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "4 Alt 2 Double Chest Press",
      "Tempo Chest Press | Rep Out",
      "Suitcase Crunch | Leg Lift",
      "Toe Touches | Jacknifes"
    ],
    "tread": [
      "Recover",
      "2% 6, 7, 8 | 4%",
      "6% | 8%",
      "5, 6, 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "8 Waiter Curls 8 OH Tricep Ext (-1)",
      "Cont.",
      "Shoulder Press Hold | Squat to Press"
    ],
    "tread": [
      "Recover",
      "7, 8, 9 | 8, 9, 10",
      "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Plank Taps",
      "Squat to Hi Pull",
      "Snatches | Burpee Snatches"
    ],
    "tread": [
      "Recover",
      "7.5, 8.5, 9.5 | 8.5, 9.5, 10.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "WGS | BW Squat to Lunge",
      "1 DB Squat to Lunge",
      "Commandos | Mountain Climbers"
    ],
    "tread": [
      "5, 6, 7",
      "6.5, 7.5, 8.5 | 7, 8, 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Heavy Reverse Lunges",
      "1 DB Reverse to Cursty Lunge",
      "Plank DB Drag",
      "Pushup to Down Dog | Pushups"
    ],
    "tread": [
      "Recover",
      "7, 8, 9 | 7.5, 8.5, 9.5",
      "6% 5.5, 6.5, 7.5",
      "5.5, 6.5, 7.5 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Lat Pullover | Add Crunch",
      "Knee Tucks | Russian Twists",
      "Toe Touches | Jacknifes"
    ],
    "tread": [
      "Recover",
      "8, 9, 10 | 7, 8, 9",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Heavy Deadlift",
      "1 DB Switch with 3 Pulses",
      "Squat to Hi Pull | Snatches"
    ],
    "tread": [
      "Recover",
      "8.5, 9,5, 10.5 | 7, 8, 9",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "R/L/D Chest Press",
      "Chest Press BO | Suicase Crunch",
      "Suitcase to Jacknige | JAcknifes",
      "Chest Press with Pulse | Chest Press BO"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 7, 8, 9",
      "6.5, 7.5, 8.5 | 6, 7, 8",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Tempo Deadlift",
      "8 DB Swings 4 Goblet Squats",
      "Same | Plank",
      "Heavy Deadlift | Deadlift Clean Squat"
    ],
    "tread": [
      "RECOVER",
      "8, 9,10 | 7.5, 8.5, 9.5",
      "7, 8, 9 | 6.5, 7.5, 8.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "L BO Row",
      "L Offset Pushup to X Human",
      "L Squat with 3 Pusles | L Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "3% 5, 6, 7 | 9, 10, 11"
    ]
  },
  {
    "floor": [
      "Plank Taps",
      "Squat to Hi Pull | Snatches"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Chest Press",
      "2 Wide 2 Close Grip | Close Grip BO",
      "DB Situp to 3 Presses",
      "Just Situp | Just Presses"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7, 8, 9",
      "4% 6, 7, 8 | 7, 8, 9",
      "5, 6, 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Tempo Deadlift",
      "3 Deadift to 1 Squat",
      "6 Swings 6 OH Tricep Ext",
      "Just OH Tricep Ext | Just Swings"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7.5, 8.5, 9.5",
      "3% 6, 7, 8 | 7.5, 8.5, 9.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Lat Pullover to Crunch",
      "Toe Touches | Jacknifes",
      "Boat Pose | Russian Twists"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Squat to Hi Pull",
      "Plank | Snatches",
      "Plank | Snatches"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "7, 8, 9 | Sprint (30 Sconds)"
    ]
  },
  {
    "floor": [
      "Tempo Heavy Deadlift",
      "8 Squats (Pushups when done)",
      "8 Squats (Pushups when done)",
      "Deadlift | Deadlift Clean Squat"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7.5, 8.5, 9.5",
      "7, 8, 9",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Chest",
      "Chest",
      "Row to Squat to Hi Pull to Snatch",
      "Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 8, 9, 10",
      "7, 8, 9",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Crunch to Half to Full Situp",
      "Just Situp | HOLD: Russian Twists",
      "Leg Lifts | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "6% 7, 8, 9 | 3% 7, 8, 9",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "4 RR 4 Pushups 4 X Human",
      "4 RR 4 Pushups 4 X Human",
      "Shoulder Press Hold | Burpees or Weighted Burpees"
    ],
    "tread": [
      "RECOVER",
      "4% 7.5, 8.5, 9.5 | 2% 7.5, 8.5, 9.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "R/L/D Chest Press",
      "Close Grip to Reverse Grip | Rep Out",
      "3 Lat pull overs to 1 Power Situp to OH Tricep",
      "Just Situp | OH Tricep"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7, 8, 9",
      "8, 9, 10 | 7, 8, 9",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Heavy Deadlift",
      "3 Deadlifts 1 Squat",
      "Alt Reverse Lunge | Stay Low",
      "DB Pulse Switch | DB SWINGS"
    ],
    "tread": [
      "RECOVER",
      "5.5, 6.5, 7.5 | 7, 8, 9",
      "8.5, 9.5, 10.5  | 7, 8, 9",
      "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Commandos",
      "3 Hi Pull to 1 Snatch",
      "Just Hi Pull | Just Snatches"
    ],
    "tread": [
      "RECOVER",
      "5, 6, 7 | 9, 10, 11",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "SAME",
      "Squat with Pause | Squat to Press"
    ],
    "tread": [
      "RECOVER | 5% 7, 8, 9",
      "5.5, 6.5, 7.5 | 5% Sprint"
    ]
  },
  {
    "floor": [
      "Plank | Squat to Press or Double Snatch",
      "Shoulder Press Hold | Double Snatch, Burpees, Weighted Burpees"
    ],
    "tread": [
      "RECOVER | 4% 7, 8, 9",
      "5, 6, 7 | 4% Sprint"
    ]
  },
  {
    "floor": [
      "4 Alt 2 Double",
      "Tempo Chest Press | Burn Out",
      "1 Leg Lift 1 Close Grip | Close Grip Leg Lift"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 4% 5, 6, 7",
      "4% 6, 7, 8 | 4% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "L SDL to Reverse Lunge",
      "Cursty Lunge | Windshield Wiper",
      "L Squat with Pulse | Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5% 5, 6, 7",
      "5% 6, 7, 8 | 5% Sprint"
    ]
  },
  {
    "floor": [
      "R SDL to Reverse Lunge",
      "Cursty Lunge | Windshield Wiper",
      "R Squat with Pulse | Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 6% 5, 6, 7",
      "6% 6, 7, 8 | 6% Sprint"
    ]
  },
  {
    "floor": [
      "Alt Squat to Hi Pulls",
      "10-12 Snatches (Plank jacks when done)",
      "12-14 Snatches (Squat jumps when done)",
      "Plank / Snatches"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 / 7, 8 9",
      "7, 8, 9  / 5, 6, 7",
      "5, 6, 7/ 45 Seconds"
    ]
  },
  {
    "floor": [
      "Alt Rows",
      "2 Pushups 2 Rows | 1 and 1",
      "Tempo Pushups | Just Rows"
    ],
    "tread": [
      "RECOVER",
      "5.5, 6.5, 7.5 | 6.5, 7.5, 8.5",
      "7.5, 8.5 9.5 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "1 DB Reverse Lunges",
      "Deadlift | Deadlft to Reverse Lunges",
      "Same | Just Heavy Lunges"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 7, 8, 9",
      "6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "OH Tricep Ext",
      "12 Sumo Squats (DB Swings when done)",
      "Tempo Sumo Squat | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7, 8, 9",
      "8, 9, 10 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Leg Lift to Hip Raise",
      "Toe Touches | Jack Knifes"
    ],
    "tread": [
      "RECOVER",
      "3% 7, 8, 9  | 3% Sprint"
    ]
  },
  {
    "floor": [
      "2 Pushups to Squat to Hi Pull",
      "Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "2% 8, 9, 10 | 2% Sprint"
    ]
  },
  {
    "floor": [
      "R SDL to Cursy Lunge",
      "3 Rows 3 Offset Pushups 3 Hi Pulls",
      "Same | R Snatches"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6 7",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Plank DB Drag",
      "2 Curls 2 Squat to Press | Curl Squat Press",
      "Shoulder Press Hold | Choice (MC, Snatches, Burpees)"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 R 2 L Chest Press",
      "Burn Out | CORE",
      "Tempo Close Grip | Close Grip Leg Lift"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5 9.5 | 5, 6, 7",
      "7, 8, 9 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Heavy Deadlift",
      "Heavy Squat (3 Pulses) | Just Squat",
      "Pulse Squat | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "7.5, 8.5, 9.5  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "3 BO Rows each side",
      "2 Push Ups to Alt Squat to Hi Pull",
      "Just Squat to Hi Pull | Snatch"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "8, 9, 10 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Lunges with 3 Pulses",
      "AMRAP  4 Curl to Press 4 Lunges",
      "AMRAP",
      "TEMPO. Front Squat | Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "5 % 5, 6, 7 | 10% 5, 6, 7",
      "7, 8, 9",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "WGS to Pushup",
      "3 Good Morning to 3 Squat",
      "1 DB Tempo Squat | 1 DB Squat to Press"
    ],
    "tread": [
      "5, 6. 7",
      "7, 8 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 Tempo 2 Alt Chest Press",
      "1 Wide 1 Close Grip | Close Grip Rep Out",
      "Situp to Press (+1)",
      "Situps : Hold | Russian Twists"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9",
      "6% (7, 8, 9) | 6% (5, 6, 7)",
      "0% (5, 6, 7) | 8.5 9.5 10.5"
    ]
  },
  {
    "floor": [
      "L Bulgarian Split Squat",
      "4 Offset Pushups 4 Rows",
      "L Tempo Squat | L Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 / 5.5, 6.5, 7.5",
      "/ Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "Suitcase Crunch (CORE)",
      "Lat Pullover to Power Situp",
      "Toe Touches | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "8, 9, 10 | Sprint (30 Seonds)"
    ]
  },
  {
    "floor": [
      "2 Good Morning to 2 Squat to 2 Lunges",
      "WGS to 4 Shoulder Taps",
      "3 Pushups 6 Hip Dips",
      "1 DB Squat with 3 Pulses | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 7, 8, 9",
      "2% 6, 7, 8 | 7, 8 9",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "R/L/ Close Grip",
      "Just Wide | Just Close Grip",
      "Lat Pullover to Situp to OH Tricep Ext",
      "Just Lat Pullover | Just OH Tricep Ext"
    ],
    "tread": [
      "Recover",
      "6, 7, 8 | 7, 8, 9",
      "6 % 6, 7, 8 | 7, 8, 9",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "BW Lunges with 3 Pulses",
      "4 Lunges 4 Squat to Press",
      "Just Lunges | Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 / 5.5, 6.5, 7.5",
      "5.5, 6.5, 7.5\\ Sprint (45 seconds)"
    ]
  },
  {
    "floor": [
      "Pushup to X Human",
      "Tempo Pushup | CHOICE"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Deadlift",
      "4 Deadlifts 4 Squats",
      "Goblet Squat | Hold : Rep Out"
    ],
    "tread": [
      "RECOVER",
      "5% 6, 7, 8 | 5% 6.5, 7.5, 8.5",
      "6.5, 7.5, 8.5,  | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "L Arm Row",
      "4 Offset Pushups 4 Rows",
      "R Squat to Hi Pull | Just Snatch"
    ],
    "tread": [
      "RECOVER",
      "4% 6, 7, 8 | 7, 8, 9",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "R Arm Row",
      "4 Offset Pushups 4 Rows",
      "L Squat to Hi Pull | L Just Snatch"
    ],
    "tread": [
      "RECOVER",
      "3% 6, 7, 8 | 2% 7.5, 7.5, 9.5",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "4 Toe Touches 4 Single Leg Lifts",
      "Just Leg Lift | Jacknifes",
      "V Sit Hold | Russian Twists"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "Pushups",
      "Weighted Burpees",
      "Plank | Choice"
    ],
    "tread": [
      "RECOVER",
      "9, 10, 11 | 8, 9, 10",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "4 Alt 2 Double Chest Press",
      "8-10 Chest Press (Suitcase crunch when done)",
      "Chest Press 3 Pulses | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "6% 6.5, 7.5, 8.5 | 7, 8, 9",
      "5, 6, 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Heavy Squat with 3 second pause",
      "8-10 Squats (Deadlift when done)",
      "1 DB SQUAT HOLD | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "4% 7, 8, 9 | 7.5, 8.5, 9.5",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "3 Gorrila Rows e/s",
      "8-10 Squat to Hi Pulls (plank when done)",
      "Alt Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "2% 7.5, 8.5, 9.5 | 8, 9, 10",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "X Human with DB",
      "Hip Dips | 6 Sumo Squats 6 Pushups (-1)",
      "Ladder Cont.",
      "Shoulder Press Hold | Double Snatch, Burpee, MC"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10",
      "5.5, 6.5, 7.5, | 6.5, 7.5, 8.5",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "WGS to Pushup",
      "3 GM to 3 Squats | 1 and 1",
      "Tempo Squat : Hold | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 2% | 4%",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "3 OH Tricep Ext to 1 Power Situp",
      "Just Power Situp | Burn Out OH Tricep Ext",
      "1 DB Squat Pulse Ladder",
      "Shoulder Press Hold : March | 1 DB Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 5%",
      "7% | 9%",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Plank DB Drag",
      "1 DB 21s (Biceps)",
      "Tempo Bicep Curl | Bicep BO"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 / 5.5, 6.5, 7.5",
      "5.5, 6.5, 7.5 / Sprint 45 Seconds)"
    ]
  },
  {
    "floor": [
      "3 Bent Over Rows e/s",
      "2 Squat to Hi Pulls to 1 Snatch",
      "SHAKE? / Just Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10. 5 / 5, 67",
      "5, 6, 7 / Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "GM to Squat to Lunges",
      "WGS to Pushup | Just Pushup",
      "1 DB Squat | Squat to Press"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "2% 6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "1.5 Deadlift",
      "8 Squats (Shoulder Taps when Done)",
      "8 Squats (Hip Dips whe done)",
      "Deadlift | Deadlift Clean Squat"
    ],
    "tread": [
      "2% RECOVER",
      "4% 6, 7, 8 | 7, 8, 9",
      "6% 6, 7, 8",
      "8% 5, 6, 7 | 7, 8, 9"
    ]
  },
  {
    "floor": [
      "R SDL to Lunge",
      "(R) 3 Rows Offset Pushups 3 Squat to Hi Pulls",
      "Same: Hold Row | R Arm Rows"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7, 8, 9",
      "8, 9, 10 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "OH Tricep Ext",
      "2 Snatches e/s 2 Pushups",
      "Same : SHAKE | CHOICE"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
      "5, 6 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Temo Deadlift",
      "Alt Rows | R/L Double",
      "Wide Squats | Hold : Rep Out"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 5, 6, 7",
      "7, 8, 9 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Situp to Shoulder Press (+1)",
      "Shoulder Press Rep Out | 4 Cherry Pickers 4 Alt Leg Lifts",
      "Same | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "7.5, 8.5 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Front Rack Squat",
      "4 Goblet Squats 8 DB Swings",
      "Squat Pulse Switch | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "8, 9, 10 | Sprint (30 Seocnds)"
    ]
  },
  {
    "floor": [
      "Plank Hip Dips",
      "3 Squats 2 Lunges 1 Snatch e/s",
      "Same",
      "Shake : _______ | Snatches, Burpees, MC"
    ],
    "tread": [
      "RECOVER",
      "3% 6, 7, 8 | 4% 6.5, 7.5, 8.5",
      "5% 7, 8, 9",
      "5. 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "4 Alt 2 Double",
      "Just Hammer | Hollow Body Hold",
      "Close Grip Pulse | Chest BO"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 6, 7 8",
      "5% 6, 7, 8 | 5% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Alt Squat to Hi Pulls",
      "10-12 Snatches (Plank Jacks when done)",
      "10-12 Snatches (MC when done)",
      "Snatches | Burpee Snatches"
    ],
    "tread": [
      "Recover",
      "7, 8, 9 / 8, 9, 10",
      "8, 9, 10 | 5, 6, 7",
      "5, 6 7 / Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "1 DB Goblet Squat",
      "Tempo Heavy Squat",
      "3 Deadlift to 1 Squat",
      "Shake : Deadlift | Deadlift Clean Squat"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7, 8, 9",
      "8% 6, 7, 8 | 8% 7, 8, 9",
      "5, 6, 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "R/L/Double",
      "Chest | Lat Pullover",
      "Toe Touches | Jacknifes",
      "Tempo Chest | Chest BO"
    ],
    "tread": [
      "RECOVER",
      "6.5, 7.5, 8.5 | 7.5, 8.5, 9.5",
      "6% 6.5, 7.5, 8.5 | 6% 7.5, 8,5, 9.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "3 Bent Over Rows e/s",
      "3 Offset Pushups to 3 Snatches (Devi'ls Press)",
      "Same : SHAKE | Just Snatches"
    ],
    "tread": [
      "RECOVER",
      "4% 7, 8, 9 | 4% 8, 9, 10",
      "5, 6, 7  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 Lunges 1 Clean 1 Squat to Press",
      "Lunges | Squat to Press"
    ],
    "tread": [
      "RECOVER | 8, 9, 10",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "4 RR to 2 Pushup",
      "Plank | Weighted Burpee"
    ],
    "tread": [
      "RECOVER | 8.5, 9.5, 10.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "4 Alt Chest Press 2 Hammer Grip",
      "Just Hammer | CORE",
      "Close Grip 3 Pulses | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 4% 5, 6, 7",
      "4% 6, 7, 8 | 4% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "1.5 Deadlift",
      "4 Deadlifts 4 Heavy Lunges",
      "DB Pulse Swtich  | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 6% 5, 6, 7",
      "6% 6, 7, 8 | 6% Sprint"
    ]
  },
  {
    "floor": [
      "Plank Hip Dips",
      "3 Squats 2 Lunges 1 Snatch e/s",
      "Same",
      "Plank | Snatches, Burpees, MC"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8, | 8, 9, 10",
      "6, 7, 8 | 8.5, 9.5, 10.5",
      "6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "L Arm Row with 3 Pulses",
      "3 Rows 3 Pushups 3 Hi Pulls",
      "R Squat to Hi Pull | Just Snatch"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5.5, 6.5, 7.5",
      "7, 8, 9  / Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "R Arm Row wth 3 Pulses",
      "3 rows 3 Pushups 3 Hi Pulls",
      "L Squat to Hi Pull | L Just Snatch"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "8, 9, 10 | Sprint (30 Seonds)"
    ]
  },
  {
    "floor": [
      "Tempo DL",
      "6 Squats 6 DL (-1)",
      "Cont.",
      "Squat Hold | Choice"
    ],
    "tread": [
      "RECOVER",
      "6.5, 7.5, 8,5 | 7.5, 8.5, 9.5",
      "8.5, 9.5, 10.5 | 6.5, 7.5, 8.5",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "R/L/ Double",
      "Tempo 1, 2, 3 | Chest BO",
      "Chery Pickers | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | 7.5, 8.5, 9.5",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "R SDL",
      "R 3 Offset Pushups 3 DB Swings 3 Squat to Press",
      "Same : Shake | R Arm Snatch"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | 8, 9, 10",
      "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "L SDL",
      "L 3 Offset Pushups 3 DB Swings 3 Squat to Press",
      "Same : Shake | L Arm Snatch"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | 8.5, 9.5, 10.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "RR",
      "6 Pushups 6 Curls 6 Squat to Press (-1)",
      "6 Pushups 6 Curls 6 Squat to Press (-1)",
      "Plank | Weighted Burpee or Burpee"
    ],
    "tread": [
      "RECOVER",
      "6.5, 7.5, 8.5 | 7, 8, 9",
      "7.5, 8.5, 9.5 | 4% 7.5, 8.5, 9.5",
      "4% 5, 6, 7 | 4% Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 GM to 2 Squat 2 Pushups",
      "Pushups | WGS",
      "Shoulder Taps | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 2% | 4%",
      "6, 7, 8 | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Alt Chest Press with 2 second pause",
      "8 -10 Chest Press (Squat to Press when done)",
      "8 Close Grip (Squat to Press when done)",
      "Tempo Chest Press | Chest Press BO"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9",
      "8% (7, 8, 9) | 8% (5, 6, 7)",
      "4% (5, 6, 7) | 4% 8.5 9.5 10.5"
    ]
  },
  {
    "floor": [
      "Goblet Squat (1.5)",
      "DB Swings | OH Tricep Ext",
      "Squat Hold | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 7, 8, 9",
      "5.5, 6.5, 7.5  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 e/s Alt Hi Squat to Hi Pull",
      "2 offset pushups to 2 snatches e/s",
      "snatches | burpee snatches"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
      "5, 6, 7 | Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "4 Lunges 2 Pushups WGS",
      "Pushups | GM to Squat",
      "Squat : Hold | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 4%",
      "6, 7, 8 | 7.5, 8.5, 9.5 4%"
    ]
  },
  {
    "floor": [
      "Alt Chest Press to Hammer Grip",
      "Burn Out Hammer | CORE",
      "CORE | CP Deadbug",
      "Tempo Both Arms Both Legs | Both Arms Both Legs"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 6, 7, 8 8%",
      "6, 7 8 | 6, 7, 8 8%",
      "6, 7, 8 | 7, 8, 9 8%"
    ]
  },
  {
    "floor": [
      "Power Situp",
      "Lat Pullover (+1) to Crunch",
      "Leg Lifts | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "8, 9, 10  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Suitcase Squat (+1) to Hammer Curl",
      "4 Pushups 4 Suitcase Squats 4 Curl to Press (-1)",
      "Shoulder Press Hold | Double Snatch or Burpee"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "8.5, 9.5, 10.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "OH Tricep Ext (+1) Power Situp",
      "Power Situp | OH Tricep Ext",
      "Single Leg Lift | Single Leg Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | 7.5, 8.5, 9.5",
      "5, 6 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Goblet Squat",
      "6 Chest Press 6 Front Squat",
      "Tempo Front Rack | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 8, 9, 10",
      "5, 6 7, | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Wide to Close Grip",
      "6 Close Grip 6 Suitcase Squats",
      "Tempo Chest Press | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 8.5, 9.5, 10.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Plank DB Drag",
      "Alt Hi Pull | Plank DB Drag",
      "Snatch | Plank DB Drag",
      "Snatches | Burpee Snatch"
    ],
    "tread": [
      "RECOVER",
      "5.5, 6.5, 7.5 | 7, 8, 9",
      "8.5, 9.5, 10.5  | 7, 8, 9",
      "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Rows",
      "8 R 8 L (plank when done)",
      "RR | Double Arm Rows"
    ],
    "tread": [
      "RECOVER",
      "6% 5, 6, 7 | 6% 6.5, 7.5, 8.5",
      "6.5, 7.5, 8.5,  | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "L SDL to Reverse Lunge",
      "Cursty Lunge | Windshield Wiper",
      "L Squat with Pause Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "5% 5 ,6 7 | 7, 8, 9",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "R SDL to Reverse Lunge",
      "Cursty Lunge | Windshield Wiper",
      "R Squat with Pause | Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "4% 5, 6, 7 | 4% 7.5, 7.5, 9.5",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Plank DB Drag",
      "2 Pushups 2 Squat to Hi Pulls (+2)",
      "Same",
      "Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 / 8, 9, 10",
      "8, 9, 10 | 5, 6, 7",
      "5, 6, 7 / Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "R/L Close Grip",
      "Tempo Wide | Close Grip BO",
      "Front Rack Squat",
      "Suitcase Squat | Suitcase Clean to Front Rack"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9",
      "7.5, 8.5, 9.5 | 3% 5, 6, 7",
      "3% 5.5, 6.5, 7.5 | 3% 8.5, 9.5 10.5"
    ]
  },
  {
    "floor": [
      "Tempo Deadlift",
      "8 Rows 8 DL",
      "Same",
      "Alt Squat to Hi Pull | Snatches"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9",
      "8, 9, 10 | 4% 5, 6, 7",
      "4% 6, 7, 8 | 4% Sprint"
    ]
  },
  {
    "floor": [
      "Seated Alt Bicep Curl",
      "Bicep BO | Toe Touches",
      "Single Leg Lift | Single Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "4 Lunge to 2 Squat to Press",
      "Front Squat | Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Lunges with 3 Pulses",
      "1.5 Squat | .5 : Rep Out",
      "1 DB Squat with 3 Pulses | 1 DB Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "4% 6.5, 7.5, 8.5 | 7.5, 8.5, 9.5",
      "5, 6, 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Alt Chest Press with 3 Pulses",
      "10-12 Chest Press (cherry pickers when done)",
      "1 Close Grip 1 Leg Lift | Same Tiime"
    ],
    "tread": [
      "RECOVER",
      "3% 7, 8, 9 | 8, 9, 10",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "1.5 Deadlift",
      "4 DL 4 Heavy Lunges",
      "1 DB Squat Pulse | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "2% 7.5, 8.5, 9.5 | 8.5, 9.5, 10.5",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "Tempo Deadlift",
      "10-12 Squats (Duck walk when done)",
      "8-10 Squats (Duck walk when done)",
      "Deadlift | Deadlift Clean Squat"
    ],
    "tread": [
      "RECOVER",
      "8% 5.5, 6.5, 7.5 | 4% 6.5, 7.5, 8.5",
      "7.5, 8.5, 9.5",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "4 RR to X Human",
      "Just Reneage Rows | Alt Lunges",
      "Alt Lunges | ! DB Lunge"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | 6.5, 7.5, 8.5",
      "7, 8 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 Suticase Squat 2 Hammer Curl to Press",
      "Shoulder Press Hold | Double Snatch or Burpees"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Row with 3 Second Pause",
      "4 Double Rows 4 Pushups",
      "Spider Crunches | 1 Row 1 Pushup"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 6, 7, 8",
      "4% 6, 7, 8 | 4% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Tempo Deadift",
      "10 Deadlits (1 DB Goblet Squat when done)",
      "Deadlifts | Deadlfit Clean Squat"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5.5, 6.5, 7.5",
      "4% 5.5, 6.5, 7.5  | 4% 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "3 R BO Rows 3 Sumo Squats 3 L BO Rows",
      "Same | Just Sumo Squats",
      "Alt Suquat to Hi pull | Snatches"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "4% 5, 6, 7 | 4% 9, 10, 11"
    ]
  },
  {
    "floor": [
      "Tempo Alt Chest Press",
      "6 Chest Press 6 Goblet Squats",
      "Tempo Chest Press | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "5% 5 ,6 7 | 7, 8, 9",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Tempo Goblet Squat",
      "6 Close Grip 6 Suitcase Squats",
      "Tempo Front Rack Squat | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "4% 5, 6, 7 | 4% 7.5, 7.5, 9.5",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Lat Pull to Power Situp to OH Tricep Ext",
      "Just OH Tricep Ext | Just Lat Pull",
      "Toe Touches | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | 5, 6, 7",
      "7, 8, 9 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Alt Chest Press with 3 Pulses",
      "Chest Press BO | V Sit : Russian Twists",
      "Close Grip 3 Pulses | Close Grip BO"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 5, 6, 7",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "1 DB Lunge with 3 Pulses",
      "Deadlift | 4 Deadlifts 4 Lunges",
      "Same | Just Lunges"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "8, 9, 10 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt to Close Grip",
      "3 Wide 3 Close Grip / Shake",
      "Tempo Chest Press | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "4% 7, 8, 9| 6, 7, 8",
      "5, 6, 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "R SDL",
      "R 3 Offset Pushups 3 R Sumo Squats",
      "Tempo R Front Rack Squat | R Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "4% 7.5 8.5, 95.| 6.5, 7.5, 7.5",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "L SDL",
      "L 3 Offset Pushups 3 Sumo Squats",
      "Tempo L Front Rack Rquat | L Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "4% 8, 9, 10 | 7, 8, 9",
      "5, 6, 7 | Sprint"
    ]
  },
  {
    "floor": [
      "4 RR to 4 X Humans",
      "Halfway Hold | Curl BO"
    ],
    "tread": [
      "RECOVER",
      "8.8, 9.8, 10.8"
    ]
  },
  {
    "floor": [
      "CORE",
      "4 Lunges 3 Curls 2 Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Same",
      "Plank | CHOICE"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "L Arm Row with Pulse",
      "3 Rows 3 Pushups 3 Hi Pulls",
      "L Squat to Hi Pull | Just Snatch"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 / 5.5, 6.5, 7.5",
      "5.5, 6.5, 7.5 | Sprint (40 Seconds)"
    ]
  },
  {
    "floor": [
      "R Arm Row wth Pulse",
      "3 rows 3 Pushups 3 Hi Pulls",
      "L Squat to Hi Pull | L Just Snatch"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 / 5, 6, 7",
      "5, 6, 7 | Sprint (40 Seconds)"
    ]
  },
  {
    "floor": [
      "Cat Cow to Bird Dogs to WGS",
      "2 GM 3 Squats 4 Pushups",
      "Squat Hold | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "2% 5, 6, 7 |  8, 9, 10"
    ]
  },
  {
    "floor": [
      "SEATED Tempo OH Tricep Ext",
      "Toe Touches | Jacknifes",
      "R/L/ Double Chest Press",
      "Tempo Chest Press | Chest Press BO"
    ],
    "tread": [
      "Recover",
      "6% 5, 6, 7 | 6% 6, 7, 8",
      "7, 8, 9",
      "3% 5, 6, 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "R Arm Concentraion Curl",
      "R Arm Tempo | R Arm BO",
      "R  Arm Squat to Hi Pull  | R Arm Snatches"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7, 8, 9",
      "8, 9, 10 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Plank DB Drag",
      "10 Deadlifts 5 Pushups",
      "Same : Shake | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
      "5, 6, 7 Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "R SDL",
      "3 Rows 3 Squats / 3 Pushups 3 Squat to Hi Pulls",
      "3 Pushups 3 Squat to Hi Pulls | Snatches"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 (+0.3 every 15 seconds)",
      "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "L SDL",
      "3 Rows 3 Squats / 3 Pushups 3 Squat to Hi Pulls",
      "3 Pushups 3 Squat to Hi Pulls | Snatches"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5 9.5 (+0.3 every 15 seconds)",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Suitcase Squat",
      "Tempo Chest Press | Chest Press BO"
    ],
    "tread": [
      "RECOVER",
      "3% 5, 6, 7 | 3% Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "4 Goblet Squats 8 DB Swings",
      "Same | DB Swings"
    ],
    "tread": [
      "RECOVER",
      "CHOICE INC | INC SPRINT (30 Seconds"
    ]
  },
  {
    "floor": [
      "1 DB Goblet Squat to Reverse Lunge",
      "Heavy Squat with 3 Second Hold",
      "3 Deadlifts 3 Squats",
      "Shake : Deadlift | Deadlift Clean Squat"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9",
      "5, 6, 7 | 6, 7, 8",
      "7, 8, 9 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "R/L/Double",
      "Chest | Lat Pullover",
      "Toe Touches | Jacknifes",
      "Tempo Hammer Grip | Chest BO"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5",
      "5.5, 6.5, 7.5 | 6.5, 7.5, 8.5",
      "7.5, 8.5, 9.5  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "3 Bent Over Rows e/s",
      "3 Offset Pushups to 3 Squat to Hi Pulls (Devi'ls Press)",
      "Same : SHAKE | Just Snatches"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7, 8, 9",
      "8, 9, 10  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "RR to 2 Pushups",
      "Add 2 Wide Squats",
      "Shoulder Press Hold | Double Snatch or Burpees"
    ],
    "tread": [
      "6% RECOVER",
      "7, 8, 9 | 8, 9, 10",
      "6%, 5, 6, 7 | 6% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "2 GM 2 Squats 2 Reverse Lunges",
      "Mountain Climbers | WGS",
      "Pushups | Burpees"
    ],
    "tread": [
      "5, 6,7",
      "7, 8, 9 | 6, 7, 8",
      "6.5, 7.5, 8,5  | 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Alt Seated Bicep Curls",
      "Curl to Press | Just Shoulder Press",
      "Leg Lift | Close Grip Leg Lift"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 5% 5, 6, 7",
      "5% 6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Tempo Deadlift",
      "Add Row | Just Rows",
      "RR to Pushups | Just Pushups"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 4% 5, 6, 7",
      "4% 6.5, 7.5, 8.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Lunge",
      "Add Hammer Bicep Curl | Just Hammer Curls",
      "Squat to Press | Weighted Burpees"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 3% 5, 6, 7",
      "3% 7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Chest Press with Pulse",
      "10 Chest Press (Goblet Squat when done)"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "10 Close Grip (Goblet Squat when done)",
      "Alt Squat to Hi Pull | Snatches"
    ],
    "tread": [
      "RECOVER",
      "Runners Choice"
    ]
  },
  {
    "floor": [
      "3 Deadlifts 3 Squats",
      "6-8 Pushups (Plank jacks) | 6-8 Pushups (Plank jacks)",
      "Pushup to sprawl | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "2% 5, 6, 7 |  8, 9, 10"
    ]
  },
  {
    "floor": [
      "Alt Chest Press",
      "10 Chest Press (1 DB Goblet Squat when done)",
      "10 Close Grip (1 DB Goblet squat when done)",
      "Alt Chest press dead bug | Both Arms Both Legs"
    ],
    "tread": [
      "Recover",
      "6% 5, 6, 7 | 6% 6, 7, 8",
      "7, 8, 9",
      "3% 5, 6, 7 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Alt Lunge with 3 Pulses",
      "Add Double Bicep Curl | Bicep Curl BO",
      "Squat to Press | Weighted Burpees"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5. 9.5 | 5.5, 6.5, 7.5",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "RR to Pushup",
      "8 Pushups 8 Wide Squats (-1)",
      "Shoulder Press Hold | Double Snatch"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "8, 9, 10  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Plank DB Drag",
      "10 Alt Squat to Hi Pulls (push ups)",
      "8 or 12 (push ups)",
      "Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 8, 9, 10",
      "5.5, 6.5, 7.5  | 6.5, 7.5, 8.5",
      "7.5, 8.5, 9. 5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 R 2 L Chest Press 2 Double",
      "2 R 2 L Hammer Chest Press 2 Close Grips",
      "Toe Touches | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9 | 6, 7 8",
      "7, 8, 9 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Heavy Deadlift",
      "10-12 Heavy Squats (bw pulses when done)",
      "Tempo DL | Deadlift Clean Squat"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5. 9.5 | 5.5, 6.5, 7.5",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 R 2 L BO Rows",
      "2 Squat to Hi Pulls e/s 2 Push Up",
      "Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "8, 9, 10  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Deficit Pushup to DD",
      "4 Pushups 3 DL 2 Bent Over Rows",
      "Same",
      "Plank | Double Snatches, Burpees, MX"
    ],
    "tread": [
      "RECOVER",
      "6.5, 7.5, 8.5 | 7, 8, 9",
      "7.5, 8.5, 9.5 | 8, 9, 10",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 GM 2 Lunges WGS",
      "3 Pushup to DD | Mountain Climbers",
      "Squats | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "6, 7, 8 | 7, 8, 9",
      "4% 6, 7, 8 | 4% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Tempo Deadlift",
      "12 BO Rows (spider crunches done)",
      "10 Wide Rows (spider crunches when done)",
      "RR to Pushup | Pushups"
    ],
    "tread": [
      "RECOVER",
      "6% 6.5, 7.5, 8.5 | 7.5, 8.5, 9.5",
      "6% 5.5, 6.5, 5.5  | 0% 5, 6, 7",
      "3% 6.5, 7.5 8.5 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Tempo Wide Chest Press (L)",
      "4 Chest Press (L) 4 Suitcase Squats (L)",
      "Front Squat (R) | Squat to Press (L)"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5,10.5  (45) / 5, 6, 7",
      "6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "R SDL to Cursy Lunge",
      "4 Offset Pushups 4 Rows",
      "R Arm Squat with Pause | R Arm Squat to Press"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5.5, 6.5, 7.5",
      "4% 6.5, 7.5, 8.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Plank DB Drag add Pushup",
      "Alt Snatches | Pushups",
      "Alt Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 5, 6, 7",
      "5% 6, 7, 8 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "WGS to Cat Cow",
      "2 GM 2 Squats 2 Reverse Lunges",
      "3 Pushups to DD | Burpees"
    ],
    "tread": [
      "5, 6, 7",
      "4% 5, 6 7 | 6.5, 7.5, 8.5",
      "6.5, 7.5, 8.5 | 8 , 9, 10"
    ]
  },
  {
    "floor": [
      "Alt Seated Bicep Curls",
      "Curl to Press | Just Shoulder Press",
      "Leg Lift | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "6% 5, 6, 7 | 6% 6.5, 7.5, 8.5",
      "6.5, 7.5, 8.5,  | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Alt Chest Press with Pulse",
      "10 Chest Press (Suitcase squat when done)"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | Sprint (45 Seconds)"
    ]
  },
  {
    "floor": [
      "Tempo OH Tricep Ext with 3 Pulses",
      "6 OH Tricep Ext",
      "Leg Lift | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 4% 5, 6, 7",
      "4% 6, 7, 8 | 4% 8, 9, 10"
    ]
  },
  {
    "floor": [
      "Goblet Squat with 3 Pulses",
      "6 Chest Press 6 Front Squat",
      "Tempo Front Rack | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5% 5, 6, 7",
      "5% 6, 7, 8 | 5% Sprint"
    ]
  },
  {
    "floor": [
      "Wide Chest Press 3 Oulsese",
      "6 Close Grip 6 Suitcase Squats",
      "Tempo Chest Press | Rep Out"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 6% 5, 6, 7",
      "6% 6, 7, 8 | 6% Sprint"
    ]
  },
  {
    "floor": [
      "Hip Dips",
      "10 Alt Squat to Hi Pulls (push ups)",
      "8 or 12 (push ups)",
      "Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 8, 9, 10",
      "5.5, 6.5, 7.5  | 6.5, 7.5, 8.5",
      "7.5, 8.5, 9. 5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Alt Chest Press to Close Grip",
      "Close Grip | Suitcase Crunch",
      "Hammer Grip Grip | Suitcase Crunch",
      "Tempo Chest Press | Hold : Chest Press BO"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9",
      "5, 6, 7 | 6, 7, 8",
      "7, 8, 9 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Tempo Alt Rows (facing bench)",
      "1 DB Sumo Squat | Alt Rows",
      "2 DB Sumo Squat | Double Row BO",
      "1 or 2 DB Tempo Sumo Squat | Hold : BO"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5",
      "5.5, 6.5, 7.5 | 6.5, 7.5, 8.5",
      "7.5, 8.5, 9.5  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Forearm Plank (Hip Dips)",
      "Alt Squat to Hi Pull | Hip Dips",
      "Alt Squat to Hi Pull | Snatches"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7, 8, 9",
      "8, 9, 10  | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "Add Pushup | Just Pushups",
      "Alt Lunge to Hammer Curl"
    ],
    "tread": [
      "RECOVER | 5% 7, 8, 9",
      "5, 6, 7 | 5% Sprint"
    ]
  },
  {
    "floor": [
      "12 Hammer Curl to Presses (Shoulder press hold)",
      "OH MARCH | Double Snatch or Weighted Burpee"
    ],
    "tread": [
      "RECOVER | 4% 7, 8, 9",
      "5, 6, 7 | 4% Sprint"
    ]
  },
  {
    "floor": [
      "Alt Chest Press",
      "10 Chest Press (Lat pullover)",
      "8 Chest Press (Lat pullover)",
      "Toe Touches | Jacknifes"
    ],
    "tread": [
      "RECOVER",
      "7, 8, 9",
      "7, 8, 9 | 5, 6, 7",
      "7, 8, 9 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "R SDL",
      "3 Rows 3 Squats",
      "R Squat to Hi Pull to Snatch | R Devil's Press"
    ],
    "tread": [
      "RECOVER",
      "7.5, 8.5, 9.5 | 5, 6, 7",
      "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "L SDL",
      "3 Rows 3 Squats",
      "L Squat to Hi Pull to Snatch | L Devil's Press"
    ],
    "tread": [
      "RECOVER",
      "8, 9, 10 | 5, 6, 7",
      "8, 9, 10 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "2 Squats to WGS to Pushups",
      "Just Pushups | Cat Cow",
      "Commandos | Mountain Climbers"
    ],
    "tread": [
      "5, 6, 7",
      "7, 8, 9",
      "6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "Sit Up to OH Tricept Ext",
      "Toe Touches | Jacknifes",
      "R/L/ Double Chest Press",
      "CLose Grip | 1 Wide 1 Close Grip"
    ],
    "tread": [
      "RECOVER",
      "6, 7, 8 | 7.5, 8.5, 9.5",
      "7, 8, 9",
      "5, 6, 7 | Sprint (30 Seconds)"
    ]
  },
  {
    "floor": [
      "R SDL to Cursy Lunge",
      "Just Cursty Lunge | 3 Rows 3 Pushups",
      "Same | Hold Row : BO"
    ],
    "tread": [
      "RECOVER",
      "8.2, 9.2, 10.2 | 4% 5, 6, 7",
      "4% 6, 7, 8 | 8.5, 9.5, 10.5"
    ]
  },
  {
    "floor": [
      "CORE",
      "Alt Snatches | CORE",
      "Alt Snatches | Burpee Snatches"
    ],
    "tread": [
      "RECOVER",
      "8.5, 9.5, 10.5 | 2% 5, 6, 7",
      "2% 6, 7, 8 | SPRINT (30)"
    ]
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getRandomBlock(blocks: WorkoutBlock[]): WorkoutBlock {
  return blocks[Math.floor(Math.random() * blocks.length)];
}

export function getBlockDuration(block: WorkoutBlock): number {
  return block.floor.length;
}

