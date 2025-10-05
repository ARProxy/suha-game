// src/types/hand.types.ts

/**
 * MediaPipe 손 랜드마크 좌표
 */
export interface Landmark {
    x: number;
    y: number;
    z: number;
}

/**
 * 한 손의 전체 랜드마크 (21개 포인트)
 */
export type HandLandmarks = Landmark[];

/**
 * MediaPipe 결과 (양손 가능)
 */
export interface HandTrackingResult {
    multiHandLandmarks?: HandLandmarks[];
    multiHandedness?: Array<{
        score: number;
        index: number;
        label: 'Left' | 'Right';
    }>;
}

/**
 * 손 방향
 */
export type PalmDirection = 'forward' | 'backward' | 'left' | 'right' | 'neutral';

/**
 * 손가락 상태
 */
export interface FingerState {
    thumb: boolean;    // 접혔는지 여부
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
}