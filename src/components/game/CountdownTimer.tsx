// src/components/game/CountdownTimer.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownTimer() {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => {
                setCount(count - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [count]);

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center pointer-events-none z-50">
            <AnimatePresence mode="wait">
                {count > 0 ? (
                    <motion.div
                        key={count}
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        transition={{
                            duration: 0.5,
                            ease: 'backOut',
                        }}
                        className="text-center"
                    >
                        <div
                            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
                            style={{
                                textShadow: '0 0 60px rgba(168, 85, 247, 0.8)',
                            }}
                        >
                            {count}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="start"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div
                            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
                            style={{
                                textShadow: '0 0 60px rgba(34, 197, 94, 0.8)',
                            }}
                        >
                            START!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}