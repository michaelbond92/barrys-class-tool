// Block Equipment Detection Service
// Analyzes floor block content to determine required equipment

import { Equipment } from '../types';

export type BlockEquipment = Equipment | 'any';

// Patterns that indicate heavy dumbbell usage
const HEAVY_PATTERNS: RegExp[] = [
  /\bDeadlift\b/i,
  /\bRDL\b/i,
  /\bSDL\b/i,
  /\bChest\s*Press\b/i,
  /\bBent\s*Over\s*Row\b/i,
  /\bReverse\s*Row\b/i,
  /\bSingle\s*Arm\s*Row\b/i,
  /\bFloor\s*Press\b/i,
  /\bHeavy\b/i,
  /\bSuitcase\s*Squat\b/i,
  /\bGoblet\s*Squat\b/i,
  /\bClean\b/i,
  /\bSnatch\b/i,
  /\bHigh\s*Pull\b/i,
  /\bSwing\b/i,
  /\bThrust\b/i,
];

// Patterns that indicate medium dumbbell usage
const MEDIUM_PATTERNS: RegExp[] = [
  /\bBicep\s*Curl\b/i,
  /\bCurl\b/i,
  /\bTricep\b/i,
  /\bShoulder\s*Press\b/i,
  /\bSquat\s*to\s*Press\b/i,
  /\bLunge\b/i,
  /\bLateral\s*Raise\b/i,
  /\bFront\s*Raise\b/i,
  /\bArnold\b/i,
  /\bSkull\s*Crusher\b/i,
  /\bOverhead\s*Ext/i,
  /\bKickback\b/i,
  /\bFly\b/i,
  /\bPullover\b/i,
];

// Patterns that are clearly bodyweight (no dumbbells needed)
const BODYWEIGHT_PATTERNS: RegExp[] = [
  /\bPushup\b/i,
  /\bPush\s*up\b/i,
  /\bMountain\s*Climber\b/i,
  /\bPlank\b/i,
  /\bBurpee\b/i,
  /\bWorld.?s\s*Greatest\b/i,
  /\bWGS\b/i,
  /\bCat\s*Cow\b/i,
  /\bBirddog\b/i,
  /\bDown\s*Dog\b/i,
  /\bX\s*Human\b/i,
  /\bCommando\b/i,
  /\bShoulder\s*Tap\b/i,
  /\bJack\b/i,
  /\bCrunch\b/i,
  /\bSit\s*up\b/i,
  /\bV\s*Sit\b/i,
  /\bRussian\s*Twist\b/i,
  /\bBicycle\b/i,
  /\bToe\s*Touch\b/i,
  /\bJackknife\b/i,
  /\bLeg\s*Raise\b/i,
  /\bFlutter\b/i,
  /\bScissor\b/i,
  /\bHollow\b/i,
  /\bSuperman\b/i,
  /\bGlute\s*Bridge\b/i,
  /\bHip\s*Raise\b/i,
  /\bSquat\s*Jump\b/i,
  /\bJump\s*Squat\b/i,
  /\bBeast/i,
  /\bSprawl\b/i,
];

// Good Morning and basic Squat/Row can work with any weight
const FLEXIBLE_PATTERNS: RegExp[] = [
  /\bGood\s*Morning\b/i,
  /\bGM\b/,
  /\bRow\b/i,  // Generic row (not bent over row)
  /\bSquat\b/i,  // Generic squat
  /\bAlternating\b/i,
  /\bTempo\b/i,
];

/**
 * Detect the required equipment for a floor block
 * Returns the most restrictive equipment needed
 */
export function detectBlockEquipment(block: string[]): BlockEquipment {
  const content = block.join(' ');

  let heavyScore = 0;
  let mediumScore = 0;
  let bodyweightScore = 0;
  let flexibleScore = 0;

  // Count pattern matches
  for (const pattern of HEAVY_PATTERNS) {
    if (pattern.test(content)) heavyScore++;
  }

  for (const pattern of MEDIUM_PATTERNS) {
    if (pattern.test(content)) mediumScore++;
  }

  for (const pattern of BODYWEIGHT_PATTERNS) {
    if (pattern.test(content)) bodyweightScore++;
  }

  for (const pattern of FLEXIBLE_PATTERNS) {
    if (pattern.test(content)) flexibleScore++;
  }

  // Determine equipment based on scores
  // If mostly bodyweight with some flexible exercises, it's 'any'
  if (bodyweightScore > 0 && heavyScore === 0 && mediumScore === 0) {
    // Pure bodyweight block - works with anything
    return 'any';
  }

  // Heavy exercises require heavy dumbbells
  if (heavyScore > mediumScore) {
    return '2 Heavy Dumbbells';
  }

  // Medium exercises (curls, presses, etc.)
  if (mediumScore > 0) {
    return '2 Mediums';
  }

  // Flexible/warmup exercises work with anything
  if (flexibleScore > 0 || bodyweightScore > 0) {
    return 'any';
  }

  // Default to 'any' if we can't determine
  return 'any';
}

/**
 * Check if a block's equipment is compatible with the required equipment
 */
export function isEquipmentCompatible(
  blockEquipment: BlockEquipment,
  requiredEquipment: Equipment
): boolean {
  // 'any' equipment blocks work with anything
  if (blockEquipment === 'any') {
    return true;
  }

  // From here, blockEquipment is a specific Equipment type (not 'any')
  const specificEquipment = blockEquipment as Equipment;

  // Exact match
  if (specificEquipment === requiredEquipment) {
    return true;
  }

  // Heavy blocks can work with mediums (scale down)
  // But medium blocks shouldn't be used for heavy rounds
  if (requiredEquipment === '2 Heavy Dumbbells') {
    // Only allow heavy blocks (already handled by exact match)
    return false;
  }

  if (requiredEquipment === '2 Mediums') {
    // Medium rounds can use medium blocks only (exact match handled above)
    return false;
  }

  if (requiredEquipment === '2 Light Dumbbells') {
    // Light rounds can use light or medium (scaled down)
    return specificEquipment === '2 Mediums';
  }

  if (requiredEquipment === 'Bodyweight') {
    // Bodyweight rounds should only use 'any' blocks (handled at top)
    return false;
  }

  return false;
}

/**
 * Get equipment label for display
 */
export function getEquipmentLabel(equipment: BlockEquipment): string {
  if (equipment === 'any') return 'Any Equipment';
  return equipment;
}

/**
 * Get equipment color for UI
 */
export function getEquipmentColor(equipment: BlockEquipment): string {
  switch (equipment) {
    case '2 Heavy Dumbbells':
      return 'bg-red-100 text-red-700';
    case '2 Mediums':
      return 'bg-blue-100 text-blue-700';
    case '2 Light Dumbbells':
      return 'bg-green-100 text-green-700';
    case 'Bodyweight':
      return 'bg-gray-100 text-gray-700';
    case 'any':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
