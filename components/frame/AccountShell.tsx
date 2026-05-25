'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ProfileIcon } from '@/components/icons/ProfileIcon';
import { SettingsIcon } from '@/components/icons/SettingsIcon';
import s from './AccountShell.module.css';

const isProfile = (p: string) => p.startsWith('/profile');
const isSettings = (p: string) =>
  p.startsWith('/settings') ||
  p.startsWith('/select-speaker') ||
  p.startsWith('/select-timezone');

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const profileActive = isProfile(pathname);
  const settingsActive = isSettings(pathname);

  return (
    <div className={s.wrap}>
      <aside className={s.sidebar}>
        <Link href="/profile" className={profileActive ? s.linkActive : s.link}>
          <ProfileIcon size={18} color={profileActive ? 'var(--color-ink)' : 'var(--color-muted)'} />
          <span>Профиль</span>
        </Link>
        <Link href="/settings" className={settingsActive ? s.linkActive : s.link}>
          <SettingsIcon size={18} color={settingsActive ? 'var(--color-ink)' : 'var(--color-muted)'} />
          <span>Настройки</span>
        </Link>
      </aside>
      <div className={s.main}>{children}</div>
    </div>
  );
}
