import {
  ApiLessonDetail, ApiModuleDetail, ApiProgress, ActivityResponse, CoursesListResponse,
  StreakResponse, BundleListItem, PaymentInitiation, PaymentPreview, PaymentStatusInfo,
} from '@/types/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface AuthUser {
  userId: number;
  username: string;
  email: string | null;
  isEmailVerified: boolean;
  isGuest: boolean;
}

async function call<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new ApiError(res.status, data.error || `Request error: ${res.status}`);
  return data as T;
}

const post = <T>(endpoint: string, body?: object) =>
  call<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : '{}' });
const get = <T>(endpoint: string) => call<T>(endpoint, { method: 'GET' });

export const api = {
  auth: {
    register: (username: string, email: string, password: string) =>
      post<AuthUser>('/api/auth/register', { username, email, password }),
    login: (usernameOrEmail: string, password: string) =>
      post<AuthUser>('/api/auth/login', { usernameOrEmail, password }),
    guest: () => post<AuthUser>('/api/auth/guest'),
    logout: () => post<{ ok: true }>('/api/auth/logout'),
    me: () => get<AuthUser>('/api/auth/me'),
    sendVerification: () => post<void>('/api/auth/email/send-verification'),
    verifyEmail: (code: string) => post<void>('/api/auth/verify-email', { code }),
    forgotPassword: (email: string) => post<void>('/api/auth/forgot-password', { email }),
    resetPassword: (email: string, code: string, newPassword: string) =>
      post<void>('/api/auth/reset-password', { email, code, newPassword }),
  },
  users: {
    me: () => get<AuthUser>('/api/users/me'),
  },
  courses: {
    getList: () => post<CoursesListResponse>('/api/courses/get-list'),
  },
  modules: {
    getInfo: (id: number) => post<ApiModuleDetail>('/api/modules/get-info', { id }),
  },
  bundles: {
    getList: () => post<{ items: BundleListItem[] }>('/api/bundles/get-list'),
    getInfo: (id: number) => post<BundleListItem>('/api/bundles/get-info', { id }),
  },
  yookassaPayments: {
    preview: (kind: 'module' | 'bundle', id: number) =>
      post<PaymentPreview>('/api/yookassa-payments/preview', { kind, id }),
    initiate: (kind: 'module' | 'bundle', id: number) =>
      post<PaymentInitiation>('/api/yookassa-payments/initiate', { kind, id }),
    getStatus: (paymentId: number) =>
      post<PaymentStatusInfo>('/api/yookassa-payments/get-status', { paymentId }),
  },
  lessons: {
    getInfo: (id: number) => post<ApiLessonDetail>('/api/lessons/get-info', { id }),
  },
  progress: {
    upsert: (lessonId: number, status: 'Active' | 'Done', body: unknown) =>
      post<ApiProgress>('/api/progress/upsert', { lessonId, status, body }),
  },
  streak: {
    get: () => get<StreakResponse>('/api/users/streak'),
    getActivity: (from: string, to: string) =>
      post<ActivityResponse>('/api/users/activity', { from, to }),
    updateTimezone: (timezoneOffset: string) =>
      post<void>('/api/users/timezone/update', { timezoneOffset }),
  },
};
