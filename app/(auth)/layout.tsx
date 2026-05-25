import type { ReactNode } from 'react';
import { BPAppBar } from '@/components/bp/BPAppBar';
import { PageContainer } from '@/components/frame/PageContainer';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BPAppBar />
      <PageContainer variant="auth">{children}</PageContainer>
    </>
  );
}
