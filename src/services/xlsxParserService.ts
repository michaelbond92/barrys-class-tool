// ============================================================================
// XLSX Parser Service
// Parses the original Barry's class spreadsheet into structured data
// ============================================================================

import * as XLSX from 'xlsx';
import {
  ImportedClass,
  ImportedMinute,
  EquipmentSet,
  WeightEquipment,
  WeightType,
  AccessoryType,
  BenchSetup,
} from '../types/hierarchyTypes';

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

/**
 * Parse a complete xlsx file containing Barry's classes
 */
export function parseClassSpreadsheet(file: File): Promise<ImportedClass[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        // Use cellStyles: true to read cell background colors for warmup detection
        const workbook = XLSX.read(data, { type: 'array', cellStyles: true });

        const classes: ImportedClass[] = [];

        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const parsed = parseSheet(sheet, sheetName);
          classes.push(parsed);
        }

        resolve(classes);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse xlsx from a path (for Node.js/testing)
 */
export function parseClassSpreadsheetFromPath(filePath: string): ImportedClass[] {
  // Use cellStyles: true to read cell background colors for warmup detection
  const workbook = XLSX.readFile(filePath, { cellStyles: true });
  const classes: ImportedClass[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const parsed = parseSheet(sheet, sheetName);
    classes.push(parsed);
  }

  return classes;
}

/**
 * Parse a single sheet into an ImportedClass
 */
