'use client';

import React, { useEffect, useReducer } from 'react';

import { BPBundlesCTA } from '@/components/bp/BPBundlesCTA';
import { BPModuleListCard } from '@/components/bp/BPModuleListCard';
import { BPSectionTitle } from '@/components/bp/BPSectionTitle';
import { BPTopBar } from '@/components/bp/BPTopBar';
import { PageContainer } from '@/components/frame/PageContainer';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ApiCourse } from '@/types/api';
import s from './page.module.css';

const COURSE_ID = 1;

interface ModulesState {
  course: ApiCourse | null;
  loading: boolean;
  error: string | null;
}

type ModulesAction =
  | { type: 'loaded'; course: ApiCourse | null }
  | { type: 'error'; message: string }
  | { type: 'retry' };

function reducer(state: ModulesState, action: ModulesAction): ModulesState {
  switch (action.type) {
    case 'loaded': return { course: action.course, loading: false, error: null };
    case 'error':  return { ...state, loading: false, error: action.message };
    case 'retry':  return { ...state, loading: true, error: null };
  }
}

const initial: ModulesState = { course: null, loading: true, error: null };

export default function ModulesScreen() {
  const { callMaybeAuthed } = useAuth();
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    let cancelled = false;
    callMaybeAuthed(() => api.courses.getList())
      .then((data) => {
        if (cancelled) return;
        const found = data.courses.find((c) => c.id === COURSE_ID) ?? data.courses[0] ?? null;
        dispatch({ type: 'loaded', course: found });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        dispatch({ type: 'error', message: e instanceof Error ? e.message : 'Ошибка загрузки' });
      });
    return () => { cancelled = true; };
  }, [callMaybeAuthed]);

  const { course, loading, error } = state;

  if (loading) {
    return (
      <PageContainer variant="tabs">
        <div className={s.center}><div className={s.spinner} /></div>
      </PageContainer>
    );
  }

  if (error || !course) {
    return (
      <PageContainer variant="tabs">
        <div className={s.center}>
          <p className={s.errorText}>{error || 'Курс не найден'}</p>
          <button type="button" onClick={() => dispatch({ type: 'retry' })} className={s.retryBtn}>
            Повторить
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="tabs">
      <div className={s.scroll}>
        <div className={s.mobileTopBar}>
          <BPTopBar showLogo />
        </div>

        <div className={s.header}>
          <BPSectionTitle title="Обучение" display="Все темы" />
        </div>

        <BPBundlesCTA className={s.bundlesCta} />

        <div className={s.moduleList}>
          {course.modules.map((m, i) => (
            <BPModuleListCard key={m.id} module={m} index={i} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
