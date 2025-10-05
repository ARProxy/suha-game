// src/data/signs/signList.ts

import { SignTemplate } from '@/types/sign.types';

/**
 * 기본 수어 템플릿 목록
 * 실제 사용 시 localStorage에서 로드하거나 서버에서 가져옴
 */
export const defaultSignTemplates: Partial<SignTemplate>[] = [
    {
        id: 'open-hand',
        name: '열린',
        displayName: '열린 손',
        handedness: 'Both',
        threshold: 0.80,
        description: '손바닥을 펴고 손가락을 모두 펼친 상태',
    },
    {
        id: 'closed-fist',
        name: '주먹',
        displayName: '주먹',
        handedness: 'Both',
        threshold: 0.85,
        description: '손가락을 모두 접어 주먹을 쥔 상태',
    },
    {
        id: 'v-sign',
        name: 'V자',
        displayName: 'V자 (평화)',
        handedness: 'Both',
        threshold: 0.80,
        description: '검지와 중지만 펴서 V자 모양',
    },
    {
        id: 'thumbs-up',
        name: '좋아요',
        displayName: '엄지 척',
        handedness: 'Both',
        threshold: 0.85,
        description: '엄지만 펴고 나머지는 접은 상태',
    },
    {
        id: 'together',
        name: '우리가_함께',
        displayName: '함께 (모으기)',
        handedness: 'Both',
        threshold: 0.75,
        description: '두 손을 가슴 앞에서 모으는 동작',
    },
];

/**
 * localStorage에서 수어 템플릿 로드
 */
export const loadSignTemplatesFromStorage = (): SignTemplate[] => {
    const templates: SignTemplate[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('template_')) {
            try {
                const data = localStorage.getItem(key);
                if (data) {
                    const template = JSON.parse(data);
                    templates.push(template);
                }
            } catch (error) {
                console.error(`Failed to load template ${key}:`, error);
            }
        }
    }

    return templates;
};

/**
 * 수어 템플릿 저장
 */
export const saveSignTemplate = (template: SignTemplate): void => {
    const key = `template_${template.name}`;
    localStorage.setItem(key, JSON.stringify(template));
};

/**
 * 수어 템플릿 삭제
 */
export const deleteSignTemplate = (signName: string): void => {
    const key = `template_${signName}`;
    localStorage.removeItem(key);
};

/**
 * 모든 수어 템플릿 가져오기
 */
export const getAllSignTemplates = (): SignTemplate[] => {
    return loadSignTemplatesFromStorage();
};