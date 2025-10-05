// src/hooks/useAudio.ts

import { useRef, useCallback, useEffect } from 'react';

interface AudioOptions {
    volume?: number;
    loop?: boolean;
}

export const useAudio = () => {
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

    /**
     * 오디오 로드
     */
    const loadAudio = useCallback((id: string, src: string, options?: AudioOptions) => {
        if (audioRefs.current.has(id)) {
            return;
        }

        const audio = new Audio(src);
        audio.volume = options?.volume ?? 1.0;
        audio.loop = options?.loop ?? false;
        audioRefs.current.set(id, audio);
    }, []);

    /**
     * 오디오 재생
     */
    const play = useCallback(async (id: string) => {
        const audio = audioRefs.current.get(id);
        if (!audio) {
            console.warn(`Audio ${id} not found`);
            return;
        }

        try {
            audio.currentTime = 0;
            await audio.play();
        } catch (error) {
            console.error(`Failed to play audio ${id}:`, error);
        }
    }, []);

    /**
     * 오디오 정지
     */
    const stop = useCallback((id: string) => {
        const audio = audioRefs.current.get(id);
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
    }, []);

    /**
     * 오디오 일시정지
     */
    const pause = useCallback((id: string) => {
        const audio = audioRefs.current.get(id);
        if (!audio) return;

        audio.pause();
    }, []);

    /**
     * 볼륨 조절
     */
    const setVolume = useCallback((id: string, volume: number) => {
        const audio = audioRefs.current.get(id);
        if (!audio) return;

        audio.volume = Math.max(0, Math.min(1, volume));
    }, []);

    /**
     * 모든 오디오 정지
     */
    const stopAll = useCallback(() => {
        audioRefs.current.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }, []);

    /**
     * 클린업
     */
    useEffect(() => {
        return () => {
            audioRefs.current.forEach((audio) => {
                audio.pause();
                audio.src = '';
            });
            audioRefs.current.clear();
        };
    }, []);

    return {
        loadAudio,
        play,
        stop,
        pause,
        setVolume,
        stopAll,
    };
};

/**
 * 게임 효과음 프리셋
 */
export const useGameAudio = () => {
    const audio = useAudio();

    useEffect(() => {
        // 효과음 로드
        audio.loadAudio('perfect', '/audio/sfx/perfect.mp3', { volume: 0.7 });
        audio.loadAudio('miss', '/audio/sfx/miss.mp3', { volume: 0.5 });
        audio.loadAudio('bgm', '/audio/bgm/way-back-home.mp3', { volume: 0.3, loop: true });
    }, [audio]);

    return {
        playPerfect: () => audio.play('perfect'),
        playMiss: () => audio.play('miss'),
        playBGM: () => audio.play('bgm'),
        stopBGM: () => audio.stop('bgm'),
        pauseBGM: () => audio.pause('bgm'),
        setBGMVolume: (volume: number) => audio.setVolume('bgm', volume),
    };
}