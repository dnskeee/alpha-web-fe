'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { LessonCard } from '@/components/lesson/LessonCard';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { BackIcon } from '@/components/icons/BackIcon';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ApiLessonDetail } from '@/types/api';
import { LessonModule } from '@/types/lesson';
import { INSTANT_READY_TYPES, getReadyHint } from '@/components/lesson/cardReadiness';
import s from './page.module.css';

export default function LessonScreen() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { withAuthOrGuest } = useAuth();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [lessonData, setLessonData] = useState<ApiLessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

  const lessonId = Number(id);

  useEffect(() => {
    withAuthOrGuest(() => api.lessons.getInfo(lessonId))
      .then((data) => {
        setLessonData(data);
        const isDone = data.progress?.status === 'Done';
        const savedStep = isDone ? 0 : ((data.progress?.body as { currentStep?: number })?.currentStep ?? 0);
        const totalCards = (data.body as LessonModule)?.cards?.length ?? 0;
        if (totalCards > 0) {
          const startCard = Math.min(savedStep, totalCards - 1);
          setCurrentCard(startCard);
          const seeded = new Set<number>();
          const seedUpTo = isDone ? totalCards : startCard;
          for (let i = 0; i < seedUpTo; i++) seeded.add(i);
          setCompletedCards(seeded);
        }
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lessonId, withAuthOrGuest]);

  const lesson = lessonData?.body as LessonModule | null;
  const card = lesson?.cards[currentCard];

  const currentCardReady = completedCards.has(currentCard) || (!!card && INSTANT_READY_TYPES.has(card.type));

  const markCurrentReady = useCallback(() => {
    setCompletedCards(prev => (prev.has(currentCard) ? prev : new Set(prev).add(currentCard)));
  }, [currentCard]);

  const handleReadyChange = useCallback((ready: boolean) => {
    if (ready) markCurrentReady();
  }, [markCurrentReady]);

  const saveProgress = (cardIndex: number) => {
    if (lessonData?.progress?.status === 'Done') return;
    withAuthOrGuest(() => api.progress.upsert(lessonId, 'Active', { currentStep: cardIndex }))
      .catch(() => {});
  };

  const goNext = () => {
    if (!lesson || currentCard >= lesson.cards.length - 1) return;
    if (!currentCardReady) return;
    const next = currentCard + 1;
    setCurrentCard(next);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    saveProgress(next);
  };

  const goPrev = () => {
    if (currentCard > 0) {
      setCurrentCard((c) => c - 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleComplete = async () => {
    if (!currentCardReady) return;
    try {
      setCompleting(true);
      await withAuthOrGuest(() => api.progress.upsert(
        lessonId,
        'Done',
        { currentStep: lesson!.cards.length - 1 },
      ));
    } catch {
      // ignore – navigate back regardless
    } finally {
      setCompleting(false);
      router.back();
    }
  };

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) touchStartX.current = touch.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const diff = touchStartX.current - touch.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className={s.safe}>
        <div className={s.center}>
          <div className={s.spinner} />
        </div>
      </div>
    );
  }

  if (notFound || !lesson || !card) {
    return (
      <div className={s.safe}>
        <div className={s.notFound}>
          <span className={s.notFoundText}>Урок не найден</span>
        </div>
      </div>
    );
  }

  const isLast = currentCard === lesson.cards.length - 1;
  const hint = !currentCardReady ? getReadyHint(card.type) : null;

  return (
    <div className={s.safe}>
      <div
        className={s.container}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <LessonHeader
          lessonNumber={lesson.lessonNumber ?? lessonData?.sortOrder}
          estimatedTime={lesson.estimatedTime}
          totalCards={lesson.cards.length}
          currentCard={currentCard}
          title={lessonData?.title}
          onBack={() => router.back()}
        />

        <div
          ref={scrollRef}
          className={s.scroll}
        >
          <div className={s.cardContent}>
            <LessonCard
              key={currentCard}
              card={card}
              xpReward={lesson.xpReward}
              scrollRef={scrollRef}
              onReadyChange={handleReadyChange}
            />
          </div>
        </div>

        <div className={s.navWrap}>
          <div className={s.nav}>
            {currentCard > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className={s.navBack}
                aria-label="Назад"
              >
                <BackIcon size={20} color="var(--color-ink)" />
              </button>
            )}
            {!isLast && (
              <div className={s.navNextWrap}>
                <BPPillButton
                  size="block"
                  variant="primary"
                  label={currentCardReady ? 'Далее →' : (hint ?? 'Далее →')}
                  onClick={goNext}
                  disabled={!currentCardReady}
                />
              </div>
            )}
            {isLast && (
              <div className={s.navNextWrap}>
                {completing ? (
                  <div className={s.completingBox}>
                    <div className={s.spinner} />
                  </div>
                ) : (
                  <BPPillButton
                    size="block"
                    variant="primary"
                    label="Завершить урок"
                    onClick={handleComplete}
                    disabled={completing || !currentCardReady}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
