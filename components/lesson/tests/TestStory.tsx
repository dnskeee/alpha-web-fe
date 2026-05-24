import { StoryModeCard } from '@/types/lesson';

interface Props {
  card: StoryModeCard;
  onReadyChange?: (ready: boolean) => void;
}

export function TestStory(_props: Props) {
  return null;
}
