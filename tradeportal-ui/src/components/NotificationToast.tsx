'use client';

import React, { useEffect, useState } from 'react';
import { Bell, X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface NotificationProps {
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    onClose: () => void;
}

export const NotificationToast = ({ message, type = 'info', onClose }: NotificationProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        info: <Info className="w-5 h-5 text-blue-500" />,
        success: <CheckCircle2 className="w-5 h-5 text-sy-green" />,
        warning: <AlertTriangle className="w-5 h-5 text-sy-gold" />,
        error: <AlertCircle className="w-5 h-5 text-sy-red" />
    };

    const colors = {
        info: 'border-blue-500/20 bg-blue-500/5',
        success: 'border-sy-green/20 bg-sy-green/5',
        warning: 'border-sy-gold/20 bg-sy-gold/5',
        error: 'border-sy-red/20 bg-sy-red/5'
    };

    return (
        <div className={`fixed bottom-6 left-6 z-[200] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`flex items-center gap-4 p-4 min-w-[320px] glass-card border rounded-2xl shadow-2xl ${colors[type]}`}>
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-grow">
                    <p className="text-xs font-bold leading-relaxed">{message}</p>
                </div>
                <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
