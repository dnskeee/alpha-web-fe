'use client';

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { BPPageHeader } from '@/components/bp/BPPageHeader';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CrossIcon } from '@/components/icons/CrossIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { ModulesIcon } from '@/components/icons/ModulesIcon';
import { PlayIcon } from '@/components/icons/PlayIcon';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { HighlightBlock } from '@/components/ui/HighlightBlock';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useBuy } from '@/lib/hooks/useBuy';
import { ApiModuleDetail } from '@/types/api';
import { lessonWord } from '@/lib/utils/plural';

import { BPAppBar } from '@/components/bp/BPAppBar';
import { PageContainer } from '@/components/frame/PageContainer';
import { BuyModuleCard } from './_components/BuyModuleCard';
import { LessonsTab } from './_components/LessonsTab';
import s from './page.module.css';

type Tab = 'about' | 'lessons';

interface ModuleState {
  module: ApiModuleDetail | null;
  loading: boolean;
  error: string | null;
  tab: Tab;
}

type ModuleAction =
  | { type: 'loading' }
  | { type: 'loaded'; module: ApiModuleDetail; isInitial: boolean }
  | { type: 'error'; message: string }
  | { type: 'set_tab'; tab: Tab };

function reducer(state: ModuleState, action: ModuleAction): ModuleState {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: null };
    case 'loaded':
      return {
        module: action.module,
        loading: false,
        error: null,
        tab: action.isInitial
          ? action.module.isOwned
            ? 'lessons'
            : 'about'
          : state.tab,
      };
    case 'error':
      return { ...state, loading: false, error: action.message };
    case 'set_tab':
      return { ...state, tab: action.tab };
  }
}

const initial: ModuleState = { module: null, loading: true, error: null, tab: 'about' };

