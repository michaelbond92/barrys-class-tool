const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exerciseBlocks.ts');
let content = fs.readFileSync(filePath, 'utf8');

// ============================================
// EXERCISE ABBREVIATION EXPANSIONS
// ============================================

// These need word boundaries to avoid replacing parts of words
const exerciseReplacements = [
  // Left/Right - be careful with word boundaries
  [/\bR\s+BO\b/g, 'Right Bent Over'],
  [/\bL\s+BO\b/g, 'Left Bent Over'],
  [/\bR\s+Squat/g, 'Right Squat'],
  [/\bL\s+Squat/g, 'Left Squat'],
  [/\bR\s+Arm\b/g, 'Right Arm'],
  [/\bL\s+Arm\b/g, 'Left Arm'],
  [/\bR\s+Tempo\b/g, 'Right Tempo'],
  [/\bL\s+Tempo\b/g, 'Left Tempo'],
  [/\bR\s+Front/g, 'Right Front'],
  [/\bL\s+Front/g, 'Left Front'],
  [/\bR\s+Offset/g, 'Right Offset'],
  [/\bL\s+Offset/g, 'Left Offset'],
  [/\bR\s+Snatch/g, 'Right Snatch'],
  [/\bL\s+Snatch/g, 'Left Snatch'],
  [/\bR\s+Just\b/g, 'Right Just'],
  [/\bL\s+Just\b/g, 'Left Just'],
  [/\bR\s+SDL\b/g, 'Right Single-Leg Deadlift'],
  [/\bL\s+SDL\b/g, 'Left Single-Leg Deadlift'],
  [/\b(\d+)\s+R\s+(\d+)\s+L\b/g, '$1 Right $2 Left'],  // "2 R 2 L" -> "2 Right 2 Left"
  [/\b(\d+)\s+R\s+BO\b/g, '$1 Right Bent Over'],
  [/\b(\d+)\s+L\s+BO\b/g, '$1 Left Bent Over'],
  [/\b3\s+R\s+Bench/g, '3 Right Bench'],
  [/\b3\s+L\s+Bench/g, '3 Left Bench'],
  [/\b8\s+R\s+8\s+L\b/g, '8 Right 8 Left'],

  // Common abbreviations
  [/\bBO\s+Row/gi, 'Bent Over Row'],
  [/\bBO\b/g, 'Bent Over'],
  [/\bDB\s+Swing/gi, 'Dumbbell Swing'],
  [/\bDB\s+Snatch/gi, 'Dumbbell Snatch'],
  [/\bDB\s+Clean/gi, 'Dumbbell Clean'],
  [/\bDB\b/g, 'Dumbbell'],
  [/\bWGS\b/g, "World's Greatest Stretch"],
  [/\bGM\b/g, 'Good Morning'],
  [/\bOH\s+Press/gi, 'Overhead Press'],
  [/\bOH\s+Tricep/gi, 'Overhead Tricep'],
  [/\bOH\b/g, 'Overhead'],
  [/\bSDL\b/g, 'Single-Leg Deadlift'],
  [/\bDL\b/g, 'Deadlift'],
  [/\bDD\b/g, 'Down Dog'],
  [/\bMC\b/g, 'Mountain Climbers'],
  [/\bCP\b/g, 'Chest Press'],
  [/\bRR\b/g, 'Reverse Row'],
  [/\bAlt\s+/gi, 'Alternating '],
  [/\bHi\s+Pull/gi, 'High Pull'],
  [/\bBW\b/g, 'Bodyweight'],
  [/\bINC\b/gi, 'Incline'],
  [/\bSauts\b/g, 'Squats'],  // typo fix

  // Fix "Puhups" typo
  [/\bPuhups\b/g, 'Pushups'],
  [/\bPusles\b/g, 'Pulses'],
  [/\bRquat\b/g, 'Squat'],
  [/\bSeocnds\b/g, 'Seconds'],
  [/\bSconds\b/g, 'Seconds'],
  [/\bSeonds\b/g, 'Seconds'],
];

// Apply exercise replacements
for (const [pattern, replacement] of exerciseReplacements) {
  content = content.replace(pattern, replacement);
}

// ============================================
// TREAD FORMATTING FIXES
// ============================================

// Fix spacing around commas in speed notations like "6.5 ,7.5" or "6,7,8"
content = content.replace(/(\d+\.?\d*)\s*,\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)/g, '$1, $2, $3');

// Fix spacing in patterns like "6, 7 8" (missing comma)
content = content.replace(/(\d+\.?\d*),\s*(\d+\.?\d*)\s+(\d+\.?\d*)(?!\s*,)/g, '$1, $2, $3');

// Normalize "Sprint" formatting
content = content.replace(/\bSprint\s*\(/gi, 'Sprint (');
content = content.replace(/\|\s*Sprint\b/gi, '| Sprint');
content = content.replace(/\/\s*Sprint\b/gi, '| Sprint');

// Fix spacing around pipes (only single pipes inside strings, not || operators)
content = content.replace(/(\w)\s*\|\s*(\w)/g, '$1 | $2');

// Fix double spaces
content = content.replace(/  +/g, ' ');

// Fix "5. 6, 7" typos (period instead of comma)
content = content.replace(/(\d+)\.\s+(\d+),\s*(\d+)/g, '$1, $2, $3');

// ============================================
// WRITE OUTPUT
// ============================================

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleanup complete!');

// Show some stats
const originalContent = fs.readFileSync(filePath, 'utf8');
console.log('\nVerifying some expansions exist in output:');
console.log('- "Bent Over Row":', originalContent.includes('Bent Over Row'));
console.log('- "World\'s Greatest Stretch":', originalContent.includes("World's Greatest Stretch"));
console.log('- "Good Morning":', originalContent.includes('Good Morning'));
console.log('- "Single-Leg Deadlift":', originalContent.includes('Single-Leg Deadlift'));
console.log('- "Mountain Climbers":', originalContent.includes('Mountain Climbers'));
