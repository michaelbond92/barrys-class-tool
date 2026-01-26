#!/usr/bin/env node
// ============================================================================
// Test Script: Validate XLSX Parsing
// Run with: node scripts/testParsing.js <path-to-xlsx>
// ============================================================================

import XLSX from 'xlsx';
import path from 'path';

// Default test file
const DEFAULT_FILE = '/Users/michaelbond/Downloads/Friday (Total Body) Master Classes.xlsx';
const testFile = process.argv[2] || DEFAULT_FILE;

console.log('🧪 Testing XLSX Parsing');
console.log('========================');
console.log(`File: ${testFile}\n`);

// Load workbook
const workbook = XLSX.readFile(testFile);
console.log(`Found ${workbook.SheetNames.length} sheets\n`);

// Parse date from sheet name
function parseDateFromSheetName(sheetName) {
  const dateMatch = sheetName.match(/(\d{1,2})\.(\d{1,2})\.(\d{2})/);
  if (!dateMatch) return null;
  const [, month, day, year] = dateMatch;
  const fullYear = parseInt(year) >= 50 ? 1900 + parseInt(year) : 2000 + parseInt(year);
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Parse equipment text
function parseEquipment(text) {
  const match = text.match(/equipment:\s*(.+?)(?:\n|$)/i);
  return match ? match[1].trim() : 'Unknown';
}

// Find round boundaries
function findRoundBoundaries(data) {
  let round1Start = -1, round1End = -1, round2Start = -1, round2End = -1;
  let inRound1 = false, inRound2 = false;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || '').trim();

    if (firstCell.match(/^\d+-\d+$/)) {
      if (!inRound1 && !inRound2) {
        round1Start = i;
        inRound1 = true;
      } else if (inRound1 && round1End > 0) {
        round2Start = i;
        inRound1 = false;
        inRound2 = true;
      }

      if (inRound1) round1End = i;
      else if (inRound2) round2End = i;
    }

    if (inRound1 && !firstCell.match(/^\d+-\d+$/)) {
      if (firstCell === '' || firstCell.toLowerCase().includes('equipment:') || firstCell.toLowerCase() === 'minute') {
        if (round1End > 0 && i > round1End + 1) {
          inRound1 = false;
        }
      }
    }
  }

  return { round1Start, round1End: round1End + 1, round2Start, round2End: round2End + 1 };
}

// Parse a single sheet
function parseSheet(sheet, sheetName) {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const date = parseDateFromSheetName(sheetName);
  const boundaries = findRoundBoundaries(data);

  // Find equipment rows
  let r1Equipment = 'Unknown', r2Equipment = 'Unknown';
  for (let i = 0; i < Math.min(data.length, 5); i++) {
    const row = data[i];
    if (row && row[0] && String(row[0]).toLowerCase().includes('equipment:')) {
      r1Equipment = parseEquipment(String(row[0]));
      break;
    }
  }
  for (let i = boundaries.round2Start - 5; i < boundaries.round2Start; i++) {
    if (i < 0) continue;
    const row = data[i];
    if (row && row[0] && String(row[0]).toLowerCase().includes('equipment:')) {
      r2Equipment = parseEquipment(String(row[0]));
      break;
    }
  }

  // Parse minutes
  const r1Minutes = [];
  const r2Minutes = [];

  for (let i = boundaries.round1Start; i < boundaries.round1End; i++) {
    const row = data[i];
    if (!row || !String(row[0]).match(/^\d+-\d+$/)) continue;
    r1Minutes.push({
      minute: row[0],
      tread: row[1] || '',
      floor: row[2] || '',
    });
  }

  for (let i = boundaries.round2Start; i < boundaries.round2End; i++) {
    const row = data[i];
    if (!row || !String(row[0]).match(/^\d+-\d+$/)) continue;
    r2Minutes.push({
      minute: row[0],
      tread: row[1] || '',
      floor: row[2] || '',
    });
  }

  return {
    sheetName,
    date,
    round1: { equipment: r1Equipment, duration: r1Minutes.length, minutes: r1Minutes },
    round2: { equipment: r2Equipment, duration: r2Minutes.length, minutes: r2Minutes },
  };
}

// Position detection patterns
const POSITION_PATTERNS = {
  bench_laying: [/chest\s*press/i, /skull/i, /pullover/i, /fly/i, /crunch/i, /toe\s*touch/i, /leg\s*lift/i, /jacknife/i],
  bench_sitting: [/russian\s*twist/i, /boat\s*pose/i, /sit\s*up/i, /situp/i],
  floor_laying: [/plank/i, /push\s*up/i, /pushup/i, /commando/i, /x\s*human/i, /mountain/i, /wgs/i, /world.*greatest/i, /shoulder\s*tap/i, /renegade/i],
  floor_standing: [/squat/i, /deadlift/i, /lunge/i, /snatch/i, /clean/i, /swing/i, /curl/i, /row/i, /good\s*morning/i, /rdl/i, /high\s*pull/i, /burpee/i, /shoulder.*press/i, /overhead/i],
};

function detectPosition(text) {
  const lower = text.toLowerCase();
  for (const [position, patterns] of Object.entries(POSITION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) return position;
    }
  }
  return 'floor_standing';
}

