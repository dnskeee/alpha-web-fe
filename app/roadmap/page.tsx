'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BPPageHeader } from '@/components/bp/BPPageHeader';
import { BPCard } from '@/components/bp/BPCard';
import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { BPSectionTitle } from '@/components/bp/BPSectionTitle';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { BPRoadmapNode } from '@/components/bp/BPRoadmapNode';
import { TagBadge } from '@/components/ui/TagBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useBuy } from '@/lib/hooks/useBuy';
import { api } from '@/lib/api';
import { BundleListItem } from '@/types/api';
import { themeWord } from '@/lib/utils/plural';
import s from './page.module.css';

function formatPrice(n: number): string {
  return n.toLocaleString('ru-RU') + ' ₽';
}

export default function RoadmapPage() {
  const router = useRouter();
  const { callMaybeAuthed, user } = useAuth();
  const mustRegister = !user || user.isGuest;
  const { buy, busy } = useBuy();
  const [bundles, setBundles] = useState<BundleListItem[]>([]);

  function loadBundles() {
    callMaybeAuthed(() => api.bundles.getList()).then((r) => setBundles(r.items)).catch(() => {});
  }

  useEffect(() => {
    loadBundles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleBundles = bundles.filter((b) => !b.effectivelyEmpty && !b.allOwned);

  return (
    <div className={s.safe}>
      <div className={s.scroll}>
        <BPPageHeader onBack={() => router.back()} />

        <div className={s.header}>
          <BPSectionTitle title="Пакеты курсов" />
          <h1 className={s.headline}>
            Выбери свой{'\n'}путь<span className={s.dot}>.</span>
          </h1>
        </div>

        <div className={s.list}>
          {visibleBundles.map((bundle) => {
            const hint = `${bundle.modules.length} ${themeWord(bundle.modules.length)} · доступ навсегда`;
            return (
              <BPCard key={bundle.id} padding={0} radius={26} className={s.bundleCard}>
                <div className={s.accentRail} />

                <div className={s.bundleHeader}>
                  <h2 className={s.bundleTitle}>{bundle.title}</h2>
                  <p className={s.bundleDesc}>{bundle.description}</p>
                </div>

                <div className={s.modulePath}>
                  {bundle.modules.map((mod, i) => {
                    const isLast = i === bundle.modules.length - 1;
                    return (
                      <div key={mod.id} className={s.moduleRow}>
                        <BPRoadmapNode number={i + 1} connector={!isLast} />
                        <div className={s.moduleCardWrap}>
                          <BPSoftCard radius={12} padding={10}>
                            <span
                              className={s.moduleTitle}
                              data-owned={mod.isOwned ? 'true' : 'false'}
                            >
                              {mod.title}
                            </span>
                          </BPSoftCard>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={s.bundleFooter}>
                  <div className={s.priceLine}>
                    {bundle.discountPercent > 0 && (
                      <>
                        <span className={s.originalPrice}>{formatPrice(bundle.originalPriceRub)}</span>
                        <TagBadge variant="danger" label={`−${bundle.discountPercent}%`} />
                      </>
                    )}
                  </div>
                  <div className={s.priceRow}>
                    <span className={s.effectivePrice}>{formatPrice(bundle.effectivePriceRub)}</span>
                    <span className={s.priceHint}>{hint}</span>
                  </div>
                  <BPPillButton
                    label={busy ? 'Загрузка...' : 'Купить пакет →'}
                    size="block"
                    variant="primary"
                    disabled={!mustRegister && busy}
                    onClick={
                      mustRegister
                        ? () => router.push('/register')
                        : () => buy('bundle', bundle.id, loadBundles)
                    }
                  />
                  {mustRegister && (
                    <p className={s.registerHint}>Для покупки нужен аккаунт</p>
                  )}
                </div>
              </BPCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
