import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware — حماية Server-Side
 * يعمل قبل تحميل أي صفحة ويتحقق من:
 * 1. وجود التوكن (مصادقة)
 * 2. صلاحيات الدور (تفويض)
 *
 * ⚠️  يستخدم cookies لأن localStorage غير متاح في Middleware
 */

// المسارات العامة
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

// خارطة الصلاحيات — أسماء أدوار الـ Backend (كما تُخزّن في Cookie)
const ROUTE_ROLES: Record<string, string[]> = {
    "/dashboard": ["Admin", "ProvinceAdmin", "CentralAuditorAdmin", "IpExpertAdmin"],
    "/provincial": ["Admin", "ProvinceAdmin", "ProvinceEmployee"],
    "/central": ["Admin", "CentralAuditorAdmin", "CentralAuditor"],
    "/ip": ["Admin", "IpExpertAdmin", "IpExpert"],
    "/admin/users": ["Admin", "ProvinceAdmin", "CentralAuditorAdmin", "IpExpertAdmin"],
    "/admin/lookups": ["Admin"],
    "/admin/settings": ["Admin"],
    "/admin/logs": ["Admin"],
};

// المسار الافتراضي حسب الدور
const DEFAULT_ROUTE: Record<string, string> = {
    Admin: "/dashboard",
    ProvinceAdmin: "/dashboard",
    ProvinceEmployee: "/provincial",
    CentralAuditorAdmin: "/dashboard",
    CentralAuditor: "/central",
    IpExpertAdmin: "/dashboard",
    IpExpert: "/ip",
};

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some(p => pathname.startsWith(p));
}

function getRouteRoles(pathname: string): string[] | null {
    // مطابقة دقيقة أولاً
    if (ROUTE_ROLES[pathname]) return ROUTE_ROLES[pathname];

    // مطابقة بادئة (wildcard)
    for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
        if (pathname.startsWith(route + "/")) return roles;
    }

    return null; // غير مسجل = مسموح
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. تجاهل الأصول الثابتة و API routes
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".") // ملفات ثابتة (favicon, images, etc.)
    ) {
        return NextResponse.next();
    }

    // 2. المسارات العامة — لا تحتاج تسجيل دخول
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // 3. التحقق من التوكن (المصادقة)
    const token = request.cookies.get("auth-token")?.value;
    const userRoleCookie = request.cookies.get("user-role")?.value;

    if (!token) {
        // غير مسجّل — إعادة توجيه لصفحة الدخول
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. التحقق من الصلاحيات (التفويض)
    if (userRoleCookie) {
        const requiredRoles = getRouteRoles(pathname);

        if (requiredRoles && !requiredRoles.includes(userRoleCookie)) {
            // لا يملك صلاحية — إعادة توجيه للمسار الافتراضي
            const defaultRoute = DEFAULT_ROUTE[userRoleCookie] || "/dashboard";
            const redirectUrl = new URL(defaultRoute, request.url);
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

// تطبيق الـ Middleware على جميع المسارات عدا الثابتة
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
