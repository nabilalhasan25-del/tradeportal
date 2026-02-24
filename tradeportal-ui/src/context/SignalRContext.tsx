'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as signalR from '@microsoft/signalr';
import api, { NotificationItem } from '@/services/api';

interface SignalRContextType {
    connection: signalR.HubConnection | null;
    isConnected: boolean;
    lastMessage: { type: string, data: any } | null;
    notifications: NotificationItem[];
    markAsRead: (id: number) => Promise<void>;
    clearAll: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<{ type: string, data: any } | null>(null);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const data = await api.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await api.markNotificationRead(id);
            setNotifications((prev: NotificationItem[]) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const clearAll = async () => {
        try {
            await api.clearAllNotifications();
            setNotifications([]);
        } catch (err) {
            console.error('Failed to clear notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const hubUrl = process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/hubs/tradeportal`
            : 'http://localhost:5183/hubs/tradeportal';

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => localStorage.getItem('token') || ''
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('SignalR Connected!');
                    setIsConnected(true);

                    const playSound = () => {
                        try {
                            const audio = new Audio('/notification.mp3');
                            audio.play().catch(e => console.log('Audio playback prevented by browser:', e));
                        } catch (err) {
                            console.error('Failed to play notification sound:', err);
                        }
                    };

                    connection.on('RequestCreated', (data: any) => {
                        console.log('SignalR: RequestCreated', data);
                        setLastMessage({ type: 'RequestCreated', data });
                        playSound();
                    });

                    connection.on('RequestUpdated', (data: any) => {
                        console.log('SignalR: RequestUpdated', data);
                        setLastMessage({ type: 'RequestUpdated', data });
                        playSound();
                    });

                    connection.on('NewNotification', (data: any) => {
                        console.log('SignalR: NewNotification', data);
                        const newNotif: NotificationItem = {
                            id: data.id || Math.random(),
                            title: data.title,
                            message: data.message,
                            type: data.type as any,
                            isRead: false,
                            createdAt: new Date().toISOString(),
                            requestId: data.requestId
                        };
                        setNotifications((prev: NotificationItem[]) => [newNotif, ...prev].slice(0, 20));

                        // Play notification sound
                        playSound();
                    });
                })
                .catch((err: any) => {
                    console.error('SignalR Connection Error: ', err);
                });

            connection.onclose((error) => {
                console.log('SignalR Connection Closed', error);
                if (error && error.message.includes('401')) {
                    // Force instant logout if deactivated
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        document.cookie = 'auth-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
                        document.cookie = 'user-role=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';

                        if (!window.location.pathname.startsWith('/login')) {
                            window.location.href = '/login';
                        }
                    }
                }
                setIsConnected(false);
            });

            return () => {
                connection.stop();
            };
        }
    }, [connection]);

    return (
        <SignalRContext.Provider value={{ connection, isConnected, lastMessage, notifications, markAsRead, clearAll }}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    if (context === undefined) {
        throw new Error('useSignalR must be used within a SignalRProvider');
    }
    return context;
};
