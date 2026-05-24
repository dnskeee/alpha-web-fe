import { BPTabBar } from '@/components/bp/BPTabBar';
import s from './layout.module.css';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.shell}>
      <div className={s.content}>{children}</div>
      <BPTabBar />
    </div>
  );
}
