// src/hooks/useHandTracking.ts

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { HandTrackingResult } from '@/types/hand.types';

export const useHandTracking = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handsRef = useRef<any>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [landmarks, setLandmarks] = useState<HandTrackingResult | null>(null);

    // MediaPipe 결과 처리
    const onResults = useCallback((results: any) => {
        setLandmarks({
            multiHandLandmarks: results.multiHandLandmarks,
            multiHandedness: results.multiHandedness,
        });

        // 캔버스에 그리기
        if (canvasRef.current && results.multiHandLandmarks) {
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            // 캔버스 초기화
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // 랜드마크 그리기
            results.multiHandLandmarks.forEach((handLandmarks: any[]) => {
                // 연결선 그리기
                const connections = [
                    [0, 1], [1, 2], [2, 3], [3, 4],           // 엄지
                    [0, 5], [5, 6], [6, 7], [7, 8],           // 검지
                    [0, 9], [9, 10], [10, 11], [11, 12],      // 중지
                    [0, 13], [13, 14], [14, 15], [15, 16],    // 약지
                    [0, 17], [17, 18], [18, 19], [19, 20],    // 새끼
                ];

                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;

                connections.forEach(([start, end]) => {
                    const startPoint = handLandmarks[start];
                    const endPoint = handLandmarks[end];

                    ctx.beginPath();
                    ctx.moveTo(
                        startPoint.x * canvasRef.current!.width,
                        startPoint.y * canvasRef.current!.height
                    );
                    ctx.lineTo(
                        endPoint.x * canvasRef.current!.width,
                        endPoint.y * canvasRef.current!.height
                    );
                    ctx.stroke();
                });

                // 랜드마크 점 그리기
                handLandmarks.forEach((landmark: any) => {
                    ctx.fillStyle = '#00FF00';
                    ctx.beginPath();
                    ctx.arc(
                        landmark.x * canvasRef.current!.width,
                        landmark.y * canvasRef.current!.height,
                        5,
                        0,
                        2 * Math.PI
                    );
                    ctx.fill();
                });
            });
        }
    }, []);

    // 비디오 프레임 처리
    const processFrame = useCallback(async () => {
        if (videoRef.current && handsRef.current && videoRef.current.readyState === 4) {
            try {
                await handsRef.current.send({ image: videoRef.current });
            } catch (err) {
                console.error('Frame processing error:', err);
            }
        }

        animationFrameRef.current = requestAnimationFrame(processFrame);
    }, []);

    // MediaPipe 및 카메라 초기화
    useEffect(() => {
        const initializeMediaPipe = async () => {
            try {
                // 동적 import로 MediaPipe 로드 (브라우저에서만 실행)
                const { Hands } = await import('@mediapipe/hands');

                // Hands 인스턴스 생성
                const hands = new Hands({
                    locateFile: (file: string) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
                });

                hands.setOptions({
                    maxNumHands: 2,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.7,
                    minTrackingConfidence: 0.5,
                });

                hands.onResults(onResults);

                handsRef.current = hands;

                // 카메라 스트림 시작
                if (videoRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: 640,
                            height: 480,
                            facingMode: 'user',
                        },
                    });

                    videoRef.current.srcObject = stream;

                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().then(() => {
                            setIsReady(true);
                            // 프레임 처리 시작
                            processFrame();
                        });
                    };
                }
            } catch (err) {
                console.error('MediaPipe 초기화 실패:', err);
                setError('카메라를 시작할 수 없습니다. 권한을 확인해주세요.');
            }
        };

        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
            initializeMediaPipe();
        }

        // 클린업
        return () => {
            // 애니메이션 프레임 취소
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            // 비디오 스트림 정지
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }

            // MediaPipe 정리
            if (handsRef.current) {
                handsRef.current.close();
            }
        };
    }, [onResults, processFrame]);

    return {
        videoRef,
        canvasRef,
        landmarks,
        isReady,
        error,
    };
};