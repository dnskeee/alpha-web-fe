import { SpeakerCard } from '@/types/lesson';

interface Props {
  card: SpeakerCard;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onReadyChange?: (ready: boolean) => void;
}

export function StepSpeaker(_props: Props) {
  return null;
}
