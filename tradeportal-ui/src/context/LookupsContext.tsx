"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { LookupItem, StatusItem, ChecklistTemplateItem, ProvinceFeeRuleDto, ProvinceFeeRuleCreateDto, ProvinceFeeRuleUpdateDto } from "@/services/api";
import { useAuth } from "./AuthContext";

/**
 * سياق البيانات الأساسية (Lookups Context)
 * يوفر الوصول للبيانات الديناميكية من الـ API الحقيقي
 * المحافظات، أنواع الشركات، وحالات الطلبات
 */

interface LookupsState {
    provinces: LookupItem[];
    companyTypes: LookupItem[];
    statuses: StatusItem[];
    provinceFees: ProvinceFeeRuleDto[];
    isLoading: boolean;
    error: string | null;
}

interface LookupsContextType extends LookupsState {
    refresh: () => Promise<void>;
    lookups: {
        provinces: string[];
        companyTypes: string[];
        requestStatus: string[];
        roles: string[];
        mandatoryAttachments: string[];
        permissions: string[];
        attachmentsList: ChecklistTemplateItem[];
    };
    // Provinces
    addProvince: (nameAr: string) => Promise<void>;
    updateProvince: (id: number, nameAr: string) => Promise<void>;
    deleteProvince: (id: number) => Promise<void>;
    // Company Types
    addCompanyType: (nameAr: string) => Promise<void>;
    updateCompanyType: (id: number, nameAr: string) => Promise<void>;
    deleteCompanyType: (id: number) => Promise<void>;
    // Statuses
    addStatus: (nameAr: string, colorCode?: string) => Promise<void>;
    updateStatus: (id: number, nameAr: string, colorCode?: string) => Promise<void>;
    deleteStatus: (id: number) => Promise<void>;
    // Attachments
    addAttachment: (nameAr: string) => Promise<void>;
    updateAttachment: (id: number, nameAr: string) => Promise<void>;
    deleteAttachment: (id: number) => Promise<void>;
    // Province Fees
    loadProvinceFees: (provinceId: number) => Promise<void>;
    addProvinceFee: (data: ProvinceFeeRuleCreateDto) => Promise<void>;
    updateProvinceFee: (id: number, data: ProvinceFeeRuleUpdateDto) => Promise<void>;
    deleteProvinceFee: (id: number) => Promise<void>;
}

const LookupsContext = createContext<LookupsContextType | null>(null);

