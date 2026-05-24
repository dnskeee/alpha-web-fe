'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BPPageHeader } from '@/components/bp/BPPageHeader';
import { BPCard } from '@/components/bp/BPCard';
import { BPSectionTitle } from '@/components/bp/BPSectionTitle';
import { ForwardIcon } from '@/components/icons/ForwardIcon';
import { ClockIcon } from '@/components/icons/ClockIcon';
import { SunIcon } from '@/components/icons/SunIcon';
import { ProfileIcon } from '@/components/icons/ProfileIcon';
import { useTheme } from '@/contexts/ThemeContext';
import { useSpeaker } from '@/contexts/SpeakerContext';
import { SPEAKERS } from '@/constants/speakers';
import { readTimezoneOffset } from '@/lib/api/streakCache';
import { getDeviceTimezoneOffset } from '@/lib/api/timezone';
import { useAuth } from '@/contexts/AuthContext';
import s from './page.module.css';

interface RowProps {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  onClick?: () => void;
  right?: React.ReactNode | null;
  labelClassName?: string;
}

function Row({ icon, label, hint, onClick, right, labelClassName }: RowProps) {
  const trailing = right === undefined ? <ForwardIcon size={16} color="var(--color-muted)" /> : right;
  return (
    <button type="button" onClick={onClick} className={s.row}>
      {icon ? <span className={s.rowIcon}>{icon}</span> : null}
      <span className={s.rowBody}>
        <span className={labelClassName ?? s.rowLabel}>{label}</span>
        {hint ? <span className={s.rowHint}>{hint}</span> : null}
      </span>
      {trailing}
    </button>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  const arr = React.Children.toArray(children);
  return (
    <BPCard padding={0} radius={18} className={s.group}>
      {arr.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < arr.length - 1 && <div className={s.divider} />}
        </React.Fragment>
      ))}
    </BPCard>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { pref, setPref } = useTheme();
  const { speakerId } = useSpeaker();
  const { user, logout } = useAuth();

  const isDark = pref === 'dark';

  const [currentOffset, setCurrentOffset] = useState<string>(getDeviceTimezoneOffset());

  useEffect(() => {
    readTimezoneOffset().then((stored) => {
      if (stored) setCurrentOffset(stored);
    });
  }, []);

  const activeSpeakerName = SPEAKERS.find((s) => s.id === speakerId)?.name ?? '—';

  function handleLogout() {
    logout().then(() => router.replace('/login'));
  }

  return (
    <div className={s.safe}>
      <BPPageHeader onBack={() => router.back()} />
      <div className={s.scroll}>
        <div className={s.titleBlock}>
          <h1 className={s.title}>Настройки</h1>
        </div>

        <BPSectionTitle title="Внешний вид" className={s.sectionTitle} />
        <Group>
          <Row
            icon={<SunIcon size={18} color="var(--color-ink)" />}
            label={isDark ? 'Тёмная тема' : 'Светлая тема'}
            right={
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                onClick={() => setPref(isDark ? 'light' : 'dark')}
                className={s.toggle}
                data-on={isDark ? 'true' : 'false'}
              >
                <span className={s.toggleThumb} />
              </button>
            }
          />
        </Group>

        <BPSectionTitle title="Аккаунт" className={s.sectionTitle} />

        {!user || user.isGuest ? (
          <BPCard padding={16} radius={18} className={s.guestCard}>
            <p className={s.guestText}>
              Вы в гостевом режиме. Создайте аккаунт, чтобы сохранить прогресс.
            </p>
            <button
              type="button"
              className={s.guestPrimary}
              onClick={() => router.push('/register')}
            >
              Создать аккаунт
            </button>
            <button
              type="button"
              className={s.guestSecondary}
              onClick={() => router.push('/login')}
            >
              Войти
            </button>
          </BPCard>
        ) : (
          <Group>
            <Row label="Выйти" right={null} labelClassName={s.rowLabelDanger} onClick={handleLogout} />
          </Group>
        )}

        <Group>
          <Row
            icon={<ClockIcon size={18} color="var(--color-ink)" />}
            label="Часовой пояс"
            hint={`UTC ${currentOffset}`}
            onClick={() => router.push('/select-timezone')}
          />
          <Row
            icon={<ProfileIcon size={18} color="var(--color-ink)" />}
            label="Персонаж"
            hint={activeSpeakerName}
            onClick={() => router.push('/select-speaker')}
          />
        </Group>
      </div>
    </div>
  );
}
