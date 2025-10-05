// src/constants/gameConfig.ts

/**
 * 점수 설정
 */
export const SCORE_CONFIG = {
    perfect: 100,
    good: 50,
    miss: 0,
    comboMultiplier: 0.1,      // 콤보당 10% 보너스
    maxComboMultiplier: 2.0,   // 최대 2배
} as const;

/**
 * 판정 설정
 */
export const JUDGEMENT_CONFIG = {
    perfectThreshold: 0.85,    // 85% 이상 유사도
    goodThreshold: 0.70,       // 70% 이상 유사도
    timeWindow: 500,           // 0.5초간 유지해야 인정
    minFrames: 10,             // 최소 10프레임 일치
} as const;

/**
 * 난이도별 설정
 */
export const DIFFICULTY_CONFIG = {
    easy: {
        timePerSign: 5,          // 수어당 5초
        threshold: 0.70,
    },
    normal: {
        timePerSign: 4,
        threshold: 0.80,
    },
    hard: {
        timePerSign: 3,
        threshold: 0.85,
    },
} as const;

/**
 * 타이머 설정
 */
export const TIMER_CONFIG = {
    countdownDuration: 3,      // 3, 2, 1 카운트다운
    feedbackDuration: 1000,    // PERFECT/MISS 표시 시간 (ms)
} as const;