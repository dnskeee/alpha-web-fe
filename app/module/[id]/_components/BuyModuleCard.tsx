'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { BPCard } from '@/components/bp/BPCard';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { TagBadge } from '@/components/ui/TagBadge';
import { ApiModuleDetail } from '@/types/api';
import s from './BuyModuleCard.module.css';

interface BuyModuleCardProps {
  module: ApiModuleDetail;
  onBuy: () => void;
  buyBusy: boolean;
  mustRegister: boolean;
}

export function BuyModuleCard({ module, onBuy, buyBusy, mustRegister }: BuyModuleCardProps) {
  const router = useRouter();

  return (
    <BPCard radius={22} padding={18} className={s.card}>
      {module.discountPercent && module.discountPercent > 0 ? (
        <div className={s.discountRow}>
          <span className={s.originalPrice}>
            {module.priceRub.toLocaleString('ru-RU')} ₽
          </span>
          <TagBadge variant="danger" label={`-${module.discountPercent}%`} />
        </div>
      ) : null}
      <div className={s.priceRow}>
        <span className={s.effectivePrice}>
          {module.effectivePriceRub.toLocaleString('ru-RU')} ₽
        </span>
        <span className={s.accessLabel}>доступ навсегда</span>
      </div>
      <BPPillButton
        label={buyBusy ? 'Загрузка...' : 'Купить тему →'}
        size="block"
        variant="primary"
        onClick={mustRegister ? () => router.push('/register') : onBuy}
        disabled={!mustRegister && buyBusy}
      />
      {mustRegister && (
        <p className={s.registerHint}>Для покупки нужен аккаунт</p>
      )}
    </BPCard>
  );
}
