import { StreakResponse } from '@/types/api';

const STREAK_CACHE_KEY = 'streak_cache';

export async function readStreakCache(): Promise<StreakResponse | null> {
  try {
    const raw = typeof window !== 'undefined'
      ? localStorage.getItem(STREAK_CACHE_KEY)
      : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function writeStreakCache(data: StreakResponse): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STREAK_CACHE_KEY, JSON.stringify(data));
    }
  } catch {
    // storage failure is non-critical
  }
}

const TIMEZONE_KEY = 'timezone_offset';

export async function readTimezoneOffset(): Promise<string | null> {
  try {
    const raw = typeof window !== 'undefined'
      ? localStorage.getItem(TIMEZONE_KEY)
      : null;
    return raw ?? null;
  } catch {
    return null;
  }
}

export async function writeTimezoneOffset(offset: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TIMEZONE_KEY, offset);
    }
  } catch {
    // storage failure is non-critical
  }
}
