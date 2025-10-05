// src/app/game/page.tsx

'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { wayBackHomeLevel } from '@/data/songs/wayBackHome';
// @ts-ignore
import GameScreen from '@/components/game/GameScreen';

export default function GamePage() {
    const { startGame, currentLevel } = useGameStore();

    useEffect(() => {
        // 페이지 진입 시 게임 초기화
        if (!currentLevel) {
            startGame(wayBackHomeLevel);
        }
    }, [currentLevel, startGame]);

    return (
        <main className="h-screen w-screen overflow-hidden bg-slate-950">
            <GameScreen />
        </main>
    );
}