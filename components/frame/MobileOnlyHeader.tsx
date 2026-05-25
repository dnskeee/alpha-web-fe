'use client';

import { useRouter } from 'next/navigation';
import { BPPageHeader } from '@/components/bp/BPPageHeader';
import s from './MobileOnlyHeader.module.css';

export function MobileOnlyHeader() {
  const router = useRouter();
  return (
    <div className={s.wrap}>
      <BPPageHeader onBack={() => router.back()} />
    </div>
  );
}