// Calculate flow score
const TRANSITION_COSTS = {
  bench_laying: { bench_laying: 0, bench_sitting: 1, floor_laying: 2, floor_standing: 2 },
  bench_sitting: { bench_laying: 1, bench_sitting: 0, floor_laying: 2, floor_standing: 2 },
  floor_laying: { bench_laying: 2, bench_sitting: 2, floor_laying: 0, floor_standing: 1 },
  floor_standing: { bench_laying: 2, bench_sitting: 2, floor_laying: 1, floor_standing: 0 },
};

function calculateFlowScore(positions) {
  if (positions.length <= 1) return { score: 100, cost: 0 };

  let totalCost = 0;
  for (let i = 1; i < positions.length; i++) {
    const from = positions[i - 1];
    const to = positions[i];
    totalCost += TRANSITION_COSTS[from]?.[to] ?? 2;
  }

  let score = 100 - (totalCost * 5);
  return { score: Math.max(0, Math.min(100, score)), cost: totalCost };
}

// Analyze and display results
console.log('📊 Analysis Results:\n');

const classes = [];
let totalMinutes = 0;
let totalRounds = 0;
let positionCounts = {};

for (const sheetName of workbook.SheetNames.slice(0, 10)) { // First 10 sheets
  const sheet = workbook.Sheets[sheetName];
  const parsed = parseSheet(sheet, sheetName);
  classes.push(parsed);

  totalMinutes += parsed.round1.duration + parsed.round2.duration;
  totalRounds += 2;

  // Analyze positions
  const allFloor = [...parsed.round1.minutes, ...parsed.round2.minutes].map(m => m.floor);
  for (const floor of allFloor) {
    const pos = detectPosition(floor);
    positionCounts[pos] = (positionCounts[pos] || 0) + 1;
  }
}

// Print summary for first 5 classes
console.log('First 5 Classes:');
console.log('─'.repeat(80));
for (const cls of classes.slice(0, 5)) {
  console.log(`\n📅 ${cls.date || cls.sheetName}`);
  console.log(`   Round 1: ${cls.round1.duration}min, ${cls.round1.equipment}`);
  console.log(`   Round 2: ${cls.round2.duration}min, ${cls.round2.equipment}`);

  // Calculate flow for round 1
  const r1Positions = cls.round1.minutes.map(m => detectPosition(m.floor));
  const r1Flow = calculateFlowScore(r1Positions);
  console.log(`   R1 Flow: ${r1Flow.score}/100 (cost: ${r1Flow.cost})`);

  // Show first/last exercises
  if (cls.round1.minutes.length > 0) {
    console.log(`   R1 Start: "${cls.round1.minutes[0].floor}"`);
    console.log(`   R1 End:   "${cls.round1.minutes[cls.round1.minutes.length - 1].floor}"`);
  }
}

// Position distribution
console.log('\n\n📍 Position Distribution (first 10 classes):');
console.log('─'.repeat(40));
const sortedPositions = Object.entries(positionCounts).sort((a, b) => b[1] - a[1]);
const totalPos = Object.values(positionCounts).reduce((a, b) => a + b, 0);
for (const [pos, count] of sortedPositions) {
  const pct = ((count / totalPos) * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(pct / 2));
  console.log(`${pos.padEnd(18)} ${count.toString().padStart(4)} (${pct.padStart(5)}%) ${bar}`);
}

// Summary stats
console.log('\n\n📈 Summary Statistics:');
console.log('─'.repeat(40));
console.log(`Total sheets analyzed: ${classes.length}`);
console.log(`Total rounds: ${totalRounds}`);
console.log(`Total minutes: ${totalMinutes}`);
console.log(`Average round duration: ${(totalMinutes / totalRounds).toFixed(1)} min`);

// Finisher analysis
console.log('\n\n🏁 Finisher Types (last exercise of each round):');
console.log('─'.repeat(40));
const finisherCounts = {};
for (const cls of classes) {
  const r1Last = cls.round1.minutes[cls.round1.minutes.length - 1]?.floor || '';
  const r2Last = cls.round2.minutes[cls.round2.minutes.length - 1]?.floor || '';

  for (const last of [r1Last, r2Last]) {
    if (/snatch/i.test(last)) finisherCounts['snatches'] = (finisherCounts['snatches'] || 0) + 1;
    else if (/burpee/i.test(last)) finisherCounts['burpees'] = (finisherCounts['burpees'] || 0) + 1;
    else if (/swing/i.test(last)) finisherCounts['db_swings'] = (finisherCounts['db_swings'] || 0) + 1;
    else if (/choice/i.test(last)) finisherCounts['choice'] = (finisherCounts['choice'] || 0) + 1;
    else if (/amrap/i.test(last)) finisherCounts['amrap'] = (finisherCounts['amrap'] || 0) + 1;
    else finisherCounts['other'] = (finisherCounts['other'] || 0) + 1;
  }
}

for (const [type, count] of Object.entries(finisherCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`${type.padEnd(15)} ${count}`);
}

console.log('\n✅ Parsing test complete!');
