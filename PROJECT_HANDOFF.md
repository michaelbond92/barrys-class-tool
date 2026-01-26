# Barry's Class Programming Tool - Project Handoff & Roadmap

> **Purpose**: Implementation priorities and roadmap for continuing development.
>
> **Related Docs:**
> - `PRD.md` — Product requirements and user stories (30 stories with acceptance criteria)
> - `TECHNICAL_SPEC.md` — Data models, taxonomies, detection patterns, algorithms
> - `IMPLEMENTATION_GUIDE.md` — Current implementation details

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [What's Already Built](#whats-already-built)
3. [What's Missing](#whats-missing)
4. [Implementation Phases](#implementation-phases)
5. [Phase Details](#phase-details)
6. [Technical References](#technical-references)

---

## Executive Summary

### The Core Problem
> "The biggest issue is actually coming up with new programs"

It's **creative fatigue**, not mechanics. The instructor wants to:
1. Describe what they want in natural language
2. Find matching rounds from their history
3. Get suggestions that feel fresh (not recently used)

### Target Interaction
```
User: "Generate me a 10 minute round that is push, pull with abs 
       mixed in for grip strength and ends with burpees"

System: Returns 3-5 matching round options, ranked by freshness and fit
```

### What's Needed
1. **Three-level data model** (Round → Block → Exercise)
2. **Rich metadata** (positions, equipment, grip load, flow scores)
3. **Freshness tracking** at all levels
4. **Natural language query** parsing
5. **Position flow validation** (smooth transitions)

---

## What's Already Built

| Feature | Status | Notes |
|---------|--------|-------|
| Block library | ✅ Done | 237 floor blocks, 207 tread blocks |
| Tag auto-detection | ✅ Done | Structure, movement, body focus, intensity |
| Equipment filtering | ✅ Done | Auto-detects required equipment |
| Tread flow scoring | ✅ Done | Ensures coherent speed progressions |
| Block shuffle UI | ✅ Done | Cycle through alternatives |
| Custom block saving | ✅ Done | Save edited blocks to localStorage |
| Export | ✅ Done | Clipboard and XLSX |
| Block library browser | ✅ Done | Search, filter by tags |

---

## What's Missing

| Feature | Priority | User Stories |
|---------|----------|--------------|
| Three-level data model | **Critical** | Foundation for everything |
| Position taxonomy & flow scoring | **High** | #20 (Position Flow Validation) |
| Freshness tracking | **High** | #11, #12, #15 |
| Import from spreadsheet | **High** | #22 (builds history) |
| Natural language query | **High** | #6, #7 (hero use case) |
| Usage analytics | Medium | #23 |
| Version history | Medium | #30 |
| Embeddings for "vibe" matching | Low | #13, #14 |

---

## Implementation Phases

```
Phase 1: Foundation (Data Model)
    ↓
Phase 2: Position & Flow (Validation)
    ↓
Phase 3: Import & Index (Build History)
    ↓
Phase 4: Freshness (Track Usage)
    ↓
Phase 5: Natural Language Query (Hero Feature)
    ↓
Phase 6: Analytics & Polish
    ↓
Phase 7: Embeddings (Future)
```

### Phase Overview

| Phase | Focus | Key Deliverables | User Stories |
|-------|-------|------------------|--------------|
| 1 | Data Model | Three-level hierarchy, TypeScript interfaces | Foundation |
| 2 | Position & Flow | Position detection, transition costs, flow scores | #20 |
| 3 | Import & Index | Spreadsheet import, build searchable index | #22 |
| 4 | Freshness | Usage tracking, freshness indicators, exclusion | #11, #12, #15 |
| 5 | NL Query | Query parser, search UI, results ranking | #6, #7 |
| 6 | Analytics | Dashboard, overuse warnings, comparison | #23, #24 |
| 7 | Embeddings | Vibe matching, "More like this", "Surprise me" | #13, #14 |

---

## Phase Details

### Phase 1: Foundation (Data Model)

**Goal:** Implement the three-level data hierarchy.

**Deliverables:**
- TypeScript interfaces for Round, Block, Exercise metadata
- Indexing service that builds metadata from existing blocks
- localStorage schema for indexed data

**Files to create:**
```
src/types/hierarchyTypes.ts      — All three-level interfaces
src/services/indexingService.ts  — Build metadata from blocks
src/services/exerciseParser.ts   — Parse exercise-level metadata
```

**Key interfaces:** See `TECHNICAL_SPEC.md` for full definitions.

**Definition of Done:**
- [ ] All TypeScript interfaces defined
- [ ] Existing blocks can be indexed into new structure
- [ ] Index persists to localStorage
- [ ] Unit tests for parsing

---

### Phase 2: Position & Flow

**Goal:** Detect exercise positions and calculate flow scores.

**Deliverables:**
- Position detection from exercise text
- Transition cost matrix
- Flow score calculation
- UI indicators for flow quality

**Files to create:**
```
src/services/positionService.ts     — Position detection
src/services/flowScoringService.ts  — Transition costs, flow scores
```

**Files to modify:**
```
src/components/library/BlockLibrary.tsx  — Show flow score
src/components/generator/RoundDisplay.tsx — Show position flow
```

**Key logic:** See `TECHNICAL_SPEC.md` Section 7 (Flow Scoring Algorithm).

**Position Taxonomy:**
| Position | Description | Frequency |
|----------|-------------|-----------|
| floor_standing | Most exercises | 61.5% |
| floor_laying | Planks, pushups, WGS | 20.4% |
| bench_laying | Chest press, crunches | 14.3% |
| bench_sitting | Russian twists, situps | 2.7% |
| bench_back | Spider crunches | 0.5% |
| bench_straddling | Bent over rows | 0.5% |
| bench_front | Box squats | 0.2% |
| bench_standing | Elevated lunges | Rare |

**Definition of Done:**
- [ ] Position detection for all exercises
- [ ] Manual override capability for positions
- [ ] Dropdown selector for new exercises
- [ ] Flow score displayed on blocks
- [ ] Warnings for high-cost transitions
- [ ] Filter by flow score in library

---

### Phase 3: Import & Index

**Goal:** Import existing spreadsheets to build class history.

**Deliverables:**
- Spreadsheet parser (xlsx)
- Preview UI before import
- Index all imported content
- Error handling for unparseable content

**Files to create:**
```
src/services/spreadsheetImporter.ts  — Parse xlsx files
src/components/import/ImportWizard.tsx — Upload and preview UI
```

**Parsing requirements:**
- Each sheet = one class
- Extract date from sheet name (e.g., "1.17.25 (119)")
- Parse round structure from "Round 1" / "Round 2" markers
- Extract equipment from "Equipment:" rows
- Parse tread notation (existing treadParser.ts)
- Parse floor exercises

**Definition of Done:**
- [ ] Can upload xlsx file
- [ ] Preview shows parsed classes
- [ ] Can confirm/reject import
- [ ] Imported classes appear in history
- [ ] All content indexed and searchable

---

### Phase 4: Freshness Tracking

**Goal:** Track when blocks/rounds/exercises were last used.

**Deliverables:**
- Usage tracking at all three levels
- Freshness indicators in UI
- "Exclude recently used" toggle
- Overuse warnings

**Files to create:**
```
src/services/usageTrackingService.ts — Track usage
```

**Files to modify:**
```
src/services/exportService.ts           — Trigger tracking on export
src/components/library/BlockLibrary.tsx — Show freshness
src/components/generator/ConfigPanel.tsx — Freshness toggle
```

**localStorage keys:**
```
barrys_usage_history — {
  blocks: { [blockId]: { lastUsed: Date, useCount: number, useDates: Date[] } },
  exercises: { [exerciseId]: { lastUsed: Date, useCount: number } },
  finishers: { [type]: { lastUsed: Date, useCount: number } },
}
```

**Freshness color coding:**
- 🟢 Green: >4 weeks ago (or never)
- 🟡 Yellow: 2-4 weeks ago
- 🔴 Red: <2 weeks ago

**Definition of Done:**
- [ ] Usage tracked on export
- [ ] Freshness displayed on all blocks
- [ ] Can sort by freshness
- [ ] "Exclude recently used" toggle works
- [ ] Overuse warnings appear (>3x in 4 weeks)

---

### Phase 5: Natural Language Query

**Goal:** Parse "10 min push/pull with abs, ends with burpees" into filters.

**Deliverables:**
- Query parser service
- Search UI in generator
- Results ranking (match → freshness → diversity)
- Parsed interpretation display

**Files to create:**
```
src/services/queryParserService.ts     — Parse natural language
src/components/generator/QueryInput.tsx — Search bar UI
src/components/generator/QueryResults.tsx — Results display
```

**Query parsing logic:**

| Input | Extracted Filter |
|-------|------------------|
| "10 min" | duration = 10 |
| "push" | movementPatterns includes 'push' |
| "pull" | movementPatterns includes 'pull' |
| "abs" / "core" | bodyFocus includes 'core' |
| "grip breaks" | hasGripBreaks = true |
| "ends with burpees" | finisherType = 'burpees' |
| "snatch finisher" | finisherType = 'snatches' |
| "heavy" | equipment.primary.type = 'heavy' |
| "something fresh" | exclude recently used |
| "incline" | treadPattern = 'incline_heavy' |

**Definition of Done:**
- [ ] Query input in generator UI
- [ ] Shows parsed interpretation
- [ ] Returns 3-5 matching results
- [ ] Results ranked appropriately
- [ ] Can select result to add to class

---

### Phase 6: Analytics & Polish

**Goal:** Usage insights and quality-of-life features.

**Deliverables:**
- Analytics dashboard
- Class comparison view
- Favorites, notes, hide functionality
- Version history

**User Stories:** #23 (Analytics), #24 (Comparison), #25-27 (Personalization), #30 (Versioning)

**Definition of Done:**
- [ ] Dashboard shows usage patterns
- [ ] Can compare two classes
- [ ] Can favorite blocks
- [ ] Can add notes to blocks
- [ ] Can hide blocks
- [ ] Version history tracks edits

---

### Phase 7: Embeddings (Future)

**Goal:** Enable "vibe" matching beyond metadata.

**Deliverables:**
- Generate embeddings for exercise sequences
- "More like this" button
- "Surprise me" (find different) feature

**Model options:**
| Model | Runs | Quality | Cost |
|-------|------|---------|------|
| Transformers.js + MiniLM | Browser | Good | Free |
| OpenAI text-embedding-3-small | API | Great | ~$0.00002/query |

**Recommendation:** Start without embeddings. The metadata-based filtering in Phases 1-5 may be sufficient. Add embeddings only if "vibe matching" proves necessary.

**Definition of Done:**
- [ ] Embeddings generated for all rounds
- [ ] "More like this" returns similar rounds
- [ ] "Surprise me" returns different rounds
- [ ] Embeddings cached in localStorage

---

## Technical References

### Key Files to Modify/Create by Phase

| Phase | Create | Modify |
|-------|--------|--------|
| 1 | `hierarchyTypes.ts`, `indexingService.ts`, `exerciseParser.ts` | `types/index.ts` |
| 2 | `positionService.ts`, `flowScoringService.ts` | `BlockLibrary.tsx`, `RoundDisplay.tsx` |
| 3 | `spreadsheetImporter.ts`, `ImportWizard.tsx` | — |
| 4 | `usageTrackingService.ts` | `exportService.ts`, `BlockLibrary.tsx`, `ConfigPanel.tsx` |
| 5 | `queryParserService.ts`, `QueryInput.tsx`, `QueryResults.tsx` | `ClassGenerator.tsx` |
| 6 | `AnalyticsDashboard.tsx`, `CompareView.tsx` | Multiple UI components |
| 7 | `embeddingService.ts` | `indexingService.ts` |

### localStorage Keys

**Current:**
```
barrys_custom_blocks      — User's custom blocks
barrys_block_manual_tags  — Manually added tags
```

**To Add:**
```
barrys_round_index        — Indexed round metadata
barrys_block_index        — Enhanced block metadata  
barrys_exercise_index     — Exercise-level metadata
barrys_usage_history      — Usage tracking at all levels
barrys_version_history    — Version history for edits
barrys_user_preferences   — Default settings
barrys_favorites          — Starred blocks
barrys_hidden             — Hidden block IDs
barrys_embeddings         — Cached embeddings (Phase 7)
```

### Detection Patterns Reference

See `TECHNICAL_SPEC.md` Section 6 for all regex patterns:
- Position detection patterns
- Movement pattern detection
- Grip-intensive detection
- Finisher detection
- Rep classification detection
- Modifier detection

### Flow Scoring Reference

See `TECHNICAL_SPEC.md` Section 7 for:
- Transition cost matrix
- Flow score calculation algorithm
- Thresholds for great/good/fair/poor

---

## Quick Start for Continuing Development

1. **Read all three docs:**
   - `PRD.md` — What to build (user stories)
   - `TECHNICAL_SPEC.md` — How it works (data models)
   - `IMPLEMENTATION_GUIDE.md` — What's already built

2. **Start with Phase 1:**
   - Create `src/types/hierarchyTypes.ts`
   - Implement the three-level interfaces
   - Build indexing service

3. **Test with real data:**
   - The spreadsheet `Friday__Total_Body__Master_Classes.xlsx` has 49 classes
   - Use it to validate parsing and indexing

4. **Iterate through phases:**
   - Each phase builds on the previous
   - Phase 5 (NL Query) is the "hero feature"
   - Phases 6-7 are polish/enhancement

---

*Document Version: 3.0*
*Last Updated: January 2025*
*Major Update: Reorganized as implementation roadmap with phased approach*
