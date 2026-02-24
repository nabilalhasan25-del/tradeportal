"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    History,
    Search,
    Filter,
    Download,
    Shield,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
    Loader2,
    RefreshCw
} from "lucide-react";
import api, { AuditLogEntry } from "@/services/api";

/**
 * صفحة سجل العمليات الشامل (Global Audit Log)
 * مربوطة بالـ API الحقيقي — بيانات من قاعدة البيانات
 */
export default function GlobalAuditLogs() {
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [entityFilter, setEntityFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pageSize = 10;

    // البيانات
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [availableActions, setAvailableActions] = useState<string[]>([]);
    const [availableEntities, setAvailableEntities] = useState<string[]>([]);

    // ─── تحميل خيارات الفلترة ──────────────────────────
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [actions, entities] = await Promise.all([
                    api.getAuditActions(),
                    api.getAuditEntities(),
                ]);
                setAvailableActions(actions);
                setAvailableEntities(entities);
            } catch {
                // لا بأس لو فشلت — الفلاتر ستبقى فارغة
            }
        };
        loadFilters();
    }, []);

    // ─── جلب السجلات ─────────────────────────────────────
    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.getAuditLogs({
                page: currentPage,
                pageSize,
                action: actionFilter || undefined,
                entityName: entityFilter || undefined,
                search: searchQuery || undefined,
            });
            setLogs(result.data);
            setTotalCount(result.totalCount);
            setTotalPages(result.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : "فشل تحميل سجل العمليات");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, actionFilter, entityFilter, searchQuery]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    // ─── ترجمة أسماء العمليات ────────────────────────────
    const translateAction = (action: string) => {
        const map: Record<string, string> = {
            "Login": "تسجيل دخول",
            "Register": "إنشاء حساب",
            "CreateRequest": "تقديم طلب",
            "TakeRequest": "استلام طلب",
            "ReleaseRequest": "تحرير طلب",
            "UpdateStatus": "تحديث حالة",
        };
        return map[action] || action;
    };

    const getActionColor = (action: string) => {
        const map: Record<string, string> = {
            "Login": "text-blue-500",
            "Register": "text-sy-gold",
            "CreateRequest": "text-sy-green",
            "TakeRequest": "text-indigo-500",
            "ReleaseRequest": "text-amber-500",
            "UpdateStatus": "text-purple-500",
        };
        return map[action] || "text-muted-foreground";
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString("ar-SY", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit",
        });
    };

    // ─── حالة التحميل ────────────────────────────────────
    if (isLoading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-sy-green animate-spin" />
                    <p className="text-sm text-muted-foreground">جاري تحميل سجل العمليات...</p>
                </div>
            </div>
        );
    }

    if (error && logs.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <AlertCircle className="w-12 h-12 text-sy-red" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <button onClick={fetchLogs} className="bg-sy-green text-white px-6 py-2 rounded-xl font-bold hover:brightness-110 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* رأس الصفحة */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sy-green/10 rounded-2xl">
                        <History className="w-8 h-8 text-sy-green" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">سجل العمليات العام</h2>
                        <p className="text-muted-foreground text-sm font-medium">بيانات حية من قاعدة البيانات — {totalCount} عملية مسجلة</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchLogs}
                        disabled={isLoading}
                        className="bg-card border border-border px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-muted transition-all shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        تحديث
                    </button>
                </div>
            </div>

            {/* شريط البحث والتصفية */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div className="md:col-span-2 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="بحث بالموظف، الإجراء، أو التفاصيل..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-background border border-border rounded-xl pr-12 pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sy-green/50 shadow-inner"
                    />
                </div>
                <div>
                    <select
                        value={actionFilter}
                        onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sy-green/50 appearance-none cursor-pointer"
                    >
                        <option value="">كافة العمليات</option>
                        {availableActions.map(a => (
                            <option key={a} value={a}>{translateAction(a)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <select
                        value={entityFilter}
                        onChange={(e) => { setEntityFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sy-green/50 appearance-none cursor-pointer"
                    >
                        <option value="">كافة الكيانات</option>
                        {availableEntities.map(e => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* جدول البيانات */}
            <div className="glass-card overflow-hidden shadow-xl border-sy-green/5">
                <table className="w-full text-right">
                    <thead className="bg-sy-green text-white text-[11px] font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">التوقيت</th>
                            <th className="px-6 py-4">المستخدم</th>
                            <th className="px-6 py-4">العملية</th>
                            <th className="px-6 py-4">الكيان</th>
                            <th className="px-6 py-4">التفاصيل</th>
                            <th className="px-6 py-4">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {logs.map((log) => (
                            <tr key={log.id} className="text-xs hover:bg-muted/30 transition-all group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="font-mono text-[10px] text-foreground/80">{formatDate(log.createdAt)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border border-border group-hover:bg-sy-green/10 transition-colors">
                                            {log.userName?.charAt(0) || "?"}
                                        </div>
                                        <span className="font-bold">{log.userName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`font-bold ${getActionColor(log.action)}`}>{translateAction(log.action)}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-2 py-1 rounded-lg border text-[9px] font-bold bg-muted border-border">
                                        {log.entityName}{log.entityId ? ` #${log.entityId}` : ""}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-muted-foreground line-clamp-1 max-w-[200px]" title={log.newValues || log.oldValues || ""}>
                                        {log.newValues || log.oldValues || "—"}
                                    </p>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="font-mono text-[10px] text-muted-foreground">{log.ipAddress || "—"}</span>
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                                    <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>لا توجد عمليات مسجلة حتى الآن</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* الترقيم */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
                        <p className="text-[10px] text-muted-foreground font-medium">
                            صفحة <span className="text-foreground">{currentPage}</span> من <span className="text-foreground">{totalPages}</span> — إجمالي <span className="text-foreground">{totalCount}</span> عملية
                        </p>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg border border-border hover:bg-card disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                                if (pageNum > totalPages) return null;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all border ${currentPage === pageNum ? "bg-sy-green text-white border-sy-green shadow-md" : "hover:bg-card border-border text-muted-foreground"}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg border border-border hover:bg-card disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* إحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex flex-col items-center gap-2 text-center border-sy-green/10">
                    <CheckCircle2 className="w-8 h-8 text-sy-green mb-2" />
                    <p className="text-2xl font-bold">{totalCount}</p>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">إجمالي العمليات المسجلة</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center gap-2 text-center border-sy-gold/10">
                    <Shield className="w-8 h-8 text-sy-gold mb-2" />
                    <p className="text-2xl font-bold">{availableActions.length}</p>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">أنواع العمليات</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center gap-2 text-center border-blue-500/10">
                    <Filter className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">{availableEntities.length}</p>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">كيانات مراقبة</p>
                </div>
            </div>
        </div>
    );
}
