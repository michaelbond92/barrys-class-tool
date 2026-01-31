# Barry's Class Programming Tool - Claude Memory

> **Purpose**: Context and memory for AI sessions working on this project.
>
> **Related Docs:**
> - `TECHNICAL_SPEC.md` — Data models, taxonomies, detection patterns
> - `PRD.md` — Product requirements
> - `src/data/generationRules.ts` — Generation rules (user-confirmed)
> - `src/services/transitionRulesService.ts` — Transition prediction rules (RLHF-trained)

---

## Project Overview

A tool for generating Barry's Bootcamp-style fitness classes. Users import real class spreadsheets, which are indexed and analyzed. The system then generates new classes that match Barry's style using block-based generation with flow scoring.

**Live URL**: https://michaelbond92.github.io/barrys-class-tool

### Key Concepts

- **Barry's Classes**: 40-42 min total, but taught as 2 rounds (R1 + R2 = 20-21 min) where groups swap between tread and floor
- **Blocks**: 2-4 minute mini-arcs of exercises that flow together
- **Flow Score**: Measures how smoothly exercises transition (position changes, grip load)
- **Vibe**: The energy/intensity feel of a round (matches tread profile)
- **Transition**: Exercise A → Exercise B. "YES" means it *could* work, not that it's ideal.

---

## Data Sources

### Imported Data (localStorage)
| Key | Description | Count |
|-----|-------------|-------|
| `barrys_rounds` | Full round data with minutes | 98 rounds |
| `barrys_classes` | Class metadata | 49 classes |
| `barrys_exercise_index` | Indexed exercises with tags | 457 exercises |
| `barrys_exercises` | Exercise definitions | 69 definitions |
| `barrys_generation_feedback` | RLHF feedback from Vibe Check | varies |
| `barrys_transition_ratings` | Manual transition ratings | 200 ratings |

### Key Files
| File | Purpose |
|------|---------|
| `src/data/generationRules.ts` | 24 confirmed generation rules with helpers |
| `src/data/exerciseReference.ts` | 71 exercises with full metadata (weightPath, movementPlane, etc.) |
| `src/data/transitionData.json` | Barry's 787 proven transitions + 200 user ratings |
| `src/data/transitionRatings.json` | Raw user ratings with notes |
| `src/services/transitionRulesService.ts` | 11 prediction rules from RLHF (78% accuracy) |
| `src/services/transitionScoringService.ts` | Scores transitions using rules + data |
| `src/components/game/TransitionRater.tsx` | Smart RLHF tool with predictions |

### RLHF Storage Keys
| Key | Description |
|-----|-------------|
| `barrys_tag_feedback` | Exercise tag corrections from Tag Check game |
| `barrys_block_feedback` | Block ratings (good/bad/fixed) with text feedback |
| `barrys_generated_combos` | Novelty tracking - avoids repeating bad combos |
| `barrys_transition_ratings` | Exercise transition ratings (yes/no/skip) |

---

## Transition Rules (RLHF-Trained)

### Rule Summary (from 402 ratings, 72% overall, YES 63%, NO 78%)

| Rule | Prediction | Confidence | Notes |
|------|------------|------------|-------|
| Split squat destination | NO | 95% | 100% NO rate (10/10) |
| Universal receivers | YES | 80% | Single Arm Row, Squat, Deadlift accept many |
| Standing curls → Bench | YES | 85% | Bicep Curl → Skull Crusher works |
| Standing curls → Supine | YES | 80% | Hammer Curl → Russian Twist works |
| Standing → Supine Core | YES | 80% | Squat to Press → Jacknife works |
| Hip Thrust → Supine Core | YES | 85% | Same floor zone |
| Supine → Supine Core | YES | 90% | Lat Pullover → Sit Up works |
| Pullover → other bench | NO | 90% | Doesn't flow despite same position |
| Renegade → Glute Bridge | YES | 75% | End of plank work, flip is OK |
| Supine → complex compound | NO | 85% | Situp → SDL to Lunge too much |
| Supine → simple standing | YES | 80% | Squat, Deadlift, Shoulder Press |
| Same bench (non-pullover) | YES | 85% | Chest Fly → Skull Crusher works |
| Power → Supine Core | YES | 80% | Clean to Press → Sit Up (rest after power) |
| High grip → High grip | NO | 75% | Fatigue concern |
| Warmup → Power | NO | 90% | Wrong sequence |
| Same family (not squat) | YES | 75% | Hinge→hinge works |

