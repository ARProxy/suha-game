// src/lib/recognition/gestureDetector.ts

import { HandLandmarks, PalmDirection, FingerState } from '@/types/hand.types';
import { vectorBetween, magnitude, normalize, dotProduct } from '@/utils/vector';

/**
 * 손가락이 접혀있는지 판단
 */
export const isFingerCurled = (
    landmarks: HandLandmarks,
    fingerTip: number,
    fingerPIP: number,
    fingerMCP: number
): boolean => {
    // 손가락 끝이 PIP 관절보다 손목에 가까우면 접힌 것으로 판단
    const tip = landmarks[fingerTip];
    const pip = landmarks[fingerPIP];
    const mcp = landmarks[fingerMCP];
    const wrist = landmarks[0];

    const tipToWrist = magnitude(vectorBetween(wrist, tip));
    const pipToWrist = magnitude(vectorBetween(wrist, pip));

    return tipToWrist < pipToWrist * 0.9; // 10% 여유
};

/**
 * 모든 손가락의 상태 감지
 */
export const detectFingerStates = (landmarks: HandLandmarks): FingerState => {
    if (!landmarks || landmarks.length < 21) {
        return {
            thumb: false,
            index: false,
            middle: false,
            ring: false,
            pinky: false,
        };
    }

    return {
        // 엄지는 다른 손가락과 달리 x축 기준으로 판단
        thumb: landmarks[4].x < landmarks[3].x - 0.05,
        index: isFingerCurled(landmarks, 8, 6, 5),
        middle: isFingerCurled(landmarks, 12, 10, 9),
        ring: isFingerCurled(landmarks, 16, 14, 13),
        pinky: isFingerCurled(landmarks, 20, 18, 17),
    };
};

/**
 * 손바닥 방향 감지
 */
export const detectPalmDirection = (landmarks: HandLandmarks): PalmDirection => {
    if (!landmarks || landmarks.length < 21) {
        return 'neutral';
    }

    const wrist = landmarks[0];
    const middleFingerMCP = landmarks[9];
    const indexFingerMCP = landmarks[5];

    // 손바닥 평면의 법선 벡터 계산
    const v1 = vectorBetween(wrist, middleFingerMCP);
    const v2 = vectorBetween(wrist, indexFingerMCP);

    // 외적으로 법선 벡터 구하기
    const normal = {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x,
    };

    const normalizedNormal = normalize(normal);

    // z축 방향으로 판단 (카메라를 향하는지)
    if (normalizedNormal.z < -0.3) return 'forward';
    if (normalizedNormal.z > 0.3) return 'backward';

    // x축 방향으로 판단 (좌우)
    if (normalizedNormal.x < -0.3) return 'left';
    if (normalizedNormal.x > 0.3) return 'right';

    return 'neutral';
};

/**
 * 주먹 쥐기 감지
 */
export const detectFist = (landmarks: HandLandmarks): boolean => {
    const fingerStates = detectFingerStates(landmarks);

    // 모든 손가락이 접혀있으면 주먹
    return (
        fingerStates.index &&
        fingerStates.middle &&
        fingerStates.ring &&
        fingerStates.pinky
    );
};

/**
 * 손 펴기 감지 (모든 손가락 펴짐)
 */
export const detectOpenHand = (landmarks: HandLandmarks): boolean => {
    const fingerStates = detectFingerStates(landmarks);

    // 모든 손가락이 펴져있으면 열린 손
    return (
        !fingerStates.thumb &&
        !fingerStates.index &&
        !fingerStates.middle &&
        !fingerStates.ring &&
        !fingerStates.pinky
    );
};

/**
 * V자 손가락 (평화/승리 제스처)
 */
export const detectVSign = (landmarks: HandLandmarks): boolean => {
    const fingerStates = detectFingerStates(landmarks);

    // 검지와 중지만 펴져있음
    return (
        !fingerStates.index &&
        !fingerStates.middle &&
        fingerStates.ring &&
        fingerStates.pinky
    );
};

/**
 * 엄지 척 (좋아요)
 */
export const detectThumbsUp = (landmarks: HandLandmarks): boolean => {
    const fingerStates = detectFingerStates(landmarks);
    const palmDirection = detectPalmDirection(landmarks);

    // 엄지만 펴져있고 손바닥이 옆을 향함
    return (
        !fingerStates.thumb &&
        fingerStates.index &&
        fingerStates.middle &&
        fingerStates.ring &&
        fingerStates.pinky &&
        (palmDirection === 'left' || palmDirection === 'right')
    );
};