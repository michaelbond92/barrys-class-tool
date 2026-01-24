// Separate floor and tread block libraries from real Barry's Total Body classes
// Blocks are categorized by length - can mix and match any floor with any tread of same length

export type BlockLength = 2 | 3 | 4;
export type BlockCategory = 'warmups' | 'workouts';

export interface BlockLibrary {
  warmups: { [key: number]: string[][] };
  workouts: { [key: number]: string[][] };
}

// ============================================
// FLOOR BLOCKS
// ============================================
export const FLOOR_BLOCKS: BlockLibrary = {
  "warmups": {
    "2": [
      [
        "Wide Squats | Walk out RR to Pushup",
        "4 Squats to 4 RR to 4 Pushup"
      ],
      [
        "2 Cleans 2 Squats",
        "4 Lunges 2 Cleans 2 Squat to Press"
      ],
      [
        "Tempo Deadlift to Row",
        "4 Rows 4 Curls"
      ],
      [
        "Deadlift to Alt Hi Pull",
        "12 Barbell Curls (RR when done)"
      ]
    ],
    "3": [
      [
        "R BO Row",
        "R Offset Pushup to X Human",
        "R Squat with 3 Pulses | R Squat to Press"
      ],
      [
        "WGS to 4 Puhups",
        "2 GM to 2 Squat",
        "Squat with 3 Hold | Burpees"
      ],
      [
        "Alt Rows",
        "4 Rows 4 Squats",
        "Tempo Squats | Just Rows"
      ],
      [
        "WGS Add Pushups",
        "GM to Squat to Lunge",
        "1 DB Squat | Hold : Rep"
      ],
      [
        "Rev Lunge to Bicep Curls",
        "2 Curls 2 Lunges 2 Squats",
        "Same | HOLD: Squat to Press"
      ],
      [
        "GM to Squat to Lunges",
        "WGS (pushup ladder)",
        "Shoulder Taps | MC"
      ],
      [
        "2 GM 2 Squats 2 Lunges",
        "WGS to Pushups",
        "Pushup to DD | Mountain Climbers"
      ],
      [
        "GM to WGS",
        "Pushup to Shoulder Taps | Reverse Lunges",
        "Squats : Hold | Burpees"
      ],
      [
        "WGS to Pushup",
        "2 GM to Squats to Lunges",
        "Squat : Hold | Burpees"
      ],
      [
        "3 GM 3 Squats 3 Pushups",
        "WGS | Cat Cow",
        "1 DB Tempo Squat | Squat to Press"
      ],
      [
        "2 Cleans 2 Squats",
        "Just Squats | Just Cleans",
        "SHAKE Tempo Squat | Squat to Press"
      ],
      [
        "Good Morning to WGS",
        "2 Lunges to 3 Sauts to 4 Pushups",
        "X Human | Mountain Climbers"
      ],
      [
        "WGS",
        "WGS to Pushups",
        "Pushup to DD | Mountain Climbers"
      ],
      [
        "Cat Cow to Birddog | 3 GM",
        "3 GM 3 Squats 3 Pushups | Just Squat",
        "Pushup to DD | Plank Jacks"
      ],
      [
        "WGS to Pushup",
        "3 Good Morning to 3 Squat",
        "1 DB Tempo Squat | 1 DB Squat to Press"
      ],
      [
        "Alt Lunges with 3 Pulses",
        "Add 2 Bicep Curls at Bottom | Just 1",
        "Halfway Hold | Bicep Curl BO"
      ],
      [
        "2 GM 2 Squat to WGS",
        "Pushup (+1) to DD",
        "Commandos | Mountain Climbers"
      ],
      [
        "2 Gm 2 Squats 2 Rev Lunges",
        "10 Mountain Climbers to WGS / 1 DL to Row",
        "Cont | Just Rows"
      ],
      [
        "WGS to Cat Cow",
        "3 GM 3 Squats 3 Pushups",
        "Pushup to DD | MC"
      ],
      [
        "WGS to Cat Cow",
        "2 GM 2 Squats to 2 Lunges",
        "Pushup to Shoulder Taps | Burpees"
      ],
      [
        "2 Gm 2 Squats to WGS",
        "Mountan Climbers | 1 DL to Row",
        "Cont | Just Rows"
      ],
      [
        "3 Good Morning to WGS",
        "2 Lunges to 3 Squats to 4 Pushups",
        "X Human | Mountain Climbers"
      ],
      [
        "Cat Cow to Birddog | 3 GM",
        "3 GM 3 Squats 3 Pushups | Pushup to Sprawl",
        "Pushup to Sprawl | Plank Jacks"
      ],
      [
        "AMRAP: 6 Lunges 6 Bicep Curls 6 Squat to Press",
        "6 Lunges 6 Bicep Curls 6 Squat to Press",
        "Bicep Curl Hold | Squat to Press"
      ],
      [
        "2 Bicep Curls to 2 Lunges",
        "2 Lunges to 2 Squats (optional press)",
        "Shoulder Taps | Bicep Curl BO"
      ],
      [
        "2 GM 2 Squat to WGS",
        "Pushup (+1) to DD",
        "1 DB Tempo Squat | Squat to Press"
      ],
      [
        "2 GM 2 Squats to WGS",
        "Pushups | OH Tricep Ext",
        "1 DB Squat | Squat to Press"
      ],
      [
        "WGS to Arm Circles",
        "2 GM 2 Squats 2 Pushups",
        "2 Pushups X Human | Mountain Climbers"
      ]
    ],
    "4": [
      [
        "WGS",
        "5 Pushups 5 Plank Jacks X Human",
        "3 Good Morning to 3 Squat",
        "Squat | Hold : Pulse"
      ],
      [
        "Alt Rows",
        "4 RR 4 Pushups 4 Squats",
        "Beastmakers",
        "Tempo Pushups | Double Rows"
      ],
      [
        "Alt Chest Press",
        "8 Chest Press 4 Suitcase Squats",
        "4 Chest Press 8 Suitcase Squats",
        "Suitcase Squats | Chest Press BO"
      ],
      [
        "2 R 2 L Shoulder Press",
        "Alt Skull Crusher | Both Arms",
        "V Sit | Russian Twists",
        "Toe Touches | Jacknifes"
      ],
      [
        "Alt Curtsy Lunges with 3 Pulses",
        "Lungster",
        "Lungster | Just Bicep Curls",
        "Bicep Curls : Hold | Squat to Press"
      ],
      [
        "Alt Chest Press (r/ld)",
        "6 Chest Press 6 Suitcase Rows (-1)",
        "Same",
        "Tempo Chest Press | Hold: Chest Press BO"
      ],
      [
        "Alt Rows",
        "6 Alt Rows 4 Pushups 2 Squat",
        "3 Double Rows 2 Pushups 1 Squat",
        "Tempo Pushups | Rows"
      ],
      [
        "Alt Rows",
        "6 Alt Rows 4 Pushups 2 Squat",
        "6 Rows 2 Squats",
        "Tempo Pushups | Rows"
      ],
      [
        "Alt Chest Press with 3 Pulses",
        "10 Hammer (suticase crucnh when done)",
        "10 Close Grip (russian twists when done)",
        "CP DB | Both Arms Both Legs"
      ],
      [
        "3 GM 3 Squats 3 Pushups",
        "WGS | Mountain Climbers",
        "1 DB Chest Press (+1)  to 1 Crunch",
        "Tempo Squat | Squat to Press"
      ],
      [
        "Tempo DL Behind Bench",
        "8 Rows 8 Deadlifts",
        "8 Rows 8 Deadlifts",
        "Rows | Row BO"
      ],
      [
        "Alt Chest Press",
        "10 Chest Press 10 Suitase Squats (-2)",
        "Same",
        "Tempo Chest Press | Chest Press BO"
      ],
      [
        "Tempo Wide Squat",
        "4 Wide Squats 4 DB Swings 4 Pushups",
        "Same",
        "RR to Pushup | Just Pushups"
      ],
      [
        "Alt Bicep Curls to Cross Body Curls",
        "6 Pushups 6 Bicep Curls 6 Squat to Press",
        "Same",
        "Same : Shake | Squat to Press"
      ],
      [
        "GM to Squat to WGS",
        "2 Lunges 4 Pushups 8 Mountain Climbers",
        "Pushups | 1 DB GM to Squat",
        "Just Squat 3 Pulses | Squat to Press"
      ],
      [
        "INC Alt Chest Press with Pulse",
        "10 Wide (leg lift to hip raise)",
        "10 Close Grip (leg lift to hip raise)",
        "CP DB | Both Arms Both Legs"
      ],
      [
        "2 R 2 L Chest Press",
        "20-25 Chest Press",
        "Situps when done",
        "Same : Halfway Hold | Russian Twists"
      ],
      [
        "Alt Bench Row with Pulse",
        "3 R Bench Rows 3 R Squats, 3 L Bench Rows 3 L Squats",
        "3 Double Arm Rows 3 Bench Squats",
        "Renegde Rows | Squats"
      ],
      [
        "Tempo DL Behind Bench",
        "Alt Rows | 6 Rows 6 DL",
        "6 Rows 6 DL",
        "RR | Row BO"
      ],
      [
        "2 GM 2 Squats 2 Pushups",
        "WGS | Mountain Climbers",
        "1 DB Chest Press (+1)  to 1 Crunch",
        "Tempo Squat | Squat to Press"
      ],
      [
        "Alt Bench Row with Pulse",
        "3 R Bench Rows 3 R Squats, 3 L Bench Rows 3 L Squats",
        "3 Double Arm Rows 3 Bench Squats",
        "Spider Crunches | Squats"
      ],
      [
        "Tempo DL Behind Bench",
        "Alt Rows | 6 Rows 6 DL",
        "6 Rows 6 DL",
        "Spider Crunch | Row BO"
      ]
    ]
  },
  "workouts": {
    "2": [
      [
        "Plank Taps",
        "Squat to Hi Pull | Snatches"
      ],
      [
        "SAME",
        "Squat with Pause | Squat to Press"
      ],
      [
        "Plank | Squat to Press or Double Snatch",
        "Shoulder Press Hold | Double Snatch, Burpees, Weighted Burpees"
      ],
      [
        "Leg Lift to Hip Raise",
        "Toe Touches | Jack Knifes"
      ],
      [
        "2 Pushups to Squat to Hi Pull",
        "Snatches | Burpee Snatches"
      ],
      [
        "Pushup to X Human",
        "Tempo Pushup | CHOICE"
      ],
      [
        "2 Lunges 1 Clean 1 Squat to Press",
        "Lunges | Squat to Press"
      ],
      [
        "4 RR to 2 Pushup",
        "Plank | Weighted Burpee"
      ],
      [
        "4 Lunge to 2 Squat to Press",
        "Front Squat | Squat to Press"
      ],
      [
        "2 Suticase Squat 2 Hammer Curl to Press",
        "Shoulder Press Hold | Double Snatch or Burpees"
      ],
      [
        "4 RR to 4 X Humans",
        "Halfway Hold | Curl BO"
      ],
      [
        "CORE",
        "4 Lunges 3 Curls 2 Squat to Press"
      ],
      [
        "Same",
        "Plank | CHOICE"
      ],
      [
        "Suitcase Squat",
        "Tempo Chest Press | Chest Press BO"
      ],
      [
        "4 Goblet Squats 8 DB Swings",
        "Same | DB Swings"
      ],
      [
        "Alt Chest Press with Pulse",
        "10 Chest Press (Goblet Squat when done)"
      ],
      [
        "10 Close Grip (Goblet Squat when done)",
        "Alt Squat to Hi Pull | Snatches"
      ],
      [
        "Alt Chest Press with Pulse",
        "10 Chest Press (Suitcase squat when done)"
      ],
      [
        "Add Pushup | Just Pushups",
        "Alt Lunge to Hammer Curl"
      ],
      [
        "12 Hammer Curl to Presses (Shoulder press hold)",
        "OH MARCH | Double Snatch or Weighted Burpee"
      ]
    ],
    "3": [
      [
        "WGS to Pushup",
        "Good Morning to Squat to Lunges",
        "Fast Feet | Burpees"
      ],
      [
        "Suitcase Crunch",
        "Toe Touches | Jacknifes",
        "Boat Pose | Russian Twists"
      ],
      [
        "AMRAP: 6 Lunges 4 RR 2 Pushups",
        "AMRAP: 6 Lunges 4 RR 2 Pushups",
        "AMRAP/Shake | CHOICE"
      ],
      [
        "3 Good Morning to 3 Squat",
        "4 Pushups 2 Commandos to 1 Pike",
        "Leg Lift | Plank Jacks"
      ],
      [
        "8 Waiter Curls 8 OH Tricep Ext (-1)",
        "Cont.",
        "Shoulder Press Hold | Squat to Press"
      ],
      [
        "Plank Taps",
        "Squat to Hi Pull",
        "Snatches | Burpee Snatches"
      ],
      [
        "WGS | BW Squat to Lunge",
        "1 DB Squat to Lunge",
        "Commandos | Mountain Climbers"
      ],
      [
        "Lat Pullover | Add Crunch",
        "Knee Tucks | Russian Twists",
        "Toe Touches | Jacknifes"
      ],
      [
        "Heavy Deadlift",
        "1 DB Switch with 3 Pulses",
        "Squat to Hi Pull | Snatches"
      ],
      [
        "L BO Row",
        "L Offset Pushup to X Human",
        "L Squat with 3 Pusles | L Squat to Press"
      ],
      [
        "Lat Pullover to Crunch",
        "Toe Touches | Jacknifes",
        "Boat Pose | Russian Twists"
      ],
      [
        "Squat to Hi Pull",
        "Plank | Snatches",
        "Plank | Snatches"
      ],
      [
        "Crunch to Half to Full Situp",
        "Just Situp | HOLD: Russian Twists",
        "Leg Lifts | Jacknifes"
      ],
      [
        "4 RR 4 Pushups 4 X Human",
        "4 RR 4 Pushups 4 X Human",
        "Shoulder Press Hold | Burpees or Weighted Burpees"
      ],
      [
        "Commandos",
        "3 Hi Pull to 1 Snatch",
        "Just Hi Pull | Just Snatches"
      ],
      [
        "4 Alt 2 Double",
        "Tempo Chest Press | Burn Out",
        "1 Leg Lift 1 Close Grip | Close Grip Leg Lift"
      ],
      [
        "L SDL to Reverse Lunge",
        "Cursty Lunge | Windshield Wiper",
        "L Squat with Pulse | Squat to Press"
      ],
      [
        "R SDL to Reverse Lunge",
        "Cursty Lunge | Windshield Wiper",
        "R Squat with Pulse | Squat to Press"
      ],
      [
        "Alt Rows",
        "2 Pushups 2 Rows | 1 and 1",
        "Tempo Pushups | Just Rows"
      ],
      [
        "1 DB Reverse Lunges",
        "Deadlift | Deadlft to Reverse Lunges",
        "Same | Just Heavy Lunges"
      ],
      [
        "OH Tricep Ext",
        "12 Sumo Squats (DB Swings when done)",
        "Tempo Sumo Squat | DB Swings"
      ],
      [
        "R SDL to Cursy Lunge",
        "3 Rows 3 Offset Pushups 3 Hi Pulls",
        "Same | R Snatches"
      ],
      [
        "Plank DB Drag",
        "2 Curls 2 Squat to Press | Curl Squat Press",
        "Shoulder Press Hold | Choice (MC, Snatches, Burpees)"
      ],
      [
        "2 R 2 L Chest Press",
        "Burn Out | CORE",
        "Tempo Close Grip | Close Grip Leg Lift"
      ],
      [
        "Heavy Deadlift",
        "Heavy Squat (3 Pulses) | Just Squat",
        "Pulse Squat | DB Swings"
      ],
      [
        "3 BO Rows each side",
        "2 Push Ups to Alt Squat to Hi Pull",
        "Just Squat to Hi Pull | Snatch"
      ],
      [
        "WGS to Pushup",
        "3 Good Morning to 3 Squat",
        "1 DB Tempo Squat | 1 DB Squat to Press"
      ],
      [
        "L Bulgarian Split Squat",
        "4 Offset Pushups 4 Rows",
        "L Tempo Squat | L Squat to Press"
      ],
      [
        "Suitcase Crunch (CORE)",
        "Lat Pullover to Power Situp",
        "Toe Touches | Jacknifes"
      ],
      [
        "BW Lunges with 3 Pulses",
        "4 Lunges 4 Squat to Press",
        "Just Lunges | Squat to Press"
      ],
      [
        "Deadlift",
        "4 Deadlifts 4 Squats",
        "Goblet Squat | Hold : Rep Out"
      ],
      [
        "L Arm Row",
        "4 Offset Pushups 4 Rows",
        "R Squat to Hi Pull | Just Snatch"
      ],
      [
        "R Arm Row",
        "4 Offset Pushups 4 Rows",
        "L Squat to Hi Pull | L Just Snatch"
      ],
      [
        "4 Toe Touches 4 Single Leg Lifts",
        "Just Leg Lift | Jacknifes",
        "V Sit Hold | Russian Twists"
      ],
      [
        "Pushups",
        "Weighted Burpees",
        "Plank | Choice"
      ],
      [
        "4 Alt 2 Double Chest Press",
        "8-10 Chest Press (Suitcase crunch when done)",
        "Chest Press 3 Pulses | Rep Out"
      ],
      [
        "Heavy Squat with 3 second pause",
        "8-10 Squats (Deadlift when done)",
        "1 DB SQUAT HOLD | DB Swings"
      ],
      [
        "3 Gorrila Rows e/s",
        "8-10 Squat to Hi Pulls (plank when done)",
        "Alt Snatches | Burpee Snatches"
      ],
      [
        "WGS to Pushup",
        "3 GM to 3 Squats | 1 and 1",
        "Tempo Squat : Hold | Burpees"
      ],
      [
        "Plank DB Drag",
        "1 DB 21s (Biceps)",
        "Tempo Bicep Curl | Bicep BO"
      ],
      [
        "3 Bent Over Rows e/s",
        "2 Squat to Hi Pulls to 1 Snatch",
        "SHAKE? / Just Snatches | Burpee Snatches"
      ],
      [
        "GM to Squat to Lunges",
        "WGS to Pushup | Just Pushup",
        "1 DB Squat | Squat to Press"
      ],
      [
        "R SDL to Lunge",
        "(R) 3 Rows Offset Pushups 3 Squat to Hi Pulls",
        "Same: Hold Row | R Arm Rows"
      ],
      [
        "OH Tricep Ext",
        "2 Snatches e/s 2 Pushups",
        "Same : SHAKE | CHOICE"
      ],
      [
        "Temo Deadlift",
        "Alt Rows | R/L Double",
        "Wide Squats | Hold : Rep Out"
      ],
      [
        "Situp to Shoulder Press (+1)",
        "Shoulder Press Rep Out | 4 Cherry Pickers 4 Alt Leg Lifts",
        "Same | Jacknifes"
      ],
      [
        "Front Rack Squat",
        "4 Goblet Squats 8 DB Swings",
        "Squat Pulse Switch | DB Swings"
      ],
      [
        "4 Alt 2 Double",
        "Just Hammer | Hollow Body Hold",
        "Close Grip Pulse | Chest BO"
      ],
      [
        "3 Bent Over Rows e/s",
        "3 Offset Pushups to 3 Snatches (Devi'ls Press)",
        "Same : SHAKE | Just Snatches"
      ],
      [
        "4 Alt Chest Press 2 Hammer Grip",
        "Just Hammer | CORE",
        "Close Grip 3 Pulses | Rep Out"
      ],
      [
        "1.5 Deadlift",
        "4 Deadlifts 4 Heavy Lunges",
        "DB Pulse Swtich  | DB Swings"
      ],
      [
        "L Arm Row with 3 Pulses",
        "3 Rows 3 Pushups 3 Hi Pulls",
        "R Squat to Hi Pull | Just Snatch"
      ],
      [
        "R Arm Row wth 3 Pulses",
        "3 rows 3 Pushups 3 Hi Pulls",
        "L Squat to Hi Pull | L Just Snatch"
      ],
      [
        "R/L/ Double",
        "Tempo 1, 2, 3 | Chest BO",
        "Chery Pickers | Jacknifes"
      ],
      [
        "R SDL",
        "R 3 Offset Pushups 3 DB Swings 3 Squat to Press",
        "Same : Shake | R Arm Snatch"
      ],
      [
        "L SDL",
        "L 3 Offset Pushups 3 DB Swings 3 Squat to Press",
        "Same : Shake | L Arm Snatch"
      ],
      [
        "2 GM to 2 Squat 2 Pushups",
        "Pushups | WGS",
        "Shoulder Taps | Burpees"
      ],
      [
        "Goblet Squat (1.5)",
        "DB Swings | OH Tricep Ext",
        "Squat Hold | DB Swings"
      ],
      [
        "2 e/s Alt Hi Squat to Hi Pull",
        "2 offset pushups to 2 snatches e/s",
        "snatches | burpee snatches"
      ],
      [
        "4 Lunges 2 Pushups WGS",
        "Pushups | GM to Squat",
        "Squat : Hold | Burpees"
      ],
      [
        "Power Situp",
        "Lat Pullover (+1) to Crunch",
        "Leg Lifts | Jacknifes"
      ],
      [
        "Suitcase Squat (+1) to Hammer Curl",
        "4 Pushups 4 Suitcase Squats 4 Curl to Press (-1)",
        "Shoulder Press Hold | Double Snatch or Burpee"
      ],
      [
        "OH Tricep Ext (+1) Power Situp",
        "Power Situp | OH Tricep Ext",
        "Single Leg Lift | Single Leg Jacknifes"
      ],
      [
        "Goblet Squat",
        "6 Chest Press 6 Front Squat",
        "Tempo Front Rack | Rep Out"
      ],
      [
        "Wide to Close Grip",
        "6 Close Grip 6 Suitcase Squats",
        "Tempo Chest Press | Rep Out"
      ],
      [
        "Alt Rows",
        "8 R 8 L (plank when done)",
        "RR | Double Arm Rows"
      ],
      [
        "L SDL to Reverse Lunge",
        "Cursty Lunge | Windshield Wiper",
        "L Squat with Pause Squat to Press"
      ],
      [
        "R SDL to Reverse Lunge",
        "Cursty Lunge | Windshield Wiper",
        "R Squat with Pause | Squat to Press"
      ],
      [
        "Seated Alt Bicep Curl",
        "Bicep BO | Toe Touches",
        "Single Leg Lift | Single Jacknifes"
      ],
      [
        "Alt Lunges with 3 Pulses",
        "1.5 Squat | .5 : Rep Out",
        "1 DB Squat with 3 Pulses | 1 DB Squat to Press"
      ],
      [
        "Alt Chest Press with 3 Pulses",
        "10-12 Chest Press (cherry pickers when done)",
        "1 Close Grip 1 Leg Lift | Same Tiime"
      ],
      [
        "1.5 Deadlift",
        "4 DL 4 Heavy Lunges",
        "1 DB Squat Pulse | DB Swings"
      ],
      [
        "4 RR to X Human",
        "Just Reneage Rows | Alt Lunges",
        "Alt Lunges | ! DB Lunge"
      ],
      [
        "Alt Row with 3 Second Pause",
        "4 Double Rows 4 Pushups",
        "Spider Crunches | 1 Row 1 Pushup"
      ],
      [
        "Tempo Deadift",
        "10 Deadlits (1 DB Goblet Squat when done)",
        "Deadlifts | Deadlfit Clean Squat"
      ],
      [
        "3 R BO Rows 3 Sumo Squats 3 L BO Rows",
        "Same | Just Sumo Squats",
        "Alt Suquat to Hi pull | Snatches"
      ],
      [
        "Tempo Alt Chest Press",
        "6 Chest Press 6 Goblet Squats",
        "Tempo Chest Press | Rep Out"
      ],
      [
        "Tempo Goblet Squat",
        "6 Close Grip 6 Suitcase Squats",
        "Tempo Front Rack Squat | Rep Out"
      ],
      [
        "Lat Pull to Power Situp to OH Tricep Ext",
        "Just OH Tricep Ext | Just Lat Pull",
        "Toe Touches | Jacknifes"
      ],
      [
        "Alt Chest Press with 3 Pulses",
        "Chest Press BO | V Sit : Russian Twists",
        "Close Grip 3 Pulses | Close Grip BO"
      ],
      [
        "1 DB Lunge with 3 Pulses",
        "Deadlift | 4 Deadlifts 4 Lunges",
        "Same | Just Lunges"
      ],
      [
        "Alt to Close Grip",
        "3 Wide 3 Close Grip / Shake",
        "Tempo Chest Press | Rep Out"
      ],
      [
        "R SDL",
        "R 3 Offset Pushups 3 R Sumo Squats",
        "Tempo R Front Rack Squat | R Squat to Press"
      ],
      [
        "L SDL",
        "L 3 Offset Pushups 3 Sumo Squats",
        "Tempo L Front Rack Rquat | L Squat to Press"
      ],
      [
        "L Arm Row with Pulse",
        "3 Rows 3 Pushups 3 Hi Pulls",
        "L Squat to Hi Pull | Just Snatch"
      ],
      [
        "R Arm Row wth Pulse",
        "3 rows 3 Pushups 3 Hi Pulls",
        "L Squat to Hi Pull | L Just Snatch"
      ],
      [
        "Cat Cow to Bird Dogs to WGS",
        "2 GM 3 Squats 4 Pushups",
        "Squat Hold | Burpees"
      ],
      [
        "R Arm Concentraion Curl",
        "R Arm Tempo | R Arm BO",
        "R  Arm Squat to Hi Pull  | R Arm Snatches"
      ],
      [
        "Plank DB Drag",
        "10 Deadlifts 5 Pushups",
        "Same : Shake | DB Swings"
      ],
      [
        "R SDL",
        "3 Rows 3 Squats / 3 Pushups 3 Squat to Hi Pulls",
        "3 Pushups 3 Squat to Hi Pulls | Snatches"
      ],
      [
        "L SDL",
        "3 Rows 3 Squats / 3 Pushups 3 Squat to Hi Pulls",
        "3 Pushups 3 Squat to Hi Pulls | Snatches"
      ],
      [
        "3 Bent Over Rows e/s",
        "3 Offset Pushups to 3 Squat to Hi Pulls (Devi'ls Press)",
        "Same : SHAKE | Just Snatches"
      ],
      [
        "RR to 2 Pushups",
        "Add 2 Wide Squats",
        "Shoulder Press Hold | Double Snatch or Burpees"
      ],
      [
        "2 GM 2 Squats 2 Reverse Lunges",
        "Mountain Climbers | WGS",
        "Pushups | Burpees"
      ],
      [
        "Alt Seated Bicep Curls",
        "Curl to Press | Just Shoulder Press",
        "Leg Lift | Close Grip Leg Lift"
      ],
      [
        "Tempo Deadlift",
        "Add Row | Just Rows",
        "RR to Pushups | Just Pushups"
      ],
      [
        "Alt Lunge",
        "Add Hammer Bicep Curl | Just Hammer Curls",
        "Squat to Press | Weighted Burpees"
      ],
      [
        "3 Deadlifts 3 Squats",
        "6-8 Pushups (Plank jacks) | 6-8 Pushups (Plank jacks)",
        "Pushup to sprawl | Burpees"
      ],
      [
        "Alt Lunge with 3 Pulses",
        "Add Double Bicep Curl | Bicep Curl BO",
        "Squat to Press | Weighted Burpees"
      ],
      [
        "RR to Pushup",
        "8 Pushups 8 Wide Squats (-1)",
        "Shoulder Press Hold | Double Snatch"
      ],
      [
        "2 R 2 L Chest Press 2 Double",
        "2 R 2 L Hammer Chest Press 2 Close Grips",
        "Toe Touches | Jacknifes"
      ],
      [
        "Heavy Deadlift",
        "10-12 Heavy Squats (bw pulses when done)",
        "Tempo DL | Deadlift Clean Squat"
      ],
      [
        "2 R 2 L BO Rows",
        "2 Squat to Hi Pulls e/s 2 Push Up",
        "Snatches | Burpee Snatches"
      ],
      [
        "2 GM 2 Lunges WGS",
        "3 Pushup to DD | Mountain Climbers",
        "Squats | Burpees"
      ],
      [
        "Tempo Wide Chest Press (L)",
        "4 Chest Press (L) 4 Suitcase Squats (L)",
        "Front Squat (R) | Squat to Press (L)"
      ],
      [
        "R SDL to Cursy Lunge",
        "4 Offset Pushups 4 Rows",
        "R Arm Squat with Pause | R Arm Squat to Press"
      ],
      [
        "Plank DB Drag add Pushup",
        "Alt Snatches | Pushups",
        "Alt Snatches | Burpee Snatches"
      ],
      [
        "WGS to Cat Cow",
        "2 GM 2 Squats 2 Reverse Lunges",
        "3 Pushups to DD | Burpees"
      ],
      [
        "Alt Seated Bicep Curls",
        "Curl to Press | Just Shoulder Press",
        "Leg Lift | Jacknifes"
      ],
      [
        "Tempo OH Tricep Ext with 3 Pulses",
        "6 OH Tricep Ext",
        "Leg Lift | Jacknifes"
      ],
      [
        "Goblet Squat with 3 Pulses",
        "6 Chest Press 6 Front Squat",
        "Tempo Front Rack | Rep Out"
      ],
      [
        "Wide Chest Press 3 Oulsese",
        "6 Close Grip 6 Suitcase Squats",
        "Tempo Chest Press | Rep Out"
      ],
      [
        "Forearm Plank (Hip Dips)",
        "Alt Squat to Hi Pull | Hip Dips",
        "Alt Squat to Hi Pull | Snatches"
      ],
      [
        "R SDL",
        "3 Rows 3 Squats",
        "R Squat to Hi Pull to Snatch | R Devil's Press"
      ],
      [
        "L SDL",
        "3 Rows 3 Squats",
        "L Squat to Hi Pull to Snatch | L Devil's Press"
      ],
      [
        "2 Squats to WGS to Pushups",
        "Just Pushups | Cat Cow",
        "Commandos | Mountain Climbers"
      ],
      [
        "R SDL to Cursy Lunge",
        "Just Cursty Lunge | 3 Rows 3 Pushups",
        "Same | Hold Row : BO"
      ],
      [
        "CORE",
        "Alt Snatches | CORE",
        "Alt Snatches | Burpee Snatches"
      ]
    ],
    "4": [
      [
        "R/L/D Chest Press",
        "Wide to Hammer | Just Hammer",
        "Lat Pullover to Situp to OH Tricep Ext",
        "Just Lat Pullover | Just OH Tricep Ext"
      ],
      [
        "4 Alt 2 Double Chest Press",
        "Tempo Chest Press | Rep Out",
        "Suitcase Crunch | Leg Lift",
        "Toe Touches | Jacknifes"
      ],
      [
        "Heavy Reverse Lunges",
        "1 DB Reverse to Cursty Lunge",
        "Plank DB Drag",
        "Pushup to Down Dog | Pushups"
      ],
      [
        "R/L/D Chest Press",
        "Chest Press BO | Suicase Crunch",
        "Suitcase to Jacknige | JAcknifes",
        "Chest Press with Pulse | Chest Press BO"
      ],
      [
        "Tempo Deadlift",
        "8 DB Swings 4 Goblet Squats",
        "Same | Plank",
        "Heavy Deadlift | Deadlift Clean Squat"
      ],
      [
        "Alt Chest Press",
        "2 Wide 2 Close Grip | Close Grip BO",
        "DB Situp to 3 Presses",
        "Just Situp | Just Presses"
      ],
      [
        "Tempo Deadlift",
        "3 Deadift to 1 Squat",
        "6 Swings 6 OH Tricep Ext",
        "Just OH Tricep Ext | Just Swings"
      ],
      [
        "Tempo Heavy Deadlift",
        "8 Squats (Pushups when done)",
        "8 Squats (Pushups when done)",
        "Deadlift | Deadlift Clean Squat"
      ],
      [
        "Chest",
        "Chest",
        "Row to Squat to Hi Pull to Snatch",
        "Snatches | Burpee Snatches"
      ],
      [
        "R/L/D Chest Press",
        "Close Grip to Reverse Grip | Rep Out",
        "3 Lat pull overs to 1 Power Situp to OH Tricep",
        "Just Situp | OH Tricep"
      ],
      [
        "Heavy Deadlift",
        "3 Deadlifts 1 Squat",
        "Alt Reverse Lunge | Stay Low",
        "DB Pulse Switch | DB SWINGS"
      ],
      [
        "Alt Squat to Hi Pulls",
        "10-12 Snatches (Plank jacks when done)",
        "12-14 Snatches (Squat jumps when done)",
        "Plank / Snatches"
      ],
      [
        "Alt Lunges with 3 Pulses",
        "AMRAP  4 Curl to Press 4 Lunges",
        "AMRAP",
        "TEMPO. Front Squat | Squat to Press"
      ],
      [
        "2 Tempo 2 Alt Chest Press",
        "1 Wide 1 Close Grip | Close Grip Rep Out",
        "Situp to Press (+1)",
        "Situps : Hold | Russian Twists"
      ],
      [
        "2 Good Morning to 2 Squat to 2 Lunges",
        "WGS to 4 Shoulder Taps",
        "3 Pushups 6 Hip Dips",
        "1 DB Squat with 3 Pulses | Squat to Press"
      ],
      [
        "R/L/ Close Grip",
        "Just Wide | Just Close Grip",
        "Lat Pullover to Situp to OH Tricep Ext",
        "Just Lat Pullover | Just OH Tricep Ext"
      ],
      [
        "X Human with DB",
        "Hip Dips | 6 Sumo Squats 6 Pushups (-1)",
        "Ladder Cont.",
        "Shoulder Press Hold | Double Snatch, Burpee, MC"
      ],
      [
        "3 OH Tricep Ext to 1 Power Situp",
        "Just Power Situp | Burn Out OH Tricep Ext",
        "1 DB Squat Pulse Ladder",
        "Shoulder Press Hold : March | 1 DB Squat to Press"
      ],
      [
        "1.5 Deadlift",
        "8 Squats (Shoulder Taps when Done)",
        "8 Squats (Hip Dips whe done)",
        "Deadlift | Deadlift Clean Squat"
      ],
      [
        "Plank Hip Dips",
        "3 Squats 2 Lunges 1 Snatch e/s",
        "Same",
        "Shake : _______ | Snatches, Burpees, MC"
      ],
      [
        "Alt Squat to Hi Pulls",
        "10-12 Snatches (Plank Jacks when done)",
        "10-12 Snatches (MC when done)",
        "Snatches | Burpee Snatches"
      ],
      [
        "1 DB Goblet Squat",
        "Tempo Heavy Squat",
        "3 Deadlift to 1 Squat",
        "Shake : Deadlift | Deadlift Clean Squat"
      ],
      [
        "R/L/Double",
        "Chest | Lat Pullover",
        "Toe Touches | Jacknifes",
        "Tempo Chest | Chest BO"
      ],
      [
        "Plank Hip Dips",
        "3 Squats 2 Lunges 1 Snatch e/s",
        "Same",
        "Plank | Snatches, Burpees, MC"
      ],
      [
        "Tempo DL",
        "6 Squats 6 DL (-1)",
        "Cont.",
        "Squat Hold | Choice"
      ],
      [
        "RR",
        "6 Pushups 6 Curls 6 Squat to Press (-1)",
        "6 Pushups 6 Curls 6 Squat to Press (-1)",
        "Plank | Weighted Burpee or Burpee"
      ],
      [
        "Alt Chest Press with 2 second pause",
        "8 -10 Chest Press (Squat to Press when done)",
        "8 Close Grip (Squat to Press when done)",
        "Tempo Chest Press | Chest Press BO"
      ],
      [
        "Alt Chest Press to Hammer Grip",
        "Burn Out Hammer | CORE",
        "CORE | CP Deadbug",
        "Tempo Both Arms Both Legs | Both Arms Both Legs"
      ],
      [
        "Plank DB Drag",
        "Alt Hi Pull | Plank DB Drag",
        "Snatch | Plank DB Drag",
        "Snatches | Burpee Snatch"
      ],
      [
        "Plank DB Drag",
        "2 Pushups 2 Squat to Hi Pulls (+2)",
        "Same",
        "Snatches | Burpee Snatches"
      ],
      [
        "R/L Close Grip",
        "Tempo Wide | Close Grip BO",
        "Front Rack Squat",
        "Suitcase Squat | Suitcase Clean to Front Rack"
      ],
      [
        "Tempo Deadlift",
        "8 Rows 8 DL",
        "Same",
        "Alt Squat to Hi Pull | Snatches"
      ],
      [
        "Tempo Deadlift",
        "10-12 Squats (Duck walk when done)",
        "8-10 Squats (Duck walk when done)",
        "Deadlift | Deadlift Clean Squat"
      ],
      [
        "SEATED Tempo OH Tricep Ext",
        "Toe Touches | Jacknifes",
        "R/L/ Double Chest Press",
        "Tempo Chest Press | Chest Press BO"
      ],
      [
        "1 DB Goblet Squat to Reverse Lunge",
        "Heavy Squat with 3 Second Hold",
        "3 Deadlifts 3 Squats",
        "Shake : Deadlift | Deadlift Clean Squat"
      ],
      [
        "R/L/Double",
        "Chest | Lat Pullover",
        "Toe Touches | Jacknifes",
        "Tempo Hammer Grip | Chest BO"
      ],
      [
        "Alt Chest Press",
        "10 Chest Press (1 DB Goblet Squat when done)",
        "10 Close Grip (1 DB Goblet squat when done)",
        "Alt Chest press dead bug | Both Arms Both Legs"
      ],
      [
        "Plank DB Drag",
        "10 Alt Squat to Hi Pulls (push ups)",
        "8 or 12 (push ups)",
        "Snatches | Burpee Snatches"
      ],
      [
        "Deficit Pushup to DD",
        "4 Pushups 3 DL 2 Bent Over Rows",
        "Same",
        "Plank | Double Snatches, Burpees, MX"
      ],
      [
        "Tempo Deadlift",
        "12 BO Rows (spider crunches done)",
        "10 Wide Rows (spider crunches when done)",
        "RR to Pushup | Pushups"
      ],
      [
        "Hip Dips",
        "10 Alt Squat to Hi Pulls (push ups)",
        "8 or 12 (push ups)",
        "Snatches | Burpee Snatches"
      ],
      [
        "Alt Chest Press to Close Grip",
        "Close Grip | Suitcase Crunch",
        "Hammer Grip Grip | Suitcase Crunch",
        "Tempo Chest Press | Hold : Chest Press BO"
      ],
      [
        "Tempo Alt Rows (facing bench)",
        "1 DB Sumo Squat | Alt Rows",
        "2 DB Sumo Squat | Double Row BO",
        "1 or 2 DB Tempo Sumo Squat | Hold : BO"
      ],
      [
        "Alt Chest Press",
        "10 Chest Press (Lat pullover)",
        "8 Chest Press (Lat pullover)",
        "Toe Touches | Jacknifes"
      ],
      [
        "Sit Up to OH Tricept Ext",
        "Toe Touches | Jacknifes",
        "R/L/ Double Chest Press",
        "CLose Grip | 1 Wide 1 Close Grip"
      ]
    ]
  }
};

