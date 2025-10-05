// src/components/record/TemplateRecorder.tsx

'use client';

import { useState } from 'react';
import { useHandTracking } from '@/hooks/useHandTracking';
import { SignTemplate } from '@/types/sign.types';
import { saveSignTemplate } from '@/data/signs/signList';
import { normalizeHandLandmarks } from '@/utils/normalize';
import Button from '../ui/Button';

interface TemplateRecorderProps {
    onSave?: (template: SignTemplate) => void;
}

export default function TemplateRecorder({ onSave }: TemplateRecorderProps) {
    const { videoRef, canvasRef, landmarks, isReady } = useHandTracking();
    const [signName, setSignName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [threshold, setThreshold] = useState(0.80);
    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = () => {
        if (!landmarks || !landmarks.multiHandLandmarks?.[0]) {
            alert('손을 카메라에 보여주세요!');
            return;
        }

        if (!signName.trim()) {
            alert('수어 이름을 입력하세요!');
            return;
        }

        // 랜드마크 정규화
        const normalizedLandmarks = normalizeHandLandmarks(
            landmarks.multiHandLandmarks[0]
        );

        const template: SignTemplate = {
            id: `custom-${Date.now()}`,
            name: signName.trim(),
            displayName: displayName.trim() || signName.trim(),
            landmarks: normalizedLandmarks,
            handedness: 'Both',
            threshold,
            description: description.trim(),
        };

        // 저장
        saveSignTemplate(template);

        if (onSave) {
            onSave(template);
        }

        alert(`"${template.displayName}" 템플릿이 저장되었습니다!`);

        // 폼 초기화
        setSignName('');
        setDisplayName('');
        setDescription('');
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        setTimeout(() => {
            handleRecord();
            setIsRecording(false);
        }, 3000);
    };

    return (
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

                    {isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/30 backdrop-blur-sm">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-white animate-pulse">
                                    녹화 중...
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 손 감지 상태 */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-white text-sm">
                            {landmarks?.multiHandLandmarks?.length
                                ? `✅ 손 감지됨 (${landmarks.multiHandLandmarks.length})`
                                : '❌ 손이 감지되지 않음'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 오른쪽: 입력 폼 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6">템플릿 정보</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white font-bold mb-2">
                            수어 이름 (ID) *
                        </label>
                        <input
                            type="text"
                            value={signName}
                            onChange={(e) => setSignName(e.target.value)}
                            placeholder="예: open_hand, v_sign"
                            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-purple-500 focus:outline-none focus:border-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-bold mb-2">
                            표시 이름
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="예: 열린 손, V자"
                            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-purple-500 focus:outline-none focus:border-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-bold mb-2">설명</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="수어 동작에 대한 설명..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-purple-500 focus:outline-none focus:border-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-bold mb-2">
                            매칭 임계값: {threshold.toFixed(2)}
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="0.95"
                            step="0.05"
                            value={threshold}
                            onChange={(e) => setThreshold(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-sm text-purple-300 mt-1">
                            낮을수록 쉽게 인식, 높을수록 정확하게 인식
                        </p>
                    </div>

                    <Button
                        onClick={handleStartRecording}
                        disabled={!landmarks || !signName.trim() || isRecording}
                        size="lg"
                        className="w-full"
                    >
                        {isRecording ? '녹화 중... (3초)' : '📷 템플릿 녹화'}
                    </Button>
                </div>
            </div>
        </div>
    );
}