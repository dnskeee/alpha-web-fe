'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { BPPageHeader } from '@/components/bp/BPPageHeader';
import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';
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
  isPassword?: boolean;
}

function Field({ label, value, onChange, placeholder, type = 'text', autoCapitalize, autoComplete, onKeyDown, error, isPassword }: FieldProps) {
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

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, ensureGuest } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Заполните все поля');
      return;
    }
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      await login(usernameOrEmail.trim(), password);
      router.replace(params.get('next') ?? '/');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Неверный логин или пароль');
    } finally {
      setBusy(false);
    }
  }

  async function handleGuest() {
    if (busy) return;
    setBusy(true);
    try {
      await ensureGuest();
      router.replace(params.get('next') ?? '/');
    } catch {
      setError('Не удалось войти как гость. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleLogin();
  }

  function onPasswordKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <main className={s.screen}>
      <BPPageHeader onBack={() => router.back()} />
      <div className={s.scroll}>
        <h1 className={s.title}>Вход</h1>
        <p className={s.subtitle}>Войди, чтобы продолжить</p>

        <form className={s.form} onSubmit={onSubmit} noValidate>
          <Field
            label="EMAIL"
            value={usernameOrEmail}
            onChange={setUsernameOrEmail}
            placeholder="Логин или email"
            type="email"
            autoCapitalize="off"
            autoComplete="username"
            error={error && !usernameOrEmail.trim() ? error : undefined}
          />
          <Field
            label="ПАРОЛЬ"
            value={password}
            onChange={setPassword}
            placeholder="Введите пароль"
            isPassword
            autoComplete="current-password"
            onKeyDown={onPasswordKeyDown}
            error={error && !password.trim() ? error : undefined}
          />

          <div className={s.forgotRow}>
            <Link href="/forgot-password" className={s.forgotLink}>
              Забыли пароль?
            </Link>
          </div>

          {error && usernameOrEmail.trim() && password.trim() ? (
            <p className={s.errorMsg}>{error}</p>
          ) : null}

          <BPPillButton
            label={busy ? 'Входим…' : 'Войти →'}
            size="block"
            disabled={busy}
            onClick={handleLogin}
          />
        </form>

        <div className={s.switchRow}>
          <span className={s.switchText}>Нет аккаунта? </span>
          <Link href="/register" className={s.switchLink}>Зарегистрироваться</Link>
        </div>

        <div className={s.guestRow}>
          <button type="button" className={s.guestBtn} onClick={handleGuest} disabled={busy}>
            Продолжить без аккаунта
          </button>
        </div>
      </div>
    </main>
  );
}
