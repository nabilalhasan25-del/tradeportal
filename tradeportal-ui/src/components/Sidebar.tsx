"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Clock,
    ShieldCheck,
    Settings,
    Users,
    Database,
    History,
    ShieldAlert,
    UserCheck
} from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { isRouteAllowed, type UserRole } from "@/config/permissions";

/**
 * مكون القائمة الجانبية (Sidebar)
 * يعتمد على ملف permissions.ts المركزي لفلترة العناصر
 */
export default function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, closeSidebar, userRole } = useLayout();

    // تحديد اسم لوحة التحكم حسب الدور
    const getDashboardName = () => {
        switch (userRole) {
            case "PROVINCIAL_ADMIN": return "لوحة المديرية المحلية";
            case "CENTRAL_AUDITOR_ADMIN": return "لوحة التدقيق المركزي";
            case "IP_EXPERT_ADMIN": return "لوحة خبراء الملكية";
            case "DIRECTOR": return "لوحة المدير العام";
            case "MINISTER_ASSISTANT": return "مكتب معاون الوزير";
            case "REGISTRY_OFFICER": return "السجل التجاري";
            default: return "لوحة الأدمن";
        }
    };

    // القائمة الرئيسية — تُفلتر تلقائياً من ملف الصلاحيات المركزي
    const menuItems = [
        { name: getDashboardName(), icon: LayoutDashboard, href: "/dashboard" },
        { name: "المديرية الفرعية", icon: FileText, href: "/provincial" },
        { name: "المدقق المركزي", icon: ShieldCheck, href: "/central" },
        { name: "خبير الملكية", icon: Clock, href: "/ip" },
        {
            name: userRole === "MINISTER_ASSISTANT" ? "مؤشرات معاون الوزير" : "مديرية الشركات",
            icon: ShieldCheck,
            href: userRole === "ADMIN" ? "/leadership?view=director" : "/leadership"
        },
        userRole === "ADMIN" && { name: "مكتب معاون الوزير", icon: UserCheck, href: "/leadership?view=minister" },
        { name: "السجل التجاري", icon: Database, href: "/registry" },
    ].filter((item): item is any => !!item && isRouteAllowed(item.href.split('?')[0], userRole as UserRole));

    // قائمة الإدارة — تُفلتر تلقائياً من ملف الصلاحيات المركزي
    const adminItems = [
        { name: "إدارة المستخدمين", icon: Users, href: "/admin/users" },
        { name: "بيانات النظام الأساسية", icon: Database, href: "/admin/lookups" },
        { name: "صلاحيات الأدوار", icon: ShieldCheck, href: "/admin/permissions" },
        { name: "إعدادات النظام", icon: Settings, href: "/admin/settings" },
        { name: "سجل العمليات العام", icon: History, href: "/admin/logs" },
        { name: "دليل الوصول والذكاء", icon: ShieldAlert, href: "/central/guide" },
    ].filter(item => isRouteAllowed(item.href, userRole as UserRole));

    return (
        <>
            {/* غطاء خلفي للشاشات الصغيرة عند فتح القائمة */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            <aside className={`
                fixed top-16 right-0 z-40 
                w-64 h-[calc(100vh-64px)] 
                bg-card border-l border-border shadow-xl
                flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            `}>
                <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">

                    {/* القسم الرئيسي */}
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest px-3 mb-4">
                            القائمة الرئيسية
                        </p>
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeSidebar}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                                            ? "bg-sy-green text-white shadow-lg shadow-sy-green/30 scale-[1.02] z-10"
                                            : "text-foreground/70 hover:bg-background hover:text-foreground"
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sy-gold rounded-l-full" />
                                        )}
                                        <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`} />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* قسم المسؤول (Admin) - يظهر فقط للأدوار التي لها صلاحية */}
                    {adminItems.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest px-3 mb-4">
                                الإدارة والنظام
                            </p>
                            <nav className="space-y-1">
                                {adminItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeSidebar}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                                                ? "bg-sy-gold text-white shadow-lg shadow-sy-gold/30 scale-[1.02] z-10"
                                                : "text-foreground/70 hover:bg-background hover:text-foreground"
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sy-green rounded-l-full" />
                                            )}
                                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`} />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    )}

                </div>

                {/* الجزء السفلي: معلومات النسخة */}
                <div className="p-4 border-t border-border">
                    <div className="bg-background/50 rounded-lg p-3 text-center">
                        <p className="text-[10px] text-muted-foreground">نظام إدارة الطلبات - v1.0</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">SYID Visual Identity applied</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
