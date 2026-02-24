"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    FileSearch,
    Send,
    CheckCircle,
    XCircle,
    Eye,
    ExternalLink,
    MessageSquare,
    ShieldAlert,
    Search,
    FileText,
    ChevronRight,
    ChevronLeft,
    Inbox,
    Archive,
    SearchCode,
    Calendar,
    UserCheck,
    AlertCircle,
    Lock,
    Unlock,
    UserCircle2,
    Loader2,
    ListChecks,
    CheckCircle2,
    ArrowLeftRight,
    Gavel,
    Filter,
    SlidersHorizontal,
    ArrowDownUp,
    Banknote
} from "lucide-react";

import { useTheme } from "next-themes";
import { useLookups } from "@/context/LookupsContext";
import api, { RequestDto } from "@/services/api";
import { translateError } from "@/utils/errorTranslator";
import { useSignalR } from "@/context/SignalRContext";
import { NotificationToast } from "@/components/NotificationToast";
import FileViewerModal from "@/components/FileViewerModal";
import PdfViewer from "@/components/PdfViewer";
import { Pagination } from "@/components/Pagination";
import { FilterPopover, FilterItem } from "@/components/FilterPopover";

/**
 * لوحة تحكم المدقق المركزي (المديرية المركزية)
 * مربوطة بالـ API الحقيقي للتدقيق واتخاذ القرارات
 */
