'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { BPCard } from '@/components/bp/BPCard';
import { SettingsIcon } from '@/components/icons/SettingsIcon';
import { ForwardIcon } from '@/components/icons/ForwardIcon';
import { useAuth } from '@/contexts/AuthContext';
import s from './page.module.css';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className={s.safe}>
      <div className={s.container}>
        <p className={s.screenLabel}>Профиль</p>

        {(!user || user.isGuest) ? (
          <BPCard padding={16} radius={18}>
            <p className={s.guestMessage}>
              Создайте аккаунт, чтобы сохранить прогресс.
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
          <div className={s.avatarSection}>
            <div className={s.avatar}>
              <span className={s.avatarLetter}>
                {user.username[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <p className={s.username}>{user.username}</p>
            <p className={s.userId}>ID {user.userId}</p>
          </div>
        )}

        <div className={s.spacer} />

        <button
          type="button"
          className={s.settingRow}
          onClick={() => router.push('/settings')}
        >
          <span className={s.settingLeft}>
            <SettingsIcon color="var(--color-muted)" size={20} />
            <span className={s.settingLabel}>Настройки</span>
          </span>
          <ForwardIcon size={14} color="var(--color-muted)" />
        </button>

        <div className={s.gap} />

        {user && !user.isGuest && (
          <button
            type="button"
            className={s.logoutButton}
            onClick={logout}
          >
            Выйти из аккаунта
          </button>
        )}
      </div>
    </div>
  );
}
