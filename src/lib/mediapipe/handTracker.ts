// src/lib/mediapipe/handTracker.ts

import { Hands, Results, Options } from '@mediapipe/hands';
import { MEDIA_PIPE_CONFIG } from '@/constants/mediaConfig';

/**
 * MediaPipe Hands 인스턴스 생성 및 초기화
 */
export const createHandTracker = (
    onResults: (results: Results) => void,
    customOptions?: Partial<Options>
): Hands => {
    const hands = new Hands({
        locateFile: MEDIA_PIPE_CONFIG.locateFile,
    });

    // 옵션 설정 (커스텀 옵션으로 오버라이드 가능)
    const options = {
        ...MEDIA_PIPE_CONFIG.options,
        ...customOptions,
    };

    hands.setOptions(options);
    hands.onResults(onResults);

    return hands;
};

/**
 * MediaPipe Hands 옵션 업데이트
 */
export const updateHandTrackerOptions = (
    hands: Hands,
    options: Partial<Options>
): void => {
    hands.setOptions(options);
};

/**
 * 성능 프리셋
 */
export const PERFORMANCE_PRESETS = {
    // 빠른 처리 (정확도 낮음)
    fast: {
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.4,
    },
    // 균형잡힌 설정 (권장)
    balanced: {
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
    },
    // 높은 정확도 (느림)
    accurate: {
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.7,
    },
} as const;

/**
 * 프리셋으로 Hands 인스턴스 생성
 */
export const createHandTrackerWithPreset = (
    onResults: (results: Results) => void,
    preset: keyof typeof PERFORMANCE_PRESETS = 'balanced'
): Hands => {
    return createHandTracker(onResults, PERFORMANCE_PRESETS[preset]);
};