export default function CentralDashboard() {
    const { theme } = useTheme();
    const { provinces, companyTypes, statuses, isLoading: lookupsLoading } = useLookups();

    // البيانات والحالات
    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(null);

    // حالات التصفية والترقيم
    const [viewMode, setViewMode] = useState<"inbox" | "archive">("inbox");
    const [statusFilter, setStatusFilter] = useState<number | "all">("all");
    const [provinceFilter, setProvinceFilter] = useState<number | "all">("all");
    const [companyTypeFilter, setCompanyTypeFilter] = useState<number | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const itemsPerPage = 6;

    // حالة اتخاذ القرار
    const [decisionComment, setDecisionComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // حالة فحص الاسم
    const [nameCheckResult, setNameCheckResult] = useState<{ isAvailable: boolean, count: number, matches: any[] } | null>(null);
    const [isCheckingName, setIsCheckingName] = useState(false);

    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfToView, setPdfToView] = useState<string>("");

    // حالة عرض الغايات التجارية
    const [showPurposesModal, setShowPurposesModal] = useState(false);

    // حالة تأكيد التحويل للملكية
    const [showConfirmIP, setShowConfirmIP] = useState(false);
    const [showConfirmTake, setShowConfirmTake] = useState<{ id: number, name: string } | null>(null);
    const [showConfirmAction, setShowConfirmAction] = useState<{ statusId: number, title: string, color: string } | null>(null);
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [forwardTarget, setForwardTarget] = useState<"Director" | "MinisterAssistant">("Director");
    const [forwardNote, setForwardNote] = useState("");

    // حالة الإشعارات
    const [notification, setNotification] = useState<{ message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
    const { lastMessage } = useSignalR();

    // جلب البيانات
    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
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

    // Reset selection and filters when switching view modes
    useEffect(() => {
        setSelectedRequest(null);
        setCurrentPage(1);
        setSearchQuery("");
        setStatusFilter("all");
        setProvinceFilter("all");
        setCompanyTypeFilter("all");
    }, [viewMode]);

    // SignalR Integration for Real-time Updates
    useEffect(() => {
        if (!lastMessage || submitting) return;

        if (lastMessage.type === 'RequestCreated') {
            const newReq = lastMessage.data as RequestDto;
            setRequests(prev => {
                if (prev.find(r => r.id === newReq.id)) return prev;
                return [newReq, ...prev];
            });
            setNotification({
                message: `تم تقديم طلب جديد لشركة: ${newReq.companyName}`,
                type: 'info'
            });
            setTimeout(() => setNotification(null), 5000);
        }

        if (lastMessage.type === 'RequestUpdated') {
            const updatedReq = lastMessage.data as RequestDto;
            setRequests(prev => prev.map(r => r.id === updatedReq.id ? { ...r, ...updatedReq } : r));

            // تحديث الطلب المفتوح حالياً إذا كان هو نفسه المحدث
            if (selectedRequest?.id === updatedReq.id) {
                setSelectedRequest(prev => prev ? { ...prev, ...updatedReq } : null);
            }
            setNotification({
                message: `تم تحديث حالة الطلب #${updatedReq.id}`,
                type: 'info'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    }, [lastMessage, submitting, selectedRequest?.id]);


    const getActionLabel = (type: string) => {
        switch (type) {
            case 'Submitted': return 'بدء المعاملة';
            case 'PaymentConfirmed': return 'تأكيد دفع الرسوم';
            case 'ForwardedToDirector': return 'رفع لمدير الشركات';
            case 'ForwardedToMinister': return 'رفع لمعاون الوزير';
            case 'IpResponded': return 'صدور تقرير الملكية';
            case 'DirectorApproved': return 'موافقة مدير الشركات';
            case 'DirectorForwarded': return 'مدير الشركات';
            case 'DirectorReturned': return 'إرجاع من المدير للتدقيق';
            case 'MinisterAccepted': return 'اعتماد معاون الوزير';
            case 'MinisterReturned': return 'إرجاع من المعاون للتدقيق';
            case 'ForwardedToIp': return 'تحويل للملكية الفكرية';
            case 'AuditorAccepted': return 'قبول نهائي (المدقق)';
            case 'AuditorRejected': return 'رفض الطلب (المدقق)';
            default: return type;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'Admin': return 'مدير النظام';
            case 'CentralAuditor': return 'المدقق المركزي';
            case 'CentralAuditorAdmin': return 'مدير التدقيق';
            case 'Director': return 'مدير الشركات';
            case 'MinisterAssistant': return 'معاون الوزير';
            case 'IpExpert': return 'خبير الملكية';
            case 'IpExpertAdmin': return 'مدير الملكية';
            case 'ProvinceAdmin': return 'مسؤول المحافظة';
            case 'ProvinceEmployee': return 'موظف المحافظة';
            case 'RegistryOfficer': return 'أمين السجل التجاري';
            default: return role;
        }
    };

    // استلام طلب (Lock)
    const handleTakeRequest = async (id: number) => {
        if (submitting) return;
        try {
            setSubmitting(true);
            await api.takeRequest(id);
            await fetchRequests(); // تحديث القائمة لرؤية القفل
        } catch (err) {
            setNotification({ message: translateError(err), type: 'error' });
            setTimeout(() => setNotification(null), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    // اتخاذ قرار (قبول / رفض / تحويل للملكية)
    const handleAction = async (newStatusId: number) => {
        if (!selectedRequest || submitting) return;
        if (!decisionComment && newStatusId !== 3) { // الملاحظات إلزامية للقبول/الرفض
            setNotification({ message: "يرجى كتابة مبررات القرار لتوضيح سبب القبول أو الرفض", type: 'warning' });
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        try {
            setSubmitting(true);
            await api.updateRequestStatus(selectedRequest.id, {
                statusId: newStatusId,
                comment: decisionComment
            });

            // Clear selection immediately
            setSelectedRequest(null);
            setDecisionComment("");

            // Refresh list
            await fetchRequests();
        } catch (err) {
            setNotification({ message: translateError(err), type: 'error' });
            setTimeout(() => setNotification(null), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    // معاينة المستندات (الاحترافي)
    const handlePreviewFile = (path: string | null | undefined) => {
        if (!path) return;
        setPdfToView(path);
        setIsPdfModalOpen(true);
    };

    // تنفيذ فحص الاسم التجاري الحقيقي
    const handleCheckName = async () => {
        if (!selectedRequest) return;
        try {
            setIsCheckingName(true);
            setNameCheckResult(null);
            const result = await api.checkTradeName(selectedRequest.companyName, selectedRequest.id);
            setNameCheckResult(result);
        } catch (err) {
            setNotification({ message: translateError(err), type: 'error' });
            setTimeout(() => setNotification(null), 5000);
        } finally {
            setIsCheckingName(false);
        }
    };

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = req.companyName.includes(searchQuery) || req.id.toString().includes(searchQuery);
            const matchesStatus = statusFilter === "all" || req.statusId === statusFilter;
            const matchesProvince = provinceFilter === "all" || req.provinceId === provinceFilter;
            const matchesType = companyTypeFilter === "all" || req.companyTypeId === companyTypeFilter;

            const isFinished = req.statusId === 5 || req.statusId === 6; // مقبول أو مرفوض
            const matchesView = viewMode === "archive" ? isFinished : !isFinished;

            return matchesSearch && matchesStatus && matchesProvince && matchesType && matchesView;
        });
    }, [requests, searchQuery, statusFilter, provinceFilter, companyTypeFilter, viewMode]);

    const counts = useMemo(() => {
        const inbox = requests.filter(req => req.statusId !== 5 && req.statusId !== 6).length;
        const archive = requests.filter(req => req.statusId === 5 || req.statusId === 6).length;
        return { inbox, archive };
    }, [requests]);

    // الترقيم
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // لون الحالة
    const getStatusClasses = (statusId: number) => {
        switch (statusId) {
            case 5: return "bg-sy-green/10 text-sy-green border-sy-green/20";
            case 6: return "bg-sy-red/10 text-sy-red border-sy-red/20";
            case 1: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case 4: return "bg-purple-500/10 text-purple-500 border-purple-500/20"; // تم الرد من الملكية
            case 14: return "bg-amber-500/10 text-amber-500 border-amber-500/20"; // تم الرد من القيادة
            default: return "bg-sy-gold/10 text-sy-gold border-sy-gold/20";
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 pb-12 animate-in fade-in duration-500">
            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            {!selectedRequest ? (
                /* شاشة الجدول */
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-sy-green/10 rounded-2xl">
                                <FileSearch className="w-8 h-8 text-sy-green" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">إدارة طلبات التدقيق</h2>
                                <p className="text-muted-foreground text-sm font-medium">مراجعة الطلبات الواردة من المحافظات واتخاذ القرارات النهائية</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    placeholder="بحث سريع..."
                                    className="w-full bg-card border border-border rounded-2xl pr-12 pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sy-green/50 shadow-md transition-all"
                                />
                            </div>

                            <FilterPopover
                                isOpen={isFilterOpen}
                                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                                onReset={() => {
                                    setStatusFilter("all");
                                    setProvinceFilter("all");
                                    setCompanyTypeFilter("all");
                                    setCurrentPage(1);
                                }}
                                activeFiltersCount={[statusFilter, provinceFilter, companyTypeFilter].filter(f => f !== "all").length}
                            >
                                <FilterItem label="حالة الطلب">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => { setStatusFilter(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}
                                        disabled={lookupsLoading}
                                    >
                                        <option value="all">كل الحالات</option>
                                        {lookupsLoading ? (
                                            <option disabled>جاري التحميل...</option>
                                        ) : (
                                            statuses.map((s) => (
                                                <option key={s.id} value={s.id}>{s.nameAr}</option>
                                            ))
                                        )}
                                    </select>
                                </FilterItem>

                                <FilterItem label="المحـافظة">
                                    <select
                                        value={provinceFilter}
                                        onChange={(e) => { setProvinceFilter(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}
                                        disabled={lookupsLoading}
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
                                        disabled={lookupsLoading}
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
                    </div>

                    <div className="flex items-center gap-1 bg-card border border-border p-1.5 rounded-2xl shadow-md w-fit">
                        <button
                            onClick={() => { if (!submitting) { setViewMode("inbox"); setStatusFilter("all"); setCurrentPage(1); } }}
                            disabled={submitting}
                            className={`flex items-center gap-2 px-8 py-3 text-xs font-bold transition-all rounded-xl ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === "inbox" ? "bg-sy-green text-white shadow-lg shadow-sy-green/20" : "text-muted-foreground hover:bg-muted"}`}
                        >
                            <Inbox className="w-4 h-4" />
                            صندوق الوارد
                            <span className={`mr-1 px-2 py-0.5 rounded-full text-[10px] font-black ${viewMode === "inbox" ? "bg-white text-sy-green" : "bg-sy-green text-white"}`}>
                                {counts.inbox}
                            </span>
                        </button>
                        <button
                            onClick={() => { if (!submitting) { setViewMode("archive"); setStatusFilter("all"); setCurrentPage(1); } }}
                            disabled={submitting}
                            className={`flex items-center gap-2 px-8 py-3 text-xs font-bold transition-all rounded-xl ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === "archive" ? "bg-sy-gold text-white shadow-lg shadow-sy-gold/20" : "text-muted-foreground hover:bg-muted"}`}
                        >
                            <Archive className="w-4 h-4" />
                            الأرشيف
                            <span className={`mr-1 px-2 py-0.5 rounded-full text-[10px] font-black ${viewMode === "archive" ? "bg-white text-sy-gold" : "bg-sy-gold text-white"}`}>
                                {counts.archive}
                            </span>
                        </button>
                    </div>

                    <div className="glass-card overflow-hidden shadow-2xl border-border/80">
                        {loading ? (
                            <div className="p-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                <Loader2 className="w-10 h-10 animate-spin text-sy-green" />
                                <p className="text-sm">جاري تحديث قائمة الطلبات...</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right min-w-[900px]">
                                        <thead className="bg-muted/30 text-[10px] text-muted-foreground uppercase font-bold tracking-wider border-b border-border">
                                            <tr>
                                                <th className="px-6 py-5">المعرف</th>
                                                <th className="px-6 py-5">الشركة المقترحة</th>
                                                <th className="px-6 py-5">نوع الكيان</th>
                                                <th className="px-6 py-5">المصدر</th>
                                                <th className="px-6 py-5">الحالة</th>
                                                <th className="px-6 py-5">المستلم</th>
                                                <th className="px-6 py-5 text-center">الإجراء</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {paginatedRequests.length > 0 ? (
                                                paginatedRequests.map((req) => (
                                                    <tr key={req.id} className="hover:bg-muted/20 transition-colors group">
                                                        <td className="px-6 py-5 text-xs font-mono text-sy-gold font-bold">#{req.id}</td>
                                                        <td className="px-6 py-5 text-sm font-bold">{req.companyName}</td>
                                                        <td className="px-6 py-5 text-[10px] font-bold text-primary">{req.companyTypeName}</td>
                                                        <td className="px-6 py-5 text-xs text-muted-foreground">{req.provinceName}</td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border-2 ${getStatusClasses(req.statusId)}`}>
                                                                {req.statusName}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            {req.lockedByName ? (
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500">
                                                                    <Lock className="w-3 h-3" />
                                                                    {req.lockedByName}
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-muted-foreground italic">غير مستحق</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            {viewMode === 'inbox' ? (
                                                                // Case 1: Ready to be taken (Status 1, 2, 4, 11) and not locked
                                                                (!req.lockedById && (req.statusId === 1 || req.statusId === 2 || req.statusId === 4 || req.statusId === 11)) ? (
                                                                    <button
                                                                        onClick={() => !submitting && setShowConfirmTake({ id: req.id, name: req.companyName })}
                                                                        disabled={submitting}
                                                                        className="px-4 py-2 bg-sy-green text-white rounded-xl text-[10px] font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all mx-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        <UserCheck className="w-3.5 h-3.5" />
                                                                        استلام المهمة
                                                                    </button>
                                                                ) :
                                                                    // Case 2: Already locked (Ready for audit)
                                                                    (req.lockedById && req.statusId !== 7) ? (
                                                                        <button
                                                                            onClick={() => !submitting && setSelectedRequest(req)}
                                                                            disabled={submitting}
                                                                            className="px-4 py-2 bg-sy-gold text-white rounded-xl text-[10px] font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all mx-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        >
                                                                            <Eye className="w-3.5 h-3.5" />
                                                                            بدء التدقيق
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-[10px] text-muted-foreground italic">بانتظار الإجراء</span>
                                                                    )
                                                            ) : (
                                                                <button
                                                                    onClick={() => !submitting && setSelectedRequest(req)}
                                                                    disabled={submitting}
                                                                    className="p-2.5 rounded-xl border bg-sy-gold/10 text-sy-gold border-sy-gold/20 hover:bg-sy-gold hover:text-white mx-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    <FileText className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground">لا توجد طلبات واردة حالياً</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => {
                                        setCurrentPage(page);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredRequests.length}
                                    className="!mt-0 !bg-transparent !border-t border-b-0 border-x-0 !rounded-none p-6"
                                />
                            </>
                        )}
                    </div>
                </div>
            ) : (
                /* شاشة التدقيق الجاري */
                <div className="flex flex-col h-auto lg:h-[calc(100vh-160px)] gap-4 animate-in slide-in-from-left duration-500">
                    <div className="flex flex-col md:flex-row items-center justify-between bg-card p-5 rounded-2xl border border-border shadow-md">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted text-sm font-bold text-foreground rounded-xl border border-border transition-all shadow-sm active:scale-95"
                        >
                            <ChevronRight className="w-5 h-5" />
                            الرجوع للقائمة
                        </button>
                        <h3 className="font-bold">تدقيق: <span className="text-sy-green">{selectedRequest.companyName}</span></h3>
                        <div className="flex gap-2 items-center">
                            <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 font-bold">{selectedRequest.companyTypeName}</span>
                            <span className="text-[10px] bg-muted px-3 py-1 rounded-lg border border-border font-mono">ID: {selectedRequest.id}</span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden">
                        {/* معاينة الـ PDF */}
                        <div className="lg:flex-[2] h-[400px] lg:h-auto glass-card flex flex-col bg-zinc-900 rounded-2xl relative shadow-2xl overflow-hidden">
                            <PdfViewer pdfPath={selectedRequest.mainPdfPath || ""} />
                        </div>

                        {/* أدوات القرار */}
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="glass-card p-5 space-y-4 border-sy-gold/20">
                                <h4 className="font-bold text-xs text-sy-gold flex items-center gap-2">
                                    <SearchCode className="w-4 h-4" />
                                    فحص الاسم التجاري
                                </h4>
                                <div className="flex gap-2">
                                    <input type="text" readOnly value={selectedRequest.companyName} className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-bold" />
                                    <button
                                        onClick={handleCheckName}
                                        disabled={isCheckingName}
                                        className="bg-sy-gold text-white px-5 rounded-xl text-[10px] font-bold shadow-lg flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                                    >
                                        {isCheckingName && <Loader2 className="w-3 h-3 animate-spin" />}
                                        فحص
                                    </button>
                                </div>
                                {nameCheckResult && (
                                    <div className={`p-4 rounded-xl border-2 animate-in zoom-in-95 duration-300 ${nameCheckResult.isAvailable ? 'bg-sy-green/10 border-sy-green/20 text-sy-green' : 'bg-sy-red/10 border-sy-red/20 text-sy-red'}`}>
                                        <div className="flex items-center gap-2 font-bold text-[10px]">
                                            {nameCheckResult.isAvailable ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                            {nameCheckResult.isAvailable ? "الاسم متاح وغير مكرر في السجلات" : `تم العثور على ${nameCheckResult.count} سجلات مشابهة`}
                                        </div>
                                        {nameCheckResult.matches.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {nameCheckResult.matches.slice(0, 3).map((m: any) => (
                                                    <li key={m.id} className="text-[9px] flex justify-between items-center opacity-80 border-t border-current/10 pt-1">
                                                        <span>{m.companyName} ({m.provinceName})</span>
                                                        <span className="font-mono">#{m.id}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            {viewMode === 'inbox' && (
                                <div className="space-y-2 mb-4">
                                    {/* التنبيهات الخاصة بحالة الطلب */}
                                    {selectedRequest.isPaid && !selectedRequest.ipExpertId && Number(selectedRequest.statusId) !== 3 && Number(selectedRequest.statusId) !== 4 && (
                                        <div className="p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 border bg-blue-500/10 border-blue-500/30 mb-3">
                                            <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                            <div className="space-y-1 text-blue-700 dark:text-blue-400">
                                                <p className="text-[11px] font-bold">
                                                    إلزامية العرض على الملكية الفكرية:
                                                </p>
                                                <p className="text-[10px] leading-relaxed">
                                                    هذا الطلب يتضمن رسوم فحص مدفوعة؛ يرجى تحويل الطلب لخبير الملكية أولاً للحصول على التقرير الفني قبل اتخاذ القرار النهائي.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setShowConfirmIP(true)}
                                        disabled={submitting || Number(selectedRequest.statusId) === 3 || Number(selectedRequest.statusId) === 4 || Number(selectedRequest.statusId) === 8 || Number(selectedRequest.statusId) === 9 || !!selectedRequest.ipExpertId}
                                        className="w-full bg-blue-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all shadow-blue-500/20"
                                    >
                                        <Send className="w-4 h-4" />
                                        تحويل لمديرية حماية الملكية (لفحص الاسم)
                                    </button>

                                    <button
                                        onClick={() => {
                                            setForwardTarget("Director");
                                            setShowForwardModal(true);
                                        }}
                                        disabled={submitting || Number(selectedRequest.statusId) === 3 || Number(selectedRequest.statusId) === 8 || Number(selectedRequest.statusId) === 9 || Number(selectedRequest.statusId) === 14 || Number(selectedRequest.statusId) === 10 || !!(selectedRequest.isPaid && !selectedRequest.ipExpertId)}
                                        className="w-full bg-slate-800 dark:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all shadow-slate-800/20 dark:shadow-indigo-500/20"
                                    >
                                        <ShieldAlert className="w-4 h-4" />
                                        تحويل لمراجعة مدير الشركات
                                    </button>
                                </div>

                            )}

                            {selectedRequest.receiptNum && (
                                <div className="glass-card p-5 space-y-3 shadow-xl border-sy-gold/30 bg-sy-gold/5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-xs flex items-center gap-2 text-sy-gold">
                                            <Banknote className="w-4 h-4" />
                                            معلومات الدفع والإيصال
                                        </h4>
                                        {selectedRequest.receiptPath && (
                                            <button
                                                onClick={() => handlePreviewFile(selectedRequest.receiptPath!)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-sy-gold text-white rounded-lg hover:brightness-110 transition-all text-[10px] font-bold shadow-md"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                معاينة الإيصال
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-3 bg-background/80 rounded-xl border border-sy-gold/20 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-muted-foreground">رقم الإيصال:</span>
                                        <span className="text-xs font-black font-mono tracking-widest">{selectedRequest.receiptNum}</span>
                                    </div>
                                </div>
                            )}

                            {/* عرض الغايات التجارية */}
                            <div className="glass-card p-5 space-y-4 shadow-xl border-sy-green/20">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-xs flex items-center gap-2">
                                        <ListChecks className="w-4 h-4 text-sy-green" />
                                        الغايات التجارية المختارة
                                    </h4>
                                    <span className="text-[10px] bg-sy-green/10 text-sy-green px-2 py-0.5 rounded-full font-bold">
                                        {selectedRequest.selectedPurposes?.length || 0} أنشطة
                                    </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    راجع قائمة الأنشطة والمتممات المحددة من قبل مقدم الطلب للتأكد من مطابقتها.
                                </p>
                                <button
                                    onClick={() => setShowPurposesModal(true)}
                                    className="w-full py-2.5 bg-sy-green/10 text-sy-green border border-sy-green/20 rounded-xl text-[10px] font-bold hover:bg-sy-green hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    عرض تفاصيل الغايات
                                </button>
                            </div>

                            <div className="glass-card p-5 space-y-4 shadow-xl border-amber-500/20">
                                <h4 className="font-bold text-xs flex items-center gap-2 text-amber-600">
                                    <FileText className="w-4 h-4" />
                                    المرفقات المطلوبة (Checklist)
                                </h4>
                                <div className="space-y-1.5">
                                    {selectedRequest.checklistItems?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-border shadow-sm">
                                            <span className="text-[10px] font-bold text-muted-foreground">{item.templateName}</span>
                                            {item.isProvided ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-sy-green" />
                                            ) : (
                                                <AlertCircle className="w-3.5 h-3.5 text-sy-red" />
                                            )}
                                        </div>
                                    ))}
                                    {(!selectedRequest.checklistItems || selectedRequest.checklistItems.length === 0) && (
                                        <div className="text-center py-4 border-2 border-dashed border-border rounded-xl">
                                            <p className="text-[10px] text-muted-foreground italic font-medium">لا توجد مرفقات مسجلة لهذا الطلب</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* سجل الملاحظات والمسار */}
                            <div className="glass-card p-5 space-y-4 shadow-xl border-blue-500/20">
                                <h4 className="font-bold text-xs flex items-center gap-2 text-blue-600 uppercase">
                                    <ArrowLeftRight className="w-4 h-4" />
                                    سجل الملاحظات والمسار
                                </h4>
                                <div className="space-y-4 border-r-2 border-border/40 pr-4 mr-2 relative">
                                    {selectedRequest.history?.map((h, i) => (
                                        <div key={i} className="relative pb-2 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="absolute -right-[21px] top-1 w-3 h-3 rounded-full bg-background border-2 border-primary/40" />
                                            <div className="flex items-center justify-between gap-3 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                                                        {(h.userName || h.role)?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-foreground leading-none">{h.userName || "مستخدم النظام"}</p>
                                                        <p className="text-[8px] font-bold text-muted-foreground/60 mt-0.5 uppercase tracking-tighter">{getRoleLabel(h.role || "")}</p>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-[9px] font-black text-primary block">{getActionLabel(h.actionType || "")}</span>
                                                    <span className="text-[8px] font-medium text-muted-foreground block">{new Date(h.createdAt).toLocaleDateString('ar-SY')}</span>
                                                </div>
                                            </div>
                                            <div className="bg-muted/30 p-2.5 rounded-xl border border-border/40">
                                                <p className="text-[10px] font-bold text-muted-foreground italic leading-relaxed">
                                                    {h.note ? `\"${h.note}\"` : "لا توجد ملاحظات إضافية."}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!selectedRequest.history || selectedRequest.history.length === 0) && (
                                        <p className="text-[10px] text-muted-foreground italic">لا توجد حركات مسجلة حالياً</p>
                                    )}
                                </div>
                            </div>

                            {selectedRequest.ipExpertId && (
                                <div className="glass-card p-5 space-y-4 shadow-xl">
                                    <h4 className="font-bold text-xs flex items-center gap-2">
                                        <ShieldAlert className={`w-4 h-4 ${selectedRequest.statusId === 4 ? 'text-sy-green' : 'text-sy-gold'}`} />
                                        تقرير الملكية الفكرية
                                    </h4>
                                    <div className="p-4 bg-background border border-border rounded-xl text-xs leading-relaxed font-semibold shadow-inner whitespace-pre-wrap max-h-48 overflow-y-auto">
                                        {selectedRequest.ipExpertFeedback || "بانتظار رد خبير الملكية الفكرية..."}
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                                        <span>الخبير: {selectedRequest.ipExpertUserName || "قيد التعيين"}</span>
                                        <div className="flex items-center gap-2">
                                            {selectedRequest.ipReportPath && (
                                                <button
                                                    onClick={() => handlePreviewFile(selectedRequest.ipReportPath)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sy-gold/10 text-sy-gold rounded-lg hover:bg-sy-gold/20 transition-all border border-sy-gold/20"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    معاينة التقرير
                                                </button>
                                            )}
                                            {selectedRequest.statusId === 4 && <span className="text-sy-green flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                تم الرد - جاهز للقرار
                                            </span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'inbox' && (
                                <div className="glass-card p-5 space-y-4 shadow-xl">
                                    <h4 className="font-bold text-xs flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                        إصدار القرار النهائي
                                    </h4>
                                    <textarea
                                        value={decisionComment}
                                        onChange={(e) => setDecisionComment(e.target.value)}
                                        placeholder="اكتب مبررات القرار هنا... ضروري في حال الرفض"
                                        className="w-full h-32 bg-background border border-border rounded-xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20"
                                    ></textarea>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setShowConfirmAction({ statusId: 5, title: "قبول الطلب نهائياً", color: "sy-green" })}
                                            disabled={submitting || Number(selectedRequest.statusId) === 3 || Number(selectedRequest.statusId) === 8 || Number(selectedRequest.statusId) === 9 || !!(selectedRequest.isPaid && !selectedRequest.ipExpertId)}
                                            className={`py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${Number(selectedRequest.statusId) === 3 || Number(selectedRequest.statusId) === 8 || Number(selectedRequest.statusId) === 9 || !!(selectedRequest.isPaid && !selectedRequest.ipExpertId)
                                                ? "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-50"
                                                : "bg-sy-green text-white hover:scale-[1.02] active:scale-95"
                                                }`}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            قبول نهائي
                                        </button>
                                        <button
                                            onClick={() => setShowConfirmAction({ statusId: 6, title: "رفض الطلب نهائياً", color: "sy-red" })}
                                            disabled={submitting || Number(selectedRequest.statusId) === 3 || Number(selectedRequest.statusId) === 8 || Number(selectedRequest.statusId) === 9 || !!(selectedRequest.isPaid && !selectedRequest.ipExpertId)}
                                            className={`py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${Number(selectedRequest.statusId) === 3 || Number(selectedRequest.statusId) === 8 || Number(selectedRequest.statusId) === 9 || !!(selectedRequest.isPaid && !selectedRequest.ipExpertId)
                                                ? "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-50"
                                                : "bg-sy-red text-white hover:scale-[1.02] active:scale-95"
                                                }`}
                                        >
                                            <XCircle className="w-4 h-4" />
                                            رفض الطلب
                                        </button>
                                    </div>

                                    {/* التنبيه تم نقله من هنا للأعلى */}


                                    {(Number(selectedRequest.statusId) === 3 || Number(selectedRequest.statusId) === 8 || Number(selectedRequest.statusId) === 9 || Number(selectedRequest.statusId) === 14 || Number(selectedRequest.statusId) === 10) && (
                                        <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 border ${[10, 14].includes(Number(selectedRequest.statusId)) ? 'bg-sy-green/10 border-sy-green/30' : 'bg-sy-gold/10 border-sy-gold/30'}`}>
                                            {[10, 14].includes(Number(selectedRequest.statusId)) ? <CheckCircle className="w-5 h-5 text-sy-green shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-sy-gold shrink-0 mt-0.5" />}
                                            <div className="space-y-1">
                                                <p className={`text-[11px] font-bold ${[10, 14].includes(Number(selectedRequest.statusId)) ? 'text-sy-green' : 'text-sy-gold'}`}>
                                                    {Number(selectedRequest.statusId) === 3 ? "بانتظار التقرير الفني:" :
                                                        Number(selectedRequest.statusId) === 10 ? "موافقة معاون الوزير:" :
                                                            Number(selectedRequest.statusId) === 14 ? "اكتملت المراجعة القيادية:" : "القضية قيد النظر القيادي:"}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                    {Number(selectedRequest.statusId) === 3
                                                        ? "تم إرسال هذا الطلب لخبير حماية الملكية. يجب انتظار نتائج الفحص الفني قبل اتخاذ قرار نهائي لضمان سلامة الاسم تجارياً."
                                                        : Number(selectedRequest.statusId) === 10
                                                            ? "تمت الموافقة على هذا الطلب من قبل معاون الوزير (حجز مؤقت). يرجى مراجعة الملاحظات ثم اتخاذ القرار النهائي (قبول) لتثبيت الحجز وإخطار المحافظة."
                                                            : Number(selectedRequest.statusId) === 14
                                                                ? "عاد هذا الطلب من معاون الوزير/مدير الشركات بقرار رسمي. يرجى مراجعة سجل الملاحظات أدناه ثم اتخاذ القرار النهائي لإعادة الطلب لموظف المحافظة."
                                                                : "تم رفع هذا الملف للمدير العام أو معاون الوزير لمراجعته. سيتم تفعيل أزرار القرار بمجرد صدور توجيهاتهم الرسمية."}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}

                            {viewMode === 'archive' && (
                                <div className="glass-card p-6 space-y-4 bg-muted/20 border-t-4 border-t-sy-gold">
                                    <h4 className="font-bold text-xs text-sy-gold flex items-center gap-2 uppercase">
                                        <Archive className="w-4 h-4" />
                                        القرار المؤرشف
                                    </h4>
                                    <div className="p-4 bg-background rounded-xl border border-border text-xs leading-relaxed font-medium">
                                        {selectedRequest.auditorFeedback || "لا توجد ملاحظات إضافية"}
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-sy-green" />
                                            {selectedRequest.lockedByName}
                                        </div>
                                        <span className="text-muted-foreground">بتاريخ: {new Date(selectedRequest.updatedAt || "").toLocaleDateString("ar-SY")}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }


            {/* عارض الملفات الذكي (Multi-format) */}
            <FileViewerModal
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                filePath={pdfToView || ""}
                title="معاينة الوثيقة الفنية"
            />
            {/* نافذة الغايات التجارية المختارة */}
            {showPurposesModal && selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 text-right" dir="rtl">
                    <div className="bg-card w-full max-w-5xl max-h-[90vh] rounded-3xl border border-border shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-sy-green/10 rounded-lg">
                                    <ListChecks className="w-5 h-5 text-sy-green" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">تفاصيل الغايات التجارية المختارة</h4>
                                    <p className="text-[10px] text-muted-foreground">قائمة الأنشطة الاقتصادية والمتممات القانونية للطلب</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPurposesModal(false)}
                                className="p-2 bg-sy-red/10 text-sy-red hover:bg-sy-red hover:text-white rounded-full transition-all"
                            >
                                <ChevronRight className="w-6 h-6 rotate-180" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                                <table className="w-full text-right border-collapse">
                                    <thead className="bg-muted/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="px-4 py-4 border-b border-border">#</th>
                                            <th className="px-4 py-4 border-b border-border">رمز النشاط</th>
                                            <th className="px-4 py-4 border-b border-border">اسم النشاط</th>
                                            <th className="px-4 py-4 border-b border-border">ISIC4</th>
                                            <th className="px-4 py-4 border-b border-border">الجهة المختصة</th>
                                            <th className="px-4 py-4 border-b border-border">المتممات / التفاصيل</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {selectedRequest.selectedPurposes?.map((p, index) => (
                                            <tr key={index} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-4 text-[10px] font-bold text-sy-gold">{index + 1}</td>
                                                <td className="px-4 py-4 text-[10px] font-mono">{p.activityCode}</td>
                                                <td className="px-4 py-4 text-xs font-bold leading-relaxed">{p.activityName}</td>
                                                <td className="px-4 py-4 text-[10px] font-mono">{p.isic4Code}</td>
                                                <td className="px-4 py-4 text-[10px] font-medium text-primary">{p.authorityName || "---"}</td>
                                                <td className="px-4 py-4 text-[10px] text-muted-foreground leading-relaxed italic">
                                                    {p.complement || <span className="text-muted-foreground/30">لا توجد متممات</span>}
                                                </td>
                                            </tr>
                                        ))}
                                        {(!selectedRequest.selectedPurposes || selectedRequest.selectedPurposes.length === 0) && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-10 text-center text-xs text-muted-foreground italic">
                                                    لم يتم اختيار أي غايات تجارية لهذا الطلب.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Info Box */}
                            <div className="mt-6 p-4 bg-sy-gold/5 border border-sy-gold/20 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-sy-gold shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-sy-gold">توجيهات التدقيق:</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        يجب التأكد من أن جميع الأنشطة المختارة تتوافق مع "الاسم التجاري المقترح" وأن المتممات المدخلة لا تحتوي على أي مخالفات قانونية للنشاط التجاري المحدد.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end">
                            <button
                                onClick={() => setShowPurposesModal(false)}
                                className="px-8 py-2.5 bg-sy-green text-white rounded-xl font-bold text-xs shadow-lg shadow-sy-green/20 hover:scale-105 transition-all"
                            >
                                إغلاق النافذة
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* نافذة تأكيد التحويل للملكية (Modern Alert) */}
            {showConfirmIP && selectedRequest && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-md rounded-[2.5rem] border border-border shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-blue-500/5">
                                <Send className="w-10 h-10 text-blue-500 animate-pulse" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">تأكيد عملية التحويل</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed px-4">
                                    أنت على وشك تحويل الطلب رقم <span className="text-blue-500 font-bold">#{selectedRequest.id}</span> إلى مديرية حماية الملكية الفكرية لإجراء الفحص الفني.
                                </p>
                            </div>

                            <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 text-[10px] text-blue-600 font-bold leading-tight">
                                سيتم تغيير حالة الطلب إلى "بانتظار رد الملكية" ولن تتمكن من تعديله حتى يصل الرد الفني.
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setShowConfirmIP(false);
                                        handleAction(3);
                                    }}
                                    disabled={submitting}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-black shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    تأكيد وإرسال الآن
                                </button>
                                <button
                                    onClick={() => setShowConfirmIP(false)}
                                    className="w-full py-4 rounded-2xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                >
                                    إلغاء العملية
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* نافذة تأكيد الاستلام (Modern Alert) */}
            {showConfirmTake && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-md rounded-[2.5rem] border border-border shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-sy-green/10 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-sy-green/5">
                                <UserCheck className="w-10 h-10 text-sy-green animate-bounce" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">استلام مهمة تدقيق</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed px-4">
                                    أنت على وشك استلام تدقيق طلب شركة <span className="text-sy-green font-bold">{showConfirmTake.name}</span>.
                                </p>
                            </div>

                            <div className="bg-sy-green/5 p-4 rounded-2xl border border-sy-green/10 text-[10px] text-sy-green font-bold leading-tight">
                                عند التأكيد، سيتم قفل هذا الطلب باسمك ولن يتمكن مدقق آخر من العمل عليه.
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        const id = showConfirmTake.id;
                                        setShowConfirmTake(null);
                                        handleTakeRequest(id);
                                    }}
                                    disabled={submitting}
                                    className="w-full bg-sy-green text-white py-4 rounded-2xl text-xs font-black shadow-xl shadow-sy-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    تأكيد الاستلام والبدء
                                </button>
                                <button
                                    onClick={() => setShowConfirmTake(null)}
                                    className="w-full py-4 rounded-2xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                >
                                    التراجع
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* نافذة تأكيد القرار (قبول/رفض) (Modern Alert) */}
            {showConfirmAction && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`bg-card w-full max-w-md rounded-[2.5rem] border border-border overflow-hidden animate-in zoom-in-95 duration-300 ${showConfirmAction.statusId === 5 ? 'shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]' : 'shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]'}`}>
                        <div className="p-8 text-center space-y-6">
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto ring-8 ${showConfirmAction.statusId === 5 ? 'bg-sy-green/10 ring-sy-green/5' : 'bg-sy-red/10 ring-sy-red/5'}`}>
                                {showConfirmAction.statusId === 5 ? <CheckCircle className={`w-10 h-10 text-sy-green`} /> : <XCircle className={`w-10 h-10 text-sy-red`} />}
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">{showConfirmAction.title}</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed px-4">
                                    هل أنت متأكد من اتخاذ هذا القرار النهائي لهذا الطلب؟ {showConfirmAction.statusId === 6 && "يجب التأكد من كتابة مبررات الرفض."}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        const statusId = showConfirmAction.statusId;
                                        setShowConfirmAction(null);
                                        handleAction(statusId);
                                    }}
                                    disabled={submitting}
                                    className={`w-full text-white py-4 rounded-2xl text-xs font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${showConfirmAction.statusId === 5 ? 'bg-sy-green shadow-sy-green/20' : 'bg-sy-red shadow-sy-red/20'}`}
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    تأكيد القرار النهائي
                                </button>
                                <button
                                    onClick={() => setShowConfirmAction(null)}
                                    className="w-full py-4 rounded-2xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* نافذة التحويل للمراجعة القيادية */}
            {showForwardModal && selectedRequest && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
                    <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl p-8 space-y-6 animate-in zoom-in-95">
                        <div className="flex items-center gap-4 border-b border-border pb-4">
                            <div className="p-3 bg-slate-100 rounded-2xl">
                                <ShieldAlert className="w-6 h-6 text-slate-800" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-lg">تحويل للمراجعة القيادية</h4>
                                <p className="text-xs text-muted-foreground font-medium text-right">سيتم Escalation للطلب إلى مستوى الإدارة العليا.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-sy-gold/10 border border-sy-gold/20 rounded-2xl flex items-center gap-3">
                                <UserCircle2 className="w-5 h-5 text-sy-gold" />
                                <div className="text-right">
                                    <p className="text-xs font-black text-sy-gold uppercase">الوجهة: مدير الشركات</p>
                                    <p className="text-[10px] text-muted-foreground italic">سيتم رفع الطلب للمدير لاتخاذ القرار أو التوصية للمستوى الأعلى.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    مبررات الرفع للقيادة
                                </label>
                                <textarea
                                    value={forwardNote}
                                    onChange={(e) => setForwardNote(e.target.value)}
                                    placeholder="اشرح مبررات رفع الطلب للقيادة..."
                                    className="w-full bg-muted/30 border-2 border-border rounded-2xl p-4 min-h-[100px] text-sm font-bold focus:border-sy-gold/30 outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={async () => {
                                    try {
                                        if (!forwardNote.trim()) {
                                            setNotification({ message: "يرجى كتابة مبررات رفع الطلب للقيادة", type: "warning" });
                                            setTimeout(() => setNotification(null), 5000);
                                            return;
                                        }
                                        setSubmitting(true);
                                        await api.forwardToLeadership(selectedRequest.id, forwardTarget, forwardNote);
                                        setNotification({ message: "تم تحويل الطلب للقيادة بنجاح", type: "success" });
                                        setShowForwardModal(false);
                                        setSelectedRequest(null);
                                        fetchRequests();
                                    } catch (err) {
                                        setError(translateError(err));
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                                disabled={!forwardNote.trim() || submitting}
                                className="flex-1 bg-slate-800 text-white py-3 rounded-2xl font-black text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "تأكيد التحويل"}
                            </button>
                            <button
                                onClick={() => setShowForwardModal(false)}
                                className="px-6 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-2xl font-bold text-sm transition-all"
                            >
                                تراجع
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
