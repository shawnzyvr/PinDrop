import { formatDate, formatTime, formatRelativeTime } from '../../src/utils/date';

describe('Date Utilities', () => {
  const testTimestamp = 1700000000000; // Fixed timestamp: Nov 14, 2023

  it('formatDate formats timestamp into a readable date string', () => {
    const formatted = formatDate(testTimestamp);
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('formatTime formats timestamp into a time string', () => {
    const formatted = formatTime(testTimestamp);
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('formatRelativeTime returns "Just now" for current timestamp', () => {
    const now = Date.now();
    expect(formatRelativeTime(now)).toBe('Just now');
  });

  it('returns empty string for invalid timestamp input', () => {
    expect(formatDate(NaN)).toBe('');
    expect(formatTime(0)).toBe('');
  });
});
