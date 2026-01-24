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
 "Wide Squats | Walk out Reverse Row to Pushup",
 "4 Squats to 4 Reverse Row to 4 Pushup"
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
 "Deadlift to Alternating High Pull",
 "12 Barbell Curls (Reverse Row when done)"
 ]
 ],
 "3": [
 [
 "Right Bent Over Row",
 "Right Offset Pushup to X Human",
 "Right Squat with 3 Pulses | Right Squat to Press"
 ],
 [
 "World's Greatest Stretch to 4 Pushups",
 "2 Good Morning to 2 Squat",
 "Squat with 3 Hold | Burpees"
 ],
 [
 "Alternating Rows",
 "4 Rows 4 Squats",
 "Tempo Squats | Just Rows"
 ],
 [
 "World's Greatest Stretch Add Pushups",
 "Good Morning to Squat to Lunge",
 "1 Dumbbell Squat | Hold : Rep"
 ],
 [
 "Rev Lunge to Bicep Curls",
 "2 Curls 2 Lunges 2 Squats",
 "Same | HOLD: Squat to Press"
 ],
 [
 "Good Morning to Squat to Lunges",
 "World's Greatest Stretch (pushup ladder)",
 "Shoulder Taps | Mountain Climbers"
 ],
 [
 "2 Good Morning 2 Squats 2 Lunges",
 "World's Greatest Stretch to Pushups",
 "Pushup to Down Dog | Mountain Climbers"
 ],
 [
 "Good Morning to World's Greatest Stretch",
 "Pushup to Shoulder Taps | Reverse Lunges",
 "Squats : Hold | Burpees"
 ],
 [
 "World's Greatest Stretch to Pushup",
 "2 Good Morning to Squats to Lunges",
 "Squat : Hold | Burpees"
 ],
 [
 "3 Good Morning 3 Squats 3 Pushups",
 "World's Greatest Stretch | Cat Cow",
 "1 Dumbbell Tempo Squat | Squat to Press"
 ],
 [
 "2 Cleans 2 Squats",
 "Just Squats | Just Cleans",
 "SHAKE Tempo Squat | Squat to Press"
 ],
 [
 "Good Morning to World's Greatest Stretch",
 "2 Lunges to 3 Squats to 4 Pushups",
 "X Human | Mountain Climbers"
 ],
 [
 "World's Greatest Stretch",
 "World's Greatest Stretch to Pushups",
 "Pushup to Down Dog | Mountain Climbers"
 ],
 [
 "Cat Cow to Birddog | 3 Good Morning",
 "3 Good Morning 3 Squats 3 Pushups | Just Squat",
 "Pushup to Down Dog | Plank Jacks"
 ],
 [
 "World's Greatest Stretch to Pushup",
 "3 Good Morning to 3 Squat",
 "1 Dumbbell Tempo Squat | 1 Dumbbell Squat to Press"
 ],
 [
 "Alternating Lunges with 3 Pulses",
 "Add 2 Bicep Curls at Bottom | Just 1",
 "Halfway Hold | Bicep Curl Bent Over"
 ],
 [
 "2 Good Morning 2 Squat to World's Greatest Stretch",
 "Pushup (+1) to Down Dog",
 "Commandos | Mountain Climbers"
 ],
 [
 "2 Gm 2 Squats 2 Rev Lunges",
 "10 Mountain Climbers to World's Greatest Stretch / 1 Deadlift to Row",
 "Cont | Just Rows"
 ],
 [
 "World's Greatest Stretch to Cat Cow",
 "3 Good Morning 3 Squats 3 Pushups",
 "Pushup to Down Dog | Mountain Climbers"
 ],
 [
 "World's Greatest Stretch to Cat Cow",
 "2 Good Morning 2 Squats to 2 Lunges",
 "Pushup to Shoulder Taps | Burpees"
 ],
 [
 "2 Gm 2 Squats to World's Greatest Stretch",
 "Mountan Climbers | 1 Deadlift to Row",
 "Cont | Just Rows"
 ],
 [
 "3 Good Morning to World's Greatest Stretch",
 "2 Lunges to 3 Squats to 4 Pushups",
 "X Human | Mountain Climbers"
 ],
 [
 "Cat Cow to Birddog | 3 Good Morning",
 "3 Good Morning 3 Squats 3 Pushups | Pushup to Sprawl",
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
 "Shoulder Taps | Bicep Curl Bent Over"
 ],
 [
 "2 Good Morning 2 Squat to World's Greatest Stretch",
 "Pushup (+1) to Down Dog",
 "1 Dumbbell Tempo Squat | Squat to Press"
 ],
 [
 "2 Good Morning 2 Squats to World's Greatest Stretch",
 "Pushups | Overhead Tricep Ext",
 "1 Dumbbell Squat | Squat to Press"
 ],
 [
 "World's Greatest Stretch to Arm Circles",
 "2 Good Morning 2 Squats 2 Pushups",
 "2 Pushups X Human | Mountain Climbers"
 ]
 ],
 "4": [
 [
 "World's Greatest Stretch",
 "5 Pushups 5 Plank Jacks X Human",
 "3 Good Morning to 3 Squat",
 "Squat | Hold : Pulse"
 ],
 [
 "Alternating Rows",
 "4 Reverse Row 4 Pushups 4 Squats",
 "Beastmakers",
 "Tempo Pushups | Double Rows"
 ],
 [
 "Alternating Chest Press",
 "8 Chest Press 4 Suitcase Squats",
 "4 Chest Press 8 Suitcase Squats",
 "Suitcase Squats | Chest Press Bent Over"
 ],
 [
 "2 Right 2 Left Shoulder Press",
 "Alternating Skull Crusher | Both Arms",
 "V Sit | Russian Twists",
 "Toe Touches | Jacknifes"
 ],
 [
 "Alternating Curtsy Lunges with 3 Pulses",
 "Lungster",
 "Lungster | Just Bicep Curls",
 "Bicep Curls : Hold | Squat to Press"
 ],
 [
 "Alternating Chest Press (r/ld)",
 "6 Chest Press 6 Suitcase Rows (-1)",
 "Same",
 "Tempo Chest Press | Hold: Chest Press Bent Over"
 ],
 [
 "Alternating Rows",
 "6 Alternating Rows 4 Pushups 2 Squat",
 "3 Double Rows 2 Pushups 1 Squat",
 "Tempo Pushups | Rows"
 ],
 [
 "Alternating Rows",
 "6 Alternating Rows 4 Pushups 2 Squat",
 "6 Rows 2 Squats",
 "Tempo Pushups | Rows"
 ],
 [
 "Alternating Chest Press with 3 Pulses",
 "10 Hammer (suticase crucnh when done)",
 "10 Close Grip (russian twists when done)",
 "Chest Press Dumbbell | Both Arms Both Legs"
 ],
 [
 "3 Good Morning 3 Squats 3 Pushups",
 "World's Greatest Stretch | Mountain Climbers",
 "1 Dumbbell Chest Press (+1) to 1 Crunch",
 "Tempo Squat | Squat to Press"
 ],
 [
 "Tempo Deadlift Behind Bench",
 "8 Rows 8 Deadlifts",
 "8 Rows 8 Deadlifts",
 "Rows | Row Bent Over"
 ],
 [
 "Alternating Chest Press",
 "10 Chest Press 10 Suitase Squats (-2)",
 "Same",
 "Tempo Chest Press | Chest Press Bent Over"
 ],
 [
 "Tempo Wide Squat",
 "4 Wide Squats 4 Dumbbell Swings 4 Pushups",
 "Same",
 "Reverse Row to Pushup | Just Pushups"
 ],
 [
 "Alternating Bicep Curls to Cross Body Curls",
 "6 Pushups 6 Bicep Curls 6 Squat to Press",
 "Same",
 "Same : Shake | Squat to Press"
 ],
 [
 "Good Morning to Squat to World's Greatest Stretch",
 "2 Lunges 4 Pushups 8 Mountain Climbers",
 "Pushups | 1 Dumbbell Good Morning to Squat",
 "Just Squat 3 Pulses | Squat to Press"
 ],
 [
 "Incline Alternating Chest Press with Pulse",
 "10 Wide (leg lift to hip raise)",
 "10 Close Grip (leg lift to hip raise)",
 "Chest Press Dumbbell | Both Arms Both Legs"
 ],
 [
 "2 Right 2 Left Chest Press",
 "20-25 Chest Press",
 "Situps when done",
 "Same : Halfway Hold | Russian Twists"
 ],
 [
 "Alternating Bench Row with Pulse",
 "3 Right Bench Rows 3 Right Squats, 3 Left Bench Rows 3 Left Squats",
 "3 Double Arm Rows 3 Bench Squats",
 "Renegde Rows | Squats"
 ],
 [
 "Tempo Deadlift Behind Bench",
 "Alternating Rows | 6 Rows 6 Deadlift",
 "6 Rows 6 Deadlift",
 "Reverse Row | Row Bent Over"
 ],
 [
 "2 Good Morning 2 Squats 2 Pushups",
 "World's Greatest Stretch | Mountain Climbers",
 "1 Dumbbell Chest Press (+1) to 1 Crunch",
 "Tempo Squat | Squat to Press"
 ],
 [
 "Alternating Bench Row with Pulse",
 "3 Right Bench Rows 3 Right Squats, 3 Left Bench Rows 3 Left Squats",
 "3 Double Arm Rows 3 Bench Squats",
 "Spider Crunches | Squats"
 ],
 [
 "Tempo Deadlift Behind Bench",
 "Alternating Rows | 6 Rows 6 Deadlift",
 "6 Rows 6 Deadlift",
 "Spider Crunch | Row Bent Over"
 ]
 ]
 },
 "workouts": {
 "2": [
 [
 "Plank Taps",
 "Squat to High Pull | Snatches"
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
 "2 Pushups to Squat to High Pull",
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
 "4 Reverse Row to 2 Pushup",
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
 "4 Reverse Row to 4 X Humans",
 "Halfway Hold | Curl Bent Over"
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
 "Tempo Chest Press | Chest Press Bent Over"
 ],
 [
 "4 Goblet Squats 8 Dumbbell Swings",
 "Same | Dumbbell Swings"
 ],
 [
 "Alternating Chest Press with Pulse",
 "10 Chest Press (Goblet Squat when done)"
 ],
 [
 "10 Close Grip (Goblet Squat when done)",
 "Alternating Squat to High Pull | Snatches"
 ],
 [
 "Alternating Chest Press with Pulse",
 "10 Chest Press (Suitcase squat when done)"
 ],
 [
 "Add Pushup | Just Pushups",
 "Alternating Lunge to Hammer Curl"
 ],
 [
 "12 Hammer Curl to Presses (Shoulder press hold)",
 "Overhead MARCH | Double Snatch or Weighted Burpee"
 ]
 ],
 "3": [
 [
 "World's Greatest Stretch to Pushup",
 "Good Morning to Squat to Lunges",
 "Fast Feet | Burpees"
 ],
 [
 "Suitcase Crunch",
 "Toe Touches | Jacknifes",
 "Boat Pose | Russian Twists"
 ],
 [
 "AMRAP: 6 Lunges 4 Reverse Row 2 Pushups",
 "AMRAP: 6 Lunges 4 Reverse Row 2 Pushups",
 "AMRAP/Shake | CHOICE"
 ],
 [
 "3 Good Morning to 3 Squat",
 "4 Pushups 2 Commandos to 1 Pike",
 "Leg Lift | Plank Jacks"
 ],
 [
 "8 Waiter Curls 8 Overhead Tricep Ext (-1)",
 "Cont.",
 "Shoulder Press Hold | Squat to Press"
 ],
 [
 "Plank Taps",
 "Squat to High Pull",
 "Snatches | Burpee Snatches"
 ],
 [
 "World's Greatest Stretch | Bodyweight Squat to Lunge",
 "1 Dumbbell Squat to Lunge",
 "Commandos | Mountain Climbers"
 ],
 [
 "Lat Pullover | Add Crunch",
 "Knee Tucks | Russian Twists",
 "Toe Touches | Jacknifes"
 ],
 [
 "Heavy Deadlift",
 "1 Dumbbell Switch with 3 Pulses",
 "Squat to High Pull | Snatches"
 ],
 [
 "Left Bent Over Row",
 "Left Offset Pushup to X Human",
 "Left Squat with 3 Pulses | Left Squat to Press"
 ],
 [
 "Lat Pullover to Crunch",
 "Toe Touches | Jacknifes",
 "Boat Pose | Russian Twists"
 ],
 [
 "Squat to High Pull",
 "Plank | Snatches",
 "Plank | Snatches"
 ],
 [
 "Crunch to Half to Full Situp",
 "Just Situp | HOLD: Russian Twists",
 "Leg Lifts | Jacknifes"
 ],
 [
 "4 Reverse Row 4 Pushups 4 X Human",
 "4 Reverse Row 4 Pushups 4 X Human",
 "Shoulder Press Hold | Burpees or Weighted Burpees"
 ],
 [
 "Commandos",
 "3 High Pull to 1 Snatch",
 "Just High Pull | Just Snatches"
 ],
 [
 "4 Alternating 2 Double",
 "Tempo Chest Press | Burn Out",
 "1 Leg Lift 1 Close Grip | Close Grip Leg Lift"
 ],
 [
 "Left Single-Leg Deadlift to Reverse Lunge",
 "Cursty Lunge | Windshield Wiper",
 "Left Squat with Pulse | Squat to Press"
 ],
 [
 "Right Single-Leg Deadlift to Reverse Lunge",
 "Cursty Lunge | Windshield Wiper",
 "Right Squat with Pulse | Squat to Press"
 ],
 [
 "Alternating Rows",
 "2 Pushups 2 Rows | 1 and 1",
 "Tempo Pushups | Just Rows"
 ],
 [
 "1 Dumbbell Reverse Lunges",
 "Deadlift | Deadlft to Reverse Lunges",
 "Same | Just Heavy Lunges"
 ],
 [
 "Overhead Tricep Ext",
 "12 Sumo Squats (Dumbbell Swings when done)",
 "Tempo Sumo Squat | Dumbbell Swings"
 ],
 [
 "Right Single-Leg Deadlift to Cursy Lunge",
 "3 Rows 3 Offset Pushups 3 High Pulls",
 "Same | Right Snatches"
 ],
 [
 "Plank Dumbbell Drag",
 "2 Curls 2 Squat to Press | Curl Squat Press",
 "Shoulder Press Hold | Choice (Mountain Climbers, Snatches, Burpees)"
 ],
 [
 "2 Right 2 Left Chest Press",
 "Burn Out | CORE",
 "Tempo Close Grip | Close Grip Leg Lift"
 ],
 [
 "Heavy Deadlift",
 "Heavy Squat (3 Pulses) | Just Squat",
 "Pulse Squat | Dumbbell Swings"
 ],
 [
 "3 Bent Over Rows each side",
 "2 Push Ups to Alternating Squat to High Pull",
 "Just Squat to High Pull | Snatch"
 ],
 [
 "World's Greatest Stretch to Pushup",
 "3 Good Morning to 3 Squat",
 "1 Dumbbell Tempo Squat | 1 Dumbbell Squat to Press"
 ],
 [
 "L Bulgarian Split Squat",
 "4 Offset Pushups 4 Rows",
 "Left Tempo Squat | Left Squat to Press"
 ],
 [
 "Suitcase Crunch (CORE)",
 "Lat Pullover to Power Situp",
 "Toe Touches | Jacknifes"
 ],
 [
 "Bodyweight Lunges with 3 Pulses",
 "4 Lunges 4 Squat to Press",
 "Just Lunges | Squat to Press"
 ],
 [
 "Deadlift",
 "4 Deadlifts 4 Squats",
 "Goblet Squat | Hold : Rep Out"
 ],
 [
 "Left Arm Row",
 "4 Offset Pushups 4 Rows",
 "Right Squat to High Pull | Just Snatch"
 ],
 [
 "Right Arm Row",
 "4 Offset Pushups 4 Rows",
 "Left Squat to High Pull | Left Just Snatch"
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
 "4 Alternating 2 Double Chest Press",
 "8-10 Chest Press (Suitcase crunch when done)",
 "Chest Press 3 Pulses | Rep Out"
 ],
 [
 "Heavy Squat with 3 second pause",
 "8-10 Squats (Deadlift when done)",
 "1 Dumbbell SQUAT HOLD | Dumbbell Swings"
 ],
 [
 "3 Gorrila Rows e/s",
 "8-10 Squat to High Pulls (plank when done)",
 "Alternating Snatches | Burpee Snatches"
 ],
 [
 "World's Greatest Stretch to Pushup",
 "3 Good Morning to 3 Squats | 1 and 1",
 "Tempo Squat : Hold | Burpees"
 ],
 [
 "Plank Dumbbell Drag",
 "1 Dumbbell 21s (Biceps)",
 "Tempo Bicep Curl | Bicep Bent Over"
 ],
 [
 "3 Bent Over Rows e/s",
 "2 Squat to High Pulls to 1 Snatch",
 "SHAKE? / Just Snatches | Burpee Snatches"
 ],
 [
 "Good Morning to Squat to Lunges",
 "World's Greatest Stretch to Pushup | Just Pushup",
 "1 Dumbbell Squat | Squat to Press"
 ],
 [
 "Right Single-Leg Deadlift to Lunge",
 "(R) 3 Rows Offset Pushups 3 Squat to High Pulls",
 "Same: Hold Row | Right Arm Rows"
 ],
 [
 "Overhead Tricep Ext",
 "2 Snatches e/s 2 Pushups",
 "Same : SHAKE | CHOICE"
 ],
 [
 "Temo Deadlift",
 "Alternating Rows | R/L Double",
 "Wide Squats | Hold : Rep Out"
 ],
 [
 "Situp to Shoulder Press (+1)",
 "Shoulder Press Rep Out | 4 Cherry Pickers 4 Alternating Leg Lifts",
 "Same | Jacknifes"
 ],
 [
 "Front Rack Squat",
 "4 Goblet Squats 8 Dumbbell Swings",
 "Squat Pulse Switch | Dumbbell Swings"
 ],
 [
 "4 Alternating 2 Double",
 "Just Hammer | Hollow Body Hold",
 "Close Grip Pulse | Chest Bent Over"
 ],
 [
 "3 Bent Over Rows e/s",
 "3 Offset Pushups to 3 Snatches (Devi'ls Press)",
 "Same : SHAKE | Just Snatches"
 ],
 [
 "4 Alternating Chest Press 2 Hammer Grip",
 "Just Hammer | CORE",
 "Close Grip 3 Pulses | Rep Out"
 ],
 [
 "1.5 Deadlift",
 "4 Deadlifts 4 Heavy Lunges",
 "Dumbbell Pulse Swtich | Dumbbell Swings"
 ],
 [
 "Left Arm Row with 3 Pulses",
 "3 Rows 3 Pushups 3 High Pulls",
 "Right Squat to High Pull | Just Snatch"
 ],
 [
 "Right Arm Row wth 3 Pulses",
 "3 rows 3 Pushups 3 High Pulls",
 "Left Squat to High Pull | Left Just Snatch"
 ],
 [
 "R/L/ Double",
 "Tempo 1, 2, 3 | Chest Bent Over",
 "Chery Pickers | Jacknifes"
 ],
 [
 "Right Single-Leg Deadlift",
 "R 3 Offset Pushups 3 Dumbbell Swings 3 Squat to Press",
 "Same : Shake | Right Arm Snatch"
 ],
 [
 "Left Single-Leg Deadlift",
 "L 3 Offset Pushups 3 Dumbbell Swings 3 Squat to Press",
 "Same : Shake | Left Arm Snatch"
 ],
 [
 "2 Good Morning to 2 Squat 2 Pushups",
 "Pushups | World's Greatest Stretch",
 "Shoulder Taps | Burpees"
 ],
 [
 "Goblet Squat (1.5)",
 "Dumbbell Swings | Overhead Tricep Ext",
 "Squat Hold | Dumbbell Swings"
 ],
 [
 "2 e/s Alternating Hi Squat to High Pull",
 "2 offset pushups to 2 snatches e/s",
 "snatches | burpee snatches"
 ],
 [
 "4 Lunges 2 Pushups World's Greatest Stretch",
 "Pushups | Good Morning to Squat",
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
 "Overhead Tricep Ext (+1) Power Situp",
 "Power Situp | Overhead Tricep Ext",
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
 "Alternating Rows",
 "8 Right 8 Left (plank when done)",
 "Reverse Row | Double Arm Rows"
 ],
 [
 "Left Single-Leg Deadlift to Reverse Lunge",
 "Cursty Lunge | Windshield Wiper",
 "Left Squat with Pause Squat to Press"
 ],
 [
 "Right Single-Leg Deadlift to Reverse Lunge",
 "Cursty Lunge | Windshield Wiper",
 "Right Squat with Pause | Squat to Press"
 ],
 [
 "Seated Alternating Bicep Curl",
 "Bicep Bent Over | Toe Touches",
 "Single Leg Lift | Single Jacknifes"
 ],
 [
 "Alternating Lunges with 3 Pulses",
 "1.5 Squat | .5 : Rep Out",
 "1 Dumbbell Squat with 3 Pulses | 1 Dumbbell Squat to Press"
 ],
 [
 "Alternating Chest Press with 3 Pulses",
 "10-12 Chest Press (cherry pickers when done)",
 "1 Close Grip 1 Leg Lift | Same Tiime"
 ],
 [
 "1.5 Deadlift",
 "4 Deadlift 4 Heavy Lunges",
 "1 Dumbbell Squat Pulse | Dumbbell Swings"
 ],
 [
 "4 Reverse Row to X Human",
 "Just Reneage Rows | Alternating Lunges",
 "Alternating Lunges | ! Dumbbell Lunge"
 ],
 [
 "Alternating Row with 3 Second Pause",
 "4 Double Rows 4 Pushups",
 "Spider Crunches | 1 Row 1 Pushup"
 ],
 [
 "Tempo Deadift",
 "10 Deadlits (1 Dumbbell Goblet Squat when done)",
 "Deadlifts | Deadlfit Clean Squat"
 ],
 [
 "3 Right Bent Over Rows 3 Sumo Squats 3 Left Bent Over Rows",
 "Same | Just Sumo Squats",
 "Alternating Suquat to High Pull | Snatches"
 ],
 [
 "Tempo Alternating Chest Press",
 "6 Chest Press 6 Goblet Squats",
 "Tempo Chest Press | Rep Out"
 ],
 [
 "Tempo Goblet Squat",
 "6 Close Grip 6 Suitcase Squats",
 "Tempo Front Rack Squat | Rep Out"
 ],
 [
 "Lat Pull to Power Situp to Overhead Tricep Ext",
 "Just Overhead Tricep Ext | Just Lat Pull",
 "Toe Touches | Jacknifes"
 ],
 [
 "Alternating Chest Press with 3 Pulses",
 "Chest Press Bent Over | V Sit : Russian Twists",
 "Close Grip 3 Pulses | Close Grip Bent Over"
 ],
 [
 "1 Dumbbell Lunge with 3 Pulses",
 "Deadlift | 4 Deadlifts 4 Lunges",
 "Same | Just Lunges"
 ],
 [
 "Alternating to Close Grip",
 "3 Wide 3 Close Grip / Shake",
 "Tempo Chest Press | Rep Out"
 ],
 [
 "Right Single-Leg Deadlift",
 "R 3 Offset Pushups 3 R Sumo Squats",
 "Tempo Right Front Rack Squat | Right Squat to Press"
 ],
 [
 "Left Single-Leg Deadlift",
 "L 3 Offset Pushups 3 Sumo Squats",
 "Tempo Left Front Rack Squat | Left Squat to Press"
 ],
 [
 "Left Arm Row with Pulse",
 "3 Rows 3 Pushups 3 High Pulls",
 "Left Squat to High Pull | Just Snatch"
 ],
 [
 "Right Arm Row wth Pulse",
 "3 rows 3 Pushups 3 High Pulls",
 "Left Squat to High Pull | Left Just Snatch"
 ],
 [
 "Cat Cow to Bird Dogs to World's Greatest Stretch",
 "2 Good Morning 3 Squats 4 Pushups",
 "Squat Hold | Burpees"
 ],
 [
 "Right Arm Concentraion Curl",
 "Right Arm Tempo | Right Arm Bent Over",
 "Right Arm Squat to High Pull | Right Arm Snatches"
 ],
 [
 "Plank Dumbbell Drag",
 "10 Deadlifts 5 Pushups",
 "Same : Shake | Dumbbell Swings"
 ],
 [
 "Right Single-Leg Deadlift",
 "3 Rows 3 Squats / 3 Pushups 3 Squat to High Pulls",
 "3 Pushups 3 Squat to High Pulls | Snatches"
 ],
 [
 "Left Single-Leg Deadlift",
 "3 Rows 3 Squats / 3 Pushups 3 Squat to High Pulls",
 "3 Pushups 3 Squat to High Pulls | Snatches"
 ],
 [
 "3 Bent Over Rows e/s",
 "3 Offset Pushups to 3 Squat to High Pulls (Devi'ls Press)",
 "Same : SHAKE | Just Snatches"
 ],
 [
 "Reverse Row to 2 Pushups",
 "Add 2 Wide Squats",
 "Shoulder Press Hold | Double Snatch or Burpees"
 ],
 [
 "2 Good Morning 2 Squats 2 Reverse Lunges",
 "Mountain Climbers | World's Greatest Stretch",
 "Pushups | Burpees"
 ],
 [
 "Alternating Seated Bicep Curls",
 "Curl to Press | Just Shoulder Press",
 "Leg Lift | Close Grip Leg Lift"
 ],
 [
 "Tempo Deadlift",
 "Add Row | Just Rows",
 "Reverse Row to Pushups | Just Pushups"
 ],
 [
 "Alternating Lunge",
 "Add Hammer Bicep Curl | Just Hammer Curls",
 "Squat to Press | Weighted Burpees"
 ],
 [
 "3 Deadlifts 3 Squats",
 "6-8 Pushups (Plank jacks) | 6-8 Pushups (Plank jacks)",
 "Pushup to sprawl | Burpees"
 ],
 [
 "Alternating Lunge with 3 Pulses",
 "Add Double Bicep Curl | Bicep Curl Bent Over",
 "Squat to Press | Weighted Burpees"
 ],
 [
 "Reverse Row to Pushup",
 "8 Pushups 8 Wide Squats (-1)",
 "Shoulder Press Hold | Double Snatch"
 ],
 [
 "2 Right 2 Left Chest Press 2 Double",
 "2 Right 2 Left Hammer Chest Press 2 Close Grips",
 "Toe Touches | Jacknifes"
 ],
 [
 "Heavy Deadlift",
 "10-12 Heavy Squats (bw pulses when done)",
 "Tempo Deadlift | Deadlift Clean Squat"
 ],
 [
 "2 R 2 Left Bent Over Rows",
 "2 Squat to High Pulls e/s 2 Push Up",
 "Snatches | Burpee Snatches"
 ],
 [
 "2 Good Morning 2 Lunges World's Greatest Stretch",
 "3 Pushup to Down Dog | Mountain Climbers",
 "Squats | Burpees"
 ],
 [
 "Tempo Wide Chest Press (L)",
 "4 Chest Press (L) 4 Suitcase Squats (L)",
 "Front Squat (R) | Squat to Press (L)"
 ],
 [
 "Right Single-Leg Deadlift to Cursy Lunge",
 "4 Offset Pushups 4 Rows",
 "Right Arm Squat with Pause | Right Arm Squat to Press"
 ],
 [
 "Plank Dumbbell Drag add Pushup",
 "Alternating Snatches | Pushups",
 "Alternating Snatches | Burpee Snatches"
 ],
 [
 "World's Greatest Stretch to Cat Cow",
 "2 Good Morning 2 Squats 2 Reverse Lunges",
 "3 Pushups to Down Dog | Burpees"
 ],
 [
 "Alternating Seated Bicep Curls",
 "Curl to Press | Just Shoulder Press",
 "Leg Lift | Jacknifes"
 ],
 [
 "Tempo Overhead Tricep Ext with 3 Pulses",
 "6 Overhead Tricep Ext",
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
 "Alternating Squat to High Pull | Hip Dips",
 "Alternating Squat to High Pull | Snatches"
 ],
 [
 "Right Single-Leg Deadlift",
 "3 Rows 3 Squats",
 "Right Squat to High Pull to Snatch | R Devil's Press"
 ],
 [
 "Left Single-Leg Deadlift",
 "3 Rows 3 Squats",
 "Left Squat to High Pull to Snatch | L Devil's Press"
 ],
 [
 "2 Squats to World's Greatest Stretch to Pushups",
 "Just Pushups | Cat Cow",
 "Commandos | Mountain Climbers"
 ],
 [
 "Right Single-Leg Deadlift to Cursy Lunge",
 "Just Cursty Lunge | 3 Rows 3 Pushups",
 "Same | Hold Row : Bent Over"
 ],
 [
 "CORE",
 "Alternating Snatches | CORE",
 "Alternating Snatches | Burpee Snatches"
 ]
 ],
 "4": [
 [
 "R/L/D Chest Press",
 "Wide to Hammer | Just Hammer",
 "Lat Pullover to Situp to Overhead Tricep Ext",
 "Just Lat Pullover | Just Overhead Tricep Ext"
 ],
 [
 "4 Alternating 2 Double Chest Press",
 "Tempo Chest Press | Rep Out",
 "Suitcase Crunch | Leg Lift",
 "Toe Touches | Jacknifes"
 ],
 [
 "Heavy Reverse Lunges",
 "1 Dumbbell Reverse to Cursty Lunge",
 "Plank Dumbbell Drag",
 "Pushup to Down Dog | Pushups"
 ],
 [
 "R/L/D Chest Press",
 "Chest Press Bent Over | Suicase Crunch",
 "Suitcase to Jacknige | JAcknifes",
 "Chest Press with Pulse | Chest Press Bent Over"
 ],
 [
 "Tempo Deadlift",
 "8 Dumbbell Swings 4 Goblet Squats",
 "Same | Plank",
 "Heavy Deadlift | Deadlift Clean Squat"
 ],
 [
 "Alternating Chest Press",
 "2 Wide 2 Close Grip | Close Grip Bent Over",
 "Dumbbell Situp to 3 Presses",
 "Just Situp | Just Presses"
 ],
 [
 "Tempo Deadlift",
 "3 Deadift to 1 Squat",
 "6 Swings 6 Overhead Tricep Ext",
 "Just Overhead Tricep Ext | Just Swings"
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
 "Row to Squat to High Pull to Snatch",
 "Snatches | Burpee Snatches"
 ],
 [
 "R/L/D Chest Press",
 "Close Grip to Reverse Grip | Rep Out",
 "3 Lat pull overs to 1 Power Situp to Overhead Tricep",
 "Just Situp | Overhead Tricep"
 ],
 [
 "Heavy Deadlift",
 "3 Deadlifts 1 Squat",
 "Alternating Reverse Lunge | Stay Low",
 "Dumbbell Pulse Switch | Dumbbell SwingS"
 ],
 [
 "Alternating Squat to High Pulls",
 "10-12 Snatches (Plank jacks when done)",
 "12-14 Snatches (Squat jumps when done)",
 "Plank / Snatches"
 ],
 [
 "Alternating Lunges with 3 Pulses",
 "AMRAP 4 Curl to Press 4 Lunges",
 "AMRAP",
 "TEMPO. Front Squat | Squat to Press"
 ],
 [
 "2 Tempo 2 Alternating Chest Press",
 "1 Wide 1 Close Grip | Close Grip Rep Out",
 "Situp to Press (+1)",
 "Situps : Hold | Russian Twists"
 ],
 [
 "2 Good Morning to 2 Squat to 2 Lunges",
 "World's Greatest Stretch to 4 Shoulder Taps",
 "3 Pushups 6 Hip Dips",
 "1 Dumbbell Squat with 3 Pulses | Squat to Press"
 ],
 [
 "R/L/ Close Grip",
 "Just Wide | Just Close Grip",
 "Lat Pullover to Situp to Overhead Tricep Ext",
 "Just Lat Pullover | Just Overhead Tricep Ext"
 ],
 [
 "X Human with Dumbbell",
 "Hip Dips | 6 Sumo Squats 6 Pushups (-1)",
 "Ladder Cont.",
 "Shoulder Press Hold | Double Snatch, Burpee, Mountain Climbers"
 ],
 [
 "3 Overhead Tricep Ext to 1 Power Situp",
 "Just Power Situp | Burn Out Overhead Tricep Ext",
 "1 Dumbbell Squat Pulse Ladder",
 "Shoulder Press Hold : March | 1 Dumbbell Squat to Press"
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
 "Shake : _______ | Snatches, Burpees, Mountain Climbers"
 ],
 [
 "Alternating Squat to High Pulls",
 "10-12 Snatches (Plank Jacks when done)",
 "10-12 Snatches (Mountain Climbers when done)",
 "Snatches | Burpee Snatches"
 ],
 [
 "1 Dumbbell Goblet Squat",
 "Tempo Heavy Squat",
 "3 Deadlift to 1 Squat",
 "Shake : Deadlift | Deadlift Clean Squat"
 ],
 [
 "R/L/Double",
 "Chest | Lat Pullover",
 "Toe Touches | Jacknifes",
 "Tempo Chest | Chest Bent Over"
 ],
 [
 "Plank Hip Dips",
 "3 Squats 2 Lunges 1 Snatch e/s",
 "Same",
 "Plank | Snatches, Burpees, Mountain Climbers"
 ],
 [
 "Tempo Deadlift",
 "6 Squats 6 Deadlift (-1)",
 "Cont.",
 "Squat Hold | Choice"
 ],
 [
 "Reverse Row",
 "6 Pushups 6 Curls 6 Squat to Press (-1)",
 "6 Pushups 6 Curls 6 Squat to Press (-1)",
 "Plank | Weighted Burpee or Burpee"
 ],
 [
 "Alternating Chest Press with 2 second pause",
 "8 -10 Chest Press (Squat to Press when done)",
 "8 Close Grip (Squat to Press when done)",
 "Tempo Chest Press | Chest Press Bent Over"
 ],
 [
 "Alternating Chest Press to Hammer Grip",
 "Burn Out Hammer | CORE",
 "CORE | Chest Press Deadbug",
 "Tempo Both Arms Both Legs | Both Arms Both Legs"
 ],
 [
 "Plank Dumbbell Drag",
 "Alternating High Pull | Plank Dumbbell Drag",
 "Snatch | Plank Dumbbell Drag",
 "Snatches | Burpee Snatch"
 ],
 [
 "Plank Dumbbell Drag",
 "2 Pushups 2 Squat to High Pulls (+2)",
 "Same",
 "Snatches | Burpee Snatches"
 ],
 [
 "R/L Close Grip",
 "Tempo Wide | Close Grip Bent Over",
 "Front Rack Squat",
 "Suitcase Squat | Suitcase Clean to Front Rack"
 ],
 [
 "Tempo Deadlift",
 "8 Rows 8 Deadlift",
 "Same",
 "Alternating Squat to High Pull | Snatches"
 ],
 [
 "Tempo Deadlift",
 "10-12 Squats (Duck walk when done)",
 "8-10 Squats (Duck walk when done)",
 "Deadlift | Deadlift Clean Squat"
 ],
 [
 "SEATED Tempo Overhead Tricep Ext",
 "Toe Touches | Jacknifes",
 "R/L/ Double Chest Press",
 "Tempo Chest Press | Chest Press Bent Over"
 ],
 [
 "1 Dumbbell Goblet Squat to Reverse Lunge",
 "Heavy Squat with 3 Second Hold",
 "3 Deadlifts 3 Squats",
 "Shake : Deadlift | Deadlift Clean Squat"
 ],
 [
 "R/L/Double",
 "Chest | Lat Pullover",
 "Toe Touches | Jacknifes",
 "Tempo Hammer Grip | Chest Bent Over"
 ],
 [
 "Alternating Chest Press",
 "10 Chest Press (1 Dumbbell Goblet Squat when done)",
 "10 Close Grip (1 Dumbbell Goblet squat when done)",
 "Alternating Chest press dead bug | Both Arms Both Legs"
 ],
 [
 "Plank Dumbbell Drag",
 "10 Alternating Squat to High Pulls (push ups)",
 "8 or 12 (push ups)",
 "Snatches | Burpee Snatches"
 ],
 [
 "Deficit Pushup to Down Dog",
 "4 Pushups 3 Deadlift 2 Bent Over Rows",
 "Same",
 "Plank | Double Snatches, Burpees, MX"
 ],
 [
 "Tempo Deadlift",
 "12 Bent Over Rows (spider crunches done)",
 "10 Wide Rows (spider crunches when done)",
 "Reverse Row to Pushup | Pushups"
 ],
 [
 "Hip Dips",
 "10 Alternating Squat to High Pulls (push ups)",
 "8 or 12 (push ups)",
 "Snatches | Burpee Snatches"
 ],
 [
 "Alternating Chest Press to Close Grip",
 "Close Grip | Suitcase Crunch",
 "Hammer Grip Grip | Suitcase Crunch",
 "Tempo Chest Press | Hold : Chest Press Bent Over"
 ],
 [
 "Tempo Alternating Rows (facing bench)",
 "1 Dumbbell Sumo Squat | Alternating Rows",
 "2 Dumbbell Sumo Squat | Double Row Bent Over",
 "1 or 2 Dumbbell Tempo Sumo Squat | Hold : Bent Over"
 ],
 [
 "Alternating Chest Press",
 "10 Chest Press (Lat pullover)",
 "8 Chest Press (Lat pullover)",
 "Toe Touches | Jacknifes"
 ],
 [
 "Sit Up to Overhead Tricept Ext",
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
 "6, 7, 8 | 6% 8, 9, 10"
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
 "5, 6, 7",
 "7, 8, 9 | 6.5, 7.5, 8.5",
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
 "6, 7, 8 | 8, 9, 10"
 ],
 [
 "5, 6, 7",
 "4% 5, 6, 7 | 6, 7, 8",
 "6, 7, 8 | 8, 9, 10"
 ],
 [
 "5, 6, 7",
 "7, 8, 9",
 "2% 5, 6, 7 | 2% 8, 9, 10"
 ],
 [
 "5, 6, 7",
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
 "7, 8, 9 | 7.5, 8.5, 9.5",
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
 "5, 6, 7 | Sprint (30 Seconds)"
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
 "Dynamic Mode | Dynamic Mode RUN",
 "REST | Dynamic Mode SPRINT",
 "REST | Dynamic Mode SPRINT",
 "REST | Dynamic Mode SPRINT"
 ],
 [
 "5, 6, 7",
 "7, 8, 9",
 "8, 9, 10 | 5, 6, 7",
 "4% 6, 7, 8 | 4% Sprint"
 ],
 [
 "5, 6, 7",
 "4% 5, 6, 7 | 8% 5, 6, 7",
 "7, 8, 9",
 "5, 6, 7 | Sprint (30 Seconds)"
 ],
 [
 "5, 6, 7",
 "7.5, 8, 5, 9.5",
 "5, 6, 7 | 6, 7, 8",
 "7, 8, 9 | Sprint (30 Seconds)"
 ],
 [
 "5, 6, 7",
 "4% 5.5, 6.5, 7.5 | 5% 6, 7, 8",
 "6% 6.5, 7.5, 8.5",
 "5, 6, 7 | Sprint (30 Seconds)"
 ],
 [
 "5, 6, 7",
 "7, 8, 9 / 7.5, 8.5, 9.5",
 "7.5, 8.5, 9.5 | 5, 6, 7",
 "5, 6, 7 | Sprint (45 Seconds)"
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
 "5, 6, 7 | Sprint (45 Seconds)"
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
 "7, 8, 9 | 8, 9, 10"
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
 "6, 7, 8 | 8, 9, 10",
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
 "7, 8, 9 | Sprint (30 Seconds)"
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
 "3% 7, 8, 9 | 3% Sprint"
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
 "CHOICE Incline | Incline Sprint (30 Seconds"
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
 "7, 8, 9 | Sprint (30 Seconds)"
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
 "8.5, 9, 5, 10.5 | 7, 8, 9",
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
 "7, 8, 9 | Sprint (30 Seconds)"
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
 "7.5, 8.5, 9.5 | 8.5, 9.5, 10.5"
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
 "8, 9, 10 | 5, 6, 7",
 "7, 8, 9 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10.5 | 5, 6, 7",
 "6, 7, 8 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "7.5, 8.5, 9.5 | 5, 6, 7",
 "7, 8, 9 | 8.5, 9.5, 10.5"
 ],
 [
 "RECOVER",
 "8, 9, 10 | 5, 6, 7",
 "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10.5 | 5, 6, 7",
 "8, 9, 10 | Sprint (30 Seconds)"
 ],
 [
 "5, 6., 7",
 "7, 8, 9",
 "6, 7, 8 | 8, 9, 10"
 ],
 [
 "RECOVER",
 "8, 9, 10 / 5.5, 6.5, 7.5",
 " | Sprint (45 Seconds)"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10.5 | 5, 6, 7",
 "8, 9, 10 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "8, 9, 10 / 5.5, 6.5, 7.5",
 "5.5, 6.5, 7.5\\ Sprint (45 seconds)"
 ],
 [
 "RECOVER",
 "5% 6, 7, 8 | 5% 6.5, 7.5, 8.5",
 "6.5, 7.5, 8.5, | 8.5, 9.5, 10.5"
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
 "6, 7, 8, 2% | 4%",
 "6, 7, 8 | 8, 9, 10"
 ],
 [
 "RECOVER",
 "8, 9, 10 / 5.5, 6.5, 7.5",
 "5.5, 6.5, 7.5 | Sprint 45 Seconds)"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10., 5 / 5, 67",
 "5, 6, 7 | Sprint (45 Seconds)"
 ],
 [
 "5, 6, 7",
 "7, 8, 9",
 "2% 6, 7, 8 | 8, 9, 10"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
 "5, 6, 7 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "7.5, 8.5, 9.5 | 5, 6, 7",
 "7, 8, 9 | 8.5, 9.5, 10.5"
 ],
 [
 "RECOVER",
 "8, 9, 10 | 5, 6, 7",
 "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10.5 | 5, 6, 7",
 "8, 9, 10 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "7.5, 8.5, 9.5 | 6, 7, 8",
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
 "5, 6, 7 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "8, 9, 10 | 5.5, 6.5, 7.5",
 "7, 8, 9 | Sprint (45 Seconds)"
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
 "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10.5 | 7.5, 8.5, 9.5",
 "5, 6, 7 | Sprint (45 Seconds)"
 ],
 [
 "5, 6, 7",
 "6, 7, 8 | 4%",
 "6, 7, 8 | 7.5, 8.5, 9.5, 4%"
 ],
 [
 "RECOVER",
 "8, 9, 10 | 5, 6, 7",
 "8, 9, 10 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10.5 | 5, 6, 7",
 "8.5, 9.5, 10.5 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "7, 8, 9 | 7.5, 8.5, 9.5",
 "5, 6, 7 | 8.5, 9.5, 10.5"
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
 "6.5, 7.5, 8.5, | 8.5, 9.5, 10.5"
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
 "7, 8, 9 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "7.5, 8.5, 9.5 | 6, 7, 8",
 "4% 6, 7, 8 | 4% 8, 9, 10"
 ],
 [
 "RECOVER",
 "8, 9, 10 | 5.5, 6.5, 7.5",
 "4% 5.5, 6.5, 7.5 | 4% 8.5, 9.5, 10.5"
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
 "4% 7, 8, 9 | 6, 7, 8",
 "5, 6, 7 | 8.5, 9.5, 10.5"
 ],
 [
 "RECOVER",
 "4% 7.5 8.5, 95. | 6.5, 7.5, 7.5",
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
 "2% 5, 6, 7 | 8, 9, 10"
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
 "7.5, 8.5, 9.5 (+0.3 every 15 seconds)",
 "5, 6, 7 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "6, 7, 8 | 7, 8, 9",
 "8, 9, 10 | Sprint (30 Seconds)"
 ],
 [
 "6% RECOVER",
 "7, 8, 9 | 8, 9, 10",
 "6%, 5, 6, 7 | 6% 8, 9, 10"
 ],
 [
 "5, 6, 7",
 "7, 8, 9 | 6, 7, 8",
 "6.5, 7.5, 8,5 | 8, 9, 10"
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
 "7, 8, 9 | 6, 7, 8",
 "7, 8, 9 | Sprint (30 Seconds)"
 ],
 [
 "5, 6, 7",
 "6, 7, 8 | 7, 8, 9",
 "4% 6, 7, 8 | 4% 8, 9, 10"
 ],
 [
 "RECOVER",
 "8.5, 9.5, 10.5 (45) / 5, 6, 7",
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
 "4% 5, 6, 7 | 6.5, 7.5, 8.5",
 "6.5, 7.5, 8.5 | 8, 9, 10"
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
 "2% 6, 7, 8 | Sprint (30)"
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
 "8, 9, 10 | 7.5, 8.5, 9.5",
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
 "8.5, 9.5, 10.5 | 7, 8, 9",
 "5.5, 6.5, 7.5 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "8, 9, 10 / 7, 8, 9",
 "7, 8, 9 / 5, 6, 7",
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
 "2% 6, 7, 8 | 7, 8, 9",
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
 "5, 6, 7 | Sprint (30 Seconds)"
 ],
 [
 "Recover",
 "7, 8, 9 / 8, 9, 10",
 "8, 9, 10 | 5, 6, 7",
 "5, 6, 7 | Sprint (45 Seconds)"
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
 "6% 6.5, 7.5, 8.5 | 6% 7.5, 8, 5, 9.5",
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
 "6, 7, 8 | 6, 7, 8, 8%",
 "6, 7, 8 | 6, 7, 8, 8%",
 "6, 7, 8 | 7, 8, 9, 8%"
 ],
 [
 "RECOVER",
 "7, 8, 9 / 8, 9, 10",
 "8, 9, 10 | 5, 6, 7",
 "5, 6, 7 | Sprint (45 Seconds)"
 ],
 [
 "RECOVER",
 "7, 8, 9",
 "7.5, 8.5, 9.5 | 3% 5, 6, 7",
 "3% 5.5, 6.5, 7.5 | 3% 8.5, 9.5, 10.5"
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
 "7.5, 8.5, 9.5 | Sprint (30 Seconds)"
 ],
 [
 "RECOVER",
 "7.5, 8.5, 9.5 | 8, 9, 10",
 "5.5, 6.5, 7.5 | 6.5, 7.5, 8.5",
 "7.5, 8.5, 9., 5 | Sprint (30 Seconds)"
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
 "6% 5.5, 6.5, 5.5 | 0% 5, 6, 7",
 "3% 6.5, 7.5, 8.5 | 8.5, 9.5, 10.5"
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
 index: number; // 1-based index in the library
 total: number; // Total blocks available for this category/length
}

export function getRandomFloorBlock(category: BlockCategory, length: number): BlockSelection | null {
 const blocks = FLOOR_BLOCKS[category][length];
 if (!blocks || blocks.length === 0) return null;
 const index = Math.floor(Math.random() * blocks.length);
 return {
 block: blocks[index],
 index: index + 1, // 1-based for display
 total: blocks.length
 };
}

export function getRandomTreadBlock(category: BlockCategory, length: number): BlockSelection | null {
 const blocks = TREAD_BLOCKS[category][length];
 if (!blocks || blocks.length === 0) return null;
 const index = Math.floor(Math.random() * blocks.length);
 return {
 block: blocks[index],
 index: index + 1, // 1-based for display
 total: blocks.length
 };
}

// Get a specific block by index (for re-selection)
export function getFloorBlockByIndex(category: BlockCategory, length: number, index: number): string[] | null {
 const blocks = FLOOR_BLOCKS[category][length];
 if (!blocks || index < 1 || index > blocks.length) return null;
 return blocks[index - 1]; // Convert from 1-based to 0-based
}

export function getTreadBlockByIndex(category: BlockCategory, length: number, index: number): string[] | null {
 const blocks = TREAD_BLOCKS[category][length];
 if (!blocks || index < 1 || index > blocks.length) return null;
 return blocks[index - 1]; // Convert from 1-based to 0-based
}

export function getAvailableLengths(category: BlockCategory): number[] {
 const floorLengths = Object.keys(FLOOR_BLOCKS[category]).map(Number);
 const treadLengths = Object.keys(TREAD_BLOCKS[category]).map(Number);
 // Return lengths that exist in both
 return floorLengths.filter(len => treadLengths.includes(len)).sort((a, b) => a - b);
}