export function LookupsProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<LookupsState>({
        provinces: [],
        companyTypes: [],
        statuses: [],
        provinceFees: [],
        isLoading: true,
        error: null,
    });

    const [attachments, setAttachments] = useState<ChecklistTemplateItem[]>([]);
    const [systemRoles, setSystemRoles] = useState<string[]>([]);
    const [systemPermissions, setSystemPermissions] = useState<string[]>([]);

    const { isAuthenticated } = useAuth();

    // ── تحميل جميع البيانات من الـ API ──────────────────
    const refresh = useCallback(async () => {
        if (!isAuthenticated) return;

        setState(s => ({ ...s, isLoading: true, error: null }));
        try {
            const [provinces, companyTypes, statuses, templates, roles, permissions] = await Promise.all([
                api.getProvinces(),
                api.getCompanyTypes(),
                api.getStatuses(),
                api.getChecklistTemplates(),
                api.getRolesLookup(),
                api.getPermissionsLookup(),
            ]);
            setState({ provinces, companyTypes, statuses, provinceFees: [], isLoading: false, error: null });
            setAttachments(templates);
            setSystemRoles(roles);
            setSystemPermissions(permissions);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "فشل تحميل البيانات";
            setState(s => ({ ...s, isLoading: false, error: msg }));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            refresh();
        }
    }, [refresh, isAuthenticated]);

    // ── Provinces CRUD ─────────────────────────────────────
    const addProvince = useCallback(async (nameAr: string) => {
        await api.addProvince(nameAr);
        await refresh();
    }, [refresh]);

    const updateProvince = useCallback(async (id: number, nameAr: string) => {
        await api.updateProvince(id, { nameAr });
        await refresh();
    }, [refresh]);

    const deleteProvince = useCallback(async (id: number) => {
        await api.deleteProvince(id);
        await refresh();
    }, [refresh]);

    // ── Company Types CRUD ─────────────────────────────────
    const addCompanyType = useCallback(async (nameAr: string) => {
        await api.addCompanyType(nameAr);
        await refresh();
    }, [refresh]);

    const updateCompanyType = useCallback(async (id: number, nameAr: string) => {
        await api.updateCompanyType(id, { nameAr });
        await refresh();
    }, [refresh]);

    const deleteCompanyType = useCallback(async (id: number) => {
        await api.deleteCompanyType(id);
        await refresh();
    }, [refresh]);

    // ── Statuses CRUD ──────────────────────────────────────
    const addStatus = useCallback(async (nameAr: string, colorCode?: string) => {
        await api.addStatus(nameAr, colorCode);
        await refresh();
    }, [refresh]);

    const updateStatus = useCallback(async (id: number, nameAr: string, colorCode?: string) => {
        await api.updateStatus(id, { nameAr, colorCode });
        await refresh();
    }, [refresh]);

    const deleteStatus = useCallback(async (id: number) => {
        await api.deleteStatus(id);
        await refresh();
    }, [refresh]);

    // ── Checklist CRUD ─────────────────────────────────────
    const addAttachment = useCallback(async (nameAr: string) => {
        await api.addChecklistTemplate(nameAr);
        await refresh();
    }, [refresh]);

    const updateAttachment = useCallback(async (id: number, nameAr: string) => {
        await api.updateChecklistTemplate(id, { nameAr });
        await refresh();
    }, [refresh]);

    const deleteAttachment = useCallback(async (id: number) => {
        await api.deleteChecklistTemplate(id);
        await refresh();
    }, [refresh]);

    // ── Province Fees CRUD ─────────────────────────────────
    const loadProvinceFees = useCallback(async (provinceId: number) => {
        setState(s => ({ ...s, isLoading: true }));
        try {
            const fees = await api.getProvinceFees(provinceId);
            setState(s => ({ ...s, provinceFees: fees, isLoading: false }));
        } catch (err) {
            setState(s => ({ ...s, isLoading: false, error: "فشل تحميل الرسوم" }));
        }
    }, []);

    const addProvinceFee = useCallback(async (data: ProvinceFeeRuleCreateDto) => {
        await api.addProvinceFeeRule(data);
        await loadProvinceFees(data.provinceId);
    }, [loadProvinceFees]);

    const updateProvinceFee = useCallback(async (id: number, data: ProvinceFeeRuleUpdateDto) => {
        const result = await api.updateProvinceFeeRule(id, data);
        await loadProvinceFees(result.provinceId);
    }, [loadProvinceFees]);

    const deleteProvinceFee = useCallback(async (id: number) => {
        // We need to know which province it was to refresh
        const fee = state.provinceFees.find(f => f.id === id);
        if (fee) {
            await api.deleteProvinceFeeRule(id);
            await loadProvinceFees(fee.provinceId);
        }
    }, [state.provinceFees, loadProvinceFees]);

    // ── التوافق مع النسخ القديمة (Dashboard) ─────────────────
    const lookups = {
        provinces: state.provinces.map(p => p.nameAr),
        companyTypes: state.companyTypes.map(t => t.nameAr),
        requestStatus: state.statuses.map(s => s.nameAr),
        roles: systemRoles,
        mandatoryAttachments: attachments.filter(a => a.isActive).map(a => a.nameAr),
        permissions: systemPermissions,
        // For administrative management
        attachmentsList: attachments,
    };

    return (
        <LookupsContext.Provider value={{
            ...state,
            lookups,
            refresh,
            addProvince, updateProvince, deleteProvince,
            addCompanyType, updateCompanyType, deleteCompanyType,
            addStatus, updateStatus, deleteStatus,
            addAttachment, updateAttachment, deleteAttachment,
            loadProvinceFees, addProvinceFee, updateProvinceFee, deleteProvinceFee
        }}>
            {children}
        </LookupsContext.Provider>
    );
}

export function useLookups() {
    const context = useContext(LookupsContext);
    if (!context) throw new Error("useLookups must be used within LookupsProvider");
    return context;
}
