import { ScenarioCard } from '@/types/lesson';

interface Props {
  card: ScenarioCard;
  onReadyChange?: (ready: boolean) => void;
}

export function BasicTest(_props: Props) {
  return null;
}
