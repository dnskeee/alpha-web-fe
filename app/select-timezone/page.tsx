'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BPAppBar } from '@/components/bp/BPAppBar';
import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { AccountShell } from '@/components/frame/AccountShell';
import { MobileOnlyHeader } from '@/components/frame/MobileOnlyHeader';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { ClockIcon } from '@/components/icons/ClockIcon';
import { TIMEZONES } from '@/constants/timezones';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { readTimezoneOffset, writeTimezoneOffset } from '@/lib/api/streakCache';
import { getDeviceTimezoneOffset } from '@/lib/api/timezone';
import s from './page.module.css';

export default function SelectTimezonePage() {
  const router = useRouter();
  const { withAuth } = useAuth();

  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    readTimezoneOffset().then((stored) => {
      setSelected(stored ?? getDeviceTimezoneOffset());
    });
  }, []);

  function handleSelect(offset: string) {
    setSelected(offset);
    writeTimezoneOffset(offset).catch(() => {});
    withAuth(() => api.streak.updateTimezone(offset)).catch(() => {});
    router.back();
  }

  return (
    <>
      <BPAppBar />
      <AccountShell>
        <div className={s.safe}>
          <MobileOnlyHeader />
          <div className={s.titleBlock}>
            <h1 className={s.title}>Часовой пояс</h1>
          </div>

          <div className={s.scroll}>
            {TIMEZONES.map((tz) => {
              const isSelected = tz.offset === selected;
              return (
                <button
                  key={tz.offset}
                  type="button"
                  className={s.tzBtn}
                  onClick={() => handleSelect(tz.offset)}
                >
                  <BPSoftCard className={s.tzCard}>
                    <div className={s.tzIconWrap}>
                      <ClockIcon size={22} color="var(--color-accent)" />
                    </div>
                    <div className={s.tzText}>
                      <span className={s.tzLabel}>{tz.label}</span>
                      <span className={s.tzDisplay}>{tz.display}</span>
                    </div>
                    {isSelected && <CheckIcon size={20} color="var(--color-accent)" />}
                  </BPSoftCard>
                </button>
              );
            })}
          </div>
        </div>
      </AccountShell>
    </>
  );
}
