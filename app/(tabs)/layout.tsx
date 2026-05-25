import { BPTabBar } from '@/components/bp/BPTabBar';
import { BPAppBar } from '@/components/bp/BPAppBar';
import s from './layout.module.css';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.shell}>
      <BPAppBar />
      <div className={s.content}>{children}</div>
      <BPTabBar />
    </div>
  );
}
