// src/lib/game/scoreCalculator.ts

import { JudgementResult } from '@/types/game.types';
import { SCORE_CONFIG } from '@/constants/gameConfig';

/**
 * 판정 결과에 따른 기본 점수 계산
 */
export const calculateBaseScore = (judgement: JudgementResult): number => {
    switch (judgement) {
        case 'perfect':
            return SCORE_CONFIG.perfect;
        case 'good':
            return SCORE_CONFIG.good;
        case 'miss':
            return SCORE_CONFIG.miss;
        default:
            return 0;
    }
};

/**
 * 콤보를 고려한 최종 점수 계산
 */
export const calculateFinalScore = (
    judgement: JudgementResult,
    combo: number
): number => {
    const baseScore = calculateBaseScore(judgement);

    if (baseScore === 0) return 0;

    // 콤보 배율 계산 (최대 2배)
    const comboMultiplier = Math.min(
        1 + combo * SCORE_CONFIG.comboMultiplier,
        SCORE_CONFIG.maxComboMultiplier
    );

    return Math.floor(baseScore * comboMultiplier);
};

/**
 * 신뢰도 점수를 판정으로 변환
 */
export const confidenceToJudgement = (confidence: number): JudgementResult => {
    if (confidence >= 0.85) return 'perfect';
    if (confidence >= 0.70) return 'good';
    return 'miss';
};

/**
 * 정확도 계산 (%)
 */
export const calculateAccuracy = (
    perfectCount: number,
    goodCount: number,
    missCount: number
): number => {
    const total = perfectCount + goodCount + missCount;
    if (total === 0) return 0;

    // Perfect는 100%, Good은 70%로 계산
    const weightedScore = perfectCount * 100 + goodCount * 70;
    return Math.round((weightedScore / total));
};

/**
 * 랭크 계산
 */
export const calculateRank = (accuracy: number): 'S' | 'A' | 'B' | 'C' | 'D' => {
    if (accuracy >= 95) return 'S';
    if (accuracy >= 85) return 'A';
    if (accuracy >= 70) return 'B';
    if (accuracy >= 50) return 'C';
    return 'D';
};

/**
 * 최종 플레이 결과 계산
 */
export const calculatePlayResult = (
    score: number,
    maxCombo: number,
    perfectCount: number,
    goodCount: number,
    missCount: number
) => {
    const accuracy = calculateAccuracy(perfectCount, goodCount, missCount);
    const rank = calculateRank(accuracy);

    return {
        score,
        maxCombo,
        perfectCount,
        goodCount,
        missCount,
        accuracy,
        rank,
    };
};