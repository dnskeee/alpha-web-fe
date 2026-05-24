export type LessonStatus = 'done' | 'current' | 'locked';

export interface LessonListItem {
  id: number;
  num: number;
  title: string;
  status: LessonStatus;
  xp: number;
  estimatedTime?: string;
}

export type CardType =
  | 'intro'
  | 'insight'
  | 'strategy'
  | 'scenario'
  | 'mentor'
  | 'summary'
  | 'challenge'
  | 'comic'
  | 'mindmap'
  | 'stats'
  | 'reveal'
  | 'voices'
  | 'timeline'
  | 'chat_simulator'
  | 'swipe_test'
  | 'before_after'
  | 'drag_rank'
  | 'quick_fire'
  | 'story_mode'
  | 'reality_check'
  | 'speaker'
  | 'step_chat';

interface BaseCard {
  type: CardType;
  emoji: string;
  title: string;
}

// ─── Original types ───

export interface IntroCard extends BaseCard {
  type: 'intro';
  body: string;
  highlight?: string | null;
  note?: string | null;
}

export interface InsightCard extends BaseCard {
  type: 'insight';
  body: string;
  note?: string | null;
}

export interface StrategyCard extends BaseCard {
  type: 'strategy';
  body: string;
  highlight?: string | null;
  note?: string | null;
}

export interface ScenarioOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface ScenarioCard extends BaseCard {
  type: 'scenario';
  body: string;
  scenarioQuote: string;
  options: ScenarioOption[];
  explanations: Record<string, string>;
}

export interface MentorCard extends BaseCard {
  type: 'mentor';
  body: string;
  note?: string | null;
}

export interface SummaryCard extends BaseCard {
  type: 'summary';
  bullets: string[];
  body?: string | null;
}

export interface ChallengeCard extends BaseCard {
  type: 'challenge';
  challengeLevel: string;
  challengeText: string;
  challengeTip: string;
  challengeBonus: string;
}

// ─── New format types ───

export interface ComicPanel {
  scene: string;
  /** Solid dark background color for the panel */
  panelBg: string;
  caption?: string | null;
  /** Italic inner thought shown in amber bubble */
  thought?: string | null;
  /** Key insight shown in accent box */
  insight?: string | null;
  /** Example message/action shown in green box */
  example?: string | null;
  /** Final takeaway lines (first line is bold/large) */
  takeaway?: string[] | null;
  mood: string;
  tag: string;
  tagColor: string;
}

export interface ComicCard extends BaseCard {
  type: 'comic';
  panels: ComicPanel[];
}

export interface MindmapBranch {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: string[];
  tip: string;
}

export interface MindmapCard extends BaseCard {
  type: 'mindmap';
  centerIcon: string;
  centerLabel: string;
  branches: MindmapBranch[];
}

export interface StatSlide {
  stat: string;
  unit?: string;
  text: string;
  detail: string;
  icon: string;
  color: string;
}

export interface StatsCard extends BaseCard {
  type: 'stats';
  slides: StatSlide[];
}

export interface RevealLayer {
  title: string;
  icon: string;
  color: string;
  content: string;
}

export interface RevealCard extends BaseCard {
  type: 'reveal';
  layers: RevealLayer[];
}

export interface VoicePair {
  fear: string;
  confidence: string;
}

export interface VoicesCard extends BaseCard {
  type: 'voices';
  pairs: VoicePair[];
  conclusion: string;
}

export interface TimelineStep {
  time: string;
  label: string;
  icon: string;
  text: string;
  do: string;
  dont: string;
}

export interface TimelineCard extends BaseCard {
  type: 'timeline';
  steps: TimelineStep[];
}

export interface RealityCheckItem {
  fear: string;
  fearEmoji: string;
  reality: string;
  realityEmoji: string;
  stat?: string;
}

export interface RealityCheckCard extends BaseCard {
  type: 'reality_check';
  items: RealityCheckItem[];
}

export interface SpeakerCard extends BaseCard {
  type: 'speaker';
  /** Image key mapped inside StepSpeaker (e.g. 'ironman') */
  speakerKey: string;
  texts: string[];
}

// ─── Step chat types ───

export interface StepChatMessage {
  from: 'her' | 'you';
  text: string;
  /** ms offset from the start of the sequence (default: index * 1200) */
  delay?: number;
}

export interface StepChatCard extends BaseCard {
  type: 'step_chat';
  characterName: string;
  characterInitial: string;
  characterColor?: string;
  messages: StepChatMessage[];
}

// ─── Interactive test types ───

export interface ChatMessage {
  from: 'her' | 'you';
  text: string;
}

export interface ChatChoice {
  id: string;
  text: string;
  quality: 'good' | 'mid' | 'bad';
  herReply: { text: string; delay: number }[];
  verdict: string;
}

export interface ChatSimulatorCard extends BaseCard {
  type: 'chat_simulator';
  context: string;
  initialMessages: ChatMessage[];
  choices: ChatChoice[];
}

export interface SwipeItem {
  text: string;
  correct: boolean;
  why: string;
}

export interface SwipeTestCard extends BaseCard {
  type: 'swipe_test';
  items: SwipeItem[];
}

export interface BeforeAfterItem {
  category: string;
  bad: { text: string; emoji: string };
  good: { text: string; emoji: string };
  lesson: string;
}

export interface BeforeAfterCard extends BaseCard {
  type: 'before_after';
  items: BeforeAfterItem[];
}

export interface DragRankItem {
  id: string;
  text: string;
  icon: string;
}

export interface DragRankCard extends BaseCard {
  type: 'drag_rank';
  instruction: string;
  items: DragRankItem[];
  correctOrder: string[];
  insight: string;
}

export interface QuickFireQuestion {
  text: string;
  answer: boolean;
  explain: string;
}

export interface QuickFireCard extends BaseCard {
  type: 'quick_fire';
  timePerQuestion: number;
  questions: QuickFireQuestion[];
}

export interface StoryScene {
  text: string;
  choices?: { text: string; next: string }[];
  isEnd?: boolean;
  endType?: 'good' | 'mid' | 'bad';
  lesson?: string;
  isGoodPath?: boolean;
}

export interface StoryModeCard extends BaseCard {
  type: 'story_mode';
  startScene: string;
  scenes: Record<string, StoryScene>;
}

export type LessonCard =
  | IntroCard
  | InsightCard
  | StrategyCard
  | ScenarioCard
  | MentorCard
  | SummaryCard
  | ChallengeCard
  | ComicCard
  | MindmapCard
  | StatsCard
  | RevealCard
  | VoicesCard
  | TimelineCard
  | ChatSimulatorCard
  | SwipeTestCard
  | BeforeAfterCard
  | DragRankCard
  | QuickFireCard
  | StoryModeCard
  | RealityCheckCard
  | SpeakerCard
  | StepChatCard;

export interface LessonModule {
  id: number;
  moduleTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  estimatedTime: string;
  xpReward: number;
  skills: string[];
  cards: LessonCard[];
}
