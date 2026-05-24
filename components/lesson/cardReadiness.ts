import { CardType } from '@/types/lesson';

/**
 * Card types that have no required user action and reveal all content at once.
 * These should report ready as soon as they mount.
 */
export const INSTANT_READY_TYPES: ReadonlySet<CardType> = new Set<CardType>([
  'intro',
  'insight',
  'strategy',
  'mentor',
  'summary',
]);

/**
 * Returns the helper hint text used as the disabled-button label, or null if
 * the card type is instant-ready (button shouldn't be disabled).
 */
export function getReadyHint(type: CardType): string | null {
  if (INSTANT_READY_TYPES.has(type)) return null;
  return 'Завершите задание';
}
