'use client';

import React, { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { ROLE_MAP_BACKEND_TO_FRONTEND, DEFAULT_ROUTES, type UserRole } from '@/config/permissions';
import { translateError } from '@/utils/errorTranslator';

function LoginContent() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  // قراءة مسار إعادة التوجيه من الـ URL (يرسله الـ Middleware)
  const redirectPath = searchParams.get('redirect');

  /**
   * تحديد الصفحة المناسبة بعد تسجيل الدخول
   * الأولوية: redirect parameter → المسار الافتراضي حسب الدور
   */
  const getRedirectRoute = (roles: string[]): string => {
    // إذا كان هناك redirect parameter صالح، استخدمه
    if (redirectPath && redirectPath.startsWith('/') && redirectPath !== '/login') {
      return redirectPath;
    }
    // وإلا استخدم المسار الافتراضي حسب الدور
    const frontendRole = ROLE_MAP_BACKEND_TO_FRONTEND[roles[0]];
    if (frontendRole) {
      return DEFAULT_ROUTES[frontendRole] || '/dashboard';
    }
    return '/dashboard';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(userName, password);
      router.push(getRedirectRoute(loggedInUser.roles));
    } catch (err) {
      setErrorMsg(translateError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="login-page">
      {/* Background pattern */}
      <div className="login-bg-pattern" />

      {/* Theme toggle button */}
      {mounted && (
        <button onClick={toggleTheme} className="theme-toggle" title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}>
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      )}

      <div className="login-container">
        {/* Left side - branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="2" opacity="0.3" />
                <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="2" opacity="0.5" />
                <path d="M40 15 L40 65 M15 40 L65 40" stroke="white" strokeWidth="2" opacity="0.3" />
                <circle cx="40" cy="40" r="8" fill="white" opacity="0.9" />
              </svg>
            </div>
            <h1 className="branding-title">مديرية الشركات</h1>
            <p className="branding-subtitle">نظام إدارة العلامات التجارية</p>
            <div className="branding-divider" />
            <p className="branding-description">
              الإدارة العامة للتجارة الداخلية وحماية المستهلك
              <br />
              الجمهورية العربية السورية
            </p>
          </div>

          {/* Decorative elements */}
          <div className="branding-decoration">
            <div className="deco-circle deco-circle-1" />
            <div className="deco-circle deco-circle-2" />
            <div className="deco-circle deco-circle-3" />
          </div>
        </div>

        {/* Right side - login form */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="form-header">
              <h2 className="form-title">تسجيل الدخول</h2>
              <p className="form-subtitle">أدخل بياناتك للوصول إلى النظام</p>
            </div>

            {errorMsg && (
              <div className="error-alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="userName" className="form-label">
                  اسم المستخدم
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="form-input"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  كلمة المرور
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="form-input form-input-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !userName || !password}
                className="login-button"
              >
                {isSubmitting ? (
                  <span className="button-loading">
                    <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  <span className="button-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    تسجيل الدخول
                  </span>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>© {new Date().getFullYear()} الإدارة العامة للتجارة الداخلية وحماية المستهلك</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }

        .login-bg-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 50%, rgba(0, 122, 61, 0.05) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(206, 17, 38, 0.04) 0%, transparent 50%),
                            radial-gradient(circle at 50% 80%, rgba(184, 134, 11, 0.03) 0%, transparent 50%);
        }

        /* Theme toggle */
        .theme-toggle {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 50;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--foreground);
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .theme-toggle:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          border-color: #007A3D;
          color: #007A3D;
        }

        .login-container {
          display: flex;
          width: 100%;
          max-width: 1000px;
          min-height: 580px;
          margin: 2rem;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 1;
        }

        /* Branding side */
        .login-branding {
          flex: 1;
          background: linear-gradient(135deg, #007A3D 0%, #005a2c 60%, #003d1e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }

        .branding-content {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .branding-icon {
          margin-bottom: 1.5rem;
          animation: pulse-slow 3s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        .branding-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .branding-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        .branding-divider {
          width: 60px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          margin: 1.5rem auto;
        }

        .branding-description {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
        }

        .branding-decoration {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .deco-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .deco-circle-1 {
          width: 200px; height: 200px;
          top: -60px; right: -60px;
        }

        .deco-circle-2 {
          width: 300px; height: 300px;
          bottom: -100px; left: -100px;
        }

        .deco-circle-3 {
          width: 150px; height: 150px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-width: 2px;
          opacity: 0.05;
          background: white;
        }

        /* Form side */
        .login-form-section {
          flex: 1;
          background: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 380px;
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: #64748b;
          font-size: 0.9rem;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(206, 17, 38, 0.08);
          border: 1px solid rgba(206, 17, 38, 0.2);
          border-radius: 10px;
          color: #CE1126;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--foreground);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          right: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 2.75rem 0.75rem 1rem;
          background: var(--background);
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          font-size: 0.95rem;
          color: var(--foreground);
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
          text-align: right;
          direction: rtl;
        }

        .form-input-password {
          padding-left: 2.75rem;
        }

        .form-input:focus {
          border-color: #007A3D;
          box-shadow: 0 0 0 3px rgba(0, 122, 61, 0.1);
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        /* Password toggle */
        .password-toggle {
          position: absolute;
          left: 10px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .password-toggle:hover {
          color: #007A3D;
          background: rgba(0, 122, 61, 0.08);
        }

        .login-button {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #007A3D 0%, #005a2c 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          font-family: inherit;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0, 122, 61, 0.3);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-content, .button-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        .spinner-track { opacity: 0.25; }
        .spinner-head { opacity: 0.75; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        .login-footer p {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Dark mode adjustments */
        :global(.dark) .form-subtitle {
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            max-width: 100%;
            min-height: auto;
            margin: 1rem;
            border-radius: 16px;
          }

          .login-branding {
            padding: 2rem;
          }

          .branding-title {
            font-size: 1.5rem;
          }

          .login-form-section {
            padding: 2rem;
          }

          .theme-toggle {
            top: 1rem;
            left: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sy-green"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
