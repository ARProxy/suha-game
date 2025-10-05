// src/app/record/page.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useHandTracking } from '@/hooks/useHandTracking';

export default function RecordPage() {
    const { videoRef, canvasRef, landmarks, isReady } = useHandTracking();
    const [signName, setSignName] = useState('');
    const [savedTemplates, setSavedTemplates] = useState<string[]>([]);

    const saveTemplate = () => {
        if (!landmarks || !signName.trim()) {
            alert('수어 이름을 입력하고 손을 카메라에 보여주세요!');
            return;
        }

        const template = {
            name: signName,
            landmarks: landmarks.multiHandLandmarks?.[0],
            timestamp: Date.now(),
        };

        localStorage.setItem(`template_${signName}`, JSON.stringify(template));
        setSavedTemplates([...savedTemplates, signName]);
        alert(`"${signName}" 템플릿이 저장되었습니다!`);
        setSignName('');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-white">수어 템플릿 녹화</h1>
                    <Link href="/">
                        <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all">
                            ← 돌아가기
                        </button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* 왼쪽: 카메라 */}
                    <div>
                        <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden border-4 border-purple-500">
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                                style={{ display: 'none' }}
                            />
                            <canvas
                                ref={canvasRef}
                                width={640}
                                height={480}
                                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                            />

                            {!isReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                                    <div className="text-center">
                                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-white font-bold">카메라 준비 중...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 저장 컨트롤 */}
                        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-6">
                            <label className="block text-white font-bold mb-2">
                                수어 이름
                            </label>
                            <input
                                type="text"
                                value={signName}
                                onChange={(e) => setSignName(e.target.value)}
                                placeholder="예: 열린, 문을_향해_나아가"
                                className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-purple-500 focus:outline-none focus:border-purple-400"
                            />
                            <button
                                onClick={saveTemplate}
                                disabled={!landmarks || !signName.trim()}
                                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                현재 동작 저장
                            </button>
                        </div>
                    </div>

                    {/* 오른쪽: 저장된 템플릿 목록 */}
                    <div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">저장된 템플릿</h2>

                            {savedTemplates.length === 0 ? (
                                <p className="text-purple-300 text-center py-8">
                                    아직 저장된 템플릿이 없습니다.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {savedTemplates.map((name) => (
                                        <li
                                            key={name}
                                            className="bg-slate-800 px-4 py-3 rounded-lg text-white flex items-center justify-between"
                                        >
                                            <span>{name}</span>
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem(`template_${name}`);
                                                    setSavedTemplates(savedTemplates.filter(n => n !== name));
                                                }}
                                                className="text-red-400 hover:text-red-300 text-sm"
                                            >
                                                삭제
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* 사용 가이드 */}
                        <div className="mt-6 bg-blue-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/50">
                            <h3 className="text-xl font-bold text-blue-300 mb-3">📝 사용 방법</h3>
                            <ol className="space-y-2 text-blue-200 text-sm">
                                <li>1. 카메라에 손을 보여주세요</li>
                                <li>2. 수어 이름을 입력하세요</li>
                                <li>3. 정확한 자세를 취하고 저장 버튼을 누르세요</li>
                                <li>4. 저장된 템플릿은 게임에서 자동으로 사용됩니다</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}