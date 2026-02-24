'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api, { LoginResponse } from '@/services/api';

// ─── Cookie helpers ───────────────────────────────────────────
function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// ─── JWT Token helpers ────────────────────────────────────────
/**
 * فك التوكن واستخراج الـ payload بدون مكتبات خارجية
 * يدعم فحص تاريخ الانتهاء (exp)
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

/**
 * هل التوكن منتهي الصلاحية؟
 * يضيف هامش أمان 60 ثانية — يعتبر التوكن منتهياً قبل دقيقة من الانتهاء الفعلي
 */
function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= payload.exp - 60; // هامش أمان 60 ثانية
}

/**
 * كم ثانية متبقية قبل انتهاء التوكن
 */
function getTokenRemainingSeconds(token: string): number {
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') return 0;
    const remaining = payload.exp - Math.floor(Date.now() / 1000);
    return Math.max(0, remaining);
}

// ─── Types ────────────────────────────────────────────────────
interface AuthUser {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    provinceId: number | null;
    roles: string[];
    permissions: string[];
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (userName: string, password: string) => Promise<AuthUser>;
    hasPermission: (permission: string) => boolean;
    logout: () => void;
    refreshUser: () => Promise<void>;
    error: string | null;
    tokenRemaining: number; // ثواني متبقية
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// فاصل فحص التوكن: كل دقيقة
const TOKEN_CHECK_INTERVAL = 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tokenRemaining, setTokenRemaining] = useState(0);
    const logoutRef = useRef<(() => void) | undefined>(undefined);

    // ─── Logout function ───────────────────────────────────
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setTokenRemaining(0);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        deleteCookie('auth-token');
        deleteCookie('user-role');
    }, []);

    // تخزين مرجع للـ logout لاستخدامه في useEffect بدون dependency
    logoutRef.current = logout;

    // ─── فحص التوكن وإخراج المستخدم تلقائياً ──────────────
    useEffect(() => {
        if (!token) return;

        const checkExpiry = () => {
            if (isTokenExpired(token)) {
                console.warn('⏰ انتهت صلاحية الجلسة — تسجيل خروج تلقائي');
                logoutRef.current?.();
                return;
            }
            setTokenRemaining(getTokenRemainingSeconds(token));
        };

        // فحص فوري
        checkExpiry();

        // فحص دوري كل دقيقة
        const interval = setInterval(checkExpiry, TOKEN_CHECK_INTERVAL);

        // فحص عند عودة المستخدم للمتصفح (visibilitychange)
        // هذا يغطي حالة: ترك المتصفح مفتوح → ذهب → رجع بعد انتهاء التوكن
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                checkExpiry();
            }
        };

        // فحص عند عودة الاتصال بالإنترنت
        const handleOnline = () => checkExpiry();

        // فحص عند العودة من النافذة (focus)
        const handleFocus = () => checkExpiry();

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('online', handleOnline);
        window.addEventListener('focus', handleFocus);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('focus', handleFocus);
        };
    }, [token]);

    // ─── تحميل البيانات من localStorage ─────────────────────
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            // ✅ فحص انتهاء التوكن قبل استعادة الجلسة
            if (isTokenExpired(savedToken)) {
                console.warn('⏰ التوكن المحفوظ منتهي الصلاحية — تنظيف');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                deleteCookie('auth-token');
                deleteCookie('user-role');
                setIsLoading(false);
                return;
            }

            try {
                setToken(savedToken);
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setTokenRemaining(getTokenRemainingSeconds(savedToken));

                // تأكد من وجود الـ Cookies
                setCookie('auth-token', savedToken);
                if (parsedUser.roles?.[0]) {
                    setCookie('user-role', parsedUser.roles[0]);
                }
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                deleteCookie('auth-token');
                deleteCookie('user-role');
            }
        }
        setIsLoading(false);
    }, []);

    // ─── تسجيل الدخول ────────────────────────────────────────
    const login = useCallback(async (userName: string, password: string) => {
        setError(null);
        setIsLoading(true);
        try {
            const response: LoginResponse = await api.login(userName, password);

            const authUser: AuthUser = {
                id: response.id,
                userName: response.userName,
                email: response.email,
                fullName: response.fullName,
                provinceId: response.provinceId,
                roles: response.roles,
                permissions: response.permissions,
            };

            setUser(authUser);
            setToken(response.token);
            setTokenRemaining(getTokenRemainingSeconds(response.token));
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(authUser));

            // تخزين في Cookie ليقرأها الـ Middleware
            setCookie('auth-token', response.token);
            setCookie('user-role', response.roles[0] || '');

            return authUser;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ─── تحديث بيانات المستخدم لحظياً ────────────────────────
    const refreshUser = useCallback(async () => {
        if (!token) return;
        try {
            const profile = await api.getProfile();
            const authUser: AuthUser = {
                id: profile.id,
                userName: profile.userName,
                email: profile.email,
                fullName: profile.fullName,
                provinceId: profile.provinceId,
                roles: profile.roles,
                permissions: profile.permissions,
            };
            setUser(authUser);
            localStorage.setItem('user', JSON.stringify(authUser));
            console.debug('🔄 تم تحديث مصفوفة الصلاحيات لحظياً من الخادم');
        } catch (err) {
            console.error('❌ فشل تحديث الصلاحيات:', err);
        }
    }, [token]);

    // تحديث الصلاحيات تلقائياً كل 30 ثانية أو عند التركيز
    useEffect(() => {
        if (!user || !token) return;

        const interval = setInterval(refreshUser, 30000); // 30 ثانية

        const handleRefresh = () => {
            if (document.visibilityState === 'visible') {
                refreshUser();
            }
        };

        window.addEventListener('focus', handleRefresh);
        document.addEventListener('visibilitychange', handleRefresh);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleRefresh);
            document.removeEventListener('visibilitychange', handleRefresh);
        };
    }, [user, token, refreshUser]);

    // ─── التحقق من الصلاحية ───────────────────────────────────
    const hasPermission = useCallback((permission: string) => {
        if (!user) return false;
        if (user.roles.includes('Admin')) return true; // مدير النظام لديه كامل الصلاحيات دائماً
        return user.permissions.includes(permission);
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user && !!token,
                login,
                hasPermission,
                logout,
                refreshUser,
                error,
                tokenRemaining,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
