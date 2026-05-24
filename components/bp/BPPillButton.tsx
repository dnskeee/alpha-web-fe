import React from 'react';
import clsx from 'clsx';

import s from './BPPillButton.module.css';

interface Props {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'block';
  className?: string;
  disabled?: boolean;
}

export function BPPillButton({ label, onClick, variant = 'primary', size = 'small', className, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        s.btn,
        s[variant],
        size === 'block' && s.block,
        size === 'small' && s.small,
        className,
      )}
    >
      {label}
    </button>
  );
}
