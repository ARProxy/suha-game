// src/stores/settingsStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Difficulty } from '@/types/game.types';

interface SettingsState {
    // 오디오 설정
    bgmVolume: number;
    sfxVolume: number;
    isMuted: boolean;

    // 게임 설정
    difficulty: Difficulty;
    showFPS: boolean;
    showLandmarkNumbers: boolean;

    // 카메라 설정
    mirrorCamera: boolean;
    cameraQuality: 'low' | 'medium' | 'high';

    // Actions
    setBGMVolume: (volume: number) => void;
    setSFXVolume: (volume: number) => void;
    toggleMute: () => void;
    setDifficulty: (difficulty: Difficulty) => void;
    toggleFPS: () => void;
    toggleLandmarkNumbers: () => void;
    toggleMirrorCamera: () => void;
    setCameraQuality: (quality: 'low' | 'medium' | 'high') => void;
    resetSettings: () => void;
}

const defaultSettings = {
    bgmVolume: 0.5,
    sfxVolume: 0.7,
    isMuted: false,
    difficulty: 'normal' as Difficulty,
    showFPS: false,
    showLandmarkNumbers: false,
    mirrorCamera: true,
    cameraQuality: 'medium' as const,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,

            setBGMVolume: (volume) => set({ bgmVolume: Math.max(0, Math.min(1, volume)) }),
            setSFXVolume: (volume) => set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
            setDifficulty: (difficulty) => set({ difficulty }),
            toggleFPS: () => set((state) => ({ showFPS: !state.showFPS })),
            toggleLandmarkNumbers: () =>
                set((state) => ({ showLandmarkNumbers: !state.showLandmarkNumbers })),
            toggleMirrorCamera: () =>
                set((state) => ({ mirrorCamera: !state.mirrorCamera })),
            setCameraQuality: (quality) => set({ cameraQuality: quality }),
            resetSettings: () => set(defaultSettings),
        }),
        {
            name: 'sign-game-settings',
        }
    )
);