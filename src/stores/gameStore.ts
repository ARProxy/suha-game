// src/stores/gameStore.ts

import { create } from 'zustand';
import { GameState, JudgementResult, Level } from '@/types/game.types';

interface GameStore extends GameState {
    currentLevel: Level | null;

    // Actions
    setStatus: (status: GameState['status']) => void;
    setCurrentLevel: (level: Level) => void;
    incrementScore: (points: number) => void;
    incrementCombo: () => void;
    resetCombo: () => void;
    setJudgement: (result: JudgementResult) => void;
    nextSign: () => void;
    decrementTime: () => void;
    resetGame: () => void;
    startGame: (level: Level) => void;
}

const initialState: GameState = {
    status: 'idle',
    currentSignIndex: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    timeRemaining: 0,
    totalTime: 0,
    judgementResult: null,
    difficulty: 'normal',
};

export const useGameStore = create<GameStore>((set, get) => ({
    ...initialState,
    currentLevel: null,

    setStatus: (status) => set({ status }),

    setCurrentLevel: (level) => set({ currentLevel: level }),

    incrementScore: (points) => set((state) => ({
        score: state.score + points,
    })),

    incrementCombo: () => set((state) => {
        const newCombo = state.combo + 1;
        return {
            combo: newCombo,
            maxCombo: Math.max(state.maxCombo, newCombo),
        };
    }),

    resetCombo: () => set({ combo: 0 }),

    setJudgement: (result) => set({ judgementResult: result }),

    nextSign: () => set((state) => ({
        currentSignIndex: state.currentSignIndex + 1,
        judgementResult: null,
    })),

    decrementTime: () => set((state) => {
        const newTime = Math.max(0, state.timeRemaining - 1);
        if (newTime === 0 && state.status === 'playing') {
            return { timeRemaining: 0, status: 'finished' };
        }
        return { timeRemaining: newTime };
    }),

    resetGame: () => set({
        ...initialState,
        currentLevel: get().currentLevel,
    }),

    startGame: (level) => set({
        ...initialState,
        currentLevel: level,
        status: 'countdown',
        totalTime: level.duration,
        timeRemaining: level.duration,
    }),
}));