// ============================================
// TREAD BLOCKS  
// ============================================
export const TREAD_BLOCKS: BlockLibrary = {
  "warmups": {
    "2": [
      [
        "5, 6, 7 | 6% 7, 8, 9",
        "6, 7 8 | 6% 8, 9, 10"
      ],
      [
        "5, 6, 7 | 7.5, 8.5, 9.5",
        "5, 6, 7 | (Sprint 30 Seconds)"
      ],
      [
        "5, 6, 7",
        "8.7, 9.7, 10.7"
      ],
      [
        "5, 6, 7 | 6% 7, 8, 9",
        "5 6, 7 | 6% 8, 9, 10"
      ]
    ],
    "3": [
      [
        "5, 6, 7",
        "7.5, 8.5, 9.5 | 5, 6, 7",
        "6% 5, 6, 7 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 7, 8, 9",
        "6, 7, 8 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "7.5, 8.5, 9.5 | 5, 6, 7",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "5, 6, 7",
        "8% 6.5, 7.5, 8.5 | 4% 6.5, 7.5, 8.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "6, 7, 8 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "7, 8, 9 | 6, 7, 8",
        "3% 6, 7, 8 | 3% 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "7.5, 8.5, 9.5 | 6.5, 7.5, 8.5",
        "5.5, 6.5, 7.5 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "7, 8, 9 | 5, 6, 7",
        "7, 8, 9 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "4% 6, 7, 8",
        "6, 7, 8 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "8, 9, 10 | 7, 8, 9",
        "5, 6, 7 | Sprint"
      ],
      [
        "5, 6,7",
        "7,8, 9 | 6.5, 7.5, 8.5",
        "4% 6, 7, 8 | 4% 8, 9, 10"
      ],
      [
        "6, 7, 8 | 6.5, 7.5, 8.5",
        "7, 8, 9 | 6% 7, 8, 9",
        "6% 5, 6, 7 | 6% Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "6,7, 8 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "4% 5, 6 7 | 6, 7, 8",
        "6, 7, 8 | 8 , 9, 10"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "2% 5, 6, 7 | 2% 8, 9, 10"
      ],
      [
        "5, 6,7",
        "7, 8, 9 | 6, 7, 8",
        "4% 6, 7, 8 | 4% 7.5, 8.5, 9.5"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 6.5, 7.5, 8.5",
        "7, 8, 9 | 8, 9, 10"
      ],
      [
        "6% 5, 6, 7",
        "7, 8, 9 | 7.5, 8.5 9.5",
        "6% 5, 6, 7 | 6% 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "7, 8, 9 | 2% 5, 6, 7",
        "2% 6, 7, 8 | 2% 8, 9, 10"
      ],
      [
        "6, 7, 8 | 6.5, 7.5, 8.5",
        "7, 8, 9 | 7.5,, 8.5, 9.5",
        "5, 6, 7 |  Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 8 | 6, 7, 8",
        "6.5, 7.5, 8.5, | 8, 9, 10"
      ]
    ],
    "4": [
      [
        "5, 6, 7",
        "7, 8, 9",
        "6.5, 7.5, 8.5 | 6, 7, 8",
        "5, 6, 7 | 8, 9, 10"
      ],
      [
        "DM | DM RUN",
        "REST | DM SPRINT",
        "REST | DM SPRINT",
        "REST | DM SPRINT"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "8, 9, 10 | 5, 6, 7",
        "4% 6, 7, 8  | 4% Sprint"
      ],
      [
        "5, 6, 7",
        "4% 5, 6, 7 | 8% 5, 6, 7",
        "7, 8, 9",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7.5, 8,5, 9.5",
        "5, 6, 7 | 6, 7, 8",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "4% 5.5, 6.5, 7.5 | 5% 6, 7, 8",
        "6% 6.5, 7.5, 8.5",
        "5. 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9 / 7.5, 8.5, 9.5",
        "7.5, 8.5 9.5 | 5, 6, 7",
        "5, 6 7 / Sprint (45 Seconds)"
      ],
      [
        "Recover",
        "6, 7, 8 | 7.5, 8.5, 9.5",
        "6, 7, 8 | 8, 9, 10",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 7, 8, 9",
        "8, 9, 10 | 7, 8, 9",
        "5, 6, 7 | Sprint"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 6.5, 7.5, 8.5",
        "7, 8, 9",
        "5, 6, 7 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 7, 8, 9",
        "8, 9, 10 | 7, 8, 9",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "5, 6, 7",
        "7, 8, 9 / 7.5, 8.5, 9.5",
        "7.5 8.5, 9.5 | 5, 6, 7",
        "5, 6, 7 / Sprint (45 Seconds)"
      ],
      [
        "5, 6, 7",
        "8, 9, 10, | 7, 8, 9",
        "6, 7, 8 | 5, 6, 7",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "8, 9, 10 | 5, 6, 7",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "Recover",
        "6, 7, 8 | 7.5, 8.5, 9.5",
        "6, 7, 8 | 8, 9, 10",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "6, 7, 8",
        "7, 8, 9 | 5, 6, 7",
        "7,  8, 9 | 8, 9, 10"
      ],
      [
        "5, 6, 7",
        "7, 8, 9 | 8, 9, 10",
        "5, 6, 7 | 6, 7, 8",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 8, 9, 10",
        "6, 7, 8 | 8, 9 10",
        "2% 5, 6, 7 | 2% Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9 | 8, 9, 10",
        "5, 6, 7 | 5, 6, 7",
        "6, 7, 8 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9 | 7.5, 8.5, 9.5",
        "5, 6, 7 | 6, 7, 8",
        "7,  8, 9 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "6, 7, 8",
        "7, 8, 9 | 5, 6, 7",
        "7, 8, 9 | 8, 9, 10"
      ]
    ]
  },
  "workouts": {
    "2": [
      [
        "RECOVER",
        "6, 7, 8 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER | 5% 7, 8, 9",
        "5.5, 6.5, 7.5 | 5% Sprint"
      ],
      [
        "RECOVER | 4% 7, 8, 9",
        "5, 6, 7 | 4% Sprint"
      ],
      [
        "RECOVER",
        "3% 7, 8, 9  | 3% Sprint"
      ],
      [
        "RECOVER",
        "2% 8, 9, 10 | 2% Sprint"
      ],
      [
        "RECOVER",
        "8, 9, 10 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER | 8, 9, 10",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER | 8.5, 9.5, 10.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.8, 9.8, 10.8"
      ],
      [
        "RECOVER",
        "3% 5, 6, 7 | 3% Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "CHOICE INC | INC SPRINT (30 Seconds"
      ],
      [
        "RECOVER",
        "6, 7, 8 | Sprint (45 Seconds)"
      ],
      [
        "RECOVER",
        "Runners Choice"
      ],
      [
        "RECOVER | 5% 7, 8, 9",
        "5, 6, 7 | 5% Sprint"
      ]
    ],
    "3": [
      [
        "5, 6, 7",
        "6, 7, 8 | 7, 8, 9",
        "6, 7, 8 | 8, 9, 10"
      ],
      [
        "Recover",
        "4% 5, 6, 7 | 7, 8, 9",
        "7, 8, 9 |  Sprint (30 Seconds)"
      ],
      [
        "Recover",
        "2% 5, 6, 7 | 2% 7.5, 8.5, 9.5",
        "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
      ],
      [
        "Recover",
        "7, 8, 9 | 8, 9, 10",
        "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
      ],
      [
        "Recover",
        "7.5, 8.5, 9.5 | 8.5, 9.5, 10.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "6.5, 7.5, 8.5 | 7, 8, 9",
        "6, 7, 8 | 8, 9, 10"
      ],
      [
        "Recover",
        "8, 9, 10 | 7, 8, 9",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "Recover",
        "8.5, 9,5, 10.5 | 7, 8, 9",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5, 6, 7",
        "3% 5, 6, 7 | 9, 10, 11"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5, 6, 7",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "7, 8, 9 | Sprint (30 Sconds)"
      ],
      [
        "RECOVER",
        "6% 7, 8, 9 | 3% 7, 8, 9",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "4% 7.5, 8.5, 9.5 | 2% 7.5, 8.5, 9.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "5, 6, 7 | 9, 10, 11",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 4% 5, 6, 7",
        "4% 6, 7, 8 | 4% 8, 9, 10"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5% 5, 6, 7",
        "5% 6, 7, 8 | 5% Sprint"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 6% 5, 6, 7",
        "6% 6, 7, 8 | 6% Sprint"
      ],
      [
        "RECOVER",
        "5.5, 6.5, 7.5 | 6.5, 7.5, 8.5",
        "7.5, 8.5 9.5 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 7, 8, 9",
        "6, 7, 8 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 7, 8, 9",
        "8, 9, 10 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5, 6 7",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "6, 7, 8 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5 9.5 | 5, 6, 7",
        "7, 8, 9 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5, 6, 7",
        "7.5, 8.5, 9.5  | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "8, 9, 10 | Sprint (30 Seconds)"
      ],
      [
        "5, 6. 7",
        "7, 8 9",
        "6, 7, 8 | 8, 9, 10"
      ],
      [
        "RECOVER",
        "8, 9, 10 / 5.5, 6.5, 7.5",
        "/ Sprint (45 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "8, 9, 10 | Sprint (30 Seonds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 / 5.5, 6.5, 7.5",
        "5.5, 6.5, 7.5\\ Sprint (45 seconds)"
      ],
      [
        "RECOVER",
        "5% 6, 7, 8 | 5% 6.5, 7.5, 8.5",
        "6.5, 7.5, 8.5,  | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "4% 6, 7, 8 | 7, 8, 9",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "3% 6, 7, 8 | 2% 7.5, 7.5, 9.5",
        "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
        "5, 6, 7 | Sprint"
      ],
      [
        "RECOVER",
        "9, 10, 11 | 8, 9, 10",
        "5, 6, 7 | Sprint"
      ],
      [
        "RECOVER",
        "6% 6.5, 7.5, 8.5 | 7, 8, 9",
        "5, 6, 7 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "4% 7, 8, 9 | 7.5, 8.5, 9.5",
        "5, 6, 7 | Sprint"
      ],
      [
        "RECOVER",
        "2% 7.5, 8.5, 9.5 | 8, 9, 10",
        "5, 6, 7 | Sprint"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 2% | 4%",
        "6, 7, 8 | 8, 9, 10"
      ],
      [
        "RECOVER",
        "8, 9, 10 / 5.5, 6.5, 7.5",
        "5.5, 6.5, 7.5 / Sprint 45 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10. 5 / 5, 67",
        "5, 6, 7 / Sprint (45 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "2% 6, 7, 8 | 8, 9, 10"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
        "5, 6 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 5, 6, 7",
        "7, 8, 9 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5, 6, 7",
        "7.5, 8.5 9.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "8, 9, 10 | Sprint (30 Seocnds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 6, 7 8",
        "5% 6, 7, 8 | 5% 8, 9, 10"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5.5, 6.5, 7.5",
        "6% 5.5, 6.5, 7.5 | 6% 8, 9, 10"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "7% 5, 6, 7 | 7% 8, 9, 10"
      ],
      [
        "RECOVER",
        "4% 7, 8, 9 | 4% 8, 9, 10",
        "5, 6, 7  | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5.5, 6.5, 7.5",
        "7, 8, 9  / Sprint (45 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9 | 7.5, 8.5, 9.5",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "7, 8, 9 | 8, 9, 10",
        "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9 | 8.5, 9.5, 10.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 7, 8, 9",
        "5.5, 6.5, 7.5  | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
        "5, 6, 7 | Sprint (45 Seconds)"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 4%",
        "6, 7, 8 | 7.5, 8.5, 9.5 4%"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5, 6, 7",
        "8, 9, 10  | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "8.5, 9.5, 10.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9 | 7.5, 8.5, 9.5",
        "5, 6 7 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 8, 9, 10",
        "5, 6 7, | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 8.5, 9.5, 10.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6% 5, 6, 7 | 6% 6.5, 7.5, 8.5",
        "6.5, 7.5, 8.5,  | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "5% 5 ,6 7 | 7, 8, 9",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "4% 5, 6, 7 | 4% 7.5, 7.5, 9.5",
        "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5, 6, 7",
        "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "4% 6.5, 7.5, 8.5 | 7.5, 8.5, 9.5",
        "5, 6, 7 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "3% 7, 8, 9 | 8, 9, 10",
        "5, 6, 7 | Sprint"
      ],
      [
        "RECOVER",
        "2% 7.5, 8.5, 9.5 | 8.5, 9.5, 10.5",
        "5, 6, 7 | Sprint"
      ],
      [
        "RECOVER",
        "7, 8, 9 | 6.5, 7.5, 8.5",
        "7, 8 9 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 6, 7, 8",
        "4% 6, 7, 8 | 4% 8, 9, 10"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5.5, 6.5, 7.5",
        "4% 5.5, 6.5, 7.5  | 4% 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "4% 5, 6, 7 | 4% 9, 10, 11"
      ],
      [
        "RECOVER",
        "7, 8, 9 | 5, 6, 7",
        "7, 8, 9 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 5, 6, 7",
        "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5, 6, 7",
        "8, 9, 10 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "4% 7, 8, 9| 6, 7, 8",
        "5, 6, 7 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "4% 7.5 8.5, 95.| 6.5, 7.5, 7.5",
        "5, 6, 7 | Sprint"
      ],
      [
        "RECOVER",
        "4% 8, 9, 10 | 7, 8, 9",
        "5, 6, 7 | Sprint"
      ],
      [
        "RECOVER",
        "8, 9, 10 / 5.5, 6.5, 7.5",
        "5.5, 6.5, 7.5 | Sprint (40 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 / 5, 6, 7",
        "5, 6, 7 | Sprint (40 Seconds)"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "2% 5, 6, 7 |  8, 9, 10"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
        "5, 6, 7 Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9 (+0.3 every 15 seconds)",
        "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5 9.5 (+0.3 every 15 seconds)",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 7, 8, 9",
        "8, 9, 10  | Sprint (30 Seconds)"
      ],
      [
        "6% RECOVER",
        "7, 8, 9 | 8, 9, 10",
        "6%, 5, 6, 7 | 6% 8, 9, 10"
      ],
      [
        "5, 6,7",
        "7, 8, 9 | 6, 7, 8",
        "6.5, 7.5, 8,5  | 8, 9, 10"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 5% 5, 6, 7",
        "5% 6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 4% 5, 6, 7",
        "4% 6.5, 7.5, 8.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 3% 5, 6, 7",
        "3% 7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5. 9.5 | 5.5, 6.5, 7.5",
        "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 3% 5, 6, 7",
        "3% 6, 7, 8 | 3% 8, 9, 10"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 4% 5, 6, 7",
        "4% 6, 7, 8 | 4% 8, 9, 10"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5% 5, 6, 7",
        "5% 6, 7, 8 | 5% 8, 9, 10"
      ],
      [
        "RECOVER",
        "7, 8, 9 | 6, 7 8",
        "7, 8, 9 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 7, 8, 9",
        "4% 6, 7, 8 | 4% 8, 9, 10"
      ],
      [
        "RECOVER",
        "8.5, 9.5,10.5  (45) / 5, 6, 7",
        "6, 7, 8 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 | 5.5, 6.5, 7.5",
        "4% 6.5, 7.5, 8.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 5, 6, 7",
        "5% 6, 7, 8 | Sprint (30 Seconds)"
      ],
      [
        "5, 6, 7",
        "4% 5, 6 7 | 6.5, 7.5, 8.5",
        "6.5, 7.5, 8.5 | 8 , 9, 10"
      ],
      [
        "5, 6, 7",
        "7, 8, 9",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "8.2, 9.2, 10.2 | 4% 5, 6, 7",
        "4% 6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "8.5, 9.5, 10.5 | 2% 5, 6, 7",
        "2% 6, 7, 8 | SPRINT (30)"
      ]
    ],
    "4": [
      [
        "Recover",
        "6, 7, 8 | 7.5, 8.5, 9.5",
        "6, 7, 8 | 8, 9, 10",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "Recover",
        "2% 6, 7, 8 | 4%",
        "6% | 8%",
        "5, 6, 7 | 8.5, 9.5, 10.5"
      ],
      [
        "Recover",
        "7, 8, 9 | 7.5, 8.5, 9.5",
        "6% 5.5, 6.5, 7.5",
        "5.5, 6.5, 7.5 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 7, 8, 9",
        "6.5, 7.5, 8.5 | 6, 7, 8",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9,10 | 7.5, 8.5, 9.5",
        "7, 8, 9 | 6.5, 7.5, 8.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 7, 8, 9",
        "4% 6, 7, 8 | 7, 8, 9",
        "5, 6, 7 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 7.5, 8.5, 9.5",
        "3% 6, 7, 8 | 7.5, 8.5, 9.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 7.5, 8.5, 9.5",
        "7, 8, 9",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 8, 9, 10",
        "7, 8, 9",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 7, 8, 9",
        "8, 9, 10 | 7, 8, 9",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "5.5, 6.5, 7.5 | 7, 8, 9",
        "8.5, 9.5, 10.5  | 7, 8, 9",
        "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "8, 9, 10 / 7, 8 9",
        "7, 8, 9  / 5, 6, 7",
        "5, 6, 7/ 45 Seconds"
      ],
      [
        "RECOVER",
        "5 % 5, 6, 7 | 10% 5, 6, 7",
        "7, 8, 9",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9",
        "6% (7, 8, 9) | 6% (5, 6, 7)",
        "0% (5, 6, 7) | 8.5 9.5 10.5"
      ],
      [
        "5, 6, 7",
        "6, 7, 8 | 7, 8, 9",
        "2% 6, 7, 8 | 7, 8 9",
        "6, 7, 8 | 8, 9, 10"
      ],
      [
        "Recover",
        "6, 7, 8 | 7, 8, 9",
        "6 % 6, 7, 8 | 7, 8, 9",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "8, 9, 10",
        "5.5, 6.5, 7.5, | 6.5, 7.5, 8.5",
        "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 5%",
        "7% | 9%",
        "6, 7, 8 | 8.5, 9.5, 10.5"
      ],
      [
        "2% RECOVER",
        "4% 6, 7, 8 | 7, 8, 9",
        "6% 6, 7, 8",
        "8% 5, 6, 7 | 7, 8, 9"
      ],
      [
        "RECOVER",
        "3% 6, 7, 8 | 4% 6.5, 7.5, 8.5",
        "5% 7, 8, 9",
        "5. 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "Recover",
        "7, 8, 9 / 8, 9, 10",
        "8, 9, 10 | 5, 6, 7",
        "5, 6 7 / Sprint (45 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 7, 8, 9",
        "8% 6, 7, 8 | 8% 7, 8, 9",
        "5, 6, 7 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "6.5, 7.5, 8.5 | 7.5, 8.5, 9.5",
        "6% 6.5, 7.5, 8.5 | 6% 7.5, 8,5, 9.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8, | 8, 9, 10",
        "6, 7, 8 | 8.5, 9.5, 10.5",
        "6, 7, 8 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6.5, 7.5, 8,5 | 7.5, 8.5, 9.5",
        "8.5, 9.5, 10.5 | 6.5, 7.5, 8.5",
        "5, 6, 7 | Sprint"
      ],
      [
        "RECOVER",
        "6.5, 7.5, 8.5 | 7, 8, 9",
        "7.5, 8.5, 9.5 | 4% 7.5, 8.5, 9.5",
        "4% 5, 6, 7 | 4% Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9",
        "8% (7, 8, 9) | 8% (5, 6, 7)",
        "4% (5, 6, 7) | 4% 8.5 9.5 10.5"
      ],
      [
        "RECOVER",
        "6, 7, 8 | 6, 7, 8 8%",
        "6, 7 8 | 6, 7, 8 8%",
        "6, 7, 8 | 7, 8, 9 8%"
      ],
      [
        "RECOVER",
        "7, 8, 9 / 8, 9, 10",
        "8, 9, 10 | 5, 6, 7",
        "5, 6, 7 / Sprint (45 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9",
        "7.5, 8.5, 9.5 | 3% 5, 6, 7",
        "3% 5.5, 6.5, 7.5 | 3% 8.5, 9.5 10.5"
      ],
      [
        "RECOVER",
        "7, 8, 9",
        "8, 9, 10 | 4% 5, 6, 7",
        "4% 6, 7, 8 | 4% Sprint"
      ],
      [
        "RECOVER",
        "8% 5.5, 6.5, 7.5 | 4% 6.5, 7.5, 8.5",
        "7.5, 8.5, 9.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6, 7, 8, | 8, 9, 10",
        "5.5, 6.5, 7.5 | 8.5, 9.5, 10.5",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7, 8, 9 | 8.5 9.5, 10.5",
        "5, 6, 7 | 7, 8, 9",
        "8, 9, 10 | Sprint (30 Seconds)"
      ],
      [
        "Recover",
        "6% 5, 6, 7 | 6% 6, 7, 8",
        "7, 8, 9",
        "3% 5, 6, 7 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "7, 8, 9",
        "5, 6, 7 | 6, 7, 8",
        "7, 8, 9 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5",
        "5.5, 6.5, 7.5 | 6.5, 7.5, 8.5",
        "7.5, 8.5, 9.5  | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "7.5, 8.5, 9.5 | 8, 9, 10",
        "5.5, 6.5, 7.5  | 6.5, 7.5, 8.5",
        "7.5, 8.5, 9. 5 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6.5, 7.5, 8.5 | 7, 8, 9",
        "7.5, 8.5, 9.5 | 8, 9, 10",
        "5, 6, 7 | Sprint (30 Seconds)"
      ],
      [
        "RECOVER",
        "6% 6.5, 7.5, 8.5 | 7.5, 8.5, 9.5",
        "6% 5.5, 6.5, 5.5  | 0% 5, 6, 7",
        "3% 6.5, 7.5 8.5 | 8.5, 9.5, 10.5"
      ],
      [
        "RECOVER",
        "7, 8, 9",
        "7, 8, 9 | 5, 6, 7",
        "7, 8, 9 | 8.5, 9.5, 10.5"
      ]
    ]
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export interface BlockSelection {
  block: string[];
  index: number;  // 1-based index in the library
  total: number;  // Total blocks available for this category/length
}

export function getRandomFloorBlock(category: BlockCategory, length: number): BlockSelection | null {
  const blocks = FLOOR_BLOCKS[category][length];
  if (!blocks || blocks.length === 0) return null;
  const index = Math.floor(Math.random() * blocks.length);
  return {
    block: blocks[index],
    index: index + 1,  // 1-based for display
    total: blocks.length
  };
}

export function getRandomTreadBlock(category: BlockCategory, length: number): BlockSelection | null {
  const blocks = TREAD_BLOCKS[category][length];
  if (!blocks || blocks.length === 0) return null;
  const index = Math.floor(Math.random() * blocks.length);
  return {
    block: blocks[index],
    index: index + 1,  // 1-based for display
    total: blocks.length
  };
}

// Get a specific block by index (for re-selection)
export function getFloorBlockByIndex(category: BlockCategory, length: number, index: number): string[] | null {
  const blocks = FLOOR_BLOCKS[category][length];
  if (!blocks || index < 1 || index > blocks.length) return null;
  return blocks[index - 1];  // Convert from 1-based to 0-based
}

export function getTreadBlockByIndex(category: BlockCategory, length: number, index: number): string[] | null {
  const blocks = TREAD_BLOCKS[category][length];
  if (!blocks || index < 1 || index > blocks.length) return null;
  return blocks[index - 1];  // Convert from 1-based to 0-based
}

export function getAvailableLengths(category: BlockCategory): number[] {
  const floorLengths = Object.keys(FLOOR_BLOCKS[category]).map(Number);
  const treadLengths = Object.keys(TREAD_BLOCKS[category]).map(Number);
  // Return lengths that exist in both
  return floorLengths.filter(len => treadLengths.includes(len)).sort((a, b) => a - b);
}

