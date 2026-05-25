'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';
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

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleRegister() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Заполните все поля');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      await register(username.trim(), email.trim(), password);
      router.replace(params.get('next') ?? '/');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось создать аккаунт');
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleRegister();
  }

  function onPasswordKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleRegister();
  }

  return (
    <main className={s.screen}>
      <MobileOnlyHeader />
      <div className={s.scroll}>
        <h1 className={s.title}>Регистрация</h1>

        <form className={s.form} onSubmit={onSubmit} noValidate>
          <Field
            label="EMAIL"
            value={email}
            onChange={setEmail}
            placeholder="Введите email"
            type="email"
            autoCapitalize="off"
            autoComplete="email"
            error={error && !email.trim() ? error : undefined}
          />
          <Field
            label="ЛОГИН"
            value={username}
            onChange={setUsername}
            placeholder="Придумайте логин"
            autoCapitalize="off"
            autoComplete="username"
            error={error && !username.trim() ? error : undefined}
          />
          <Field
            label="ПАРОЛЬ"
            value={password}
            onChange={setPassword}
            placeholder="Минимум 6 символов"
            isPassword
            autoComplete="new-password"
            onKeyDown={onPasswordKeyDown}
            error={error && (!password.trim() || password.length < 6) ? error : undefined}
          />

          <div className={s.passwordHint}>
            <span className={s.passwordHintText}>Минимум 6 символов</span>
          </div>

          {error && username.trim() && email.trim() && password.length >= 6 ? (
            <p className={s.errorMsg}>{error}</p>
          ) : null}

          <BPPillButton
            label={busy ? 'Создаём…' : 'Создать аккаунт →'}
            size="block"
            disabled={busy}
            onClick={handleRegister}
          />
        </form>

        <div className={s.switchRow}>
          <span className={s.switchText}>Уже есть аккаунт? </span>
          <Link href="/login" className={s.switchLink}>Войти</Link>
        </div>
      </div>
    </main>
  );
}
