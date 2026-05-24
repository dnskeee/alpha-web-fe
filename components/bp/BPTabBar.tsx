'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { HomeIcon } from '@/components/icons/HomeIcon';
import { ModulesIcon } from '@/components/icons/ModulesIcon';
import { ProfileIcon } from '@/components/icons/ProfileIcon';
import s from './BPTabBar.module.css';

const TABS = [
  { href: '/', label: 'Главная', Icon: HomeIcon, match: (p: string) => p === '/' },
  { href: '/modules', label: 'Темы', Icon: ModulesIcon, match: (p: string) => p.startsWith('/modules') },
  { href: '/profile', label: 'Профиль', Icon: ProfileIcon, match: (p: string) => p.startsWith('/profile') },
] as const;

export function BPTabBar() {
  const pathname = usePathname();
  return (
    <nav className={s.bar}>
      {TABS.map((t) => {
        const active = t.match(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={active ? s.itemActive : s.item}
          >
            <div className={active ? s.iconWrapActive : s.iconWrap}>
              <t.Icon
                size={14}
                color={active ? 'var(--color-accent-ink)' : 'var(--color-muted)'}
              />
            </div>
            <span className={s.label}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
