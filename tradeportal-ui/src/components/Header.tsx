"use client";

import React from "react";
import { Bell, Moon, Sun, User, Menu, Shield, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useLayout } from "@/context/LayoutContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSignalR } from "@/context/SignalRContext";
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * مكون الهيدر (Header) - الجزء العلوي من النظام
 */
export default function Header() {
    const { theme, setTheme } = useTheme();
    const { toggleSidebar, userRole, userProvince, setRole } = useLayout();
    const { user, logout, isAuthenticated } = useAuth();
    const { notifications, markAsRead, clearAll } = useSignalR();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // التحقق من الجاهزية بعد التحميل الأولي (تجنب مشاكل الهيدرة)
    useEffect(() => {
        setMounted(true);
    }, []);

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

        if (diffInMinutes < 1) return 'الآن';
        if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
        if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
        return date.toLocaleDateString('ar-SY');
    };

    // إغلاق قائمة التنبيهات عند النقر في أي مكان آخر
    useEffect(() => {
        const handleClickOutside = () => {
            setIsNotificationsOpen(false);
            setIsProfileOpen(false);
        };
        if (isNotificationsOpen || isProfileOpen) {
            window.addEventListener("click", handleClickOutside);
        }
        return () => window.removeEventListener("click", handleClickOutside);
    }, [isNotificationsOpen, isProfileOpen]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // الحصول على اسم الدور بالعربي
    const getRoleName = (role: string) => {
        switch (role) {
            case "ADMIN": return "المدير العام للمنصة";
            case "PROVINCIAL_ADMIN": return `مسؤول مديرية ${userProvince}`;
            case "PROVINCE_EMPLOYEE": return `موظف مديرية ${userProvince}`;
            case "CENTRAL_AUDITOR_ADMIN": return "مدير التدقيق المركزي";
            case "CENTRAL_AUDITOR": return "موظف تدقيق مركزي";
            case "IP_EXPERT_ADMIN": return "مدير خبراء الملكية";
            case "IP_EXPERT": return "موظف ملكية فكرية";
            case "DIRECTOR": return "المدير العام لمديرية الشركات";
            case "MINISTER_ASSISTANT": return "معاون وزير التجارة الداخلية";
            case "REGISTRY_OFFICER": return "أمين السجل التجاري الرئيسي";
            default: return "مستخدم";
        }
    };

    const getRoleSwitcherLabel = (role: string) => {
        switch (role) {
            case "ADMIN": return "المدير العام";
            case "PROVINCIAL_ADMIN": return "مسؤول المحافظة";
            case "PROVINCE_EMPLOYEE": return "موظف محافظة";
            case "CENTRAL_AUDITOR_ADMIN": return "مدير التدقيق";
            case "CENTRAL_AUDITOR": return "موظف تدقيق";
            case "IP_EXPERT_ADMIN": return "مدير الملكية";
            case "IP_EXPERT": return "موظف ملكية";
            case "DIRECTOR": return "المدير العام";
            case "MINISTER_ASSISTANT": return "معاون الوزير";
            case "REGISTRY_OFFICER": return "أمين السجل";
            default: return "مستخدم";
        }
    };

    const getRoleSwitcherColor = (role: string) => {
        switch (role) {
            case "ADMIN": return "bg-sy-gold/10 text-sy-gold border-sy-gold/20";
            case "PROVINCIAL_ADMIN": return "bg-sy-green/10 text-sy-green border-sy-green/20";
            case "PROVINCE_EMPLOYEE": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "CENTRAL_AUDITOR_ADMIN": return "bg-sy-red/10 text-sy-red border-sy-red/20";
            case "CENTRAL_AUDITOR": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "IP_EXPERT_ADMIN": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "IP_EXPERT": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "DIRECTOR": return "bg-sy-gold/10 text-sy-gold border-sy-gold/20";
            case "MINISTER_ASSISTANT": return "bg-blue-600/10 text-blue-600 border-blue-600/20";
            case "REGISTRY_OFFICER": return "bg-sy-green/10 text-sy-green border-sy-green/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    if (!mounted) return null;

    return (
        <header className="h-16 w-full bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            {/* القسم الأيمن: الشعار والعنوان */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-background rounded-md transition-colors"
                >
                    <Menu className="w-5 h-5 text-foreground" />
                </button>
                <div className="flex items-center gap-3">
                    {/* شعار الهوية البصرية السورية الرسمي */}
                    <div className="relative w-12 h-12 flex items-center justify-center p-1">
                        <Image
                            src="/logo.svg"
                            alt="الشعار الرسمي"
                            width={44}
                            height={44}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground leading-tight">مديرية الشركات</h1>
                        <p className="text-[10px] text-muted-foreground opacity-70">الجمهورية العربية السورية</p>
                    </div>
                </div>
            </div>

            {/* القسم الأيسر: الأدوات والبروفايل */}
            <div className="flex items-center gap-3">
                {/* زر التنبيهات */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`p-2 relative hover:bg-background rounded-full transition-all ${isNotificationsOpen ? "bg-background shadow-inner" : ""}`}
                    >
                        <Bell className="w-5 h-5 text-foreground/80" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sy-red text-[9px] font-bold text-white ring-2 ring-card animate-in zoom-in group-hover:scale-110 transition-transform">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* قائمة التنبيهات المنسدلة (Notifications Dropdown) */}
                    {isNotificationsOpen && (
                        <div className="absolute left-0 mt-3 w-80 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                                <h3 className="text-sm font-bold">التنبيهات الأخيرة ({unreadCount})</h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); clearAll(); }}
                                    className="text-[10px] text-sy-green font-bold hover:underline"
                                >
                                    مسح الكل
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto divide-y divide-border">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                                        <p className="text-xs text-muted-foreground italic">لا توجد تنبيهات جديدة حالياً</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markAsRead(Number(notif.id))}
                                            className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer group relative ${!notif.isRead ? "bg-sy-green/5" : ""}`}
                                        >
                                            {!notif.isRead && (
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sy-green rounded-l-full" />
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${notif.type === "new" ? "bg-sy-green/10 text-sy-green border border-sy-green/20" :
                                                        notif.type === "success" ? "bg-sy-gold/10 text-sy-gold border border-sy-gold/20" :
                                                            notif.type === "error" ? "bg-sy-red/10 text-sy-red border border-sy-red/20" :
                                                                "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                                        }`}>
                                                        {notif.type === "new" ? "طلب جديد" : notif.type === "success" ? "مكتمل" : notif.type === "error" ? "مرفوض" : "تحديث"}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">{formatTime(notif.createdAt)}</span>
                                                </div>
                                                <p className="text-sm font-bold mt-1">{notif.title}</p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-3 bg-muted/30 border-t border-border text-center">
                                <button className="text-xs font-bold text-foreground/60 hover:text-foreground transition-colors">عرض كافة التنبيهات ←</button>
                            </div>
                        </div>
                    )}
                </div>


                {/* زر تبديل المظهر (ليلي/نهاري) */}
                {mounted ? (
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 hover:bg-background rounded-full transition-colors hidden sm:block"
                        title={theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-foreground/80" />
                        ) : (
                            <Moon className="w-5 h-5 text-foreground/80" />
                        )}
                    </button>
                ) : (
                    <div className="w-9 h-9 hidden sm:block"></div>
                )}

                {/* زر تسجيل الخروج السريع */}
                <button
                    onClick={handleLogout}
                    title="تسجيل الخروج"
                    className="p-2 text-sy-red hover:bg-sy-red/10 rounded-full transition-colors hidden sm:flex items-center gap-2"
                >
                    <LogOut className="w-5 h-5" />
                </button>

                <div className="h-6 w-[1px] bg-border mx-2"></div>

                {/* بروفايل المستخدم مع قائمة منسدلة */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <div
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 px-2 py-1 hover:bg-background rounded-lg cursor-pointer transition-colors"
                    >
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-bold text-foreground">
                                {isAuthenticated && user ? user.fullName : "مستخدم"}
                            </p>
                            <p className="text-[10px] text-muted-foreground text-right">
                                {getRoleName(userRole)}
                            </p>
                        </div>
                        <div className="w-9 h-9 bg-sy-green/10 rounded-full flex items-center justify-center border border-sy-green/20">
                            <User className="w-5 h-5 text-sy-green" />
                        </div>
                    </div>

                    {/* قائمة بروفايل منسدلة */}
                    {isProfileOpen && (
                        <div className="absolute left-0 mt-3 w-56 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50">
                            {isAuthenticated && user && (
                                <div className="p-4 border-b border-border bg-muted/30">
                                    <p className="text-sm font-bold">{user.fullName}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{user.email}</p>
                                    <p className="text-[10px] text-muted-foreground">@{user.userName}</p>
                                </div>
                            )}
                            <div className="p-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sy-red hover:bg-sy-red/10 transition-colors text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    تسجيل الخروج
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
