// src/lib/recognition/signMatcher.ts

import { HandLandmarks } from '@/types/hand.types';
import { SignTemplate, RecognitionResult, MatchingOptions } from '@/types/sign.types';
import { normalizeHandLandmarks } from '@/utils/normalize';
import { calculateHybridSimilarity } from './similarityCalculator';

/**
 * 현재 손 랜드마크와 템플릿을 비교하여 매칭 여부 판단
 */
export const matchSignTemplate = (
    currentLandmarks: HandLandmarks,
    template: SignTemplate,
    options?: MatchingOptions
): RecognitionResult => {
    if (!currentLandmarks || currentLandmarks.length === 0) {
        return {
            signName: template.name,
            confidence: 0,
            matched: false,
            timestamp: Date.now(),
        };
    }

    // 랜드마크 정규화 (크기/위치 불변성)
    const normalizedCurrent = normalizeHandLandmarks(currentLandmarks);
    const normalizedTemplate = normalizeHandLandmarks(template.landmarks);

    // 유사도 계산
    const confidence = calculateHybridSimilarity(
        normalizedCurrent,
        normalizedTemplate
    );

    // 임계값 결정
    const threshold = options?.threshold ?? template.threshold;

    return {
        signName: template.name,
        confidence,
        matched: confidence >= threshold,
        timestamp: Date.now(),
    };
};

/**
 * 여러 템플릿 중 가장 유사한 것 찾기
 */
export const findBestMatch = (
    currentLandmarks: HandLandmarks,
    templates: SignTemplate[],
    options?: MatchingOptions
): RecognitionResult | null => {
    if (!currentLandmarks || templates.length === 0) {
        return null;
    }

    let bestMatch: RecognitionResult | null = null;
    let highestConfidence = 0;

    templates.forEach(template => {
        const result = matchSignTemplate(currentLandmarks, template, options);

        if (result.confidence > highestConfidence) {
            highestConfidence = result.confidence;
            bestMatch = result;
        }
    });

    return bestMatch;
};

/**
 * 시간 윈도우를 고려한 매칭
 * 여러 프레임에 걸쳐 일치하는지 확인
 */
export class TimeWindowMatcher {
    private recentResults: RecognitionResult[] = [];
    private windowSize: number;
    private minFrames: number;

    constructor(windowSize: number = 500, minFrames: number = 10) {
        this.windowSize = windowSize;
        this.minFrames = minFrames;
    }

    /**
     * 새로운 인식 결과 추가
     */
    addResult(result: RecognitionResult): void {
        const now = Date.now();

        // 오래된 결과 제거
        this.recentResults = this.recentResults.filter(
            r => now - r.timestamp <= this.windowSize
        );

        this.recentResults.push(result);
    }

    /**
     * 윈도우 내에서 안정적으로 매칭되었는지 확인
     */
    isStableMatch(signName: string): boolean {
        const matchingResults = this.recentResults.filter(
            r => r.signName === signName && r.matched
        );

        return matchingResults.length >= this.minFrames;
    }

    /**
     * 평균 신뢰도 계산
     */
    getAverageConfidence(signName: string): number {
        const matchingResults = this.recentResults.filter(
            r => r.signName === signName
        );

        if (matchingResults.length === 0) return 0;

        const sum = matchingResults.reduce((acc, r) => acc + r.confidence, 0);
        return sum / matchingResults.length;
    }

    /**
     * 윈도우 초기화
     */
    reset(): void {
        this.recentResults = [];
    }
}