'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type Kind = 'module' | 'bundle';

export function useBuy() {
  const { withAuth } = useAuth();
  const [busy, setBusy] = useState(false);

  const buy = useCallback(
    async (kind: Kind, id: number, onSuccess: () => void) => {
      if (busy) return;
      setBusy(true);
      try {
        let preview;
        try {
          preview = await withAuth(() => api.yookassaPayments.preview(kind, id));
        } catch {
          alert('Ошибка\n\nНе удалось получить цену.');
          return;
        }

        if (preview.alreadyOwned) {
          alert('Уже куплено\n\nВы уже владеете этим контентом.');
          return;
        }

        const confirmed = window.confirm(
          `Подтвердите покупку\n\nБудет начислен платёж ${preview.amountRub} ₽\n\nВы получите доступ к ${preview.grantedModules.length} модулям.`,
        );
        if (!confirmed) return;

        let init;
        try {
          init = await withAuth(() => api.yookassaPayments.initiate(kind, id));
        } catch {
          alert('Ошибка\n\nНе удалось создать платёж.');
          return;
        }

        if (init.alreadySucceeded) {
          onSuccess();
          return;
        }

        if (!init.redirectUrl) {
          alert('Ошибка\n\nНе удалось создать платёж.');
          return;
        }

        window.location.href = init.redirectUrl;
      } finally {
        setBusy(false);
      }
    },
    [busy, withAuth],
  );

  return { buy, busy };
}
