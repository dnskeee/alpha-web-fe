import type { ReactNode } from 'react';
import clsx from 'clsx';
import s from './PageContainer.module.css';

type Variant = 'tabs' | 'detail' | 'reader' | 'auth';

interface Props {
  variant: Variant;
  children: ReactNode;
  className?: string;
}

export function PageContainer({ variant, children, className }: Props) {
  return (
    <div className={clsx(s.container, s[variant], className)}>
      {children}
    </div>
  );
}
