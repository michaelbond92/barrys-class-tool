# Barry's Class Programming Tool - Product Requirements Document

> **Purpose**: Product requirements, user stories, and acceptance criteria.
>
> **Related Docs:**
> - `TECHNICAL_SPEC.md` — Data models, taxonomies, detection patterns, algorithms
> - `PROJECT_HANDOFF.md` — Priorities and implementation roadmap
> - `IMPLEMENTATION_GUIDE.md` — Current implementation details

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [The Problem](#the-problem)
3. [Architecture Summary](#architecture-summary)
4. [User Stories](#user-stories)
5. [Current Implementation](#current-implementation)
6. [Future Enhancements](#future-enhancements)

---

## Project Overview

A React web application for Barry's Bootcamp instructors to efficiently program classes. Uses a **block-based generation** approach with real blocks extracted from actual Barry's Total Body classes.

**Key Insight:** Instead of generating classes exercise-by-exercise, we use pre-built "blocks" (2-4 minute segments) that preserve the authentic flow and programming patterns from real classes.

---

## The Problem

### Who
- Barry's Bootcamp instructor
- Teaches multiple days/week (e.g., Wed = Chest/Back/Abs, Fri = Total Body)
- Perfectionist who wants every class to feel fresh

### The Real Problem
> "The biggest issue is actually coming up with new programs"

It's **creative fatigue**, not mechanics. The instructor has a style — certain flows, pairings, and vibes they return to. They want to:
1. Describe what they want in natural language
2. Find matching rounds from their history
3. Get suggestions that feel fresh (not recently used)
4. Optionally remix to create something "new but in my style"

### Target Interaction
```
User: "Generate me a 10 minute round that is push, pull with abs 
       mixed in for grip strength and ends with burpees"

System: Returns 3-5 matching rounds/block combinations, ranked by:
        - Match to constraints (push/pull, abs, burpee finisher)
        - Freshness (not used recently)
        - Vibe diversity (options that feel different from each other)
```

---

## Architecture Summary

### Block-Based Generation (Implemented)

The core innovation is treating class programming as **block assembly** rather than exercise selection:

```
Class = Warmup Block(s) + Workout Block(s)
```

Each block is a coherent multi-minute segment:
- Floor blocks: Related exercises that flow together
- Tread blocks: Speed progressions that tell a story

### Three-Level Data Hierarchy (Planned)

See `TECHNICAL_SPEC.md` for full details.

| Level | Unit | Duration | What It Captures |
|-------|------|----------|------------------|
| **Round** | Class section | 8-14 min | Overall vibe, finisher, tread profile |
| **Block** | Mini-arc | 2-4 min | Flow pattern, structure, body focus |
| **Exercise** | Single minute | 1 min | Specific movement, modifiers, position |

### Current Block Library

| Type | Warmups | Workouts | Total |
|------|---------|----------|-------|
| Floor | 54 | 183 | 237 |
| Tread | 47 | 159 | 207 |

---

## User Stories

### Search & Browse

#### 1. Browse Class History
**As a user, I want to browse my class history to see what I've programmed.**

**Acceptance Criteria:**
- Can view a list of all past classes sorted by date (newest first)
- Each class shows: date, class type, round durations, equipment, tread average
- Can click into a class to see full round/block/exercise details
- Can filter by date range
- Can filter by class type (Total Body, Chest/Back/Abs, etc.)
- Can search by keyword (exercise name, equipment)

---

#### 2. Search Blocks by Attributes
**As a user, I want to search for blocks by attributes (body focus, structure, equipment, length).**

**Acceptance Criteria:**
- Can filter by block type (floor/tread)
- Can filter by category (warmup/workout)
- Can filter by length (2/3/4 min)
- Can filter by body focus (upper, lower, core, full body)
- Can filter by structure (AMRAP, tempo, superset, hold/pulse, ladder)
- Can filter by movement pattern (push, pull, hinge, squat)
- Can filter by equipment (heavy, medium, light, bodyweight)
- Can filter by intensity (high, medium, low)
- Can combine multiple filters (AND logic)
- Results show block content with highlighted matching attributes
- Can sort results by freshness (least recently used first)

---

#### 3. Search Rounds by Attributes
**As a user, I want to search for rounds by attributes (duration, finisher, movement patterns, tread profile).**

**Acceptance Criteria:**
- Can filter by duration (8-14 min, or range)
- Can filter by finisher type (snatches, burpees, DB swings, AMRAP, etc.)
- Can filter by movement patterns (push-focused, pull-focused, push+pull, etc.)
- Can filter by equipment
- Can filter by tread profile (incline-heavy, sprint-focused, progressive build)
- Can filter by grip load (high/medium/low)
- Can filter by "has grip breaks" (core interspersed)
- Can filter by "has Right/Left sequence"
- Results show round summary with matching attributes highlighted
- Can expand to see full block/exercise breakdown

---

#### 4. Search Exercises by Attributes
**As a user, I want to search for exercises by attributes (modifiers, muscle group, grip demand).**

**Acceptance Criteria:**
- Can search by exercise name (partial match)
- Can filter by muscle group (chest, back, shoulders, biceps, triceps, legs, core)
- Can filter by movement pattern (push, pull, hinge, squat, lunge, rotation, plank, power)
- Can filter by modifier (tempo, alternating, burnout, hold, pulse, heavy, wide, narrow, single arm)
- Can filter by grip demand (high, medium, low, none)
- Can filter by "is finisher move" (burpees, snatches, etc.)
- Can filter by "has rep scheme" (shows exercises with specific rep patterns)
- Results show the exercise in context (which blocks/rounds contain it)

---

### Build & Generate

#### 5. Build Class from Menu
**As a user, I want to build a class by picking rounds/blocks from a menu.**

**Acceptance Criteria:**
- Can start with empty class template (Round 1 + Round 2)
- Can set duration for each round
- Can set equipment for each round
- Can browse available blocks filtered by length/equipment/category
- Can drag-and-drop or click-to-add blocks to each round
- Blocks snap to fill duration (warns if over/under)
- Can see tread average update in real-time as blocks are added
- Can see floor alongside tread for each block
- Can reorder blocks within a round
- Can remove blocks
- System warns if Right block added without room for Left follow-up
- System warns if grip load is high without breaks

---

#### 6. Generate Round with Natural Language
**As a user, I want to generate a round using natural language (e.g., "10 min push focused with abs woven in, snatch finisher").**

**Acceptance Criteria:**
- Can enter free-text query describing desired round
- System parses and extracts:
  - Duration (required, or defaults to "any")
  - Movement focus (push, pull, hinge, etc.)
  - Interspersed muscle group ("abs woven in" → core for grip breaks)
  - Finisher type
  - Equipment preference
  - Intensity preference
  - Freshness preference ("something I haven't done recently")
- System shows parsed interpretation for confirmation ("I understood: 10 min, push-focused, with core breaks, snatch finisher")
- System returns 3-5 matching round options
- Options are ranked by: constraint match → freshness → diversity
- Each option shows: match score, last used date, key attributes
- Can click to preview full round details
- Can select an option to add to class

---

#### 7. Generate Class with Natural Language
**As a user, I want to generate a complete class using natural language.**

**Acceptance Criteria:**
- Can describe both rounds in one query ("R1: 12 min upper body heavy, R2: 9 min lower body with AMRAP finisher")
- Can specify class-level constraints (max tread average, equipment for each round)
- System generates complete class matching constraints
- Can regenerate individual rounds while keeping others
- Shows tread average for combined class

---

### Edit & Create

#### 8. Edit a Class
**As a user, I want to edit a generated class (swap blocks, reorder, change exercises, adjust tread).**

**Acceptance Criteria:**
- Can swap any block for another of same length/category
- Can shuffle to random alternative block (existing feature)
- Can edit individual exercise text inline
- Can edit individual tread entry inline
- Can reorder blocks within a round (drag-and-drop)
- Can change round duration (adds/removes block slots)
- Can change round equipment (re-filters available blocks)
- Tread average recalculates on any change
- System warns if changes break constraints (grip load, Right/Left balance)
- Can undo last N changes

---

#### 9. Add New Content to Library
**As a user, I want to add new blocks, rounds, or exercises to my library.**

**Acceptance Criteria:**
- Can create new floor block (specify length, enter exercise per minute)
- Can create new tread block (specify length, enter tread notation per minute)
- System auto-detects tags for new blocks (body focus, structure, equipment, etc.)
- Can manually add/override tags
- For new exercises: dropdown selector for position tagging
- Can save a generated/edited round as a "template" for reuse
- Can save edited class as template
- New content marked as "custom" in library
- Custom content persists across sessions (localStorage)

---

#### 10. Edit Existing Content
**As a user, I want to edit existing blocks, rounds, or exercises in my library.**

**Acceptance Criteria:**
- Can edit custom blocks (not built-in library)
- Can edit exercise text within a block
- Can edit tags/metadata on any block
- Can add notes to blocks ("Great for morning classes")
- System re-detects tags after content edit
- Can delete custom blocks
- Cannot delete built-in blocks (but can hide them)

---

### Freshness & Discovery

#### 11. View Usage/Freshness
**As a user, I want to see when blocks/rounds/exercises were last used.**

**Acceptance Criteria:**
- Every block shows "Last used: [date]" or "Never used"
- Every block shows "Used X times"
- Freshness displayed in Block Library browser
- Freshness displayed when browsing for block swap
- Freshness displayed in search results
- Color coding: green (>4 weeks), yellow (2-4 weeks), red (<2 weeks), gray (never)
- Can sort any list by freshness

---

#### 12. Exclude Recently Used
**As a user, I want to exclude recently-used content from generation.**

**Acceptance Criteria:**
- Global setting: "Exclude content used in last N weeks" (default: 2)
- Can override per-generation
- Excluded blocks still visible but grayed out / deprioritized
- Clear indicator of why a block was excluded
- Can force-include an excluded block if desired

---

#### 13. Find Similar Content
**As a user, I want to find rounds/blocks similar to one I liked.**

**Acceptance Criteria:**
- "More like this" button on any round/block
- System finds similar content based on:
  - Same body focus
  - Similar structure
  - Similar exercise sequence (embedding similarity if implemented)
- Results ranked by similarity score
- Shows what makes each result similar ("Same finisher, similar push/pull balance")
- Excludes the original from results

---

#### 14. Find Different Content
**As a user, I want suggestions that are maximally different from my recent classes.**

**Acceptance Criteria:**
- "Surprise me" or "Something different" button/mode
- System analyzes last N classes (default: 4 weeks)
- Identifies overused patterns (finishers, structures, exercises)
- Returns blocks/rounds that are LEAST similar to recent usage
- Shows why each suggestion is "different" ("You haven't used incline tread in 3 weeks")

---

#### 15. Overuse Warnings
**As a user, I want to be warned when I'm overusing certain patterns.**

**Acceptance Criteria:**
- System tracks frequency of: finisher types, specific exercises, block structures
- Warns when selecting something used >3 times in 4 weeks
- Dashboard/report showing overused patterns
- Suggestions for alternatives to overused content

---

### Validation & Constraints

#### 16. Tread Average Validation
**As a user, I want to ensure my tread average stays within target.**

**Acceptance Criteria:**
- Target max tread average configurable (default: 7.75)
- Real-time average display during class building
- Color coding: green (under target), yellow (close), red (over)
- Warning when adding block that would push average over target
- Suggestions for lower-average alternatives if over target

---

#### 17. Grip Load Tracking
**As a user, I want to see grip load and get warnings about grip fatigue.**

**Acceptance Criteria:**
- Each block shows grip load score (0-10)
- Round shows total grip load
- Warning when grip load is high without breaks (no core/plank minutes)
- Suggestion to add core block for grip relief
- Can filter for "grip break" blocks (core-focused, low grip demand)

---

#### 18. Equipment Compatibility
**As a user, I want blocks filtered to match my round's equipment.**

**Acceptance Criteria:**
- When equipment selected for round, only compatible blocks shown
- Clear indicator when a block requires different equipment
- Can see what equipment a block requires
- Warning if switching equipment mid-round (not typical)

---

#### 19. Right/Left Balance
**As a user, I want Right-side blocks automatically followed by Left-side.**

**Acceptance Criteria:**
- System detects Right-focused blocks
- Automatically creates/suggests Left version as next block
- Warning if Right block placed at end (no room for Left)
- Can manually override if intentional
- Shows R/L indicator on blocks

---

#### 20. Position Flow Validation
**As a user, I want blocks validated for smooth position transitions.**

**Acceptance Criteria:**
- Each exercise tagged with position (bench_laying, floor_standing, etc.)
- Blocks show position flow visually (icons or color coding)
- Blocks show "flow score" (0-100)
- Warning when block has excessive transition cost
- Warning about bench_standing (stepping onto bench)
- Can filter blocks by "smooth flow" (flow score > 70)
- When building class, system warns about awkward transitions between blocks

---

### Export & Import

#### 21. Export Class
**As a user, I want to export a class to clipboard or Excel in my spreadsheet format.**

**Acceptance Criteria:**
- Can copy to clipboard in formatted text (existing feature)
- Can export to .xlsx matching current spreadsheet format
- Export includes: minute, tread, floor, notes columns
- Export includes round headers with equipment
- Export includes tread average
- Color coding preserved in Excel (L1/L2/L3, incline, sprint)

---

#### 22. Import from Spreadsheet
**As a user, I want to import classes from my existing spreadsheets to build my history.**

**Acceptance Criteria:**
- Can upload .xlsx file
- System parses sheets (each sheet = one class)
- Extracts date, round structure, equipment from sheet
- Parses tread notation and floor exercises
- Builds Round → Block → Exercise hierarchy
- Auto-detects metadata (tags, modifiers, finishers)
- Shows preview before confirming import
- Handles parsing errors gracefully (shows what couldn't be parsed)
- Adds imported classes to history and indexes content

---

### Analytics & Insights

#### 23. Usage Analytics
**As a user, I want insights into my programming patterns.**

**Acceptance Criteria:**
- Dashboard showing:
  - Most used exercises (top 10)
  - Most used blocks
  - Most used finishers
  - Muscle group distribution over time
  - Movement pattern distribution
  - Equipment usage frequency
- Time range filter (last month, 3 months, all time)
- Highlights imbalances ("80% of your finishers are snatches")
- Suggestions for variety

---

#### 24. Class Comparison
**As a user, I want to compare two classes side-by-side.**

**Acceptance Criteria:**
- Can select two classes from history
- Side-by-side view showing both classes
- Highlights differences (different blocks, exercises)
- Shows similarity score
- Useful for avoiding repetition with recent classes

---

### Personalization

#### 25. Favorite Blocks
**As a user, I want to star/favorite blocks for quick access.**

**Acceptance Criteria:**
- Can star any block
- Favorites section in Block Library
- Can filter to show only favorites
- Favorites persist across sessions
- Can unfavorite

---

#### 26. Block Notes
**As a user, I want to add notes to blocks.**

**Acceptance Criteria:**
- Can add free-text note to any block
- Notes displayed in block detail view
- Can search notes
- Notes like "Great energy builder" or "Only for advanced classes"

---

#### 27. Hide Blocks
**As a user, I want to hide blocks I never want to use.**

**Acceptance Criteria:**
- Can hide any block (built-in or custom)
- Hidden blocks excluded from generation and search by default
- Can view hidden blocks in separate section
- Can unhide

---

### Settings & Configuration

#### 28. Default Preferences
**As a user, I want to set default preferences for generation.**

**Acceptance Criteria:**
- Default class structure (R1 duration, R2 duration)
- Default equipment per round
- Default max tread average
- Default freshness exclusion window
- Default class type
- Preferences persist across sessions

---

#### 29. Multiple Class Types
**As a user, I want to program different class types (Total Body, Chest/Back/Abs, Arms/Abs, Legs/Core).**

**Acceptance Criteria:**
- Can select class type
- Block library filters to appropriate content per class type
- Muscle group constraints enforced (e.g., Chest/Back/Abs excludes legs)
- Can add blocks for non-Total Body class types

---

### Version Control

#### 30. Version History
**As a user, I want to track changes to blocks and rounds over time.**

**Acceptance Criteria:**
- Every edit to a block creates a new version
- Can view version history for any block/round
- Each version shows: timestamp, what changed, previous content
- Can revert to a previous version
- Can compare two versions side-by-side
- Version history persists across sessions
- Can add a note when saving a version ("Tweaked for advanced class")
- Original built-in blocks are "v1" and immutable; edits create custom versions

---

## Current Implementation

### Implemented Features

| Feature | Status |
|---------|--------|
| Block library | ✅ Done |
| Tag auto-detection | ✅ Done |
| Equipment filtering | ✅ Done |
| Tread flow scoring | ✅ Done |
| Block shuffle UI | ✅ Done |
| Custom block saving | ✅ Done |
| Export (clipboard/XLSX) | ✅ Done |
| Block library browser | ✅ Done |
| Tread average calculation | ✅ Done |

### Not Yet Implemented

| Feature | Status |
|---------|--------|
| Three-level hierarchy | ❌ Missing |
| Natural language query | ❌ Missing |
| Freshness tracking | ❌ Missing |
| Position flow validation | ❌ Missing |
| Import from spreadsheet | ❌ Missing |
| Usage analytics | ❌ Missing |
| Version history | ❌ Missing |
| Embeddings | ❌ Missing |

---

## Future Enhancements

See `PROJECT_HANDOFF.md` for prioritized implementation roadmap.

---

*Document Version: 2.0*
*Last Updated: January 2025*
*Major Update: Added 30 user stories with acceptance criteria*
