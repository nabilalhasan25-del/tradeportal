/**
 * ملف الصلاحيات المركزي — المصدر الوحيد للحقيقة
 * يُستخدم في: Sidebar, RouteGuard, Middleware
 *
 * ⚠️  عند إضافة صفحة جديدة يكفي تحديث هذا الملف فقط
 */

// ─── أنواع الأدوار ──────────────────────────────────────────
export type UserRole =
    | "ADMIN"
    | "PROVINCIAL_ADMIN"
    | "PROVINCE_EMPLOYEE"
    | "CENTRAL_AUDITOR_ADMIN"
    | "CENTRAL_AUDITOR"
    | "IP_EXPERT_ADMIN"
    | "IP_EXPERT"
    | "DIRECTOR"
    | "MINISTER_ASSISTANT"
    | "REGISTRY_OFFICER";

// ─── خارطة صلاحيات المسارات ─────────────────────────────────
// كل مسار → قائمة الأدوار المسموحة
// المسارات غير المسجلة تكون مسموحة تلقائياً لأي مستخدم مسجّل
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    "/dashboard": ["ADMIN", "PROVINCIAL_ADMIN", "CENTRAL_AUDITOR_ADMIN", "IP_EXPERT_ADMIN"],
    "/provincial": ["ADMIN", "PROVINCIAL_ADMIN", "PROVINCE_EMPLOYEE"],
    "/central": ["ADMIN", "CENTRAL_AUDITOR_ADMIN", "CENTRAL_AUDITOR"],
    "/ip": ["ADMIN", "IP_EXPERT_ADMIN", "IP_EXPERT"],
    "/admin/users": ["ADMIN", "PROVINCIAL_ADMIN", "CENTRAL_AUDITOR_ADMIN", "IP_EXPERT_ADMIN"],
    "/admin/lookups": ["ADMIN"],
    "/admin/settings": ["ADMIN"],
    "/admin/permissions": ["ADMIN"],
    "/admin/logs": ["ADMIN"],
    "/leadership": ["ADMIN", "DIRECTOR", "MINISTER_ASSISTANT"],
    "/registry": ["ADMIN", "REGISTRY_OFFICER"],
    "/central/guide": ["ADMIN"],
};

// ─── المسار الافتراضي حسب الدور ─────────────────────────────
// عند رفض الوصول يُعاد توجيه المستخدم إلى هذا المسار
export const DEFAULT_ROUTES: Record<UserRole, string> = {
    ADMIN: "/dashboard",
    PROVINCIAL_ADMIN: "/dashboard",
    PROVINCE_EMPLOYEE: "/provincial",
    CENTRAL_AUDITOR_ADMIN: "/dashboard",
    CENTRAL_AUDITOR: "/central",
    IP_EXPERT_ADMIN: "/dashboard",
    IP_EXPERT: "/ip",
    DIRECTOR: "/leadership",
    MINISTER_ASSISTANT: "/leadership",
    REGISTRY_OFFICER: "/registry",
};

// ─── المسارات العامة (بدون تسجيل دخول) ──────────────────────
export const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

// ─── التحقق من صلاحية الوصول ─────────────────────────────────
export function isRouteAllowed(pathname: string, role: UserRole): boolean {
    // مطابقة دقيقة أولاً
    const exactMatch = ROUTE_PERMISSIONS[pathname];
    if (exactMatch) return exactMatch.includes(role);

    // مطابقة بادئة (wildcard) — مثلاً /admin/* يطابق /admin/reports
    for (const [route, roles] of Object.entries(ROUTE_PERMISSIONS)) {
        if (pathname.startsWith(route + "/")) {
            return roles.includes(role);
        }
    }

    // مسارات غير مسجلة — مسموحة تلقائياً
    return true;
}

// ─── التحقق من المسارات العامة ────────────────────────────────
export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

// ─── تحويل دور الـ Backend إلى Frontend ──────────────────────
// Backend يستخدم أسماء مثل "ProvinceAdmin"
// Frontend يستخدم أسماء مثل "PROVINCIAL_ADMIN"
export const ROLE_MAP_BACKEND_TO_FRONTEND: Record<string, UserRole> = {
    "Admin": "ADMIN",
    "ProvinceAdmin": "PROVINCIAL_ADMIN",
    "ProvinceEmployee": "PROVINCE_EMPLOYEE",
    "CentralAuditorAdmin": "CENTRAL_AUDITOR_ADMIN",
    "CentralAuditor": "CENTRAL_AUDITOR",
    "IpExpertAdmin": "IP_EXPERT_ADMIN",
    "IpExpert": "IP_EXPERT",
    "Director": "DIRECTOR",
    "MinisterAssistant": "MINISTER_ASSISTANT",
    "RegistryOfficer": "REGISTRY_OFFICER",
};

// ─── عكس الخارطة: Frontend → Backend ────────────────────────
export const ROLE_MAP_FRONTEND_TO_BACKEND: Record<UserRole, string> = {
    ADMIN: "Admin",
    PROVINCIAL_ADMIN: "ProvinceAdmin",
    PROVINCE_EMPLOYEE: "ProvinceEmployee",
    CENTRAL_AUDITOR_ADMIN: "CentralAuditorAdmin",
    CENTRAL_AUDITOR: "CentralAuditor",
    IP_EXPERT_ADMIN: "IpExpertAdmin",
    IP_EXPERT: "IpExpert",
    DIRECTOR: "Director",
    MINISTER_ASSISTANT: "MinisterAssistant",
    REGISTRY_OFFICER: "RegistryOfficer",
};
