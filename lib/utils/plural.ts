export function pluralRu(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export function lessonWord(n: number): string {
  return pluralRu(n, 'урок', 'урока', 'уроков');
}

export function themeWord(n: number): string {
  return pluralRu(n, 'тема', 'темы', 'тем');
}
