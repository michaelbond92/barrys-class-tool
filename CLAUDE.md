# Barry's Class Programming Tool - Claude Memory

> **Purpose**: Context and memory for AI sessions working on this project.
>
> **Related Docs:**
> - `TECHNICAL_SPEC.md` — Data models, taxonomies, detection patterns
> - `PRD.md` — Product requirements
> - `src/data/generationRules.ts` — Generation rules (user-confirmed)

---

## Project Overview

A tool for generating Barry's Bootcamp-style fitness classes. Users import real class spreadsheets, which are indexed and analyzed. The system then generates new classes that match Barry's style using block-based generation with flow scoring.

### Key Concepts

- **Barry's Classes**: 40-42 min total, but taught as 2 rounds (R1 + R2 = 20-21 min) where groups swap between tread and floor
- **Blocks**: 2-4 minute mini-arcs of exercises that flow together
- **Flow Score**: Measures how smoothly exercises transition (position changes, grip load)
- **Vibe**: The energy/intensity feel of a round (matches tread profile)

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

### Key Files
| File | Purpose |
|------|---------|
| `src/data/generationRules.ts` | 24 confirmed generation rules with helpers |
| `src/data/exerciseReference.ts` | 40+ curated exercise definitions with proper tags |
| `src/data/types.ts` | Shared TypeScript types for positions, patterns, muscles |
| `src/data/exerciseBlocks.ts` | Block definitions (being replaced by imports) |
| `src/services/ruleExtractionService.ts` | Analyzes imported data for patterns |
| `src/components/game/VibeCheckGame.tsx` | RLHF feedback collection for class generation |
| `src/components/game/TagValidationGame.tsx` | Manual validation of exercise tagging |

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

## Known Tagging Issues

The current exercise tagging in `barrys_exercise_index` has errors:

| Exercise | Current Tag | Problem |
|----------|-------------|---------|
| WGS | position: floor_laying, muscle: chest | Should be floor_standing/laying hybrid, targets hips/shoulders |
| Good Morning | movementPattern: squat | Should be hinge pattern |

**Action Required**: Manual validation through Tag Validation Game

---

## Exercise Categories

### Warmup Exercises
- WGS (World's Greatest Stretch)
- GMS (Good Morning Stretch)
- Good Morning to Squat
- Cat Cow
- Hip Opener
- Inchworm

### Power/Finisher Exercises
- Snatches (67% of finishers)
- DB Swings (10% of finishers)
- Clean to Press
- Thrusters
- Burpees
- Squat to Hi Pull

### Core Exercises
- Plank
- Russian Twist
- Crunch
- Sit Up
- Dead Bug
- Hollow
- Mountain Climbers

### Compound Movements
- Squat to Press
- Deadlift to Row
- Lunge to Curl
- Clean and Press
- Squat to Hi Pull

---

## Current Work

### Completed
- [x] Import 49 classes from XLSX
- [x] Index exercises with automatic tagging
- [x] Build generation rules from user feedback (24 rules)
- [x] Data-backed timing analysis
- [x] Vibe Check Game for RLHF feedback
- [x] Exercise Reference file with 40+ curated exercises
- [x] Tag Validation Game for manual review
- [x] CLAUDE.md memory file for session continuity

### In Progress
- [ ] Validate remaining exercises via Tag Check game
- [ ] Fix tagging errors in indexed data based on feedback

### Planned
- [ ] Embeddings integration
- [ ] Remove hardcoded blocks
- [ ] NL generation feature
- [ ] Library redesign

---

## Session Notes

### 2025-01-25: Exercise Timing Analysis
Analyzed 984 exercises from 49 classes:
- Warmup: 98% in first 25% (avg 12%)
- Power: 80% in last 25% (avg 90%)
- Burpees behave differently by round
- Core in middle (avg 59%)
- Split timing (`|`) evenly distributed

Added 6 timing rules to `generationRules.ts` with data backing.

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

---

*Last Updated: 2025-01-25*
