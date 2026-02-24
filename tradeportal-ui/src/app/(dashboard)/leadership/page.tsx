"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import {
    ShieldCheck,
    Send,
    CheckCircle,
    XCircle,
    Eye,
    ExternalLink,
    Search,
    FileText,
    ChevronRight,
    ChevronLeft,
    Inbox,
    Archive,
    Scale,
    Calendar,
    UserCheck,
    AlertCircle,
    Loader2,
    Info,
    MessageSquare,
    ArrowLeftRight,
    Gavel,
    ListChecks,
    History,
    FileSignature,
    MoreVertical,
    LayoutDashboard,
    CheckCircle2,
    Zap,
    X
} from "lucide-react";

import { useLookups } from "@/context/LookupsContext";
import api, { RequestDto } from "@/services/api";
import { translateError } from "@/utils/errorTranslator";
import { useAuth } from "@/context/AuthContext";
import PdfViewerModal from "@/components/PdfViewerModal";
import { NotificationToast } from "@/components/NotificationToast";
import { useSignalR } from "@/context/SignalRContext";
import { useSearchParams } from "next/navigation";
import { FilterPopover, FilterItem } from "@/components/FilterPopover";
import { Pagination } from "@/components/Pagination";

// --- Sub-Components: Modals ---

interface DashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose, title, icon, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
            <div className="bg-card w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] border border-border shadow-2xl overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 fade-in duration-300">
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sy-gold/10 rounded-xl text-sy-gold">
                            {icon}
                        </div>
                        <h3 className="font-extrabold text-foreground">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

