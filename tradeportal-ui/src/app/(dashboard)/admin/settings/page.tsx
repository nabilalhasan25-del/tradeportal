"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Settings,
    Bell,
    Database,
    Globe,
    ShieldAlert,
    Save,
    Palette,
    Mail,
    Smartphone,
    History as HistoryIcon,
    Loader2,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Lock,
    Eye,
    EyeOff,
    Sparkles
} from "lucide-react";
import api, { SystemSetting } from "@/services/api";

/**
 * صفحة إعدادات النظام - مربوطة بالـ API
 * تتيح للمسؤولين ضبط إعدادات المنصة المخزنة في قاعدة البيانات
 */
export default function SystemSettings() {
    const [activeTab, setActiveTab] = useState("General");
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

    // قيم مؤقتة للتعديل
    const [localValues, setLocalValues] = useState<Record<string, string>>({});

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getSettings();
            setSettings(data);

            // تهيئة القيم المحلية
            const values: Record<string, string> = {};
            data.forEach(s => {
                values[s.key] = s.value;
            });
            setLocalValues(values);
        } catch (err) {
            setError(err instanceof Error ? err.message : "فشل تحميل الإعدادات");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async () => {
        setSubmitting(true);
        setSuccessMsg(null);
        try {
            // سنقوم بتحديث الإعدادات التي تغيرت فقط
            // ملاحظة: لا نحدث SmtpPassword إذا كانت قيمتها "********"
            const promises = settings
                .filter(s => localValues[s.key] !== s.value && localValues[s.key] !== "********")
                .map(s => api.updateSetting(s.key, localValues[s.key]));

            if (promises.length === 0) {
                setSuccessMsg("لم يتم إجراء أي تغييرات");
                setSubmitting(false);
                return;
            }

            await Promise.all(promises);
            setSuccessMsg("تم حفظ كافة التغييرات بنجاح");
            await fetchSettings(); // تحديث الحالة الأصلية
        } catch (err) {
            setError(err instanceof Error ? err.message : "فشل حفظ الإعدادات");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleBoolean = (key: string) => {
        const current = localValues[key];
        setLocalValues(prev => ({
            ...prev,
            [key]: current === "true" ? "false" : "true"
        }));
    };

    // استخراج المجموعات الفريدة من الإعدادات
    const groups = Array.from(new Set(settings.map(s => s.group)));

    // أيقونات المجموعات
    const getGroupIcon = (group: string) => {
        switch (group) {
            case "General": return Globe;
            case "Appearance": return Palette;
            case "Security": return ShieldAlert;
            case "Notifications": return Bell;
            case "Storage": return Database;
            case "AI": return Sparkles;
            default: return Settings;
        }
    };

    const getGroupLabel = (group: string) => {
        const labels: Record<string, string> = {
            "General": "الإعدادات العامة",
            "Appearance": "المظهر والهوية",
            "Security": "الأمان والوصول",
            "Notifications": "التنبيهات والرسائل",
            "Storage": "التخزين والملفات",
            "AI": "محرك الذكاء الاصطناعي"
        };
        return labels[group] || group;
    };

    if (loading && settings.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-sy-gold animate-spin" />
                    <p className="text-sm text-muted-foreground">جاري تحميل إعدادات النظام...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* رأس الصفحة */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sy-gold/10 rounded-2xl">
                        <Settings className="w-8 h-8 text-sy-gold" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">إعدادات النظام</h2>
                        <p className="text-muted-foreground text-sm">تخصيص وبرمجة سلوك المنصة العام من قاعدة البيانات</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchSettings}
                        className="p-2.5 bg-card border border-border rounded-xl hover:bg-muted transition-all"
                        title="تحديث"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={submitting}
                        className="bg-sy-green text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-sy-green/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        حفظ التغييرات
                    </button>
                </div>
            </div>

            {successMsg && (
                <div className="p-4 bg-sy-green/10 border border-sy-green/20 rounded-2xl flex items-center gap-3 text-sy-green animate-in zoom-in-95">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">{successMsg}</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-sy-red/10 border border-sy-red/20 rounded-2xl flex items-center gap-3 text-sy-red animate-in zoom-in-95">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold text-sm">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* التنقل الجانبي */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-2 space-y-1 sticky top-6">
                        {groups.map((group) => {
                            const Icon = getGroupIcon(group);
                            return (
                                <button
                                    key={group}
                                    onClick={() => setActiveTab(group)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === group
                                        ? "bg-sy-green text-white shadow-md shadow-sy-green/20"
                                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {getGroupLabel(group)}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* المحتوى الرئيسي */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card p-6 space-y-6">
                        <h3 className="text-lg font-bold border-b border-border pb-4 mb-6">
                            {getGroupLabel(activeTab)}
                        </h3>

                        <div className="space-y-6">
                            {settings.filter(s => s.group === activeTab).map(s => (
                                <div key={s.key} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold">{s.description || s.key}</label>
                                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{s.key}</span>
                                    </div>

                                    {s.value === "true" || s.value === "false" ? (
                                        <div
                                            onClick={() => toggleBoolean(s.key)}
                                            className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border cursor-pointer hover:bg-background transition-colors"
                                        >
                                            <p className="text-xs text-muted-foreground italic">
                                                الحالة الحالية: {localValues[s.key] === "true" ? "مفعل" : "معطل"}
                                            </p>
                                            <div className={`w-12 h-6 rounded-full relative transition-all ${localValues[s.key] === "true" ? "bg-sy-green" : "bg-muted"}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localValues[s.key] === "true" ? "right-1" : "left-1"}`} />
                                            </div>
                                        </div>
                                    ) : s.key === "AI_Provider" ? (
                                        <select
                                            value={localValues[s.key] || ""}
                                            onChange={(e) => setLocalValues(prev => ({ ...prev, [s.key]: e.target.value }))}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none transition-all"
                                        >
                                            <option value="Gemini">Google Gemini</option>
                                            <option value="Groq">Groq (Llama 3.3)</option>
                                            <option value="DeepSeek">DeepSeek</option>
                                            <option value="OpenAI">OpenAI (ChatGPT)</option>
                                        </select>
                                    ) : s.key === "SmtpPassword" || s.key.endsWith("ApiKey") || s.key.startsWith("AI_") ? (
                                        <div className="relative">
                                            <input
                                                type={showPassword[s.key] ? "text" : "password"}
                                                value={localValues[s.key] || ""}
                                                onChange={(e) => setLocalValues(prev => ({ ...prev, [s.key]: e.target.value }))}
                                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none transition-all pl-12"
                                            />
                                            <button
                                                onClick={() => setShowPassword(p => ({ ...p, [s.key]: !p[s.key] }))}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword[s.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    ) : s.key.toLowerCase().includes("color") ? (
                                        <div className="flex gap-3">
                                            <input
                                                type="color"
                                                value={localValues[s.key] || "#000000"}
                                                onChange={(e) => setLocalValues(prev => ({ ...prev, [s.key]: e.target.value }))}
                                                className="w-12 h-12 rounded-xl border border-border cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={localValues[s.key] || ""}
                                                onChange={(e) => setLocalValues(prev => ({ ...prev, [s.key]: e.target.value }))}
                                                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none transition-all font-mono"
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={localValues[s.key] || ""}
                                            onChange={(e) => setLocalValues(prev => ({ ...prev, [s.key]: e.target.value }))}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none transition-all"
                                        />
                                    )}
                                </div>
                            ))}

                            {settings.filter(s => s.group === activeTab).length === 0 && (
                                <div className="py-20 text-center text-muted-foreground">
                                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                    <p>لا توجد إعدادات في هذه المجموعة حالياً</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