### Key Learnings from 402 Ratings

1. **Bi-directional flows** - Standing ↔ Supine Core works both ways
2. **Standing Curls are special** - Flow to bench AND supine (unique transition ability)
3. **Universal Receivers** - Single Arm Row, Squat, Deadlift accept almost anything
4. **Hip Thrust → Supine = YES** - Same floor zone, not awkward like we thought
5. **Power → Core = YES** - Rest on floor after power finisher makes sense
6. **Renegade → Glute Bridge = YES** - End of plank work, flip is intentional

### Exercise Categories

```typescript
// Universal receivers - accept from many sources
UNIVERSAL_RECEIVERS = ['squat', 'goblet_squat', 'deadlift', 'single_arm_row', 'row']

// Standing curls flow to bench AND supine
STANDING_CURLS = ['bicep_curl', 'hammer_curl', 'hammer_curl_to_press', 'curl_to_press']

// Bench that receives from curls
BENCH_FROM_CURLS = ['skull_crusher', 'chest_fly', 'chest_press']

// NEVER valid as destination
PROBLEM_DESTINATIONS = ['split_squat']

// Don't flow to other bench exercises
PULLOVER_EXERCISES = ['pullover', 'lat_pullover', 'lat_pullover_to_crunch']
```

---

## Navigation Structure

The app uses dropdown navigation to keep the header clean:

**Main Tabs**: Generator, Library, History, Analytics, Import

**Training Dropdown**: Transitions, Vibe Check, Tag Check, Block Builder, Exercises

**More Dropdown**: Calculator, Search

---

## Generation Rules Summary

### Tread Rules (User-Confirmed)
- Always start R1 with "5 - 7" pace
- Speed ranges span 3 numbers (e.g., 5-7, 6-8), max 9-11
- Patterns hold 2-3 minutes typically
- Never start with "ACTIVE REST" or "RECOVER"
- Lower speeds pair with higher inclines (but not strict)

### Floor Rules (User-Confirmed)
- Intense WEIGHTED moves only in last 20% of R1 or anytime in R2
- Intense moves can be back-to-back (max 2 min) if they flow
- Avoid repeating same exercise within 3 min unless building

### Timing Rules (Data-Backed from 49 classes)
| Category | Avg Placement | Key Finding |
|----------|---------------|-------------|
| Warmup (WGS, GMS) | 12% | 98% in first 25% of round |
| Power (Snatch, Thruster) | 90% | 80% in last 25% of round |
| Burpees | 78% | R1: 51% (mid), R2: 98% (end) |
| Core | 59% | Middle of rounds |
| Compound | 66% | Later half |

### Structure Rules
- R1 + R2 = 20-21 min (×2 for swap = 40-42 min class)
- R1 typically longer than R2 (common: 12/8, 11/9, 14/6)
- Warmup blocks: 3-4 min, stretch → movement → intense

### Rep Rules
- Standard: 8, 10, or 12 reps
- Warmup: 3-4 reps
- Power: 6-8 reps or AMRAP
- Ladders change by 1 or 2 only (up or down)

---

## Current Work

