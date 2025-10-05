// src/components/game/SignPrompt.tsx

'use client';

import { useGameStore } from '@/stores/gameStore';

export default function SignPrompt() {
    const { currentLevel, currentSignIndex } = useGameStore();

    if (!currentLevel) return null;

    const currentChallenge = currentLevel.challenges[currentSignIndex];

    if (!currentChallenge) return null;

    return (
        <div className="w-full max-w-3xl">
            <div className="bg-slate-900/90 backdrop-blur-md border-2 border-purple-500 rounded-2xl px-8 py-6 shadow-2xl">
                {/* 문제 번호 */}
                <div className="text-purple-400 text-sm font-bold mb-2 text-center">
                    {currentSignIndex + 1} / {currentLevel.challenges.length}
                </div>

                {/* 수어 텍스트 */}
                <h2 className="text-4xl font-bold text-white text-center mb-3">
                    {currentChallenge.text}
                </h2>

                {/* 설명 */}
                <p className="text-purple-300 text-center text-base">
                    {currentChallenge.description}
                </p>

                {/* 진행 바 */}
                <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        style={{
                            width: `${((currentSignIndex + 1) / currentLevel.challenges.length) * 100}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}