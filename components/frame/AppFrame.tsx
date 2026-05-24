import type { ReactNode } from 'react';
import s from './AppFrame.module.css';

export function AppFrame({ children }: { children: ReactNode }) {
  return <div className={s.frame}>{children}</div>;
}
