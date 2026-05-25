'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { useAuth } from '@/contexts/AuthContext';
import { MobileOnlyHeader } from '@/components/frame/MobileOnlyHeader';
import s from './page.module.css';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, verifyEmail, resendVerification } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (user?.isGuest) router.replace('/');
  }, [user, router]);

  const focusedIndex = focused ? Math.min(code.length, 5) : -1;

  async function handleVerify(value?: string) {
    const v = (value ?? code).trim();
    if (v.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      await verifyEmail(v);
      router.replace('/');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Неверный или просроченный код');
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    if (resending) return;
    setError('');
    setSuccess('');
    setResending(true);
    try {
      await resendVerification();
      setSuccess('Новый код отправлен на ваш email');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Не удалось отправить код');
    } finally {
      setResending(false);
    }
  }

  function onChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
    if (error) setError('');
    if (digits.length === 6) {
      handleVerify(digits);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleVerify();
  }

  if (user?.isGuest) {
    return null;
  }

  const subtitle = user?.email
    ? `Мы отправили код на ${user.email}`
    : 'Мы отправили 6-значный код на ваш email. Код действителен 15 минут.';

  return (
    <main className={s.screen}>
      <MobileOnlyHeader />
      <div className={s.scroll}>
        <h1 className={s.title}>Подтвердите email</h1>
        <p className={s.subtitle}>{subtitle}</p>

        <form onSubmit={onSubmit} noValidate>
          <input
            ref={inputRef}
            value={code}
            onChange={onChangeCode}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            className={s.hiddenInput}
            aria-label="Код подтверждения"
          />

          <div className={s.cells} onClick={() => inputRef.current?.focus()}>
            {Array.from({ length: 6 }).map((_, i) => (
              <BPSoftCard
                key={i}
                radius={12}
                padding={0}
                className={[
                  s.cell,
                  error ? s.cellError : focusedIndex === i ? s.cellFocused : '',
                ].filter(Boolean).join(' ')}
              >
                <span className={s.cellText}>{code[i] ?? ''}</span>
              </BPSoftCard>
            ))}
          </div>

          {error ? <p className={s.errorMsg}>{error}</p> : null}
          {success ? <p className={s.successMsg}>{success}</p> : null}

          <BPPillButton
            label={busy ? 'Проверяем…' : 'Подтвердить →'}
            size="block"
            disabled={busy}
            onClick={() => handleVerify()}
          />
        </form>

        <div className={s.resendRow}>
          {resending ? (
            <span className={s.resendingText}>Отправляем…</span>
          ) : (
            <button
              type="button"
              className={s.resendBtn}
              onClick={handleResend}
              disabled={resending}
            >
              Отправить код повторно
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