### Completed
- [x] Import 49 classes from XLSX
- [x] Index exercises with automatic tagging
- [x] Build generation rules from user feedback (24 rules)
- [x] Data-backed timing analysis
- [x] Vibe Check Game for RLHF feedback
- [x] Exercise Reference file with 71 curated exercises
- [x] Tag Validation Game for manual review
- [x] Block Builder Game for RLHF on block generation
- [x] Exercise substitution classes for controlled variety
- [x] Equipment compatibility checking
- [x] Novelty tracking to avoid repeating combos
- [x] Deployed to GitHub Pages
- [x] **Transition Rater** - Smart RLHF with predictions (200 ratings)
- [x] **Transition Rules** - 11 rules at 78% accuracy
- [x] **Enhanced Flow Scoring** - Position, weight path, plane, grip
- [x] **Dropdown Navigation** - Clean header with grouped tabs

### In Progress
- [ ] Continue RLHF training to improve rule accuracy
- [ ] Integrate transition rules into block generation

### Planned
- [ ] Round Builder Game (rate sequences of blocks)
- [ ] Embeddings integration (needs backend for production)
- [ ] NL generation feature
- [ ] Library redesign

---

## Session Notes

### 2026-01-31: Transition Rater & RLHF Training (402 ratings)

Built smart Transition Rater with prediction system:
- 3 modes: Smart (uncertain), Review Predictions, Random
- Shows system prediction with confidence %
- Keyboard shortcuts: Y/N/S/A (accept prediction)
- Tracks prediction accuracy in real-time

**402 ratings collected:**
- 136 YES (34%), 266 NO (66%)
- User is stricter than Barry's actual transitions

**Prediction accuracy (after 402):**
- Overall: 72%
- YES predictions: 63%
- NO predictions: 78%
- New 102 ratings: 76% accuracy (rules improving!)

**Major discoveries from 402 ratings:**

| Finding | Rule Update |
|---------|-------------|
| Standing → Supine Core = YES | Lie down for core is natural |
| Standing Curls → Bench = YES | Bicep Curl → Skull Crusher works |
| Standing Curls → Supine = YES | Hammer Curl → Russian Twist works |
| Hip Thrust → Supine Core = YES | Same floor zone, not awkward |
| Renegade → Glute Bridge = YES | End of plank work, flip is OK |
| Power → Supine Core = YES | Rest on floor after power |
| Universal receivers expanded | Single Arm Row, Squat, Deadlift |

**Key insight:** Transitions are bi-directional for Supine Core:
- Standing → Supine Core = YES (lie down)
- Supine Core → Standing = YES (sit up and stand)

**Standing curls are uniquely flexible:**
- Flow to bench exercises (Skull Crusher, Chest Fly)
- Flow to supine core (Russian Twist, Jacknife)
- Flow to dead bug (Hammer Curl → Dead Bug = YES)

### 2026-01-30: Enhanced Flow Scoring

Added multi-factor flow scoring:
- Position score (40%) - transitions between positions
- Weight path score (30%) - where dumbbells end/start
- Movement plane score (20%) - sagittal/frontal/transverse
- Grip fatigue score (10%) - consecutive high-grip exercises

### 2025-01-25: Block Builder Game & RLHF Training

Built Block Builder Game for training block generation:
- Rate blocks: good/bad/fix with text feedback
- Drag-to-reorder for "fix" mode
- Batch display (4 blocks at once)
- Novelty tracking to avoid repeating bad combos

**Key learnings from user feedback:**

| Issue | Learning |
|-------|----------|
| Core blocks | Don't exist as standalone - core is sprinkled as grip break (30%) |
| Position oscillations | Stay in one position zone per block (bench zone OR standing zone) |
| Power overload | Max 1 power move per finisher, not 2-3 |
| Warmup flow | Standing stretch → transition (inchworm) → plank/floor work |
| Lower body | Hinge first → lunge → core break → lunge/squat |
| Finisher continuity | Movement patterns must match (hinge+hinge, not lunge+swing) |

---

## Quick Reference

### Common Exercise Abbreviations
| Abbrev | Full Name |
|--------|-----------|
| WGS | World's Greatest Stretch |
| GMS | Good Morning Stretch |
| GM | Good Morning |
| DL | Deadlift |
| RDL | Romanian Deadlift |
| SDL | Stiff/Straight Leg Deadlift |
| RR | Renegade Row |
| MC | Mountain Climbers |
| OH | Overhead |
| BO | Burn Out / Bent Over |

