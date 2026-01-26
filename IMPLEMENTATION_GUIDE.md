# Barry's Class Programming Tool - Implementation Guide

## Overview

This document provides a comprehensive overview of the Barry's Class Programming Tool, detailing the architecture, features, and implementation decisions made during development.

**Project Location:** `/Users/michaelbond/barrys-class-tool`
**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS
**Last Updated:** January 2026

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Key Design Decision: Block-Based Generation](#2-key-design-decision-block-based-generation)
3. [Core Features](#3-core-features)
4. [Services Layer](#4-services-layer)
5. [Data Structures](#5-data-structures)
6. [UI Components](#6-ui-components)
7. [Feature Deep Dives](#7-feature-deep-dives)
8. [File Reference](#8-file-reference)

---

## 1. Architecture Overview

### Original PRD vs. Actual Implementation

The original PRD proposed an **exercise-based generation** approach where individual exercises would be selected based on freshness, muscle groups, and energy levels.

**What we actually built** is a **block-based generation** system that uses real pre-built blocks extracted from actual Barry's Total Body classes. This approach:

- Preserves authentic class "feel" and programming patterns
- Ensures exercises flow together naturally within blocks
- Maintains the instructor's creative intent from real classes
- Allows mixing and matching blocks of the same length

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Tab Navigation                          │  │
│  │         Generator | Calculator | Block Library             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  ClassGenerator │  │ TreadCalculator │  │  BlockLibrary   │
│                 │  │                 │  │                 │
│  ConfigPanel    │  │  Paste/Parse    │  │  Browse Blocks  │
│       │         │  │       │         │  │  Search/Filter  │
│       ▼         │  │       ▼         │  │  View Metadata  │
│  blockBased     │  │  treadParser    │  │                 │
│  Generator      │  │       │         │  └─────────────────┘
│       │         │  │       ▼         │
│       ▼         │  │   Results       │
│  ClassPreview   │  └─────────────────┘
│  (editable)     │
│       │         │
│       ▼         │
│  Export (Copy/  │
│  XLSX)          │
└─────────────────┘
```

---

## 2. Key Design Decision: Block-Based Generation

### What is a Block?

A **block** is a multi-minute segment of a class (typically 2-4 minutes) that contains related exercises or tread patterns that flow together naturally.

**Floor Block Example (3 minutes):**
```
Minute 1: Right Bent Over Row
Minute 2: Right Offset Pushup to X Human
Minute 3: Right Squat with 3 Pulses | Right Squat to Press
```

**Tread Block Example (3 minutes):**
```
Minute 1: 5, 6, 7
Minute 2: 6.5, 7.5, 8.5 | 7, 8, 9
Minute 3: 6, 7, 8 | 8, 9, 10
```

### Block Categories

Blocks are organized by:

| Dimension | Options |
|-----------|---------|
| **Type** | Floor, Tread |
| **Category** | Warmups, Workouts |
| **Length** | 2 min, 3 min, 4 min |
| **Equipment** | 2 Heavy Dumbbells, 2 Mediums, Any |

### Block Counts (Current Library)

| Type | Warmups | Workouts |
|------|---------|----------|
| Floor | 54 | 183 |
| Tread | 47 | 159 |

### Why Block-Based?

1. **Authenticity**: Blocks come from real Barry's classes, preserving programming wisdom
2. **Flow**: Exercises within a block are designed to flow together
3. **Patterns**: Right/Left sequences, progressive builds, supersets are maintained
4. **Flexibility**: Can still shuffle to different blocks or edit individual rows

---

## 3. Core Features

### 3.1 Class Generator

**Purpose:** Generate complete class plans by assembling blocks

**Configuration Options:**
- Class Type: Total Body (more types planned)
- Date
- Round 1 Duration (default: 12 min)
- Round 2 Duration (default: 9 min)
- Round 1 Equipment
- Round 2 Equipment
- Max Tread Average (default: 7.75)

**Generation Process:**
1. Plan block lengths to fill duration exactly
2. Select warmup block for Round 1 (first ~3 min)
3. Select workout blocks for remaining time
4. Apply flow analysis for tread blocks
5. Apply equipment filtering for floor blocks
6. Avoid duplicate blocks within class
7. Handle Right/Left block sequencing

### 3.2 Tread Calculator

**Purpose:** Parse and calculate tread averages from pasted tread columns

**Features:**
- Paste entire tread column
- Automatic parsing of speed sets, inclines, recovers, sprints
- Real-time average calculation
- Color-coded feedback (green = good, red = over max)

### 3.3 Block Library

**Purpose:** Browse, search, and manage the block library

**Features:**
- Filter by type (Floor/Tread)
- Filter by category (Warmups/Workouts)
- Filter by length (2/3/4 min)
- Search by content or tags
- Tag-based filtering
- View block metadata (tags, flow profile, equipment)
- Delete custom blocks

---

## 4. Services Layer

### 4.1 Block-Based Generator (`blockBasedGenerator.ts`)

The main generation service that assembles classes from blocks.

**Key Functions:**
```typescript
generateClass(config: GeneratorConfig): ClassPlan
generateRound(duration, roundNumber, usedBlocks, equipment): RoundData
```

**Features:**
- Plans block lengths to exactly fill duration
- Avoids duplicate blocks
- Handles Right/Left block sequencing
- Applies tread flow analysis
- Applies equipment filtering

### 4.2 Tread Parser (`treadParser.ts`)

Parses tread notation into structured data.

**Handles:**
- Speed sets: `6, 7, 8`
- Multiple sets: `6, 7, 8 | 7, 8, 9`
- Inclines: `4% 5, 6, 7`
- Recovers: `RECOVER`
- Sprints: `5, 6, 7 | Sprint (30 Seconds)`

**Calculation:**
- Uses lowest speed from first set for average
- Adds +0.2 per 1% incline to effective speed
- Excludes recovers from average

### 4.3 Tread Flow Service (`treadFlowService.ts`)

Analyzes tread blocks for flow compatibility to ensure blocks "tell a story."

**Block Profile Analysis:**
```typescript
interface TreadBlockProfile {
  baseSpeed: number;        // Lowest speed in first set
  maxSpeed: number;         // Highest speed in block
  speedRange: number;       // Max - min speed
  avgSpeed: number;         // Average of all speeds
  hasIncline: boolean;
  maxIncline: number;       // Highest incline %
  hasRecover: boolean;
  recoverCount: number;
  hasSprint: boolean;
  sprintCount: number;
  hasIntervals: boolean;    // Multiple speed sets (pipes)
  intensity: 'low' | 'medium' | 'high';
  character: TreadCharacter;
}

type TreadCharacter =
  | 'speed_build'       // Gradually increasing speeds
  | 'incline_focus'     // Significant incline work
  | 'interval_heavy'    // Lots of speed changes
  | 'recovery_focused'  // High recovery ratio
  | 'sprint_focused'    // Sprint-heavy
  | 'balanced';         // Mixed/moderate
```

**Flow Scoring (0-100):**

Penalties applied for:
- Large speed jumps (>1.5 difference): -25
- Speed regression (non-recovery): -15
- Sudden incline introduction: -30
- Back-to-back recovery blocks: -25
- Heavy sprints too early: -15
- Jarring character transitions: -20

Bonuses applied for:
- Natural speed progression: +10
- Matching block characters: +5
- Gradual incline progression: +5

### 4.4 Block Tags Service (`blockTagsService.ts`)

Auto-detects metadata tags for blocks based on content analysis.

**Floor Block Tags:**

| Category | Tags |
|----------|------|
| Structure | AMRAP, Tempo, Drop Set, Hold/Pulse, Superset, Ladder, Rep Scheme, Same Side |
| Movement | Compound, Isolation, Power/Explosive, Mobility |
| Body Focus | Upper, Lower, Core, Full Body |
| Intensity | High, Medium, Low |

**Tread Block Tags:**

| Category | Tags |
|----------|------|
| Pattern | Incline, Sprint, Progressive Build, Pyramid, Intervals, Recovery Heavy |
| Intensity | High, Medium, Low |

**Detection Method:** Regex pattern matching against block content

### 4.5 Block Equipment Service (`blockEquipmentService.ts`)

Auto-detects required equipment for floor blocks.

**Equipment Detection Patterns:**

| Equipment | Indicators |
|-----------|------------|
| 2 Heavy Dumbbells | Deadlift, RDL, SDL, Chest Press, Bent Over Row, Clean, Snatch, High Pull, Swing, Thrust |
| 2 Mediums | Bicep Curl, Tricep, Shoulder Press, Squat to Press, Lunges, Lateral Raise, Skull Crusher |
| Any Equipment | Pushups, Planks, Mountain Climbers, Burpees, World's Greatest Stretch, Good Morning |

**Compatibility Rules:**
- "Any" equipment blocks work with all equipment types
- Heavy rounds only use heavy or "any" blocks
- Medium rounds use medium or "any" blocks
- Equipment filtering prevents mismatched exercises

### 4.6 Custom Blocks Service (`customBlocksService.ts`)

Manages user-created custom blocks.

**Features:**
- Add custom blocks from edited content
- Store in localStorage
- Merge with built-in blocks for selection
- Delete custom blocks
- Track custom block counts

**Storage Key:** `barrys_custom_blocks`

---

## 5. Data Structures

### 5.1 Core Types (`types/index.ts`)

```typescript
// Equipment options
type Equipment =
  | '2 Heavy Dumbbells'
  | '2 Mediums'
  | '2 Light Dumbbells'
  | 'Bodyweight';

// Energy levels for floor work
type EnergyLevel = 'L1' | 'L2' | 'L3';

// Tread entry with block tracking
interface TreadEntry {
  minute: string;           // "0-1", "1-2"
  raw: string;              // Original notation
  speeds: SpeedSet[];       // Parsed speed sets
  isRecover: boolean;
  isSprint: boolean;
  inclinePercent: number;
  lowestSpeed: number;
  effectiveSpeed: number;
  textColor: 'black' | 'red' | 'purple';
  blockIndex?: number;      // Which block (1-based)
  blockType?: 'warmup' | 'workout';
  libraryIndex?: number;    // Block # in library
  libraryTotal?: number;    // Total blocks available
  blockLength?: number;     // Block length in minutes
  isCustomBlock?: boolean;  // From custom blocks
}

// Floor entry with block tracking
interface FloorEntry {
  minute: string;
  exercises: string;
  exerciseIds: string[];
  energyLevel: EnergyLevel;
  notes?: string;
  blockIndex?: number;
  blockType?: 'warmup' | 'workout';
  libraryIndex?: number;
  libraryTotal?: number;
  blockLength?: number;
  isCustomBlock?: boolean;
}

// Round structure
interface Round {
  number: 1 | 2;
  duration: number;
  equipment: Equipment;
  forecast?: string;
  tread: TreadEntry[];
  floor: FloorEntry[];
}

// Complete class plan
interface ClassPlan {
  id: string;
  date: string;
  classType: ClassType;
  round1: Round;
  round2: Round;
  treadAverage: number;
  createdAt: string;
  updatedAt: string;
}
```

### 5.2 Block Library Structure (`exerciseBlocks.ts`)

```typescript
type BlockLength = 2 | 3 | 4;
type BlockCategory = 'warmups' | 'workouts';

interface BlockLibrary {
  warmups: { [key: number]: string[][] };
  workouts: { [key: number]: string[][] };
}

// Floor blocks: FLOOR_BLOCKS
// Tread blocks: TREAD_BLOCKS

// Block selection result
interface BlockSelection {
  block: string[];
  index: number;        // 1-based position in library
  total: number;        // Total blocks available
  isCustom: boolean;
  customId?: string;
}

// Floor block with equipment
interface FloorBlockInfo {
  block: string[];
  isCustom: boolean;
  customId?: string;
  equipment: BlockEquipment;
}
```

---

## 6. UI Components

### 6.1 Generator Components

| Component | Purpose |
|-----------|---------|
| `ClassGenerator.tsx` | Main container, orchestrates generation |
| `ConfigPanel.tsx` | Configuration form (type, durations, equipment) |
| `ClassPreview.tsx` | Displays generated class with edit/export options |
| `RoundDisplay.tsx` | Single round in spreadsheet format with shuffle/save |
| `TreadRow.tsx` | Editable tread entry row |
| `FloorRow.tsx` | Editable floor entry row |
| `TreadAverageIndicator.tsx` | Visual average display with color feedback |

### 6.2 Library Components

| Component | Purpose |
|-----------|---------|
| `BlockLibrary.tsx` | Main library container with search, filters, block display |

### 6.3 Calculator Components

| Component | Purpose |
|-----------|---------|
| `TreadCalculator.tsx` | Main calculator with paste area and results |

### 6.4 UI Primitives

| Component | Purpose |
|-----------|---------|
| `Button.tsx` | Styled button with variants |
| `Input.tsx` | Styled text input |
| `Select.tsx` | Styled dropdown |

---

## 7. Feature Deep Dives

### 7.1 Block Shuffle

**Location:** `RoundDisplay.tsx`

Users can shuffle to a different block of the same type/length:
- Click the block label (e.g., "F42") or shuffle button (↻)
- Cycles through available blocks
- Maintains equipment compatibility
- Shows block number and total (e.g., "Block 42 of 118")

### 7.2 Save as Custom Block

**Location:** `RoundDisplay.tsx`

After editing a block's content:
- "Save" button appears
- Saves edited content as new custom block
- Custom blocks appear in library with purple border
- Custom blocks get "*" indicator in generator

### 7.3 Right/Left Block Handling

**Location:** `blockBasedGenerator.ts`

Some blocks start with "Right" exercises:
- Generator detects "Right" blocks
- Automatically creates "Left" version for next block
- Prevents "Right" blocks at end of round (no room for Left)
- Prevents starting with "Same" (assumes previous Right/Left)

### 7.4 Tread Flow-Aware Selection

**Location:** `blockBasedGenerator.ts`, `treadFlowService.ts`

After first tread block, subsequent blocks are scored for flow:
1. Analyze previous block's profile
2. Score all candidate blocks for compatibility
3. Filter to score >= 60
4. Pick randomly from top 3 candidates
5. Falls back to any valid block if none score well

### 7.5 Equipment-Aware Floor Selection

**Location:** `blockBasedGenerator.ts`, `blockEquipmentService.ts`

Floor blocks are filtered by round equipment:
1. Detect each block's required equipment
2. Filter to blocks compatible with round's equipment
3. "Any" equipment blocks always included
4. Prevents heavy exercises in medium rounds

### 7.6 Block Metadata Display

**Location:** `BlockLibrary.tsx`

Each block displays:
- **Tags:** Auto-detected structure, movement, body focus, intensity
- **Equipment:** Required equipment (floor blocks)
- **Flow Profile:** Base speed, incline %, sprints, recovers, character (tread blocks)

---

## 8. File Reference

### Services

| File | Purpose |
|------|---------|
| `src/services/blockBasedGenerator.ts` | Main class generation from blocks |
| `src/services/treadParser.ts` | Parse tread notation, calculate averages |
| `src/services/treadFlowService.ts` | Tread block flow analysis and scoring |
| `src/services/blockTagsService.ts` | Auto-detect block metadata tags |
| `src/services/blockEquipmentService.ts` | Auto-detect floor block equipment |
| `src/services/customBlocksService.ts` | CRUD for custom blocks |
| `src/services/exportService.ts` | Clipboard and XLSX export |

### Data

| File | Purpose |
|------|---------|
| `src/data/exerciseBlocks.ts` | Floor and tread block libraries + selection functions |

### Components

| File | Purpose |
|------|---------|
| `src/components/generator/ClassGenerator.tsx` | Main generator container |
| `src/components/generator/ConfigPanel.tsx` | Configuration form |
| `src/components/generator/ClassPreview.tsx` | Generated class display |
| `src/components/generator/RoundDisplay.tsx` | Round display with shuffle/save |
| `src/components/generator/TreadRow.tsx` | Editable tread row |
| `src/components/generator/FloorRow.tsx` | Editable floor row |
| `src/components/calculator/TreadCalculator.tsx` | Tread calculator |
| `src/components/library/BlockLibrary.tsx` | Block library browser |

### Types

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript type definitions |

### Utilities

| File | Purpose |
|------|---------|
| `src/utils/dateUtils.ts` | Date formatting, ID generation |
| `src/utils/formatUtils.ts` | Minute range formatting |

---

## Appendix A: localStorage Keys

| Key | Purpose |
|-----|---------|
| `barrys_custom_blocks` | User's custom blocks |
| `barrys_block_manual_tags` | Manually added tags (future) |
| `barrys_exercises` | Exercise library (from original PRD, unused) |
| `barrys_class_history` | Past classes (from original PRD, unused) |

---

## Appendix B: Future Considerations

### Potential Enhancements

1. **Manual Equipment Override**: Allow manual equipment tagging for blocks
2. **Block Favorites**: Star/favorite blocks for quick access
3. **Class History**: Track generated classes for freshness
4. **Additional Class Types**: Chest/Back/Abs, Arms/Abs, Legs/Core
5. **Block Notes**: Add instructor notes to blocks
6. **Drag-and-Drop Reorder**: Reorder blocks within a round
7. **Print-Friendly View**: Optimized layout for printing
8. **Mobile Responsive**: Better mobile experience

### Known Limitations

1. Equipment detection is pattern-based and may need refinement
2. Flow scoring thresholds may need adjustment based on usage
3. Only Total Body class type has real block data currently
4. Some blocks may need manual equipment/tag overrides
