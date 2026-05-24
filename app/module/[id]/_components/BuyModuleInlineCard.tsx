'use client';

import React from 'react';

import { BPPillButton } from '@/components/bp/BPPillButton';
import { LockIcon } from '@/components/icons/LockIcon';
import s from './BuyModuleInlineCard.module.css';

interface BuyModuleInlineCardProps {
  onPress: () => void;
  connector: boolean;
}

export function BuyModuleInlineCard({ onPress, connector }: BuyModuleInlineCardProps) {
  return (
    <div className={s.row}>
      <div className={s.nodeCol}>
        <div className={s.lockCircle}>
          <LockIcon size={14} color="var(--color-accent)" />
        </div>
        {connector && <div className={s.connector} />}
      </div>
      <button type="button" onClick={onPress} className={s.card}>
        <p className={s.cardText}>
          Купите тему для полного доступа ко всем урокам
        </p>
        <BPPillButton
          label="Перейти к покупке →"
          variant="accent"
          size="block"
          onClick={onPress}
        />
      </button>
    </div>
  );
}
