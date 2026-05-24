import { BeforeAfterCard } from '@/types/lesson';

interface Props {
  card: BeforeAfterCard;
  onReadyChange?: (ready: boolean) => void;
}

export function TestBeforeAfter(_props: Props) {
  return null;
}
