'use client';

import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RouteGuard from "@/components/RoleGuard";
import { LayoutProvider, useLayout } from "@/context/LayoutContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * حارس المصادقة - يحمي صفحات لوحة التحكم
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-border border-t-sy-green rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <>{children}</>;
}

/**
 * المحتوى الفعلي للوحة التحكم مع التحكم في ظهور القائمة الجانبية
 */
function DashboardContent({ children }: { children: React.ReactNode }) {
    const { userRole } = useLayout();

    // الأدوار التنفيذية والقيادية التي نريد إخفاء القائمة الجانبية لها لتوسيع مساحة العمل (عارض الـ PDF والجداول)
    const rolesToHideSidebar = ["PROVINCE_EMPLOYEE", "CENTRAL_AUDITOR", "IP_EXPERT", "DIRECTOR", "MINISTER_ASSISTANT", "REGISTRY_OFFICER"];
    const shouldHideSidebar = rolesToHideSidebar.includes(userRole);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* الجزء العلوي الثابت */}
            <Header />

            <div className="flex flex-1 overflow-hidden relative">
                {/* القائمة الجانبية - تظهر فقط للأدوار الإدارية أو حسب الإعداد */}
                {!shouldHideSidebar && <Sidebar />}

                {/* المحتوى الرئيسي المتغير - يتمدد بالكامل إذا كانت القائمة مخفية */}
                <main className={`flex-1 overflow-y-auto bg-background/30 w-full transition-all duration-300 ${shouldHideSidebar ? 'p-2 md:p-4' : 'p-4 md:p-8 lg:mr-64'}`}>
                    <div className={`${shouldHideSidebar ? 'max-w-full' : 'max-w-7xl'} mx-auto space-y-8 h-full`}>
                        <RouteGuard>
                            {children}
                        </RouteGuard>
                    </div>
                </main>
            </div>
        </div>
    );
}

/**
 * غلاف لوحة التحكم (Dashboard Layout)
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <LayoutProvider>
                <DashboardContent>
                    {children}
                </DashboardContent>
            </LayoutProvider>
        </AuthGuard>
    );
}