function parseSheet(sheet: XLSX.WorkSheet, sheetName: string): ImportedClass {
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
  const parseErrors: string[] = [];
  const parseWarnings: string[] = [];

  // Parse date from sheet name (e.g., "1.17.25 (119)" -> "2025-01-17")
  const date = parseDateFromSheetName(sheetName);
  if (!date) {
    parseErrors.push(`Could not parse date from sheet name: ${sheetName}`);
  }

  // Find round boundaries
  const { round1Start, round1End, round2Start, round2End } = findRoundBoundaries(data);

  // Parse Round 1 (with warmup detection from green cells)
  const round1Header = findEquipmentRow(data, 0, round1End);
  const round1Equipment = round1Header ? parseEquipmentText(round1Header) : 'Unknown';
  const round1Forecast = round1Header ? parseForecast(round1Header) : undefined;
  const round1Minutes = parseMinutes(data, round1Start, round1End, parseErrors, sheet, true);

  // Parse Round 2 (no warmup detection - warmups only in Round 1)
  const round2Header = findEquipmentRow(data, round2Start - 5, round2End);
  const round2Equipment = round2Header ? parseEquipmentText(round2Header) : 'Unknown';
  const round2Forecast = round2Header ? parseForecast(round2Header) : undefined;
  const round2Minutes = parseMinutes(data, round2Start, round2End, parseErrors, sheet, false);

  // Validation warnings
  if (round1Minutes.length === 0) {
    parseWarnings.push('Round 1 has no minutes parsed');
  }
  if (round2Minutes.length === 0) {
    parseWarnings.push('Round 2 has no minutes parsed');
  }
  if (round1Minutes.length + round2Minutes.length !== 20) {
    parseWarnings.push(`Total duration is ${round1Minutes.length + round2Minutes.length} minutes, expected 20`);
  }

  return {
    sourceSheet: sheetName,
    date: date || 'unknown',
    round1: {
      equipment: round1Equipment,
      forecast: round1Forecast,
      minutes: round1Minutes,
    },
    round2: {
      equipment: round2Equipment,
      forecast: round2Forecast,
      minutes: round2Minutes,
    },
    parseErrors,
    parseWarnings,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse date from sheet name like "1.17.25 (119)" or "7.13.25 SUNDAY (128)"
 */
function parseDateFromSheetName(sheetName: string): string | null {
  // Match patterns like "1.17.25", "12.31.24", etc.
  const dateMatch = sheetName.match(/(\d{1,2})\.(\d{1,2})\.(\d{2})/);
  if (!dateMatch) return null;

  const [, month, day, year] = dateMatch;
  const fullYear = parseInt(year) >= 50 ? 1900 + parseInt(year) : 2000 + parseInt(year);

  // Return ISO format
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Extract class number from sheet name like "1.17.25 (119)"
 */
export function parseClassNumberFromSheetName(sheetName: string): number | null {
  const match = sheetName.match(/\((\d+)\)/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Extract day of week from sheet name like "7.13.25 SUNDAY (128)"
 */
export function parseDayFromSheetName(sheetName: string): string | null {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const upperName = sheetName.toUpperCase();
  return days.find(day => upperName.includes(day)) || null;
}

/**
 * Find the row indices for round boundaries
 * Key insight: Round 2 starts with "0-1" again after Round 1 ends
 */
function findRoundBoundaries(data: string[][]): {
  round1Start: number;
  round1End: number;
  round2Start: number;
  round2End: number;
} {
  // First, collect all minute rows
  const minuteRows: { index: number; minute: string }[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || '').trim();
    if (firstCell.match(/^\d+-\d+$/)) {
      minuteRows.push({ index: i, minute: firstCell });
    }
  }

  // Find where Round 2 starts - look for when "0-1" appears again
  // (or when minute numbers reset to lower values after increasing)
  let round1Start = -1;
  let round1End = -1;
  let round2Start = -1;
  let round2End = -1;

  if (minuteRows.length === 0) {
    return { round1Start, round1End, round2Start, round2End };
  }

  round1Start = minuteRows[0].index;

  // Find where Round 2 starts
  for (let i = 1; i < minuteRows.length; i++) {
    const currentMinute = minuteRows[i].minute;
    const prevMinute = minuteRows[i - 1].minute;

    // Extract the start number from "X-Y" format
    const currentStart = parseInt(currentMinute.split('-')[0]);
    const prevStart = parseInt(prevMinute.split('-')[0]);

    // If we see "0-1" again, or a reset (current < previous), that's Round 2
    if (currentStart === 0 || currentStart < prevStart) {
      round1End = minuteRows[i - 1].index + 1;
      round2Start = minuteRows[i].index;
      break;
    }
  }

  // If no reset found, all minutes are Round 1
  if (round2Start === -1) {
    round1End = minuteRows[minuteRows.length - 1].index + 1;
    return { round1Start, round1End, round2Start: -1, round2End: -1 };
  }

  // Find Round 2 end
  round2End = minuteRows[minuteRows.length - 1].index + 1;

  return { round1Start, round1End, round2Start, round2End };
}

/**
 * Find equipment/forecast row near a position
 */
function findEquipmentRow(data: string[][], searchStart: number, searchEnd: number): string | null {
  for (let i = Math.max(0, searchStart); i < Math.min(data.length, searchEnd); i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || '').trim();
    if (firstCell.toLowerCase().includes('equipment:')) {
      return firstCell;
    }
  }
  return null;
}

/**
 * Parse equipment text into structured format
 */
function parseEquipmentText(text: string): string {
  // Extract just the equipment part
  const match = text.match(/equipment:\s*(.+?)(?:\n|$)/i);
  return match ? match[1].trim() : text;
}

/**
 * Parse full equipment text into EquipmentSet
 */
export function parseEquipmentToSet(text: string): EquipmentSet {
  const rawText = text.toLowerCase();

  // Default values
  let primary: WeightEquipment = { type: 'heavy', count: 2 };
  let secondary: WeightEquipment | undefined;
  let accessory: AccessoryType | undefined;
  let benchSetup: BenchSetup = 'flat';

  // Parse primary weight
  if (rawText.includes('2 heavy') || rawText.includes('2 heavies')) {
    primary = { type: 'heavy', count: 2 };
  } else if (rawText.includes('1 heavy')) {
    primary = { type: 'heavy', count: 1 };
  } else if (rawText.includes('2 medium')) {
    primary = { type: 'medium', count: 2 };
  } else if (rawText.includes('1 medium')) {
    primary = { type: 'medium', count: 1 };
  } else if (rawText.includes('2 light')) {
    primary = { type: 'light', count: 2 };
  }

  // Parse secondary weight
  if (rawText.includes('+ 1 medium') || rawText.includes('1 medium')) {
    if (primary.type !== 'medium') {
      secondary = { type: 'medium', count: 1 };
    }
  }
  if (rawText.includes('+ 2 medium') || rawText.includes('2 mediums')) {
    if (primary.type !== 'medium') {
      secondary = { type: 'medium', count: 2 };
    }
  }

  // Parse accessory
  if (rawText.includes('mini band')) {
    accessory = 'mini_band';
  } else if (rawText.includes('long band')) {
    accessory = 'long_band';
  } else if (rawText.includes('booty band')) {
    accessory = 'booty_band';
  }

  // Parse bench setup
  if (rawText.includes('mega')) {
    benchSetup = 'mega';
  } else if (rawText.includes('incline')) {
    benchSetup = 'incline';
  }

  return {
    primary,
    secondary,
    accessory,
    benchSetup,
    rawText: text,
  };
}

/**
 * Parse forecast from header text
 */
function parseForecast(text: string): string | undefined {
  const treadMatch = text.match(/tread forecast:\s*([^\n]*)/i);
  const floorMatch = text.match(/floor forecast:\s*([^\n]*)/i);

  const parts: string[] = [];
  if (treadMatch?.[1]?.trim()) parts.push(`Tread: ${treadMatch[1].trim()}`);
  if (floorMatch?.[1]?.trim()) parts.push(`Floor: ${floorMatch[1].trim()}`);

  return parts.length > 0 ? parts.join('; ') : undefined;
}

/**
 * Check if a cell has a green background color (warmup indicator)
 * Green colors in Excel are typically in the range of RGB where G > R and G > B
 */
function isCellGreen(sheet: XLSX.WorkSheet, cellAddress: string): boolean {
  const cell = sheet[cellAddress];
  if (!cell || !cell.s) return false;

  const style = cell.s as { fgColor?: { rgb?: string; theme?: number }; bgColor?: { rgb?: string; theme?: number }; patternType?: string };

  // Check fill color (fgColor when there's a pattern fill)
  const fillColor = style.fgColor?.rgb || style.bgColor?.rgb;
  if (!fillColor) return false;

  // Parse RGB hex (format: AARRGGBB or RRGGBB)
  const rgb = fillColor.length === 8 ? fillColor.slice(2) : fillColor;
  if (rgb.length !== 6) return false;

  const r = parseInt(rgb.slice(0, 2), 16);
  const g = parseInt(rgb.slice(2, 4), 16);
  const b = parseInt(rgb.slice(4, 6), 16);

  // Detect green-ish colors:
  // - High green component (G > 150)
  // - Green is dominant (G > R * 1.2 and G > B * 1.2)
  // - Or specifically light green (high R, very high G, lower B)
  // Common Excel greens: 00FF00, 92D050, C6EFCE, etc.
  const isGreen = (
    g > 150 && g > r * 1.1 && g > b * 1.1
  ) || (
    // Light lime green like 92D050
    g > 180 && g >= r && g > b
  ) || (
    // Pale green like C6EFCE
    g > 200 && r > 150 && b > 150 && g > r && g > b
  );

  return isGreen;
}

/**
 * Convert row/column to Excel cell address
 */
function getCellAddress(row: number, col: number): string {
  const colLetter = XLSX.utils.encode_col(col);
  return `${colLetter}${row + 1}`;
}

/**
 * Parse minute rows from data
 */
function parseMinutes(
  data: string[][],
  startRow: number,
  endRow: number,
  errors: string[],
  sheet?: XLSX.WorkSheet,
  detectWarmup?: boolean
): ImportedMinute[] {
  const minutes: ImportedMinute[] = [];

  for (let i = startRow; i < endRow; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || '').trim();

    // Only process minute rows
    if (!firstCell.match(/^\d+-\d+$/)) continue;

    const minute = firstCell;
    const tread = String(row[1] || '').trim();
    const floor = String(row[2] || '').trim();
    const notes = row[3] ? String(row[3]).trim() : undefined;

    if (!tread && !floor) {
      errors.push(`Row ${i}: Minute ${minute} has no tread or floor data`);
      continue;
    }

    // Check if this is a warmup cell (green background, Round 1 only)
    let isWarmup: boolean | undefined;
    if (detectWarmup && sheet) {
      // Check floor column (column C = index 2) for green color
      const floorCellAddr = getCellAddress(i, 2);
      // Also check tread column (column B = index 1)
      const treadCellAddr = getCellAddress(i, 1);

      isWarmup = isCellGreen(sheet, floorCellAddr) || isCellGreen(sheet, treadCellAddr);
    }

    minutes.push({ minute, tread, floor, notes, isWarmup });
  }

  return minutes;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate an imported class for completeness
 */
export function validateImportedClass(imported: ImportedClass): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [...imported.parseErrors];
  const warnings: string[] = [...imported.parseWarnings];

  // Check date
  if (imported.date === 'unknown') {
    errors.push('Missing or invalid date');
  }

  // Check round 1
  if (imported.round1.minutes.length === 0) {
    errors.push('Round 1 has no content');
  } else if (imported.round1.minutes.length < 8) {
    warnings.push(`Round 1 is only ${imported.round1.minutes.length} minutes`);
  }

  // Check round 2
  if (imported.round2.minutes.length === 0) {
    errors.push('Round 2 has no content');
  } else if (imported.round2.minutes.length < 6) {
    warnings.push(`Round 2 is only ${imported.round2.minutes.length} minutes`);
  }

  // Check equipment
  if (imported.round1.equipment === 'Unknown') {
    warnings.push('Round 1 equipment not detected');
  }
  if (imported.round2.equipment === 'Unknown') {
    warnings.push('Round 2 equipment not detected');
  }

  // Check for empty floor entries
  const emptyFloors = [
    ...imported.round1.minutes.filter(m => !m.floor),
    ...imported.round2.minutes.filter(m => !m.floor),
  ];
  if (emptyFloors.length > 0) {
    warnings.push(`${emptyFloors.length} minute(s) have no floor exercises`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export function formatDateForDisplay(isoDate: string): string {
  // Parse as local date to avoid timezone issues
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getSheetNameFromDate(dateStr: string, classNumber?: number): string {
  // Parse as local date to avoid timezone issues
  const [year, month, day] = dateStr.split('-').map(Number);
  const shortYear = year % 100;

  let name = `${month}.${day}.${shortYear.toString().padStart(2, '0')}`;
  if (classNumber) {
    name += ` (${classNumber})`;
  }
  return name;
}
