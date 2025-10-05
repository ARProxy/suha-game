// src/components/game/GameScreen.tsx

'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import GameHeader from './GameHeader';
import CameraView from '../camera/CarmeraView';
import SignPrompt from './SignPrompt';
import ResultFeedback from './ResultFeedback';
import CountdownTimer from './CountdownTimer';

export default function GameScreen() {
    const { status, setStatus } = useGameStore();

    useEffect(() => {
        // 카운트다운 시작
        if (status === 'countdown') {
            const timer = setTimeout(() => {
                setStatus('playing');
            }, 3000); // 3초 카운트다운

            return () => clearTimeout(timer);
        }
    }, [status, setStatus]);

    return (
        <div className="h-full w-full flex flex-col relative">
            {/* 헤더: 타이틀, 타이머, 점수 */}
            <GameHeader />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">

                {/* 수어 문제 표시 (카메라 위에 분리) */}
                {(status === 'playing' || status === 'countdown') && (
                    <SignPrompt />
                )}

                {/* 카메라 뷰 */}
                <div className="relative w-full max-w-3xl">
                    <CameraView />

                    {/* PERFECT/MISS 피드백 (카메라 위에 오버레이) */}
                    <ResultFeedback />
                </div>
            </div>

            {/* 카운트다운 오버레이 (3, 2, 1) */}
            {status === 'countdown' && <CountdownTimer />}

            {/* 일시정지/종료 화면 */}
            {status === 'paused' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-8">일시정지</h2>
                        <button
                            onClick={() => setStatus('playing')}
                            className="bg-purple-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-600 transition-colors"
                        >
                            계속하기
                        </button>
                    </div>
                </div>
            )}

            {status === 'finished' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">게임 종료!</h2>
                        <div className="text-2xl text-purple-300 mb-8">
                            최종 점수: {useGameStore.getState().score}
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-purple-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-600 transition-colors"
                            >
                                다시 하기
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors"
                            >
                                메인으로
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}