// src/hooks/useSignRecognition.ts

import { useState, useEffect, useCallback } from 'react';
import { HandTrackingResult } from '@/types/hand.types';
import { SignTemplate, RecognitionResult } from '@/types/sign.types';
import { matchSignTemplate } from '@/lib/recognition/signMatcher';
import { TimeWindowMatcher } from '@/lib/recognition/signMatcher';

interface UseSignRecognitionProps {
    landmarks: HandTrackingResult | null;
    targetTemplate: SignTemplate | null;
    enabled?: boolean;
}

export const useSignRecognition = ({
                                       landmarks,
                                       targetTemplate,
                                       enabled = true,
                                   }: UseSignRecognitionProps) => {
    const [currentResult, setCurrentResult] = useState<RecognitionResult | null>(null);
    const [isMatched, setIsMatched] = useState(false);
    const [matcher] = useState(() => new TimeWindowMatcher(500, 10));

    const recognize = useCallback(() => {
        if (!enabled || !landmarks || !targetTemplate) {
            return;
        }

        const handLandmarks = landmarks.multiHandLandmarks?.[0];
        if (!handLandmarks) {
            return;
        }

        // 템플릿 매칭
        const result = matchSignTemplate(handLandmarks, targetTemplate);
        setCurrentResult(result);

        // 시간 윈도우 매칭
        matcher.addResult(result);
        const stable = matcher.isStableMatch(targetTemplate.name);
        setIsMatched(stable);

    }, [enabled, landmarks, targetTemplate, matcher]);

    useEffect(() => {
        recognize();
    }, [recognize]);

    const reset = useCallback(() => {
        matcher.reset();
        setCurrentResult(null);
        setIsMatched(false);
    }, [matcher]);

    return {
        result: currentResult,
        isMatched,
        confidence: currentResult?.confidence ?? 0,
        reset,
    };
};