### Position Types
- `floor_standing` (61.5%) - Most exercises
- `floor_laying` (20.4%) - Planks, pushups, WGS
- `bench_laying` (14.3%) - Chest press, crunches
- `bench_sitting` (2.7%) - Russian twists, situps
- `bench_front/back/straddling` (rare)

### Movement Patterns
- `push` - Chest press, pushups, shoulder press
- `pull` - Rows, curls, pullovers
- `hinge` - Deadlifts, RDLs, swings
- `squat` - Squats, goblet, sumo
- `lunge` - Lunges, curtsy, split squat
- `rotation` - Russian twist, woodchop
- `plank` - Planks, mountain climbers
- `power` - Snatches, cleans, burpees

### Movement Families (for transitions)
| Family | Exercises |
|--------|-----------|
| plank_family | plank, mountain_climber, commando, pushup, renegade_row, bear_crawl, inchworm |
| hinge_family | deadlift, rdl, sdl, good_morning, clean, snatch, db_swing |
| squat_family | squat, goblet_squat, sumo_squat, front_squat, split_squat, bulgarian_split_squat |
| lunge_family | lunge, reverse_lunge, curtsy_lunge, lateral_lunge |
| core_supine | situp, crunch, toe_touch, jacknife, russian_twist, leg_lift, hip_raise |

### Block Generation Rules (from RLHF)
- **Warmup**: Standing stretch → Transition (inchworm) → Plank work
- **Upper Body**: Stay in bench zone OR standing zone
- **Lower Body**: Hinge → Lunge → Core break (40%) → Lunge/Squat
- **Finisher**: Build-up → Single power move (same movement family)
- **Core**: NOT a block type - sprinkle as grip break (30-40% chance)
- **Equipment**: All exercises in block must use same weight type (heavy OR medium)

---

## Weight Path Model

Exercises have a weight position at START, MID, and END of the movement.
Compounds work when one exercise's MID or END matches the next exercise's START.

### Weight Positions
| Position | Description | Example |
|----------|-------------|---------|
| `floor` | On ground | Deadlift start |
| `sides` | Hanging at sides | Standing, arms down |
| `chest` | At chest level | Goblet squat |
| `shoulders` | Rack position | Clean catch, front squat |
| `overhead` | Above head | Press top |
| `extended` | Arms extended forward | Chest press top |
| `behind_head` | Behind head | Skull crusher bottom |

### Compound Flow Rule
Exercise A → B works if:
1. `A.weightPath.end === B.weightPath.start` (sequential)
2. OR `A.weightPath.mid === B.weightPath.start` (compound mid-movement)
3. AND equipment types match
4. AND body positions compatible
5. AND movement planes compatible (sagittal with sagittal, etc.)

### Movement Planes
| Plane | Direction | Examples |
|-------|-----------|----------|
| `sagittal` | Forward/backward | Squats, lunges, presses |
| `frontal` | Side-to-side | Lateral raises, lateral lunges |
| `transverse` | Rotational | Russian twist, woodchop |

Lateral movements don't mix with sagittal (user feedback: lateral lunge doesn't fit with deadlifts/lunges).

---

## Body Positions (Expanded)

| Position | Description | Example Exercises |
|----------|-------------|-------------------|
| `floor_standing` | Standing on floor | Squats, lunges, rows |
| `floor_laying` | Lying/plank on floor | Pushups, planks |
| `floor_kneeling` | Kneeling on floor | Kneeling press |
| `bench_laying` | Lying on bench | Chest press, skull crusher |
| `bench_sitting` | Sitting on bench | Russian twist, seated press |
| `bench_kneeling` | Kneeling on bench | Banded kickbacks |
| `bench_facing` | Standing at bench, facing it | Lateral movements |
| `bench_front` | At front of bench, facing away | Step-ups |

---

*Last Updated: 2026-01-31*
