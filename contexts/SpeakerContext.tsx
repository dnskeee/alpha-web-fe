'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_SPEAKER_ID, SPEAKERS, SpeakerId } from '@/constants/speakers';

const SPEAKER_KEY = 'app_speaker_id';

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
};

interface SpeakerContextType {
  speakerId: SpeakerId;
  setSpeaker: (id: SpeakerId) => void;
}

const SpeakerContext = createContext<SpeakerContextType | null>(null);

export function SpeakerProvider({ children }: { children: React.ReactNode }) {
  const [speakerId, setSpeakerId] = useState<SpeakerId>(DEFAULT_SPEAKER_ID);

  useEffect(() => {
    storage.getItem(SPEAKER_KEY).then((val) => {
      if (SPEAKERS.some((s) => s.id === val)) {
        setSpeakerId(val as SpeakerId);
      }
    });
  }, []);

  function setSpeaker(id: SpeakerId) {
    setSpeakerId(id);
    storage.setItem(SPEAKER_KEY, id);
  }

  return (
    <SpeakerContext.Provider value={{ speakerId, setSpeaker }}>
      {children}
    </SpeakerContext.Provider>
  );
}

export function useSpeaker(): SpeakerContextType {
  const ctx = useContext(SpeakerContext);
  if (!ctx) throw new Error('useSpeaker must be used within SpeakerProvider');
  return ctx;
}
