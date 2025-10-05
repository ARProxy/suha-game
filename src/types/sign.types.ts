// src/types/sign.types.ts

import { HandLandmarks } from './hand.types';

/**
 * 수어 템플릿
 */
export interface SignTemplate {
    id: string;
    name: string;              // "열린", "문을_향해_나아가" 등
    displayName: string;       // 화면 표시용
    landmarks: HandLandmarks;  // 정답 랜드마크
    handedness: 'Left' | 'Right' | 'Both';
    threshold: number;         // 유사도 임계값 (0.0 ~ 1.0)
    description?: string;
    imageUrl?: string;         // 참고 이미지
}

/**
 * 수어 인식 결과
 */
export interface RecognitionResult {
    signName: string;
    confidence: number;        // 신뢰도 (0.0 ~ 1.0)
    matched: boolean;
    timestamp: number;
}

/**
 * 템플릿 매칭 옵션
 */
export interface MatchingOptions {
    threshold?: number;        // 전역 임계값 오버라이드
    timeWindow?: number;       // 시간 윈도우 (ms)
    minFrames?: number;        // 최소 프레임 수
}