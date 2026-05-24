'use client';

import React, { useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';

import { BPBundlesCTA } from '@/components/bp/BPBundlesCTA';
import { BPContinueModuleCard } from '@/components/bp/BPContinueModuleCard';
import { BPModulesShelf } from '@/components/bp/BPModulesShelf';
import { BPRecommendedModuleCard } from '@/components/bp/BPRecommendedModuleCard';
import { BPStreakCard } from '@/components/bp/BPStreakCard';
import { BPThoughtCard } from '@/components/bp/BPThoughtCard';
import { BPTopBar } from '@/components/bp/BPTopBar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { readStreakCache, writeStreakCache } from '@/lib/api/streakCache';
import { ApiCourse, ApiModule, StreakDay } from '@/types/api';
import s from './page.module.css';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Доброе утро';
  if (hour >= 12 && hour < 17) return 'Добрый день';
  if (hour >= 17 && hour < 22) return 'Добрый вечер';
  return 'Доброй ночи';
}

function pickActiveModule(modules: ApiModule[]): ApiModule | null {
  const inProgress = modules.find(
    (m) => m.completedLessons > 0 && m.completedLessons < m.totalLessons,
  );
  if (inProgress) return inProgress;
  return modules.find((m) => m.completedLessons < m.totalLessons) ?? null;
}

interface HomeState {
  course: ApiCourse | null;
  loading: boolean;
  streakDays: number;
  currentWeek: StreakDay[];
}

type HomeAction =
  | { type: 'course_loaded'; course: ApiCourse | null }
  | { type: 'streak_loaded'; streakDays: number; currentWeek: StreakDay[] }
  | { type: 'done' };

function reducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'course_loaded':
      return { ...state, course: action.course };
    case 'streak_loaded':
      return { ...state, streakDays: action.streakDays, currentWeek: action.currentWeek };
    case 'done':
      return { ...state, loading: false };
  }
}

const initial: HomeState = { course: null, loading: true, streakDays: 0, currentWeek: [] };

export default function HomeScreen() {
  const { user, withAuth, callMaybeAuthed } = useAuth();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await callMaybeAuthed(() => api.courses.getList());
        if (!cancelled) {
          const found = data.courses.find((c) => c.id === 1) ?? data.courses[0] ?? null;
          dispatch({ type: 'course_loaded', course: found });
        }
      } catch {
        // silently fail
      }

      try {
        const cached = await readStreakCache();
        if (!cancelled && cached) {
          dispatch({ type: 'streak_loaded', streakDays: cached.streakDays, currentWeek: cached.currentWeek });
        }
        if (!user || user.isGuest) return;
        const fresh = await withAuth(() => api.streak.get()).catch(() => null);
        if (!cancelled && fresh) {
          dispatch({ type: 'streak_loaded', streakDays: fresh.streakDays, currentWeek: fresh.currentWeek });
          await writeStreakCache(fresh);
        }
      } catch {
        // keep cached/zero state silently
      }

      if (!cancelled) dispatch({ type: 'done' });
    }

    load();
    return () => { cancelled = true; };
  }, [callMaybeAuthed, user, withAuth]);

  const { course, loading, streakDays, currentWeek } = state;

  if (loading) {
    return (
      <div className={s.safe}>
        <div className={s.loadingWrap}>
          <div className={s.spinner} />
        </div>
      </div>
    );
  }

  const modules: ApiModule[] = course
    ? [...course.modules].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const shelfModules = modules.filter((m) => !m.isOwned);
  const hasProgress = !!course && course.completedLessons > 0;
  const activeModule = hasProgress ? pickActiveModule(modules) : null;
  const isRegistered = !!user && !user.isGuest;
  const isAuthed = !!user && !user.isGuest;

  return (
    <div className={s.safe}>
      <div className={s.scroll}>
        <BPTopBar
          showLogo
          streak={isAuthed ? streakDays : undefined}
          onStreakPress={() => router.push('/streak')}
        />

        {isRegistered && (
          <div className={s.greetingBlock}>
            <p className={s.greetingSub}>{getGreeting()},</p>
            <p className={s.greetingName}>{user.username}</p>
          </div>
        )}

        {activeModule
          ? <BPContinueModuleCard module={activeModule} />
          : modules[0] && <BPRecommendedModuleCard module={modules[0]} />}

        <BPThoughtCard />

        {isAuthed && (
          <BPStreakCard streakDays={streakDays} currentWeek={currentWeek} />
        )}

        <BPModulesShelf modules={shelfModules} />

        <BPBundlesCTA className={s.bundlesCta} />
      </div>
    </div>
  );
}
