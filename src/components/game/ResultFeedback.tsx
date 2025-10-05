// src/components/game/ResultFeedback.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

export default function ResultFeedback() {
    const { judgementResult } = useGameStore();

    return (
        <AnimatePresence>
            {judgementResult && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'backOut' }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    {judgementResult === 'perfect' && (
                        <div className="text-center">
                            <motion.div
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                                style={{
                                    textShadow: '0 0 30px rgba(251, 191, 36, 0.5)',
                                }}
                            >
                                PERFECT
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-2xl text-yellow-400 mt-2"
                            >
                                ✨ 완벽해요! ✨
                            </motion.div>
                        </div>
                    )}

                    {judgementResult === 'good' && (
                        <div className="text-center">
                            <motion.div
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
                            >
                                GOOD
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-green-400 mt-2"
                            >
                                👍 잘했어요!
                            </motion.div>
                        </div>
                    )}

                    {judgementResult === 'miss' && (
                        <div className="text-center">
                            <motion.div
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500"
                            >
                                MISS
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-red-400 mt-2"
                            >
                                😢 다시 도전!
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}