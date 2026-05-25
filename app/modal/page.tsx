'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { BPAppBar } from '@/components/bp/BPAppBar';
import { BPCard } from '@/components/bp/BPCard';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { PageContainer } from '@/components/frame/PageContainer';
import s from './page.module.css';

export default function ModalPage() {
  const router = useRouter();

  return (
    <>
      <BPAppBar />
      <PageContainer variant="detail">
        <div className={s.overlay}>
          <BPCard padding={22} radius={22} className={s.card}>
            <h2 className={s.title}>Модальное окно</h2>
            <p className={s.body}>
              Здесь будет содержимое модального окна. Замените актуальным контентом.
            </p>
            <div className={s.actions}>
              <BPPillButton label="Отмена" variant="secondary" onClick={() => router.back()} />
              <BPPillButton label="OK" onClick={() => router.back()} />
            </div>
          </BPCard>
        </div>
      </PageContainer>
    </>
  );
}
