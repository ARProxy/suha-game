// src/lib/recognition/similarityCalculator.ts

import { HandLandmarks } from '@/types/hand.types';
import { flattenLandmarks } from '@/utils/normalize';

/**
 * 코사인 유사도 계산
 * 두 벡터가 얼마나 비슷한 방향을 가리키는지 측정 (0 ~ 1)
 */
export const calculateCosineSimilarity = (
    landmarks1: HandLandmarks,
    landmarks2: HandLandmarks
): number => {
    if (!landmarks1 || !landmarks2) return 0;
    if (landmarks1.length !== landmarks2.length) return 0;

    const vector1 = flattenLandmarks(landmarks1);
    const vector2 = flattenLandmarks(landmarks2);

    // 내적 계산
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
        magnitude1 += vector1[i] * vector1[i];
        magnitude2 += vector2[i] * vector2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
};

/**
 * 유클리드 거리 기반 유사도 계산
 * 거리가 가까울수록 높은 점수 (0 ~ 1)
 */
export const calculateEuclideanSimilarity = (
    landmarks1: HandLandmarks,
    landmarks2: HandLandmarks
): number => {
    if (!landmarks1 || !landmarks2) return 0;
    if (landmarks1.length !== landmarks2.length) return 0;

    let sumSquaredDistance = 0;

    for (let i = 0; i < landmarks1.length; i++) {
        const dx = landmarks1[i].x - landmarks2[i].x;
        const dy = landmarks1[i].y - landmarks2[i].y;
        const dz = landmarks1[i].z - landmarks2[i].z;
        sumSquaredDistance += dx * dx + dy * dy + dz * dz;
    }

    const distance = Math.sqrt(sumSquaredDistance);

    // 거리를 유사도로 변환 (가까울수록 1에 가까움)
    // 최대 거리를 sqrt(3 * 21) = 7.9로 가정 (21개 점, 각 좌표 최대 1)
    const maxDistance = Math.sqrt(3 * landmarks1.length);
    return Math.max(0, 1 - distance / maxDistance);
};

/**
 * 하이브리드 유사도 계산 (코사인 + 유클리드)
 * 더 정확한 매칭을 위해 두 방식을 결합
 */
export const calculateHybridSimilarity = (
    landmarks1: HandLandmarks,
    landmarks2: HandLandmarks,
    cosineWeight: number = 0.6,
    euclideanWeight: number = 0.4
): number => {
    const cosineSim = calculateCosineSimilarity(landmarks1, landmarks2);
    const euclideanSim = calculateEuclideanSimilarity(landmarks1, landmarks2);

    return cosineSim * cosineWeight + euclideanSim * euclideanWeight;
};

/**
 * 동적 시간 워핑(DTW) 거리 계산
 * 시간적 변화가 있는 제스처 비교에 유용
 */
export const calculateDTWDistance = (
    sequence1: HandLandmarks[],
    sequence2: HandLandmarks[]
): number => {
    const n = sequence1.length;
    const m = sequence2.length;

    // DTW 행렬 초기화
    const dtw: number[][] = Array(n + 1)
        .fill(0)
        .map(() => Array(m + 1).fill(Infinity));
    dtw[0][0] = 0;

    // DTW 행렬 채우기
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const cost = 1 - calculateCosineSimilarity(
                sequence1[i - 1],
                sequence2[j - 1]
            );

            dtw[i][j] = cost + Math.min(
                dtw[i - 1][j],      // 삽입
                dtw[i][j - 1],      // 삭제
                dtw[i - 1][j - 1]   // 매칭
            );
        }
    }

    return dtw[n][m];
};