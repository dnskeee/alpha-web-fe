'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { useAuth } from '@/contexts/AuthContext';
import { MobileOnlyHeader } from '@/components/frame/MobileOnlyHeader';
import s from './page.module.css';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoCapitalize?: string;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
}

function Field({ label, value, onChange, placeholder, type = 'text', autoCapitalize, autoComplete, onKeyDown, error }: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={s.fieldWrap}>
      <BPSoftCard
        radius={14}
        padding={0}
        className={[s.fieldCard, error ? s.fieldError : focused ? s.fieldFocused : ''].filter(Boolean).join(' ')}
      >
        <div className={s.fieldInner}>
          <div className={s.fieldContent}>
            <span className={s.fieldLabel}>{label}</span>
            <input
              className={s.fieldInput}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              type={type}
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              autoCorrect="off"
              spellCheck={false}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      </BPSoftCard>
      {error ? <span className={s.fieldErrorMsg}>{error}</span> : null}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return;
    if (busy) return;
    setBusy(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSubmit();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
  }

  if (sent) {
    return (
      <main className={s.screen}>
        <MobileOnlyHeader />
        <div className={s.scroll}>
          <h1 className={s.title}>Проверьте почту</h1>
          <p className={s.subtitle}>Если этот email зарегистрирован, вы получите код для сброса пароля.</p>
          <BPPillButton
            label="Ввести код →"
            size="block"
            onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`)}
          />
          <div className={s.switchRow}>
            <button type="button" className={s.backLink} onClick={() => router.replace('/login')}>
              ← Вернуться к входу
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={s.screen}>
      <MobileOnlyHeader />
      <div className={s.scroll}>
        <h1 className={s.title}>Забыли пароль?</h1>
        <p className={s.subtitle}>Мы отправим код для сброса пароля на ваш email.</p>

        <form className={s.form} onSubmit={onSubmit} noValidate>
          <Field
            label="EMAIL"
            value={email}
            onChange={setEmail}
            placeholder="Введите email"
            type="email"
            autoCapitalize="off"
            autoComplete="email"
            onKeyDown={onKeyDown}
          />

          <BPPillButton
            label={busy ? 'Отправляем…' : 'Отправить код →'}
            size="block"
            disabled={busy || !email.trim()}
            onClick={handleSubmit}
          />

          <div className={s.switchRow}>
            <button type="button" className={s.backLink} onClick={() => router.replace('/login')}>
              ← Вернуться к входу
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