export default function ModuleScreen() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user, callMaybeAuthed } = useAuth();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initial);
  const { buy, busy } = useBuy();
  const loadedIdRef = useRef<string | null>(null);
  const buyCardRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollToBuyRef = useRef(false);

  const loadModule = useCallback(() => {
    const isInitial = loadedIdRef.current !== id;
    if (isInitial) dispatch({ type: 'loading' });
    callMaybeAuthed(() => api.modules.getInfo(Number(id)))
      .then((data) => {
        loadedIdRef.current = id ?? null;
        dispatch({ type: 'loaded', module: data, isInitial });
      })
      .catch((e: unknown) => {
        if (isInitial) {
          dispatch({
            type: 'error',
            message: e instanceof Error ? e.message : 'Ошибка загрузки модуля',
          });
        }
      });
  }, [id, callMaybeAuthed]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  const setTab = useCallback((tab: Tab) => dispatch({ type: 'set_tab', tab }), []);

  const goToBuy = useCallback(() => {
    pendingScrollToBuyRef.current = true;
    setTab('about');
    requestAnimationFrame(() => {
      if (buyCardRef.current) {
        buyCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [setTab]);

  const { module, loading, error, tab } = state;

  if (loading) {
    return (
      <>
        <BPAppBar />
        <PageContainer variant="detail">
          <div className={s.safe}>
            <BPPageHeader onBack={() => router.back()} />
            <div className={s.center}>
              <div className={s.spinner} />
            </div>
          </div>
        </PageContainer>
      </>
    );
  }

  if (error || !module) {
    return (
      <>
        <BPAppBar />
        <PageContainer variant="detail">
          <div className={s.safe}>
            <BPPageHeader onBack={() => router.back()} />
            <div className={s.center}>
              <p className={s.errorText}>{error || 'Тема не найдена'}</p>
              <BPPillButton label="Повторить" onClick={loadModule} variant="accent" />
            </div>
          </div>
        </PageContainer>
      </>
    );
  }

  const pct =
    module.totalLessons > 0
      ? Math.round((module.completedLessons / module.totalLessons) * 100)
      : 0;

  const sorted = [...module.lessons].sort((a, b) => a.sortOrder - b.sortOrder);
  const lastDoneIdx = sorted.reduce(
    (acc, lesson, idx) => (lesson.progressStatus === 'Done' ? idx : acc),
    -1,
  );

  return (
    <>
      <BPAppBar />
      <PageContainer variant="detail">
        <div className={s.safe}>
          <BPPageHeader onBack={() => router.back()} />

          <div className={s.titleBlock}>
            <h1 className={s.title}>{module.title}</h1>
          </div>

          <div className={s.tabWrap}>
            <div className={s.tabBar}>
              {(['about', 'lessons'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`${s.tabPill} ${tab === t ? s.tabPillActive : ''}`}
                >
                  {t === 'about' ? 'О теме' : 'Уроки'}
                </button>
              ))}
            </div>
          </div>

          <div className={s.scroll}>
            {tab === 'about' ? (
              <AboutTab
                module={module}
                sorted={sorted}
                onBuy={() => buy('module', module.id, loadModule)}
                buyBusy={busy}
                setTab={setTab}
                mustRegister={!user || user.isGuest}
                buyCardRef={buyCardRef}
              />
            ) : (
              <LessonsTab
                module={module}
                sorted={sorted}
                lastDoneIdx={lastDoneIdx}
                pct={pct}
                onRequestBuy={goToBuy}
              />
            )}
          </div>
        </div>
      </PageContainer>
    </>
  );
}

interface AboutTabProps {
  module: ApiModuleDetail;
  sorted: ApiModuleDetail['lessons'];
  onBuy: () => void;
  buyBusy: boolean;
  setTab: (t: Tab) => void;
  mustRegister: boolean;
  buyCardRef: React.RefObject<HTMLDivElement | null>;
}

function AboutTab({
  module,
  sorted,
  onBuy,
  buyBusy,
  setTab,
  mustRegister,
  buyCardRef,
}: AboutTabProps) {
  const preview = sorted.slice(0, 4);
  const remaining = Math.max(0, module.totalLessons - preview.length);

  return (
    <div className={s.aboutContent}>
      {module.hook && (module.hook.question || module.hook.answer) && (
        <div className={s.hookBlock}>
          <HighlightBlock
            question={module.hook.question ?? undefined}
            text={module.hook.answer ?? ''}
          />
        </div>
      )}

      {module.keyStatements && module.keyStatements.length > 0 && (
        <div className={s.statementsBlock}>
          {module.keyStatements.map(stmt => (
            <div key={stmt} className={s.statementRow}>
              <div className={s.crossBadge}>
                <CrossIcon size={12} color="#ffffff" />
              </div>
              <p className={s.statementText}>{stmt}</p>
            </div>
          ))}
        </div>
      )}

      {module.outcomes.length > 0 && (
        <>
          <h2 className={s.sectionTitle}>Что ты узнаешь</h2>
          <div className={s.outcomesBlock}>
            {module.outcomes.map((o, i) => (
              <div
                key={`${o.title}-${i}`}
                className={s.outcomeRow}
                style={{
                  borderBottom:
                    i < module.outcomes.length - 1
                      ? '1px solid var(--color-line)'
                      : 'none',
                }}
              >
                <div className={s.checkBadge}>
                  <CheckIcon size={13} color="var(--color-accent)" />
                </div>
                <div className={s.outcomeTexts}>
                  <span className={s.outcomeTitle}>{o.title}</span>
                  {o.subtitle ? (
                    <span className={s.outcomeSub}>{o.subtitle}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {module.descriptionExtended ? (
        <div className={s.descBlock}>
          <ExpandableText text={module.descriptionExtended} numberOfLines={4} />
        </div>
      ) : module.description ? (
        <p className={s.descText}>{module.description}</p>
      ) : null}

      {preview.length > 0 && (
        <>
          <p className={s.programLabel}>
            Программа · {module.totalLessons} {lessonWord(module.totalLessons)}
          </p>
          <BPSoftCard radius={16} padding={4} className={s.previewCard}>
            {preview.map((l, i) => {
              const isLocked = l.isLocked;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setTab('lessons')}
                  className={s.previewRow}
                  style={{
                    borderBottom:
                      i < preview.length - 1
                        ? '1px solid var(--color-line)'
                        : 'none',
                  }}
                >
                  <div
                    className={s.previewIcon}
                    style={{
                      backgroundColor: isLocked
                        ? 'var(--color-overlay)'
                        : 'var(--color-accent-soft)',
                    }}
                  >
                    {isLocked ? (
                      <LockIcon size={12} color="var(--color-muted)" />
                    ) : (
                      <PlayIcon size={12} color="var(--color-accent)" />
                    )}
                  </div>
                  <span
                    className={s.previewTitle}
                    style={{
                      color: isLocked
                        ? 'var(--color-muted)'
                        : 'var(--color-ink)',
                    }}
                  >
                    {l.title}
                  </span>
                </button>
              );
            })}
            {remaining > 0 && (
              <p className={s.previewMore}>
                + {remaining} {lessonWord(remaining)}
              </p>
            )}
          </BPSoftCard>
        </>
      )}

      <div className={s.statsChips}>
        <SkillBadge
          icon={<ModulesIcon size={14} color="var(--color-accent)" />}
          name={`${module.totalLessons} ${lessonWord(module.totalLessons)}`}
        />
        {module.completedCount > 0 && (
          <SkillBadge
            icon={<UsersIcon size={14} color="var(--color-accent)" />}
            name={`${module.completedCount} прошли`}
          />
        )}
      </div>

      {!module.isOwned && (
        <div ref={buyCardRef}>
          <BuyModuleCard
            module={module}
            onBuy={onBuy}
            buyBusy={buyBusy}
            mustRegister={mustRegister}
          />
        </div>
      )}
    </div>
  );
}

function ExpandableText({ text, numberOfLines }: { text: string; numberOfLines: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={s.descText}
        style={
          !expanded
            ? {
                display: '-webkit-box',
                WebkitLineClamp: numberOfLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
            : undefined
        }
      >
        {text}
      </p>
      <button
        type="button"
        className={s.expandBtn}
        onClick={() => setExpanded(prev => !prev)}
      >
        {expanded ? 'Скрыть' : 'Раскрыть'}
      </button>
    </div>
  );
}
