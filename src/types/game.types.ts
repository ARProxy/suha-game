// src/types/game.types.ts

/**
 * 게임 상태
 */
export type GameStatus = 'idle' | 'ready' | 'countdown' | 'playing' | 'paused' | 'finished';

/**
 * 판정 결과
 */
export type JudgementResult = 'perfect' | 'good' | 'miss' | null;

/**
 * 게임 난이도
 */
export type Difficulty = 'easy' | 'normal' | 'hard';

/**
 * 게임 상태 인터페이스
 */
export interface GameState {
    status: GameStatus;
    currentSignIndex: number;
    score: number;
    combo: number;
    maxCombo: number;
    timeRemaining: number;
    totalTime: number;
    judgementResult: JudgementResult;
    difficulty: Difficulty;
}

/**
 * 수어 문제 정보
 */
export interface SignChallenge {
    id: string;
    text: string;              // 화면에 표시될 텍스트
    signName: string;          // 템플릿 매칭용 이름
    description: string;       // 설명
    timing: number;            // 노래에서의 타이밍 (초)
    duration: number;          // 수행 시간 (초)
}

/**
 * 레벨/노래 정보
 */
export interface Level {
    id: string;
    title: string;             // "WAY BACK HOME"
    artist?: string;
    duration: number;          // 총 길이 (초)
    bpm?: number;
    challenges: SignChallenge[];
    audioPath: string;
}

/**
 * 플레이 결과
 */
export interface PlayResult {
    score: number;
    maxCombo: number;
    perfectCount: number;
    goodCount: number;
    missCount: number;
    accuracy: number;          // 정확도 (%)
    rank: 'S' | 'A' | 'B' | 'C' | 'D';
}