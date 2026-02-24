"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Shield,
    Lock,
    Unlock,
    Save,
    Search,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    Info,
    RefreshCw,
    Users,
    Key,
    ChevronLeft,
    FileText,
    Settings,
    UserCheck,
    Database,
    ShieldCheck
} from "lucide-react";
import api, { RolePermissionMatrix, RolePermissionData } from "@/services/api";

/**
 * صفحة مصفوفة الصلاحيات (Permission Matrix) - النسخة المطورة
 * توفر واجهة احترافية ومقسمة حسب الأدوار مع ترجمة ثنائية
 */

// ترجمة الأدوار
const ROLE_LABELS: Record<string, { ar: string, en: string, icon: any }> = {
    "Admin": { ar: "مدير النظام", en: "System Admin", icon: ShieldCheck },
    "ProvinceAdmin": { ar: "مدير المحافظة", en: "Province Admin", icon: Users },
    "ProvinceEmployee": { ar: "موظف المحافظة", en: "Province Employee", icon: UserCheck },
    "CentralAuditorAdmin": { ar: "مدير التدقيق المركزي", en: "Central Auditor Admin", icon: Shield },
    "CentralAuditor": { ar: "مدقق مركزي", en: "Central Auditor", icon: Search },
    "IpExpertAdmin": { ar: "مدير خبراء الملكية", en: "IP Expert Admin", icon: Key },
    "IpExpert": { ar: "خبير ملكية فكرية", en: "IP Expert", icon: Info },
};

// تصنيف الصلاحيات
const PERMISSION_GROUPS = [
    {
        id: "requests",
        nameAr: "الطلبات والملفات",
        nameEn: "Requests & Attachments",
        icon: FileText,
        permissions: ["إنشاء طلب جديد", "تعديل المسودات", "رفع الملفات (PDF)", "تتبع حالة الطلبات", "معاينة الإضبارات"]
    },
    {
        id: "audit",
        nameAr: "التدقيق واتخاذ القرار",
        nameEn: "Audit & Decision Making",
        icon: UserCheck,
        permissions: ["فحص تطابق الأسماء", "طلب استشارة فنية", "اتخاذ القرار النهائي", "استقبال طلبات الفحص", "إعداد التقارير الفنية", "حجز الطلبات للتدقيق", "إضافة ملاحظات داخلية"]
    },
    {
        id: "system",
        nameAr: "إدارة النظام",
        nameEn: "System Administration",
        icon: Settings,
        permissions: ["إدارة البيانات الأساسية", "تصدير البيانات (Excel/PDF)", "عرض لوحات الإحصائيات", "إدارة المستخدمين", "تعديل الصلاحيات", "ضبط إعدادات النظام", "الوصول لسجل المراجعة الكامل"]
    }
];

