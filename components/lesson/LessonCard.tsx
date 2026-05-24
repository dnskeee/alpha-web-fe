import React from 'react';
import { LessonCard as LessonCardType } from '@/types/lesson';
import { StepIntro } from './steps/StepIntro';
import { StepInsight } from './steps/StepInsight';
import { StepStrategy } from './steps/StepStrategy';
import { StepMentor } from './steps/StepMentor';
import { StepSummary } from './steps/StepSummary';
import { StepChallenge } from './steps/StepChallenge';
import { StepComic } from './steps/StepComic';
import { StepMindmap } from './steps/StepMindmap';
import { StepStats } from './steps/StepStats';
import { StepReveal } from './steps/StepReveal';
import { StepVoices } from './steps/StepVoices';
import { StepTimeline } from './steps/StepTimeline';
import { StepRealityCheck } from './steps/StepRealityCheck';
import { StepSpeaker } from './steps/StepSpeaker';
import { StepChat } from './steps/StepChat';
import { BasicTest } from './tests/BasicTest';
import { TestChat } from './tests/TestChat';
import { TestSwipe } from './tests/TestSwipe';
import { TestBeforeAfter } from './tests/TestBeforeAfter';
import { TestDragRank } from './tests/TestDragRank';
import { TestQuickFire } from './tests/TestQuickFire';
import { TestStory } from './tests/TestStory';

interface LessonCardProps {
  card: LessonCardType;
  xpReward: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onReadyChange?: (ready: boolean) => void;
}

export function LessonCard({ card, xpReward, scrollRef, onReadyChange }: LessonCardProps) {
  switch (card.type) {
    case 'intro':           return <StepIntro card={card} onReadyChange={onReadyChange} />;
    case 'insight':         return <StepInsight card={card} onReadyChange={onReadyChange} />;
    case 'strategy':        return <StepStrategy card={card} onReadyChange={onReadyChange} />;
    case 'scenario':        return <BasicTest card={card} onReadyChange={onReadyChange} />;
    case 'mentor':          return <StepMentor card={card} onReadyChange={onReadyChange} />;
    case 'summary':         return <StepSummary card={card} onReadyChange={onReadyChange} />;
    case 'challenge':       return <StepChallenge card={card} xpReward={xpReward} onReadyChange={onReadyChange} />;
    case 'comic':           return <StepComic card={card} onReadyChange={onReadyChange} />;
    case 'mindmap':         return <StepMindmap card={card} onReadyChange={onReadyChange} />;
    case 'stats':           return <StepStats card={card} onReadyChange={onReadyChange} />;
    case 'reveal':          return <StepReveal card={card} onReadyChange={onReadyChange} />;
    case 'voices':          return <StepVoices card={card} onReadyChange={onReadyChange} />;
    case 'timeline':        return <StepTimeline card={card} onReadyChange={onReadyChange} />;
    case 'reality_check':   return <StepRealityCheck card={card} onReadyChange={onReadyChange} />;
    case 'speaker':         return <StepSpeaker card={card} scrollRef={scrollRef} onReadyChange={onReadyChange} />;
    case 'step_chat':       return <StepChat card={card} onReadyChange={onReadyChange} />;
    case 'chat_simulator':  return <TestChat card={card} onReadyChange={onReadyChange} />;
    case 'swipe_test':      return <TestSwipe card={card} onReadyChange={onReadyChange} />;
    case 'before_after':    return <TestBeforeAfter card={card} onReadyChange={onReadyChange} />;
    case 'drag_rank':       return <TestDragRank card={card} onReadyChange={onReadyChange} />;
    case 'quick_fire':      return <TestQuickFire card={card} onReadyChange={onReadyChange} />;
    case 'story_mode':      return <TestStory card={card} onReadyChange={onReadyChange} />;
    default:                return null;
  }
}
