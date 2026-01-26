# Vibe Improvement Suggestions

Based on vibe comparison testing between imported Barry's class data and generated output.

## Current Gap Analysis (Score: 54/100)

| Metric | Imported | Generated | Gap |
|--------|----------|-----------|-----|
| Combo Movements | 25% | 0% | -25% |
| EMOM Notation | 6.3% | 0% | -6.3% |
| Ladder Patterns | 12.5% | 0% | -12.5% |
| 30/30 Splits | 6.3% | 0% | -6.3% |
| 45/15 Splits | 6.3% | 0% | -6.3% |
| Power Moves | 18.8% | 6.3% | -12.5% |
| Finishers | 150%* | 50% | -100% |

*Finisher rate > 100% means multiple finisher-type moves per round

## Improvement Recommendations

### 1. Add Combo Movement Generation (Priority: HIGH)
**Current**: Generator outputs simple exercises like "8 Chest Press"
**Target**: Output compound movements like "8 Squat to Press", "6 Deadlift to Row"

**Implementation**:
- Add `comboMovementChance` parameter to generation config (default: 0.15-0.25)
- Create combo templates:
  ```typescript
  const COMBO_PATTERNS = [
    '{count} Squat to Press',
    '{count} Deadlift to Row',
    '{count} Clean to Press',
    '{count} Lunge to Curl',
    '{count} RDL to Row',
    '{count} Goblet Squat to Press',
    '{count} Thruster',
  ];
  ```
- Apply to workout blocks, not warmups

### 2. Add EMOM Notation Formatting (Priority: MEDIUM)
**Current**: Generator outputs "8 Chest Press 8 Rows"
**Target**: Output "8 Chest Press // 8 Rows" for EMOM minutes

**Implementation**:
- Add `emomChance` parameter (default: 0.05-0.10)
- Format applicable lines with `//` or `(Exercise)` notation
- Only apply to paired exercises in same minute

### 3. Add Ladder Pattern Generation (Priority: MEDIUM)
**Current**: Static rep counts
**Target**: Progressive rep schemes like "(+2)" or "(-1 to Squat)"

**Implementation**:
- Add `ladderChance` parameter (default: 0.10-0.15)
- Append ladder notation to blocks:
  ```typescript
  // Simple ladder
  "8 Chest Press 8 Squats (-2)"

  // Targeted ladder
  "4 Rows 4 Press (+1 to Press)"
  ```
- Track initial reps and ladder direction

### 4. Add Split Timing Notation (Priority: MEDIUM)
**Current**: Single exercise per minute
**Target**: Split exercises like "8 Press | 8 Fly" (30/30) or "8 Press / Hold" (45/15)

**Implementation**:
- Add `split30Chance` and `split45Chance` parameters (default: 0.05 each)
- Create split templates:
  ```typescript
  // 30/30 splits
  '{count} {exercise1} | {count} {exercise2}'
  '{count} {exercise} | {count} Pulse'

  // 45/15 splits
  '{count} {exercise} / Hold'
  '{count} {exercise} / Squeeze'
  ```

### 5. Increase Power Move Frequency (Priority: HIGH)
**Current**: 6.3% power moves
**Target**: 15-20% power moves

**Implementation**:
- Add `powerMoveChance` parameter to config (default: 0.15-0.20)
- Tag exercises as power moves in exercise database
- Bias selection toward power moves for finisher positions
- Power move keywords: snatch, clean, swing, burpee, jump, thruster

### 6. Enhance Finisher Selection (Priority: HIGH)
**Current**: Finisher appears 50% of rounds
**Target**: Every round should have finisher-appropriate final exercise

**Implementation**:
- Add `finisherStyle` config option
- Create finisher exercise pool:
  ```typescript
  const FINISHER_EXERCISES = [
    'Single Arm Snatch',
    'Clean to Press',
    'Burpees',
    'Thruster',
    'Jump Squats',
    'KB Swings',
    'Power Cleans',
  ];
  ```
- Force finisher selection for last block of each round

## Implementation Priority

1. **Phase 1 (High Impact)**
   - Combo movement generation
   - Power move frequency boost
   - Finisher enhancement

2. **Phase 2 (Medium Impact)**
   - EMOM notation
   - Ladder patterns
   - Split timing notation

3. **Phase 3 (Polish)**
   - Fine-tune rates based on imported data distribution
   - Add style presets (Intense, Balanced, Recovery)

## New Config Parameters

Add to generation config:
```typescript
interface GenerationConfig {
  // ... existing fields ...

  // Vibe matching parameters
  comboMovementChance: number;     // 0.15-0.25
  emomChance: number;              // 0.05-0.10
  ladderChance: number;            // 0.10-0.15
  split30Chance: number;           // 0.05
  split45Chance: number;           // 0.05
  powerMoveChance: number;         // 0.15-0.20
  forceFinisher: boolean;          // true
}
```

## Validation

After implementing, run vibe comparison again:
- Target overall score: 80+
- Key metrics to watch:
  - Combo Movement Rate: 15%+
  - Power Move Rate: 15%+
  - Finisher Rate: 90%+
  - Maintain Flow Score within 10 points of imported

## Tagging Improvements

To support better vibe matching, add these tags to exercise metadata:

1. **`isPowerMove`**: boolean - for explosive exercises
2. **`isFinisherCandidate`**: boolean - for round-ending exercises
3. **`comboCompatible`**: string[] - exercises this can combine with
4. **`supportsEMOM`**: boolean - if exercise works in EMOM format
5. **`supportsLadder`**: boolean - if reps can progressively change
6. **`supportsSplit`**: '30_30' | '45_15' | 'both' | 'none'

These tags enable smarter selection during generation.
