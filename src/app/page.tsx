// src/app/page.tsx

'use client';

import Link from 'next/link';
import { wayBackHomeLevel } from '@/data/songs/wayBackHome';

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
                {/* 타이틀 */}
                <h1 className="text-6xl font-bold text-white text-center mb-4">
                    수어 리듬 게임
                </h1>
                <p className="text-xl text-purple-200 text-center mb-12">
                    음악에 맞춰 수어를 배워보세요
                </p>

                {/* 레벨 선택 */}
                <div className="grid gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {wayBackHomeLevel.title}
                                </h2>
                                <p className="text-purple-200">
                                    {wayBackHomeLevel.artist} • {wayBackHomeLevel.challenges.length}개 챌린지
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-purple-400">
                                    {Math.floor(wayBackHomeLevel.duration / 60)}:
                                    {(wayBackHomeLevel.duration % 60).toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm text-purple-300">BPM {wayBackHomeLevel.bpm}</div>
                            </div>
                        </div>

                        <Link href="/game">
                            <button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:scale-105 transition-transform">
                                플레이 시작
                            </button>
                        </Link>
                    </div>
                </div>

                {/* 설정 버튼들 */}
                <div className="flex gap-4 justify-center">
                    <Link href="/record">
                        <button className="bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                            템플릿 녹화
                        </button>
                    </Link>
                    <button className="bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                        설정
                    </button>
                </div>
            </div>
        </main>
    );
}