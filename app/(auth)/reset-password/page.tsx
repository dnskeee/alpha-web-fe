'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BPPageHeader } from '@/components/bp/BPPageHeader';
import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { useAuth } from '@/contexts/AuthContext';
import s from './page.module.css';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoCapitalize?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  isPassword?: boolean;
}

function Field({ label, value, onChange, placeholder, type = 'text', autoCapitalize, autoComplete, inputMode, maxLength, onKeyDown, error, isPassword }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

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
              type={isPassword && !show ? 'password' : type}
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              inputMode={inputMode}
              maxLength={maxLength}
              autoCorrect="off"
              spellCheck={false}
              onKeyDown={onKeyDown}
            />
          </div>
          {isPassword ? (
            <button
              type="button"
              className={s.eyeBtn}
              onClick={() => setShow(prev => !prev)}
              tabIndex={-1}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show
                ? <EyeOffIcon size={18} color="var(--color-muted)" />
                : <EyeIcon size={18} color="var(--color-muted)" />
              }
            </button>
          ) : null}
        </div>
      </BPSoftCard>
      {error ? <span className={s.fieldErrorMsg}>{error}</span> : null}
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { resetPassword } = useAuth();

  const email = params.get('email') ?? '';
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleReset() {
    if (!email) {
      setError('Недостаточно данных. Вернитесь и попробуйте снова.');
      return;
    }
    if (code.trim().length !== 6) {
      setError('Введите 6-значный код');
      return;
    }
    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      await resetPassword(email, code.trim(), newPassword);
      router.replace('/');
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'PASSWORD_RESET_LOGIN_FAILED') {
        setError('Пароль сброшен, но автовход не удался. Войдите вручную.');
        router.replace('/login');
        return;
      }
      setError(e instanceof Error ? e.message : 'Неверный или просроченный код');
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleReset();
  }

  function onConfirmKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleReset();
  }

  return (
    <main className={s.screen}>
      <BPPageHeader onBack={() => router.back()} />
      <div className={s.scroll}>
        <h1 className={s.title}>Новый пароль</h1>
        <p className={s.subtitle}>Введите код из письма и придумайте новый пароль.</p>

        <form className={s.form} onSubmit={onSubmit} noValidate>
          <Field
            label="КОД"
            value={code}
            onChange={setCode}
            placeholder="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            error={error && code.trim().length !== 6 ? error : undefined}
          />
          <Field
            label="НОВЫЙ ПАРОЛЬ"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Минимум 6 символов"
            isPassword
            autoComplete="new-password"
            error={error && newPassword.length < 6 ? error : undefined}
          />
          <Field
            label="ПОВТОРИТЕ ПАРОЛЬ"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Повторите пароль"
            isPassword
            autoComplete="new-password"
            onKeyDown={onConfirmKeyDown}
            error={error && newPassword.length >= 6 && newPassword !== confirmPassword ? error : undefined}
          />

          {error && code.trim().length === 6 && newPassword.length >= 6 && newPassword === confirmPassword ? (
            <p className={s.errorMsg}>{error}</p>
          ) : null}

          <BPPillButton
            label={busy ? 'Обновляем…' : 'Обновить пароль →'}
            size="block"
            disabled={busy}
            onClick={handleReset}
          />
        </form>
      </div>
    </main>
  );
}
