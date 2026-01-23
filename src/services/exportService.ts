import { ClassPlan, Round } from '../types';
import { formatClassTypeName, formatTreadAverage } from '../utils/formatUtils';
import { formatDisplayDate } from '../utils/dateUtils';
import * as XLSX from 'xlsx';

function formatRoundForClipboard(round: Round, roundNumber: number): string[] {
  const lines: string[] = [];

  // Header
  lines.push(`Round ${roundNumber}\t\t\t`);
  lines.push(`Floor Forecast:\t${round.forecast || ''}\t\t`);
  lines.push(`Equipment: ${round.equipment}\t\t\t`);
  lines.push(`Minute\tTread\tFloor\tNotes`);

  // Content rows
  const maxRows = Math.max(round.tread.length, round.floor.length);
  for (let i = 0; i < maxRows; i++) {
    const tread = round.tread[i];
    const floor = round.floor[i];
    lines.push(
      `${tread?.minute || ''}\t${tread?.raw || ''}\t${floor?.exercises || ''}\t${floor?.notes || ''}`
    );
  }

  return lines;
}

export function formatForClipboard(classPlan: ClassPlan): string {
  const lines: string[] = [];

  // Title section
  lines.push(`${formatClassTypeName(classPlan.classType)}\t\t\t`);
  lines.push(`Date: ${formatDisplayDate(classPlan.date)}\t\t\t`);
  lines.push(`Tread Average: ${formatTreadAverage(classPlan.treadAverage)}\t\t\t`);
  lines.push('');

  // Round 1
  lines.push(...formatRoundForClipboard(classPlan.round1, 1));
  lines.push('');

  // Round 2
  lines.push(...formatRoundForClipboard(classPlan.round2, 2));

  return lines.join('\n');
}

export async function copyToClipboard(classPlan: ClassPlan): Promise<boolean> {
  try {
    const text = formatForClipboard(classPlan);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

function roundToWorksheetData(round: Round, roundNumber: number): (string | number)[][] {
  const data: (string | number)[][] = [];

  // Header rows
  data.push([`Round ${roundNumber}`, '', '', '']);
  data.push(['Floor Forecast:', round.forecast || '', '', '']);
  data.push([`Equipment: ${round.equipment}`, '', '', '']);
  data.push(['Minute', 'Tread', 'Floor', 'Notes']);

  // Content rows
  const maxRows = Math.max(round.tread.length, round.floor.length);
  for (let i = 0; i < maxRows; i++) {
    const tread = round.tread[i];
    const floor = round.floor[i];
    data.push([
      tread?.minute || '',
      tread?.raw || '',
      floor?.exercises || '',
      floor?.notes || ''
    ]);
  }

  return data;
}

export function exportToXLSX(classPlan: ClassPlan): void {
  const workbook = XLSX.utils.book_new();

  // Combine all data
  const data: (string | number)[][] = [];

  // Title section
  data.push([formatClassTypeName(classPlan.classType), '', '', '']);
  data.push([`Date: ${formatDisplayDate(classPlan.date)}`, '', '', '']);
  data.push([`Tread Average: ${formatTreadAverage(classPlan.treadAverage)}`, '', '', '']);
  data.push(['', '', '', '']);

  // Round 1
  data.push(...roundToWorksheetData(classPlan.round1, 1));
  data.push(['', '', '', '']);

  // Round 2
  data.push(...roundToWorksheetData(classPlan.round2, 2));

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 10 }, // Minute
    { wch: 25 }, // Tread
    { wch: 35 }, // Floor
    { wch: 20 }  // Notes
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Class Plan');

  // Generate filename
  const filename = `barrys-class-${classPlan.date}.xlsx`;

  // Download
  XLSX.writeFile(workbook, filename);
}

export function formatRoundPreview(round: Round): string {
  const lines: string[] = [];
  lines.push(`Duration: ${round.duration} minutes`);
  lines.push(`Equipment: ${round.equipment}`);

  if (round.forecast) {
    lines.push(`Forecast: ${round.forecast}`);
  }

  return lines.join('\n');
}
