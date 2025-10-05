// src/components/camera/CameraView.tsx

'use client';

import { useHandTracking } from '@/hooks/useHandTracking';

export default function CameraView() {
    const { videoRef, canvasRef, isReady, error } = useHandTracking();

    if (error) {
        return (
            <div className="aspect-video bg-red-900/20 border-2 border-red-500 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-white font-bold mb-2">카메라 오류</p>
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden border-4 border-green-500 shadow-2xl shadow-green-500/50">
            {/* 비디오 (숨김) */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                style={{ display: 'none' }}
            />

            {/* 캔버스 (랜드마크 표시) */}
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />

            {/* 로딩 오버레이 */}
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white font-bold">카메라 준비 중...</p>
                    </div>
                </div>
            )}

            {/* 안내 텍스트 */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm">
                    📷 수어 인식 카메라
                </p>
            </div>
        </div>
    );
}