function LeadershipDashboardContent() {
    const { user } = useAuth();
    const { provinces, companyTypes, statuses, lookups, isLoading: lookupsLoading } = useLookups();
    const searchParams = useSearchParams();
    const [listMode, setListMode] = useState<'incoming' | 'finished'>('incoming');

    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [provinceFilter, setProvinceFilter] = useState<number | "all">("all");
    const [statusFilter, setStatusFilter] = useState<number | "all">("all");
    const [companyTypeFilter, setCompanyTypeFilter] = useState<number | "all">("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [decisionNote, setDecisionNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Modal & Action States
    const [activeModal, setActiveModal] = useState<'purposes' | 'study' | 'history' | null>(null);
    const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'return' | 'forward', title: string, color: string } | null>(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfToView, setPdfToView] = useState<string>("");
    const [notification, setNotification] = useState<{ message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

    const viewParam = searchParams.get("view");
    const isAdmin = user?.roles.includes("Admin");

    const isMinisterAssistant = user?.roles.includes("MinisterAssistant") || (isAdmin && viewParam === "minister");
    const isDirector = user?.roles.includes("Director") || (isAdmin && viewParam === "director");

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await api.getRequests();
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const { lastMessage } = useSignalR();

    useEffect(() => {
        if (!lastMessage || submitting) return;
        if (lastMessage.type === 'RequestCreated' || lastMessage.type === 'RequestUpdated') {
            fetchRequests();
            if (lastMessage.type === 'RequestUpdated') {
                const updatedReq = lastMessage.data as RequestDto;
                if (selectedRequest?.id === updatedReq.id) {
                    setSelectedRequest(updatedReq);
                }
            }
        }
    }, [lastMessage, submitting, selectedRequest?.id]);

    useEffect(() => {
        fetchRequests();
    }, []);

    // Reset selection and filters when switching tabs
    useEffect(() => {
        setSelectedRequest(null);
        setCurrentPage(1);
        setSearchQuery("");
        setProvinceFilter("all");
        setStatusFilter("all");
        setCompanyTypeFilter("all");
    }, [listMode]);

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

    const filteredRequests = useMemo(() => {
        return requests.filter(r => {
            const matchesSearch = r.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toString() === searchQuery;
            if (!matchesSearch) return false;

            if (provinceFilter !== "all" && r.provinceId !== provinceFilter) return false;
            if (statusFilter !== "all" && r.statusId !== statusFilter) return false;
            if (companyTypeFilter !== "all" && r.companyTypeId !== companyTypeFilter) return false;

            const isCurrentActioner =
                (isDirector && r.statusId === 8) ||
                (isMinisterAssistant && r.statusId === 9);

            const hasActionInHistory = r.history?.some(h =>
                (isDirector && h.role === "Director") ||
                (isMinisterAssistant && h.role === "MinisterAssistant")
            );

            if (listMode === 'incoming') return isCurrentActioner;
            return hasActionInHistory;
        });
    }, [requests, searchQuery, listMode, isDirector, isMinisterAssistant, provinceFilter, statusFilter, companyTypeFilter]);

    const paginatedRequests = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(start, start + itemsPerPage);
    }, [filteredRequests, currentPage]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const counts = useMemo(() => {
        const incoming = requests.filter(r =>
            (isDirector && r.statusId === 8) ||
            (isMinisterAssistant && r.statusId === 9)
        ).length;

        const finished = requests.filter(r =>
            r.history?.some(h =>
                (isDirector && h.role === "Director") ||
                (isMinisterAssistant && h.role === "MinisterAssistant")
            )
        ).length;

        return { incoming, finished };
    }, [requests, isDirector, isMinisterAssistant]);

    const handleAction = async (action: 'approve' | 'return' | 'forward') => {
        if (!selectedRequest || submitting) return;
        try {
            setSubmitting(true);
            if (isMinisterAssistant) {
                await api.ministerDecision(selectedRequest.id, action === 'approve', decisionNote);
            } else if (isDirector) {
                await api.directorDecision(selectedRequest.id, action as any, decisionNote);
            }

            setNotification({ message: "تم تسجيل القرار السيادي بنجاح", type: "success" });

            // Clear UI immediately
            setSelectedRequest(null);
            setDecisionNote("");

            // Refresh list
            await fetchRequests();
        } catch (err) {
            setNotification({ message: translateError(err), type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] overflow-hidden flex flex-col font-sy text-right" dir="rtl">
            {notification && (
                <NotificationToast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
            )}

            {/* Header - Compact */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 mb-2 bg-card border border-border rounded-3xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sy-gold/10 rounded-2xl border border-sy-gold/20">
                        <Scale className="w-6 h-6 text-sy-gold" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-foreground">
                            {isMinisterAssistant ? "مكتب معاون الوزير" : "مدير الشركات"}
                        </h1>
                        <p className="text-[10px] font-bold text-muted-foreground opacity-70">نظام الاعتماد والقرارات الاستراتيجية</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 bg-background border border-border px-3 py-1.5 rounded-2xl relative group focus-within:ring-2 focus-within:ring-sy-gold/20 transition-all">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="بحث سريع..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="bg-transparent text-xs font-bold w-48 outline-none placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <FilterPopover
                        isOpen={isFilterOpen}
                        onToggle={() => setIsFilterOpen(!isFilterOpen)}
                        onReset={() => {
                            setProvinceFilter("all");
                            setStatusFilter("all");
                            setCompanyTypeFilter("all");
                            setCurrentPage(1);
                        }}
                        activeFiltersCount={[provinceFilter, statusFilter, companyTypeFilter].filter(f => f !== "all").length}
                    >
                        <FilterItem label="المحافظة">
                            <select
                                value={provinceFilter}
                                onChange={(e) => { setProvinceFilter(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value="all">كل المحافظات</option>
                                {provinces.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.nameAr}</option>
                                ))}
                            </select>
                        </FilterItem>

                        <FilterItem label="نوع الشركة">
                            <select
                                value={companyTypeFilter}
                                onChange={(e) => { setCompanyTypeFilter(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value="all">كل الأنواع</option>
                                {companyTypes.map((t: any) => (
                                    <option key={t.id} value={t.id}>{t.nameAr}</option>
                                ))}
                            </select>
                        </FilterItem>

                        <FilterItem label="حالة الطلب">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value="all">كل الحالات</option>
                                {lookupsLoading ? (
                                    <option disabled>جاري التحميل...</option>
                                ) : (
                                    statuses.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.nameAr}</option>
                                    ))
                                )}
                            </select>
                        </FilterItem>
                    </FilterPopover>
                </div>
            </header>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Sidebar - List */}
                <aside className="w-80 flex flex-col bg-card border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
                    <div className="p-2 flex gap-1 bg-muted/20 border-b border-border">
                        <button
                            onClick={() => !submitting && setListMode('incoming')}
                            disabled={submitting}
                            className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black transition-all relative ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${listMode === 'incoming' ? 'bg-sy-gold text-white shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            <Inbox className="w-4 h-4" />
                            الواردة
                            <span className={`mr-1 px-1.5 py-0.5 rounded-full text-[8px] font-black ${listMode === 'incoming' ? 'bg-white text-sy-gold' : 'bg-sy-gold text-white'}`}>
                                {counts.incoming}
                            </span>
                        </button>
                        <button
                            onClick={() => !submitting && setListMode('finished')}
                            disabled={submitting}
                            className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black transition-all relative ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${listMode === 'finished' ? 'bg-sy-green text-white shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            <Archive className="w-4 h-4" />
                            المنتهية
                            <span className={`mr-1 px-1.5 py-0.5 rounded-full text-[8px] font-black ${listMode === 'finished' ? 'bg-white text-sy-green' : 'bg-sy-green text-white'}`}>
                                {counts.finished}
                            </span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {loading && requests.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-3 opacity-30">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <span className="text-[10px] font-black">جاري المزامنة...</span>
                            </div>
                        ) : paginatedRequests.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-2 text-center py-20 opacity-20">
                                <Inbox className="w-10 h-10" />
                                <p className="text-xs font-black">لا توجد طلبات</p>
                            </div>
                        ) : (
                            paginatedRequests.map(req => (
                                <button
                                    key={req.id}
                                    onClick={() => !submitting && setSelectedRequest(req)}
                                    disabled={submitting}
                                    className={`w-full text-right p-4 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${selectedRequest?.id === req.id
                                        ? (listMode === 'incoming' ? 'bg-card border-sy-gold shadow-lg shadow-sy-gold/5' : 'bg-card border-sy-green shadow-lg shadow-sy-green/5')
                                        : 'bg-muted/5 border-border hover:bg-muted/10 hover:border-muted-foreground/30'}`}
                                >
                                    {selectedRequest?.id === req.id && <div className={`absolute right-0 top-0 bottom-0 w-1 ${listMode === 'incoming' ? 'bg-sy-gold' : 'bg-sy-green'}`} />}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-black text-muted-foreground opacity-50">#{req.id}</span>
                                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border ${selectedRequest?.id === req.id ? 'bg-sy-gold/10 border-sy-gold/20 text-sy-gold' : 'bg-muted border-border text-muted-foreground'}`}>
                                            {req.statusName}
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-black text-foreground truncate group-hover:text-sy-gold transition-colors">{req.companyName}</h4>
                                    <div className="flex items-center gap-2 mt-2 text-[9px] font-bold text-muted-foreground">
                                        <Calendar className="w-3 h-3 opacity-50" />
                                        {new Date(req.createdAt).toLocaleDateString('ar-SY')}
                                        <span className="opacity-20">•</span>
                                        {req.provinceName}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Pagination in Sidebar */}
                    <div className="p-4 border-t border-border bg-muted/10">
                        <div className="flex items-center justify-between gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-border hover:bg-muted disabled:opacity-20"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <span className="text-[10px] font-black text-muted-foreground">
                                {currentPage} / {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-2 rounded-xl border border-border hover:bg-muted disabled:opacity-20"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area - No Scroll */}
                <main className="flex-1 bg-card border border-border rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden relative">
                    {!selectedRequest ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-40">
                            <LayoutDashboard className="w-24 h-24 text-muted-foreground/20" />
                            <div className="text-center">
                                <h2 className="text-lg font-black text-muted-foreground">مركز القرارات السيادية</h2>
                                <p className="text-[11px] font-bold text-muted-foreground/60">اختر طلباً من القائمة الجانبية لبدء الإجراءات</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
                            {/* Request Info Bar */}
                            <div className="p-6 border-b border-border bg-muted/5 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-background rounded-3xl border border-border shadow-sm">
                                        <FileText className="w-6 h-6 text-sy-gold" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-black text-foreground">{selectedRequest.companyName}</h2>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase opacity-70">
                                            <span>{selectedRequest.companyTypeName}</span>
                                            <span className="opacity-30">|</span>
                                            <span>محافظة {selectedRequest.provinceName}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setPdfToView(selectedRequest.mainPdfPath || ""); setIsPdfModalOpen(true); }}
                                    className="flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-2xl text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Eye className="w-4 h-4" />
                                    الملف الكامل
                                </button>
                            </div>

                            {/* Details Grid - The "No Scroll" Heart */}
                            <div className="flex-1 p-8 grid grid-cols-3 gap-6 overflow-hidden">
                                {/* Card 1: Business Purposes */}
                                <div className="bg-muted/20 border border-border rounded-[2rem] p-6 flex flex-col gap-6 group hover:bg-muted/30 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-sy-green">
                                            <ListChecks className="w-6 h-6" />
                                            <h3 className="text-xs font-black uppercase tracking-wider">الغايات التجارية</h3>
                                        </div>
                                        <div className="p-2 bg-sy-green/10 rounded-lg text-sy-green font-black text-[10px]">{selectedRequest.selectedPurposes?.length}</div>
                                    </div>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                        تحتوي هذه المنطقة على كافة الأنشطة والغايات التجارية المحددة في طلب التأسيس.
                                    </p>
                                    <button
                                        onClick={() => setActiveModal('purposes')}
                                        className="mt-auto w-full py-4 bg-card border border-border rounded-2xl text-[11px] font-black hover:bg-sy-green hover:text-white hover:border-sy-green transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        عرض كافة الغايات
                                    </button>
                                </div>

                                {/* Card 2: Technical Study */}
                                <div className="bg-muted/20 border border-border rounded-[2rem] p-6 flex flex-col gap-6 group hover:bg-muted/30 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-sy-gold">
                                            <ShieldCheck className="w-6 h-6" />
                                            <h3 className="text-xs font-black uppercase tracking-wider">دراسة خبير الملكية</h3>
                                        </div>
                                        {selectedRequest.ipReportPath && <Zap className="w-4 h-4 text-sy-gold animate-pulse" />}
                                    </div>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                        مراجعة التوصية الفنية المتعلقة بالاسم التجاري والعلامات التجارية من قبل الخبراء الفنيين.
                                    </p>
                                    <button
                                        onClick={() => setActiveModal('study')}
                                        className="mt-auto w-full py-4 bg-card border border-border rounded-2xl text-[11px] font-black hover:bg-sy-gold hover:text-white hover:border-sy-gold transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Search className="w-4 h-4" />
                                        فتح الدراسة الفنية
                                    </button>
                                </div>

                                {/* Card 3: Audit Chronology */}
                                <div className="bg-muted/20 border border-border rounded-[2rem] p-6 flex flex-col gap-6 group hover:bg-muted/30 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <History className="w-6 h-6" />
                                            <h3 className="text-xs font-black uppercase tracking-wider">تاريخ المراجعة</h3>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                        تتبع مسار الطلب منذ التقديم وحتى وصوله لمرحلة القرار القيادي، مع الاطلاع على كافة الملاحظات.
                                    </p>
                                    <button
                                        onClick={() => setActiveModal('history')}
                                        className="mt-auto w-full py-4 bg-card border border-border rounded-2xl text-[11px] font-black hover:bg-foreground hover:text-background transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeftRight className="w-4 h-4" />
                                        عرض جدول المسار
                                    </button>
                                </div>
                            </div>

                            {/* Sticky Decision Footer - Actions or Summary */}
                            <div className="p-8 bg-muted/50 dark:bg-card border-t border-border">
                                {listMode === 'incoming' ? (
                                    <div className="flex gap-6 items-end">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3 text-sy-gold">
                                                <Gavel className="w-5 h-5" />
                                                <span className="text-[11px] font-black uppercase tracking-widest text-foreground/70 dark:text-sy-gold">توجيه القرار الاستراتيجي</span>
                                            </div>
                                            <textarea
                                                value={decisionNote}
                                                onChange={(e) => setDecisionNote(e.target.value)}
                                                placeholder="اكتب التوجيهات النهائية هنا..."
                                                className="w-full h-24 bg-background border-2 border-border rounded-2xl p-4 text-foreground text-xs font-bold outline-none focus:border-sy-gold transition-all resize-none shadow-inner placeholder:opacity-40"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 w-72">
                                            {isMinisterAssistant ? (
                                                <>
                                                    <button
                                                        onClick={() => setPendingAction({ type: 'approve', title: 'موافقة (اعتماد نهائي)', color: 'bg-sy-green' })}
                                                        disabled={submitting}
                                                        className="w-full bg-sy-green text-white py-4 rounded-2xl font-black text-[11px] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> موافقة (اعتماد نهائي)
                                                    </button>
                                                    <button
                                                        onClick={() => setPendingAction({ type: 'return', title: 'رفض (إعادة للمدقق)', color: 'bg-sy-red' })}
                                                        disabled={submitting}
                                                        className="w-full bg-sy-red text-white py-4 rounded-2xl font-black text-[11px] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-4 h-4" /> رفض (إعادة للمدقق)
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setPendingAction({ type: 'forward', title: 'موافقة وتحويل لمعاون الوزير', color: 'bg-sy-green' })}
                                                        disabled={submitting}
                                                        className="w-full bg-sy-green text-white py-4 rounded-2xl font-black text-[12px] shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> موافقة وتحويل لمعاون الوزير
                                                    </button>
                                                    <button
                                                        onClick={() => setPendingAction({ type: 'return', title: 'رفض (إعادة للمدقق)', color: 'bg-sy-red' })}
                                                        disabled={submitting}
                                                        className="w-full bg-sy-red text-white py-4 rounded-2xl font-black text-[11px] shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-4 h-4" /> رفض (إعادة للمدقق)
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // Archive Mode: Show Final Verdict
                                    (() => {
                                        const myLastDecision = [...(selectedRequest.history || [])]
                                            .reverse()
                                            .find(h => (isDirector && h.role === "Director") || (isMinisterAssistant && h.role === "MinisterAssistant"));

                                        return (
                                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                                <div className="flex-1 flex items-center gap-6">
                                                    <div className="w-20 h-20 rounded-full border-4 border-sy-gold/20 flex items-center justify-center relative bg-sy-gold/5 shrink-0">
                                                        <Gavel className="w-8 h-8 text-sy-gold" />
                                                        <div className="absolute -bottom-1 -right-1 bg-sy-green text-white p-1 rounded-full border-2 border-background dark:border-card">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-sy-gold uppercase tracking-tighter">القرار الرسمي المسجل:</p>
                                                        <h4 className="text-xl font-black text-foreground dark:text-white leading-none">
                                                            {myLastDecision ? getActionLabel(myLastDecision.actionType) : "تم البت في الطلب"}
                                                        </h4>
                                                        <p className="text-xs font-bold text-muted-foreground italic mt-2">
                                                            "{myLastDecision?.note || "لا توجد ملاحظات إضافية مسجلة مع هذا القرار."}"
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="bg-muted dark:bg-background/40 px-6 py-4 rounded-2xl border border-border text-center shrink-0">
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">تاريخ المصادقة</p>
                                                    <p className="text-xs font-black text-foreground">
                                                        {myLastDecision ? new Date(myLastDecision.createdAt).toLocaleDateString('ar-SY') : "---"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div >

            {/* --- Modals --- */}

            {/* 1. Modals: Business Purposes */}
            <DashboardModal title="غايات وأنشطة الشركة" icon={<ListChecks className="w-6 h-6" />} isOpen={activeModal === 'purposes'} onClose={() => setActiveModal(null)}>
                <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-muted/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-4 py-4 border-b border-border">#</th>
                                <th className="px-4 py-4 border-b border-border">رمز النشاط</th>
                                <th className="px-4 py-4 border-b border-border">اسم النشاط</th>
                                <th className="px-4 py-4 border-b border-border">الجهة المختصة</th>
                                <th className="px-4 py-4 border-b border-border">التفاصيل</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {selectedRequest?.selectedPurposes?.map((p, index) => (
                                <tr key={index} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4 text-[10px] font-bold text-sy-gold">{index + 1}</td>
                                    <td className="px-4 py-4 text-[10px] font-mono">{p.activityCode}</td>
                                    <td className="px-4 py-4 text-xs font-bold leading-relaxed">{p.activityName}</td>
                                    <td className="px-4 py-4 text-[10px] font-medium text-primary">{p.authorityName || "---"}</td>
                                    <td className="px-4 py-4 text-[10px] text-muted-foreground leading-relaxed italic">
                                        {p.complement || "---"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DashboardModal>

            {/* 2. Modals: Technical Study */}
            <DashboardModal title="تقرير ودراسة خبير الملكية الفكرية" icon={<ShieldCheck className="w-6 h-6" />} isOpen={activeModal === 'study'} onClose={() => setActiveModal(null)}>
                <div className="space-y-6">
                    <div className="bg-muted/30 border border-border p-6 rounded-3xl min-h-[150px] relative">
                        <MessageSquare className="absolute left-6 top-6 w-12 h-12 text-sy-gold opacity-10" />
                        <h5 className="text-[10px] font-black text-sy-gold uppercase mb-4 tracking-widest">التوصية الفنية المختصرة:</h5>
                        <p className="text-sm font-bold text-foreground leading-relaxed italic pr-4">
                            {selectedRequest?.ipExpertFeedback ? `"${selectedRequest.ipExpertFeedback}"` : "لا يوجد نص مضاف حالياً للتقرير الفني من قبل الخبير."}
                        </p>
                    </div>
                    {selectedRequest?.ipReportPath && (
                        <div className="bg-sy-gold/5 border border-sy-gold/20 p-6 rounded-3xl flex flex-col items-center gap-4 text-center">
                            <span className="text-[10px] font-bold text-sy-gold">يوجد ملف مرفق مفصل للدراسة الفنية</span>
                            <button
                                onClick={() => { setPdfToView(selectedRequest.ipReportPath || ""); setIsPdfModalOpen(true); }}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-sy-gold text-white rounded-2xl text-xs font-black shadow-xl hover:scale-105 transition-all"
                            >
                                <ExternalLink className="w-5 h-5" />
                                معاينة المرفق الفني الرقمي (PDF)
                            </button>
                        </div>
                    )}
                </div>
            </DashboardModal>

            {/* 3. Modals: Audit History */}
            <DashboardModal title="سجل توثيق الطلب (التسلسل الزمني)" icon={<History className="w-6 h-6" />} isOpen={activeModal === 'history'} onClose={() => setActiveModal(null)}>
                <div className="relative space-y-0">
                    <div className="absolute right-4 top-2 bottom-2 w-0.5 bg-border" />
                    {selectedRequest?.history?.map((h, i) => (
                        <div key={i} className="relative pr-12 pb-10 last:pb-2">
                            <div className={`absolute right-2 top-2 w-4 h-4 rounded-full border-2 border-card z-10 ${i === 0 ? 'bg-sy-gold scale-125 shadow-lg shadow-sy-gold/40' : 'bg-muted-foreground/40'}`} />
                            <div className="bg-muted/30 p-5 rounded-3xl border border-border shadow-sm flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-background border-2 border-sy-gold/20 flex items-center justify-center text-xs font-black text-sy-gold shadow-sm">
                                            {(h.userName || h.role)?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-black text-foreground">{h.userName || "مستخدم النظام"}</p>
                                                <span className="text-[8px] font-black bg-sy-gold/10 text-sy-gold px-1.5 py-0.5 rounded uppercase">{getRoleLabel(h.role || "")}</span>
                                            </div>
                                            <p className="text-[10px] font-black text-sy-green mt-0.5">{getActionLabel(h.actionType || "")}</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <span className="text-[9px] font-black text-muted-foreground block">{new Date(h.createdAt).toLocaleDateString('ar-SY')}</span>
                                        <span className="text-[8px] font-bold text-muted-foreground/60 block">{new Date(h.createdAt).toLocaleTimeString('ar-SY')}</span>
                                    </div>
                                </div>
                                <div className="bg-card/50 border border-border/40 p-4 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-sy-gold/30" />
                                    <p className="text-xs font-bold text-muted-foreground italic leading-relaxed">
                                        {h.note ? `"${h.note}"` : "استكمال مسار العمل المعياري للطلب دون ملاحظات إضافية."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardModal>

            {/* Confirmation Modal */}
            <DashboardModal
                title="تأكيد الإجراء السيادي"
                icon={<AlertCircle className="w-6 h-6 text-sy-gold" />}
                isOpen={!!pendingAction}
                onClose={() => setPendingAction(null)}
            >
                <div className="space-y-6 text-center">
                    <div className="p-6 bg-muted/20 rounded-3xl border border-border">
                        <p className="text-sm font-bold text-foreground">
                            هل أنت متأكد من تنفيذ إجراء <span className="text-sy-gold font-black">"{pendingAction?.title}"</span> للشركة <span className="font-black">"{selectedRequest?.companyName}"</span>؟
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
                            هذا الإجراء سيقوم بتحريك حالة الطلب وإرسال الإشعارات اللازمة للموظفين المعنيين بشكل فوري.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                if (pendingAction) {
                                    handleAction(pendingAction.type);
                                    setPendingAction(null);
                                }
                            }}
                            disabled={submitting}
                            className={`flex-1 py-4 ${pendingAction?.color.includes('bg-sy-') ? pendingAction.color : 'bg-foreground'} text-white rounded-2xl text-xs font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            تأكيد التنفيذ
                        </button>
                        <button
                            onClick={() => setPendingAction(null)}
                            className="flex-1 py-4 bg-muted text-muted-foreground rounded-2xl text-xs font-black shadow-md hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            تراجع
                        </button>
                    </div>
                </div>
            </DashboardModal>

            <PdfViewerModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} pdfPath={pdfToView} title="معاينة المستند المهني" />
        </div >
    );
}

export default function LeadershipDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 text-sy-gold animate-spin" />
                    <span className="text-lg font-black text-muted-foreground">جاري تحميل لوحة القيادة...</span>
                </div>
            </div>
        }>
            <LeadershipDashboardContent />
        </Suspense>
    );
}
