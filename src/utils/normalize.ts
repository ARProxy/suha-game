// src/utils/normalize.ts

import { HandLandmarks, Landmark } from '@/types/hand.types';

/**
 * 손 랜드마크를 손목 중심으로 정규화
 * 손의 크기와 위치에 불변하도록 만듦
 */
export const normalizeHandLandmarks = (landmarks: HandLandmarks): HandLandmarks => {
    if (!landmarks || landmarks.length === 0) return landmarks;

    // 손목(0번 인덱스)을 원점으로 이동
    const wrist = landmarks[0];
    const translated = landmarks.map(point => ({
        x: point.x - wrist.x,
        y: point.y - wrist.y,
        z: point.z - wrist.z,
    }));

    // 손 크기 계산 (손목에서 중지 끝까지의 거리)
    const middleFingerTip = translated[12];
    const handSize = Math.sqrt(
        middleFingerTip.x ** 2 +
        middleFingerTip.y ** 2 +
        middleFingerTip.z ** 2
    );

    // 크기로 스케일링 (손 크기를 1.0으로 정규화)
    if (handSize === 0) return translated;

    return translated.map(point => ({
        x: point.x / handSize,
        y: point.y / handSize,
        z: point.z / handSize,
    }));
};

/**
 * 랜드마크를 [0, 1] 범위로 정규화
 */
export const normalizeTo01Range = (landmarks: HandLandmarks): HandLandmarks => {
    if (!landmarks || landmarks.length === 0) return landmarks;

    // 최소/최대 값 찾기
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    landmarks.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
        minZ = Math.min(minZ, point.z);
        maxZ = Math.max(maxZ, point.z);
    });

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const rangeZ = maxZ - minZ || 1;

    return landmarks.map(point => ({
        x: (point.x - minX) / rangeX,
        y: (point.y - minY) / rangeY,
        z: (point.z - minZ) / rangeZ,
    }));
};

/**
 * 랜드마크 배열을 1차원 벡터로 평탄화
 */
export const flattenLandmarks = (landmarks: HandLandmarks): number[] => {
    const flattened: number[] = [];
    landmarks.forEach(point => {
        flattened.push(point.x, point.y, point.z);
    });
    return flattened;
};

/**
 * 1차원 벡터를 랜드마크 배열로 변환
 */
export const unflattenLandmarks = (vector: number[]): HandLandmarks => {
    const landmarks: HandLandmarks = [];
    for (let i = 0; i < vector.length; i += 3) {
        landmarks.push({
            x: vector[i],
            y: vector[i + 1],
            z: vector[i + 2],
        });
    }
    return landmarks;
};