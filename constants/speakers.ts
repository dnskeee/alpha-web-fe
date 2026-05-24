export type SpeakerId = 'sprite_cat' | 'sprite_ironman';

export interface Speaker {
  id: SpeakerId;
  name: string;
  /** Relative URL path to the image asset (served from /public). */
  asset: string;
}

export const SPEAKERS: Speaker[] = [
  {
    id: 'sprite_cat',
    name: 'Кот',
    asset: '/images/sprite_cat.webp',
  },
  {
    id: 'sprite_ironman',
    name: 'Железный человек',
    asset: '/images/sprite_ironman.webp',
  },
];

export const DEFAULT_SPEAKER_ID: SpeakerId = 'sprite_cat';
