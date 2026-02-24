'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROLE_MAP_BACKEND_TO_FRONTEND, DEFAULT_ROUTES } from '@/config/permissions';

/**
 * تحديد الصفحة الافتراضية حسب دور المستخدم
 * يستخدم ملف الصلاحيات المركزي
 */
function getDefaultRoute(roles: string[]): string {
  const frontendRole = ROLE_MAP_BACKEND_TO_FRONTEND[roles[0]];
  if (frontendRole) {
    return DEFAULT_ROUTES[frontendRole] || '/dashboard';
  }
  return '/dashboard';
}

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        router.replace(getDefaultRoute(user.roles));
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid var(--border-color)',
        borderTopColor: '#007A3D',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