export default function PermissionMatrixPage() {
    const [matrix, setMatrix] = useState<RolePermissionMatrix | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // تحميل البيانات
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getPermissionMatrix();
            setMatrix(data);
            if (data.roles.length > 0 && !selectedRoleId) {
                setSelectedRoleId(data.roles[0].id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "فشل تحميل مصفوفة الصلاحيات");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const selectedRole = useMemo(() =>
        matrix?.roles.find(r => r.id === selectedRoleId) || null
        , [matrix, selectedRoleId]);

    // تبديل صلاحية
    const togglePermission = (permission: string) => {
        if (!matrix || !selectedRoleId) return;

        setMatrix(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                roles: prev.roles.map(role => {
                    if (role.id === selectedRoleId) {
                        const hasPerm = role.permissions.includes(permission);
                        return {
                            ...role,
                            permissions: hasPerm
                                ? role.permissions.filter(p => p !== permission)
                                : [...role.permissions, permission]
                        };
                    }
                    return role;
                })
            };
        });
    };

    // حفظ التغييرات للدور المختار
    const handleSave = async () => {
        if (!selectedRole) return;
        setIsSaving(true);
        setSuccessMessage(null);
        try {
            await api.updateRolePermissions(selectedRole.id, selectedRole.permissions);
            const roleLabels = ROLE_LABELS[selectedRole.name] || { ar: selectedRole.name };
            setSuccessMessage(`تمت تحديث صلاحيات "${roleLabels.ar}" بنجاح`);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            alert(err instanceof Error ? err.message : "فشل التحديث");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Loader2 className="w-12 h-12 text-sy-green animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">جاري تجهيز بيئة الصلاحيات...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
                <AlertTriangle className="w-16 h-16 text-sy-red animate-bounce" />
                <h3 className="text-2xl font-bold">خطأ في الاتصال</h3>
                <p className="text-muted-foreground max-w-sm">{error}</p>
                <button onClick={fetchData} className="mt-4 flex items-center gap-2 bg-sy-green hover:bg-sy-green/90 text-white px-8 py-3 rounded-2xl transition-all active:scale-95 shadow-lg shadow-sy-green/20">
                    <RefreshCw className="w-5 h-5" /> إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/50">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-sy-green/10 rounded-3xl shadow-lg border border-sy-green/20">
                        <ShieldCheck className="w-10 h-10 text-sy-green" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-foreground/90">إدارة صلاحيات الوصول</h2>
                        <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                            تحكم كامل في مصفوفة الصلاحيات (Role-Based Access Control)
                            <span className="w-1.5 h-1.5 rounded-full bg-sy-green animate-pulse" />
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-card p-1.5 rounded-2xl border border-border/40 shadow-sm">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="ابحث عن صلاحية محددة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-muted/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-sy-green/30 outline-none transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-sy-green active:rotate-180 duration-500"
                        title="تحديث البيانات"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar: Roles List */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
                        <div className="p-5 border-b border-border bg-muted/30">
                            <h3 className="font-black flex items-center gap-2">
                                <Users className="w-5 h-5 text-sy-green" />
                                <span>أدوار النظام</span>
                                <span className="text-[10px] bg-sy-green/10 text-sy-green px-2 py-0.5 rounded-full mr-auto">{matrix?.roles.length} أدوار</span>
                            </h3>
                        </div>
                        <div className="p-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {matrix?.roles.map(role => {
                                const labels = ROLE_LABELS[role.name] || { ar: role.name, en: role.name, icon: Users };
                                const isSelected = selectedRoleId === role.id;
                                const Icon = labels.icon;

                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRoleId(role.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative border ${isSelected
                                                ? "bg-sy-green text-white shadow-lg shadow-sy-green/20 border-sy-green py-5"
                                                : "hover:bg-muted border-transparent text-foreground/70"
                                            }`}
                                    >
                                        <div className={`p-2.5 rounded-xl transition-colors ${isSelected ? "bg-white/20" : "bg-muted group-hover:bg-white/50"}`}>
                                            <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground group-hover:text-sy-green"}`} />
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm">{labels.ar}</div>
                                            <div className={`text-[10px] font-medium opacity-60 uppercase tracking-wider ${isSelected ? "text-white" : "text-muted-foreground"}`}>
                                                {labels.en}
                                            </div>
                                        </div>
                                        {isSelected && <ChevronLeft className="w-5 h-5 mr-auto animate-in slide-in-from-right-2" />}
                                        {role.isSmartRole && (
                                            <div className={`absolute top-2 left-2 p-1 rounded-full ${isSelected ? "text-white/40" : "text-sy-gold/40"}`}>
                                                <Info className="w-3 h-3" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="p-6 bg-sy-gold/5 border border-sy-gold/20 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-sy-gold">
                            <Info className="w-5 h-5" />
                            <h4 className="font-bold text-sm">ملاحظة تقنية</h4>
                        </div>
                        <p className="text-[11px] leading-relaxed text-sy-gold/80 italic">
                            سيتم تطبيق التعديلات لحظياً على الخادم، ولكن قد يحتاج المستخدم النشط لإعادة الدخول لتحديث القائمة الجانبية (Client-side).
                        </p>
                    </div>
                </div>

                {/* Content: Permissions List */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {selectedRole ? (
                        <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden border-t-4 border-t-sy-green">
                            {/* Role Context Header */}
                            <div className="p-6 bg-muted/20 border-b border-border flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-sy-green rounded-2xl text-white shadow-lg shadow-sy-green/20">
                                        {selectedRole && React.createElement(ROLE_LABELS[selectedRole.name]?.icon || Shield, { className: "w-6 h-6" })}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">
                                            {ROLE_LABELS[selectedRole.name]?.ar || selectedRole.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                            Editing Permissions for: {ROLE_LABELS[selectedRole.name]?.en || selectedRole.name}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 bg-sy-green text-white px-8 py-3 rounded-2xl font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-sy-green/20 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> حفظ التغييرات</>}
                                </button>
                            </div>

                            {/* Success Inline Message */}
                            {successMessage && (
                                <div className="mx-6 mt-6 p-4 bg-sy-green/10 border border-sy-green/30 rounded-2xl text-sy-green flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-sm font-bold">{successMessage}</span>
                                </div>
                            )}

                            {/* Permission Sections */}
                            <div className="p-8 space-y-10">
                                {PERMISSION_GROUPS.map(group => {
                                    // Filter within group by search term
                                    const filteredInGroup = group.permissions.filter(p =>
                                        p.includes(searchTerm) || group.nameAr.includes(searchTerm)
                                    );

                                    if (filteredInGroup.length === 0) return null;

                                    return (
                                        <div key={group.id} className="space-y-6">
                                            <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                                                <group.icon className="w-5 h-5 text-sy-green" />
                                                <div className="flex flex-col">
                                                    <h4 className="font-black text-lg text-foreground/80">{group.nameAr}</h4>
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{group.nameEn}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {filteredInGroup.map(perm => {
                                                    const isGranted = selectedRole.permissions.includes(perm);
                                                    return (
                                                        <button
                                                            key={perm}
                                                            onClick={() => togglePermission(perm)}
                                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-right group ${isGranted
                                                                    ? "bg-sy-green/5 border-sy-green/30 hover:border-sy-green/60"
                                                                    : "bg-muted/30 border-border/50 hover:border-border hover:bg-muted/50"
                                                                }`}
                                                        >
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isGranted
                                                                    ? "bg-sy-green text-white shadow-md shadow-sy-green/10 rotate-3"
                                                                    : "bg-muted text-muted-foreground/30 group-hover:bg-muted/80"
                                                                }`}>
                                                                {isGranted ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className={`font-bold text-sm ${isGranted ? "text-foreground" : "text-muted-foreground"}`}>
                                                                    {perm}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground/60 mt-0.5 font-medium">
                                                                    {isGranted ? "صلاحية ممنوحة" : "وصول مقيد"}
                                                                </div>
                                                            </div>
                                                            <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${isGranted ? "border-sy-green bg-sy-green" : "border-muted-foreground/20"
                                                                }`}>
                                                                {isGranted && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Special Logic Alert for Smart Roles */}
                                {selectedRole.isSmartRole && (
                                    <div className="p-5 bg-sy-gold/10 border border-sy-gold/40 rounded-3xl flex gap-4">
                                        <div className="p-3 bg-sy-gold/20 rounded-2xl h-fit">
                                            <AlertTriangle className="w-6 h-6 text-sy-gold" />
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="font-black text-sy-gold">تنبيه: دور ذكي (Hardcoded Business Logic)</h5>
                                            <p className="text-xs text-sy-gold/70 leading-relaxed">
                                                هذا الدور يمتلك قيوداً برمجية ثابتة في النظام. مثلاً: سيظل المستخدم يرى طلبات محافظته فقط حتى لو تم منح كل الصلاحيات. الصلاحيات الممنوحة هنا تتحكم بظهور الأزرار والواجهات فقط.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card rounded-3xl border border-dashed border-border flex flex-col items-center justify-center p-20 gap-4 text-center grayscale opacity-50">
                            <Shield className="w-20 h-20 text-muted-foreground" />
                            <h3 className="text-xl font-bold">يرجى اختيار دور للبدء</h3>
                            <p className="text-sm text-muted-foreground max-w-xs">اختر أحد أدوار النظام من القائمة الجانبية لعرض وتعديل مصفوفة الصلاحيات الخاصة به.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
