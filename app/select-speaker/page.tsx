'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { BPAppBar } from '@/components/bp/BPAppBar';
import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { AccountShell } from '@/components/frame/AccountShell';
import { MobileOnlyHeader } from '@/components/frame/MobileOnlyHeader';
import { SpeakerSpriteAvatar } from '@/components/bp/SpeakerSpriteAvatar';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { SPEAKERS } from '@/constants/speakers';
import { useSpeaker } from '@/contexts/SpeakerContext';
import s from './page.module.css';

export default function SelectSpeakerPage() {
  const router = useRouter();
  const { speakerId, setSpeaker } = useSpeaker();

  return (
    <>
      <BPAppBar />
      <AccountShell>
        <div className={s.safe}>
          <MobileOnlyHeader />
          <div className={s.scroll}>
            <div className={s.titleBlock}>
              <h1 className={s.title}>Персонаж</h1>
            </div>

            {SPEAKERS.map((speaker) => {
              const selected = speaker.id === speakerId;
              return (
                <button
                  key={speaker.id}
                  type="button"
                  className={s.speakerBtn}
                  onClick={() => {
                    setSpeaker(speaker.id);
                    router.back();
                  }}
                >
                  <BPSoftCard className={s.speakerCard}>
                    <SpeakerSpriteAvatar asset={speaker.asset} size={44} />
                    <span className={s.speakerName}>{speaker.name}</span>
                    {selected && <CheckIcon size={20} color="var(--color-accent)" />}
                  </BPSoftCard>
                </button>
              );
            })}
          </div>
        </div>
      </AccountShell>
    </>
  );
}
