// src/components/ui/Button.tsx

'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export default function Button({
                                   variant = 'primary',
                                   size = 'md',
                                   className = '',
                                   children,
                                   ...props
                               }: ButtonProps) {
    const baseStyles = 'font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 active:scale-95',
        secondary: 'bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20',
        outline: 'bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}