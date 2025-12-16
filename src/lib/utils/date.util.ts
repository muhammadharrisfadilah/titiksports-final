import { format, isToday, isTomorrow, isYesterday, addDays, subDays } from 'date-fns';

/**
 * Format date to YYYYMMDD for API
 */
export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyyMMdd');
}

/**
 * Format date to readable text (Today, Tomorrow, Yesterday, or date)
 */
export function formatDateText(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  return format(date, 'EEE, d MMM');
}

/**
 * Format UTC time to local time string (HH:mm)
 */
export function formatTime(utcTime: string | undefined): string {
  if (!utcTime) return 'TBD';
  
  try {
    const date = new Date(utcTime);
    if (isNaN(date.getTime())) return 'TBD';
    
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'TBD';
  }
}

/**
 * Format date for display in match details
 */
export function formatMatchDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'EEE, d MMM yyyy • HH:mm');
  } catch (error) {
    return dateString;
  }
}

/**
 * Get date range for calendar
 */
export function getDateRange(date: Date): Date[] {
  const dates: Date[] = [];
  const start = subDays(date, 7);
  
  for (let i = 0; i < 15; i++) {
    dates.push(addDays(start, i));
  }
  
  return dates;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd');
}