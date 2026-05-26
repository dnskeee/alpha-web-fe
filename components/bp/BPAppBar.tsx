'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogoIcon } from '@/components/icons/LogoIcon';
import { ProfileIcon } from '@/components/icons/ProfileIcon';
import s from './BPAppBar.module.css';

const MAIN_NAV = [
  { href: '/', label: 'Главная', match: (p: string) => p === '/' },
  { href: '/modules', label: 'Темы', match: (p: string) => p.startsWith('/modules') },
  { href: '/roadmap', label: 'Пакеты курсов', match: (p: string) => p.startsWith('/roadmap') },
] as const;

const PROFILE_HREF = '/profile';
const isProfileActive = (p: string) => p.startsWith('/profile');

interface Props {
  mode?: 'full' | 'minimal';
}

export function BPAppBar({ mode = 'full' }: Props) {
  const pathname = usePathname();

  return (
    <header className={s.bar}>
      <div className={s.barInner}>
        <Link href="/" className={s.brand}>
          <LogoIcon background="var(--color-ink)" foreground="var(--color-bg-dark)" size={28} />
          <span className={s.brandText}>BePrime</span>
        </Link>

        {mode === 'full' && (
          <nav className={s.nav}>
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.match(pathname) ? s.linkActive : s.link}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className={s.right}>
          {mode === 'full' && (
            <Link
              href={PROFILE_HREF}
              className={isProfileActive(pathname) ? s.profileLinkActive : s.profileLink}
            >
              <ProfileIcon
                size={18}
                color={isProfileActive(pathname) ? 'var(--color-ink)' : 'var(--color-muted)'}
              />
              <span>Профиль</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
