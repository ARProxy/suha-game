// src/components/game/GameHeader.tsx

'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function GameHeader() {
    const { currentLevel, timeRemaining, score, combo, decrementTime, status } = useGameStore();

    // 타이머 카운트다운
    useEffect(() => {
        if (status !== 'playing') return;

        const interval = setInterval(() => {
            decrementTime();
        }, 1000);

        return () => clearInterval(interval);
    }, [status, decrementTime]);

    if (!currentLevel) return null;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* 왼쪽: 노래 정보 */}
                <div>
                    <h1 className="text-2xl font-bold text-white">{currentLevel.title}</h1>
                    <p className="text-sm text-purple-300">{currentLevel.artist}</p>
                </div>

                {/* 가운데: 타이머 */}
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-white tabular-nums">
                            {minutes}:{seconds.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-purple-300 mt-1">TIME</div>
                    </div>
                </div>

                {/* 오른쪽: 점수 & 콤보 */}
                <div className="text-right">
                    <div className="text-3xl font-bold text-purple-400 tabular-nums">
                        {score.toLocaleString()}
                    </div>
                    <div className="text-sm text-purple-300">SCORE</div>
                    {combo > 0 && (
                        <div className="text-xl font-bold text-yellow-400 mt-2">
                            {combo} COMBO
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}