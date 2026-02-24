"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLookups } from "@/context/LookupsContext";
import { UserRole, ROLE_MAP_BACKEND_TO_FRONTEND } from "@/config/permissions";

interface LayoutContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    userRole: UserRole;
    userProvince: string;
    setRole: (role: UserRole) => void;
    setProvince: (province: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

/**
 * تحويل أسماء الأدوار من الباك إند إلى أسماء الأدوار في الفرونت
 */
function mapBackendRole(roles: string[]): UserRole {
    // نبحث عن أول دور للمستخدم موجود في الخارطة
    for (const role of roles) {
        if (ROLE_MAP_BACKEND_TO_FRONTEND[role]) {
            return ROLE_MAP_BACKEND_TO_FRONTEND[role];
        }
    }
    return "ADMIN"; // القيمة الافتراضية
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const { provinces } = useLookups();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRole>("ADMIN");
    const [userProvince, setUserProvince] = useState("دمشق");

    // مزامنة الدور والمحافظة مع بيانات المستخدم الحقيقية
    useEffect(() => {
        if (isAuthenticated && user) {
            setUserRole(mapBackendRole(user.roles));

            // تحديث اسم المحافظة بناءً على ID المستخدم
            if (user.provinceId && provinces.length > 0) {
                const prov = provinces.find((p: any) => p.id === user.provinceId);
                if (prov) {
                    setUserProvince(prov.nameAr);
                }
            }
        }
    }, [isAuthenticated, user, provinces]);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    const setRole = (role: UserRole) => setUserRole(role);
    const setProvince = (province: string) => setUserProvince(province);

    return (
        <LayoutContext.Provider value={{
            isSidebarOpen,
            toggleSidebar,
            closeSidebar,
            userRole,
            userProvince,
            setRole,
            setProvince
        }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
}
