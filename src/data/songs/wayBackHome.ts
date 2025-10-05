// src/data/songs/wayBackHome.ts

// @ts-ignore
import { Level } from '@/types/game.types';

/**
 * "WAY BACK HOME" 레벨 정의
 */
export const wayBackHomeLevel: Level = {
    id: 'way-back-home',
    title: '수하 리듬 게임',
    artist: '동히',
    duration: 180,              // 3분
    bpm: 86,
    audioPath: '/audio/bgm/way-back-home.mp3',

    challenges: [
        {
            id: 'challenge-1',
            text: '어떤 결을 걸어도',
            signName: '어떤',
            description: '손을 펴서 좌우로 움직이기',
            timing: 5,
            duration: 4,
        },
        {
            id: 'challenge-2',
            text: '열린 문을 향해 나아가',
            signName: '열린',
            description: '두 손을 펴서 열기',
            timing: 10,
            duration: 4,
        },
        {
            id: 'challenge-3',
            text: '우리가 함께 만들어가는',
            signName: '우리가_함께',
            description: '두 손을 모으기',
            timing: 15,
            duration: 5,
        },
        // ... 추가 챌린지
        // 실제로는 가사에 맞춰 더 많이 추가
    ],
};

/**
 * 모든 레벨 목록
 */
export const allLevels: Level[] = [
    wayBackHomeLevel,
    // 추가 노래들...
];