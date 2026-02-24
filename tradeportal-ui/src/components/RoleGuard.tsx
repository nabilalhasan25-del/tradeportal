"use client";

import { useLayout } from "@/context/LayoutContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { isRouteAllowed, DEFAULT_ROUTES, type UserRole } from "@/config/permissions";

/**
 * مكوّن حماية المسارات — يُستخدم في Layout
 * يتحقق من الدور ويمنع الوصول غير المصرح مع إعادة توجيه تلقائية
 * يعتمد على ملف permissions.ts المركزي
 */
export default function RouteGuard({ children }: { children: React.ReactNode }) {
    const { userRole } = useLayout();
    const router = useRouter();
    const pathname = usePathname();
    const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking");

    useEffect(() => {
        if (isRouteAllowed(pathname, userRole as UserRole)) {
            setStatus("allowed");
        } else {
            setStatus("denied");
            const defaultRoute = DEFAULT_ROUTES[userRole as UserRole] || "/dashboard";
            const timer = setTimeout(() => {
                router.replace(defaultRoute);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [userRole, pathname, router]);

    if (status === "checking") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-3 border-border border-t-sy-green rounded-full animate-spin" />
            </div>
        );
    }

    if (status === "denied") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4 p-8 bg-card border border-border rounded-2xl shadow-lg max-w-md">
                    <div className="w-16 h-16 mx-auto bg-sy-red/10 rounded-full flex items-center justify-center">
                        <ShieldAlert className="w-8 h-8 text-sy-red" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">غير مصرح بالدخول</h2>
                    <p className="text-sm text-muted-foreground">
                        ليس لديك صلاحية للوصول إلى هذه الصفحة.
                        <br />
                        جارٍ إعادة التوجيه...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
