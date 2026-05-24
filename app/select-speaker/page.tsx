'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { BPPageHeader } from '@/components/bp/BPPageHeader';
import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { SpeakerSpriteAvatar } from '@/components/bp/SpeakerSpriteAvatar';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { SPEAKERS } from '@/constants/speakers';
import { useSpeaker } from '@/contexts/SpeakerContext';
import s from './page.module.css';

export default function SelectSpeakerPage() {
  const router = useRouter();
  const { speakerId, setSpeaker } = useSpeaker();

  return (
    <div className={s.safe}>
      <BPPageHeader onBack={() => router.back()} />

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
                <SpeakerSpriteAvatar size={44} />
                <span className={s.speakerName}>{speaker.name}</span>
                {selected && <CheckIcon size={20} color="var(--color-accent)" />}
              </BPSoftCard>
            </button>
          );
        })}
      </div>
    </div>
  );
}
