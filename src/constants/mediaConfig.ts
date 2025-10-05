// src/constants/mediaConfig.ts

/**
 * MediaPipe Hands 설정
 */
export const MEDIAPIPE_CONFIG = {
    locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,

    options: {
        maxNumHands: 2,
        modelComplexity: 1,      // 0: Lite, 1: Full (권장)
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
    },
} as const;

/**
 * 카메라 설정
 */
export const CAMERA_CONFIG = {
    width: 640,
    height: 480,
    facingMode: 'user',        // 전면 카메라
    fps: 30,
} as const;

/**
 * 캔버스 설정
 */
export const CANVAS_CONFIG = {
    drawLandmarks: true,
    drawConnectors: true,
    landmarkColor: '#00FF00',
    connectorColor: '#FFFFFF',
    lineWidth: 2,
} as const;