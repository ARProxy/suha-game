// src/utils/vector.ts

import { Landmark } from '@/types/hand.types';

/**
 * 두 점 사이의 유클리드 거리 계산
 */
export const calculateDistance = (p1: Landmark, p2: Landmark): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * 두 벡터의 내적(dot product) 계산
 */
export const dotProduct = (v1: Landmark, v2: Landmark): number => {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

/**
 * 벡터의 크기(magnitude) 계산
 */
export const magnitude = (v: Landmark): number => {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

/**
 * 벡터 정규화 (단위 벡터로 변환)
 */
export const normalize = (v: Landmark): Landmark => {
    const mag = magnitude(v);
    if (mag === 0) return { x: 0, y: 0, z: 0 };
    return {
        x: v.x / mag,
        y: v.y / mag,
        z: v.z / mag,
    };
};

/**
 * 두 벡터 사이의 각도 계산 (라디안)
 */
export const angleBetween = (v1: Landmark, v2: Landmark): number => {
    const dot = dotProduct(v1, v2);
    const mag1 = magnitude(v1);
    const mag2 = magnitude(v2);

    if (mag1 === 0 || mag2 === 0) return 0;

    const cosAngle = dot / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cosAngle))); // clamp to [-1, 1]
};

/**
 * 두 점 사이의 벡터 계산
 */
export const vectorBetween = (from: Landmark, to: Landmark): Landmark => {
    return {
        x: to.x - from.x,
        y: to.y - from.y,
        z: to.z - from.z,
    };
};

/**
 * 벡터 배열의 평균 계산
 */
export const averageVector = (vectors: Landmark[]): Landmark => {
    if (vectors.length === 0) return { x: 0, y: 0, z: 0 };

    const sum = vectors.reduce(
        (acc, v) => ({
            x: acc.x + v.x,
            y: acc.y + v.y,
            z: acc.z + v.z,
        }),
        { x: 0, y: 0, z: 0 }
    );

    return {
        x: sum.x / vectors.length,
        y: sum.y / vectors.length,
        z: sum.z / vectors.length,
    };
};