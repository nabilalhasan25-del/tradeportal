"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Library,
    Send,
    CheckCircle,
    XCircle,
    Eye,
    Search,
    FileText,
    ChevronRight,
    ChevronLeft,
    Inbox,
    Calendar,
    UserCheck,
    Loader2,
    Info,
    CheckCircle2,
    Stamp,
    Clock,
    AlertTriangle,
    Hash,
    Building2
} from "lucide-react";

import { useLookups } from "@/context/LookupsContext";
import api, { RequestDto } from "@/services/api";
import { translateError } from "@/utils/errorTranslator";
import PdfViewerModal from "@/components/PdfViewerModal";
import { NotificationToast } from "@/components/NotificationToast";
import { useSignalR } from "@/context/SignalRContext";
import { FilterPopover, FilterItem } from "@/components/FilterPopover";
import { Pagination } from "@/components/Pagination";

export default function RegistryDashboard() {
    const { provinces, companyTypes, isLoading: lookupsLoading } = useLookups();

    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [provinceFilter, setProvinceFilter] = useState<number | "all">("all");
    const [companyTypeFilter, setCompanyTypeFilter] = useState<number | "all">("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Registry fields
    const [registryNumber, setRegistryNumber] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfToView, setPdfToView] = useState<string>("");
    const [viewMode, setViewMode] = useState<"inbox" | "archive">("inbox");
    const [showConfirmAction, setShowConfirmAction] = useState<"finalize" | "release" | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

    // Reset selection when switching view modes
    useEffect(() => {
        setSelectedRequest(null);
        setCurrentPage(1);
    }, [viewMode]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await api.getRequests();
            setRequests(data);
        } catch (err) {
            setError(translateError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // SignalR Integration
    const { lastMessage } = useSignalR();

    useEffect(() => {
        if (!lastMessage || submitting) return;

        if (lastMessage.type === 'RequestCreated') {
            const newReq = lastMessage.data as RequestDto;
            setRequests(prev => {
                if (prev.find(r => r.id === newReq.id)) return prev;
                return [newReq, ...prev];
            });
        }

        if (lastMessage.type === 'RequestUpdated') {
            const updatedReq = lastMessage.data as RequestDto;
            setRequests(prev => prev.map(r => r.id === updatedReq.id ? { ...r, ...updatedReq } : r));

            if (selectedRequest?.id === updatedReq.id) {
                setSelectedRequest(prev => prev ? { ...prev, ...updatedReq } : null);
            }

            setNotification({
                message: `تم تحديث الطلب #${updatedReq.id}`,
                type: 'info'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    }, [lastMessage, submitting, selectedRequest?.id]);

    const filteredRequests = useMemo(() => {
        return requests.filter(r => {
            // View Mode Logic:
            // Inbox: Accepted (5)
            // Archive: Reserved (10) or Finalized (12)
            const isFinished = r.statusId === 10 || r.statusId === 12;
            const matchesView = viewMode === "archive" ? isFinished : (r.statusId === 5);
            if (!matchesView) return false;

            const matchesSearch = r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toString() === searchQuery;
            if (!matchesSearch) return false;

            if (provinceFilter !== "all" && r.provinceId !== provinceFilter) return false;
            if (companyTypeFilter !== "all" && r.companyTypeId !== companyTypeFilter) return false;

            return true;
        });
    }, [requests, searchQuery, provinceFilter, companyTypeFilter, viewMode]);

    const counts = useMemo(() => {
        const inbox = requests.filter(r => r.statusId === 5).length;
        const archive = requests.filter(r => r.statusId === 10 || r.statusId === 12).length;
        return { inbox, archive };
    }, [requests]);

    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredRequests, currentPage]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const handleFinalize = async () => {
        if (!selectedRequest || !registryNumber.trim() || submitting) return;
        try {
            setSubmitting(true);
            await api.finalizeRegistry(selectedRequest.id, {
                registryNumber,
                registryDate: new Date().toISOString()
            });

            setNotification({ message: "تم تسجيل الشركة وتثبيت الحجز بنجاح", type: "success" });

            // Clear UI immediately
            setSelectedRequest(null);
            setRegistryNumber("");
            setShowConfirmAction(null);

            // Wait for refresh
            await fetchRequests();
        } catch (err) {
            setError(translateError(err));
        } finally {
            setSubmitting(false);
        }
    };

    const handleRelease = async () => {
        if (!selectedRequest || submitting) return;
        try {
            setSubmitting(true);
            await api.releaseName(selectedRequest.id);

            setNotification({ message: "تم إطلاق التسمية بنجاح", type: "info" });

            // Clear UI immediately
            setSelectedRequest(null);
            setShowConfirmAction(null);

            // Wait for refresh
            await fetchRequests();
        } catch (err) {
            setError(translateError(err));
        } finally {
            setSubmitting(false);
        }
    };

    const getRemainingDays = (expiryDate?: string | null) => {
        if (!expiryDate) return null;
        const expiry = new Date(expiryDate);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-sy">
            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-md border-r-8 border-r-sy-green">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-sy-green/10 rounded-2xl">
                            <Library className="w-8 h-8 text-sy-green" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-foreground tracking-tight">أمين السجل التجاري</h1>
                            <p className="text-sm font-bold text-muted-foreground">تثبيت الحجوزات القطعية وإصدار الشهادات</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-sy-green transition-colors" />
                            <input
                                type="text"
                                placeholder="بحث برقم الطلب أو اسم الشركة..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full md:w-80 bg-background border-2 border-border rounded-2xl py-3 pr-11 pl-4 focus:bg-card focus:border-sy-green/40 focus:ring-4 focus:ring-sy-green/5 outline-none transition-all font-bold text-sm shadow-sm placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <FilterPopover
                            isOpen={isFilterOpen}
                            onToggle={() => setIsFilterOpen(!isFilterOpen)}
                            onReset={() => {
                                setProvinceFilter("all");
                                setCompanyTypeFilter("all");
                                setCurrentPage(1);
                            }}
                            activeFiltersCount={[provinceFilter, companyTypeFilter].filter(f => f !== "all").length}
                        >
                            <FilterItem label="المحافظة">
                                <select
                                    value={provinceFilter}
                                    onChange={(e) => { setProvinceFilter(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}
                                >
                                    <option value="all">كل المحافظات</option>
                                    {lookupsLoading ? (
                                        <option disabled>جاري التحميل...</option>
                                    ) : (
                                        provinces.map((p) => (
                                            <option key={p.id} value={p.id}>{p.nameAr}</option>
                                        ))
                                    )}
                                </select>
                            </FilterItem>

                            <FilterItem label="نوع الشركة">
                                <select
                                    value={companyTypeFilter}
                                    onChange={(e) => { setCompanyTypeFilter(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}
                                >
                                    <option value="all">كل الأنواع</option>
                                    {lookupsLoading ? (
                                        <option disabled>جاري التحميل...</option>
                                    ) : (
                                        companyTypes.map((t) => (
                                            <option key={t.id} value={t.id}>{t.nameAr}</option>
                                        ))
                                    )}
                                </select>
                            </FilterItem>
                        </FilterPopover>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Requests List */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* View Mode Switching - Relocated above requests */}
                        <div className="flex items-center gap-1 bg-card border border-border p-1.5 rounded-2xl shadow-sm">
                            <button
                                onClick={() => !submitting && setViewMode("inbox")}
                                disabled={submitting}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black transition-all rounded-xl ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === "inbox" ? "bg-sy-green text-white shadow-lg shadow-sy-green/20" : "text-muted-foreground hover:bg-muted"}`}
                            >
                                <Inbox className="w-4 h-4" />
                                بانتظار الإجراء
                                <span className={`mr-1 px-2 py-0.5 rounded-full text-[9px] ${viewMode === "inbox" ? "bg-white text-sy-green" : "bg-sy-green text-white"}`}>
                                    {counts.inbox}
                                </span>
                            </button>
                            <button
                                onClick={() => !submitting && setViewMode("archive")}
                                disabled={submitting}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black transition-all rounded-xl ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === "archive" ? "bg-slate-800 text-white shadow-lg shadow-slate-800/20" : "text-muted-foreground hover:bg-muted"}`}
                            >
                                <Clock className="w-4 h-4" />
                                الأرشيف
                                <span className={`mr-1 px-2 py-0.5 rounded-full text-[9px] ${viewMode === "archive" ? "bg-white text-slate-800" : "bg-slate-800 text-white"}`}>
                                    {counts.archive}
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Inbox className="w-3 h-3" />
                                {viewMode === 'inbox' ? 'الطلبات المقبولة' : 'الحجوزات المثبتة'} ({filteredRequests.length})
                            </h2>
                        </div>

                        {loading ? (
                            <div className="bg-card rounded-3xl p-12 border border-border flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-10 h-10 text-sy-green animate-spin" />
                                <span className="font-bold text-slate-400">جاري تحميل البيانات...</span>
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="bg-card rounded-3xl p-12 border border-border flex flex-col items-center justify-center gap-4 opacity-60">
                                <Building2 className="w-12 h-12 text-slate-300" />
                                <span className="font-bold text-slate-400">لا توجد حجوزات نشطة حالياً</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {paginatedRequests.map(req => {
                                    const daysLeft = getRemainingDays(req.reservationExpiryDate);
                                    const isCritical = daysLeft !== null && daysLeft <= 2;

                                    return (
                                        <button
                                            key={req.id}
                                            onClick={() => !submitting && setSelectedRequest(req)}
                                            disabled={submitting}
                                            className={`w-full text-right p-5 rounded-3xl border-2 transition-all duration-300 relative group overflow-hidden ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${selectedRequest?.id === req.id
                                                ? "bg-card border-sy-green shadow-xl shadow-sy-green/5 -translate-x-2"
                                                : "bg-card/70 border-border hover:border-sy-green/30 hover:bg-card hover:shadow-md"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-black font-mono px-2 py-0.5 bg-muted dark:bg-slate-800 rounded-full text-foreground/60">#{req.id}</span>
                                                {daysLeft !== null && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isCritical ? "bg-sy-red/10 text-sy-red animate-pulse" : "bg-sy-gold/10 text-sy-gold"
                                                        }`}>
                                                        <Clock className="w-3 h-3" />
                                                        {daysLeft} أيام متبقية
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-black text-foreground text-base mb-1 truncate">{req.companyName}</h4>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(req.createdAt).toLocaleDateString('ar-SY')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <UserCheck className="w-3 h-3" />
                                                    {req.provinceName}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Compact Pagination for Sidebar */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-2 pt-4 border-t border-border/50 mt-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="p-2 border border-border rounded-xl bg-card hover:bg-muted disabled:opacity-20 transition-all group"
                                >
                                    <ChevronRight className="w-4 h-4 group-active:-translate-x-1 transition-transform" />
                                </button>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black text-foreground">{currentPage} / {totalPages}</span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">الصفحة</span>
                                </div>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className="p-2 border border-border rounded-xl bg-card hover:bg-muted disabled:opacity-20 transition-all group"
                                >
                                    <ChevronLeft className="w-4 h-4 group-active:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Registry Actions */}
                    <div className="lg:col-span-8">
                        {selectedRequest ? (
                            <div className="bg-card rounded-[32px] border border-border shadow-2xl overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-500">
                                {/* Details Header */}
                                <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-card rounded-2xl border border-border flex items-center justify-center shadow-sm">
                                            <Stamp className="w-6 h-6 text-sy-green" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-foreground leading-tight">{selectedRequest.companyName}</h3>
                                            <p className="text-xs font-bold text-slate-500">{selectedRequest.companyTypeName} • {selectedRequest.provinceName}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setPdfToView(selectedRequest.mainPdfPath || "");
                                            setIsPdfModalOpen(true);
                                        }}
                                        className="px-4 py-2 bg-card border border-border rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        عرض الإضبارة
                                    </button>
                                </div>

                                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                    {/* Warnings/Context */}
                                    <div className="p-4 bg-sy-gold/5 border border-sy-gold/20 rounded-2xl flex gap-3 items-start">
                                        <Clock className="w-5 h-5 text-sy-gold shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-sy-gold">تنبيه انتهاء الحجز</p>
                                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                                رصيد المهلة القانونية لهذا الحجز هو <span className="text-sy-red font-black">{getRemainingDays(selectedRequest.reservationExpiryDate)} أيام</span>.
                                                في حال عدم استكمال إجراءات التأسيس، سيتم إطلاق التسمية تلقائياً من قبل النظام.
                                            </p>
                                        </div>
                                    </div>

                                    {viewMode === "inbox" ? (
                                        <div className="space-y-6 pt-4">
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                                    <Hash className="w-4 h-4 text-sy-green" />
                                                    تثبيت بيانات السجل التجاري
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase mr-2">رقم الشهادة / السجل</label>
                                                        <input
                                                            type="text"
                                                            value={registryNumber}
                                                            onChange={(e) => setRegistryNumber(e.target.value)}
                                                            placeholder="أدخل رقم السجل التجاري..."
                                                            className="w-full bg-background dark:bg-slate-900 border-2 border-border rounded-2xl p-4 font-bold text-sm focus:bg-card focus:border-sy-green/40 outline-none transition-all dark:text-foreground shadow-sm placeholder:text-muted-foreground/50"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase mr-2">تاريخ التصديق</label>
                                                        <input
                                                            type="text"
                                                            value={new Date().toLocaleDateString('ar-SY')}
                                                            readOnly
                                                            className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl p-4 font-bold text-sm text-foreground/50 cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setShowConfirmAction("finalize")}
                                                    disabled={!registryNumber.trim() || submitting}
                                                    className="bg-sy-green text-white p-6 rounded-3xl font-black text-base hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-sy-green/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-7 h-7" />}
                                                    تثبيت السجل والتأسيس
                                                </button>

                                                <button
                                                    onClick={() => setShowConfirmAction("release")}
                                                    disabled={submitting}
                                                    className="bg-white border-2 border-sy-red text-sy-red p-6 rounded-3xl font-black text-base hover:bg-sy-red/5 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <AlertTriangle className="w-6 h-6" />
                                                    إلغاء الحجز وإعادة الاسم
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 pt-4 border-t border-border mt-4 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[24px] border border-border space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle className="w-5 h-5 text-sy-green" />
                                                    <h4 className="text-sm font-black text-foreground">بيانات الحجز القطعي (مؤرشف)</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">رقم السجل التجاري</p>
                                                        <p className="text-xl font-black text-sy-green tracking-wider">{selectedRequest.registryNumber || "غير متوفر"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">تاريخ الحجز القطعي</p>
                                                        <p className="text-sm font-bold text-foreground">
                                                            {selectedRequest.registryDate ? new Date(selectedRequest.registryDate).toLocaleDateString('ar-SY') : "غير متوفر"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-background/50 dark:bg-slate-900/50 rounded-[32px] border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 text-muted-foreground p-12 text-center">
                                <div className="p-6 bg-card rounded-full border border-border shadow-md">
                                    <Building2 className="w-12 h-12 text-border/50 dark:text-slate-700" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-lg text-foreground/70">منصة أمين السجل</p>
                                    <p className="text-sm font-bold text-muted-foreground">اختر طلباً من القائمة الجانبية لتثبيت إجراءات السجل التجاري</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* View Modal */}
                <PdfViewerModal
                    isOpen={isPdfModalOpen}
                    onClose={() => setIsPdfModalOpen(false)}
                    pdfPath={pdfToView}
                    title="معاينة إضبارة التأسيس"
                />
            </div>

            {/* Confirmation Modal */}
            {showConfirmAction && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
                    <div className="bg-card w-full max-w-md rounded-[32px] border border-border shadow-2xl p-8 space-y-6 animate-in zoom-in-95 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className={`p-4 rounded-3xl ${showConfirmAction === 'finalize' ? 'bg-sy-green/10' : 'bg-sy-red/10'}`}>
                                {showConfirmAction === 'finalize' ? (
                                    <Stamp className="w-10 h-10 text-sy-green" />
                                ) : (
                                    <AlertTriangle className="w-10 h-10 text-sy-red" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-extrabold text-xl text-foreground">
                                    {showConfirmAction === 'finalize' ? 'تأكيد تثبيت الحجز القطعي' : 'تأكيد إلغاء الحجز'}
                                </h4>
                                <p className="text-xs text-muted-foreground font-bold">
                                    {showConfirmAction === 'finalize'
                                        ? 'سيتم تسجيل الشركة في السجل التجاري واعتماد الاسم بشكل نهائي. هل أنت متأكد؟'
                                        : 'سيتم تحرير الاسم التجاري وإلغاء حجز الشركة بالكامل. هذا الإجراء لا يمكن التراجع عنه.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={showConfirmAction === 'finalize' ? handleFinalize : handleRelease}
                                disabled={submitting}
                                className={`w-full text-white py-4 rounded-2xl text-sm font-black shadow-xl transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 ${showConfirmAction === 'finalize' ? 'bg-sy-green shadow-sy-green/20' : 'bg-sy-red shadow-sy-red/20'
                                    }`}
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                تأكيد التنفيذ
                            </button>
                            <button
                                onClick={() => setShowConfirmAction(null)}
                                className="w-full py-4 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                            >
                                تراجع
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
