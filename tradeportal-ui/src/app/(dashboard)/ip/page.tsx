"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    ShieldCheck,
    Clock,
    FileText,
    Send,
    History,
    AlertCircle,
    FileCheck,
    Upload,
    CheckCircle2,
    Search,
    ChevronRight,
    ChevronLeft,
    Inbox,
    MessageCircle,
    Eye,
    Loader2,
    ListChecks
} from "lucide-react";

import api, { RequestDto } from "@/services/api";
import { translateError } from "@/utils/errorTranslator";
import { useSignalR } from "@/context/SignalRContext";
import { useAuth } from "@/context/AuthContext";
import { useLookups } from "@/context/LookupsContext";
import { NotificationToast } from "@/components/NotificationToast";
import PdfViewerModal from "@/components/PdfViewerModal";
import { FilterPopover, FilterItem } from "@/components/FilterPopover";
import { Pagination } from "@/components/Pagination";

/**
 * لوحة تحكم خبير حماية الملكية (IP Expert Dashboard)
 * المحسنة بنظام الترقيم، الفلترة المتقدمة لفرز الطلبات (الواردة/المنتهية)
 * مربوطة بالـ API الحقيقي
 */
export default function IPDashboard() {
    // حالة البيانات الحقيقية
    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // حالة الطلب المختار للرد
    const [activeConsult, setActiveConsult] = useState<RequestDto | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [provinceFilter, setProvinceFilter] = useState<number | "all">("all");
    const [companyTypeFilter, setCompanyTypeFilter] = useState<number | "all">("all");

    // حالات التصفية والترقيم
    const [viewMode, setViewMode] = useState<"pending" | "resolved">("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // حالة إرسال التقرير
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [verdict, setVerdict] = useState<"لا مانع قانوني" | "الاسم محمي" | "يسمح بشروط" | "">("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfToView, setPdfToView] = useState<string>("");

    // حالة عرض الغايات التجارية
    const [showPurposesModal, setShowPurposesModal] = useState(false);

    // حالة تأكيد الاستلام والإرسال
    const [showConfirmTake, setShowConfirmTake] = useState<{ id: number, name: string } | null>(null);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    // حالة الإشعارات والربط الفوري
    const [notification, setNotification] = useState<{ message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
    const { lastMessage } = useSignalR();
    const { user } = useAuth();
    const { provinces, companyTypes, isLoading: lookupsLoading } = useLookups();

    // هل يملك المستخدم الحالي صلاحية التعديل؟ (صاحب الحجز أو مدير النظام)
    const canEdit = useMemo(() => {
        if (!activeConsult) return false;
        if (user?.roles.includes("Admin")) return true;
        return activeConsult.ipExpertId === user?.id;
    }, [activeConsult, user]);

    // تحقق من اكتمال كافة متطلبات الدراسة الفنية قبل السماح بالإرسال
    const isReportReady = useMemo(() => {
        return !!verdict && !!feedback.trim() && !!pdfFile;
    }, [verdict, feedback, pdfFile]);

    // جلب البيانات عند التحميل
    const fetchRequests = async () => {
        setLoading(true);
        try {
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
        setActiveConsult(null);
        setCurrentPage(1);
        setSearchQuery("");
        setProvinceFilter("all");
        setCompanyTypeFilter("all");
    }, [viewMode]);

    // الاستماع للتحديثات الفورية (SignalR)
    useEffect(() => {
        if (!lastMessage || submitting) return;

        if (lastMessage.type === 'RequestCreated' || (lastMessage.type === 'RequestUpdated' && lastMessage.data.statusId === 3)) {
            const req = lastMessage.data as RequestDto;
            setRequests(prev => {
                const exists = prev.find(r => r.id === req.id);
                if (exists) return prev.map(r => r.id === req.id ? req : r);
                return [req, ...prev];
            });

            if (Number(req.statusId) === 3 && !req.ipExpertId) {
                setNotification({
                    message: `طلب فحص فني جديد لشركة: ${req.companyName}`,
                    type: 'warning'
                });
            }
        } else if (lastMessage.type === 'RequestUpdated') {
            const updatedReq = lastMessage.data as RequestDto;
            setRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));

            if (activeConsult?.id === updatedReq.id) {
                setActiveConsult(updatedReq);
            }
        }
    }, [lastMessage, submitting, activeConsult?.id]);

    // تصفية البيانات (Status 3 للوارد، Status 4 للمنتهى)
    const filteredConsults = useMemo(() => {
        return requests.filter(item => {
            const matchesSearch = item.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toString().includes(searchQuery);
            if (!matchesSearch) return false;

            if (provinceFilter !== "all" && item.provinceId !== provinceFilter) return false;
            if (companyTypeFilter !== "all" && item.companyTypeId !== companyTypeFilter) return false;

            // 3: SentToIp, 4: IpExpertResponded, 11: Referred
            const status = Number(item.statusId);
            const isIpAdmin = user?.roles.includes("Admin") || user?.roles.includes("IpExpertAdmin");
            const matchesView = viewMode === "resolved"
                ? (status !== 3 && status !== 11 && (isIpAdmin || Number(item.ipExpertId) === Number(user?.id)))
                : (status === 3 || status === 11);
            return matchesView;
        });
    }, [requests, searchQuery, viewMode, provinceFilter, companyTypeFilter]);

    // الترقيم
    const totalPages = Math.ceil(filteredConsults.length / itemsPerPage);
    const paginatedConsults = useMemo(() => {
        return filteredConsults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredConsults, currentPage, itemsPerPage]);

    // التعامل مع اختيار طلب
    const handleSelectConsult = (item: RequestDto) => {
        setActiveConsult(item);
        setFeedback(item.ipExpertFeedback || "");
        setVerdict("");
        setPdfFile(null);
    };

    // استلام الطلب (Take)
    const handleTake = async (id: number) => {
        if (submitting) return;
        try {
            setSubmitting(true);
            await api.takeRequest(id);

            // تحديث محلي فوري لتفادي تأخير الشبكة
            setRequests(prev => prev.map(r => {
                if (r.id === id) {
                    return { ...r, ipExpertId: -1 }; // -1 مؤقت
                }
                return r;
            }));

            await fetchRequests();

            setRequests(currentRequests => {
                const updated = currentRequests.find(r => r.id === id);
                if (updated) {
                    setActiveConsult(updated);
                }
                return currentRequests;
            });

        } catch (err) {
            setNotification({ message: translateError(err), type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // إرسال التقرير النهائي
    const handleSubmitReport = async () => {
        if (!activeConsult || submitting) return;
        if (!feedback || !verdict) {
            setNotification({ message: "يرجى كتابة التقرير وتحديد محصلة الفحص", type: 'warning' });
            return;
        }

        try {
            setSubmitting(true);
            let reportPath = "";
            if (pdfFile) {
                const uploadRes = await api.uploadFile(pdfFile);
                reportPath = uploadRes.path;
            }

            await api.addTechnicalReport(activeConsult.id, {
                feedback: `${verdict}: ${feedback}`,
                reportPath: reportPath
            });

            setNotification({
                message: "تم إرسال الدراسة الفنية بنجاح",
                type: 'success'
            });

            // تفريغ الحقول وإغلاق الطلب لضمان عدم الإرسال المتكرر
            setActiveConsult(null);
            setFeedback("");
            setVerdict("");
            setPdfFile(null);

            await fetchRequests();
        } catch (err) {
            setNotification({ message: translateError(err), type: 'error' });
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

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* رأس الصفحة */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sy-gold/10 rounded-2xl shadow-lg shadow-sy-gold/5">
                        <ShieldCheck className="w-8 h-8 text-sy-gold" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">مركز استشارات حماية الملكية</h2>
                        <p className="text-muted-foreground font-medium">نظام التدقيق الفني الموحد للعلامات والأسماء التجارية</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            placeholder="بحث عن طلب فحص فني..."
                            className="w-full bg-card border border-border rounded-xl pr-12 pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sy-gold/50 shadow-md transition-all"
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* الجانب الأيمن: قائمة المهام والوارد */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-1 bg-card border border-border p-1.5 rounded-2xl shadow-md">
                        <button
                            onClick={() => { if (!submitting) { setViewMode("pending"); setCurrentPage(1); setActiveConsult(null); } }}
                            disabled={submitting}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === "pending" ? "bg-sy-gold text-white shadow-lg shadow-sy-gold/20" : "text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <Inbox className="w-4 h-4" />
                            <span>طلبات فحص</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${viewMode === "pending" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                                {requests.filter(c => {
                                    const s = Number(c.statusId);
                                    return s === 3 || s === 11;
                                }).length}
                            </span>
                        </button>
                        <button
                            onClick={() => { if (!submitting) { setViewMode("resolved"); setCurrentPage(1); setActiveConsult(null); } }}
                            disabled={submitting}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === "resolved" ? "bg-sy-green text-white shadow-lg shadow-sy-green/20" : "text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <History className="w-4 h-4" />
                            <span>سجل الردود</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${viewMode === "resolved" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                                {requests.filter(c => {
                                    const s = Number(c.statusId);
                                    const isIpAdmin = user?.roles.includes("Admin") || user?.roles.includes("IpExpertAdmin");
                                    return s !== 3 && s !== 11 && (isIpAdmin || Number(c.ipExpertId) === Number(user?.id));
                                }).length}
                            </span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {loading && requests.length === 0 ? (
                            <div className="p-12 text-center glass-card">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-sy-gold" />
                            </div>
                        ) : paginatedConsults.length > 0 ? (
                            paginatedConsults.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => !submitting && handleSelectConsult(item)}
                                    className={`glass-card p-4 transition-all border-r-4 shadow-md ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${activeConsult?.id === item.id
                                        ? `scale-[1.03] ${viewMode === 'pending' ? 'border-sy-gold bg-sy-gold/10' : 'border-sy-green bg-sy-green/10'}`
                                        : "border-transparent hover:border-border/60"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${viewMode === 'pending' ? 'text-sy-gold bg-sy-gold/5 border-sy-gold/10' : 'text-sy-green bg-sy-green/5 border-sy-green/10'
                                            }`}>{item.id}</span>

                                        {/* التبديل بين الأولوية والنتيجة */}
                                        {viewMode === "pending" ? (
                                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border-2 bg-sy-gold/10 text-sy-gold border-sy-gold/20`}>
                                                بانتظار الرد
                                            </span>
                                        ) : (
                                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border-2 bg-sy-green/10 text-sy-green border-sy-green/20`}>
                                                تم الرد
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 mb-1">
                                        <h4 className="font-bold text-sm group-hover:text-sy-gold transition-colors line-clamp-1">{item.companyName}</h4>
                                        <span className="text-[9px] font-bold text-primary bg-primary/5 w-fit px-1.5 py-0.5 rounded border border-primary/10">{item.companyTypeName}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${viewMode === 'pending' ? 'bg-sy-gold' : 'bg-sy-green'}`}></div>
                                            {item.provinceName || "المركز الرئيسي"}
                                        </span>
                                        <span>{item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : ""}</span>
                                    </div>

                                    {/* زر الاستلام السريع */}
                                    {viewMode === "pending" && !item.ipExpertId && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!submitting) setShowConfirmTake({ id: item.id, name: item.companyName });
                                            }}
                                            disabled={submitting}
                                            className="mt-3 w-full py-2 bg-sy-gold text-white rounded-xl text-[10px] font-bold shadow-lg shadow-sy-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            استلام للدراسة الفنية
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center glass-card opacity-50 border-dashed">
                                <p className="text-xs font-bold text-muted-foreground">لا توجد طلبات واردة</p>
                            </div>
                        )}
                    </div>

                    {/* Compact Pagination for Sidebar */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-2 pt-4 border-t border-border/50 mt-4">
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

                {/* الجانب الأيسر: مساحة التحرير والقرار */}
                <div className="lg:col-span-2">
                    {activeConsult ? (
                        <div className="glass-card flex flex-col h-full animate-in slide-in-from-left-4 duration-500 shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-border bg-card flex items-center justify-between gap-4 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setActiveConsult(null)}
                                        className="flex items-center gap-2 px-3 py-2 bg-background hover:bg-muted text-[11px] font-bold text-foreground rounded-xl border border-border transition-all shadow-sm active:scale-95 whitespace-nowrap"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                        الرجوع للقائمة
                                    </button>
                                    <div className="space-y-1">
                                        <h3 className="font-bold flex items-center gap-2">
                                            {viewMode === 'pending' ? 'إعداد التقرير الفني المعتمد' : 'مراجعة التقرير الفني المرسل'}
                                            <span className="text-sy-gold">/ {activeConsult.companyName}</span>
                                        </h3>
                                        <span className="text-[9px] font-bold text-primary bg-primary/5 w-fit px-1.5 py-0.5 rounded border border-primary/10">{activeConsult.companyTypeName}</span>
                                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> المعرف: {activeConsult.id}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> تاريخ الورود: {activeConsult.submissionDate ? new Date(activeConsult.submissionDate).toLocaleDateString() : ""}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePreviewFile(activeConsult.mainPdfPath)}
                                    className="text-[11px] text-sy-green font-bold hover:brightness-110 p-3 bg-sy-green/10 rounded-xl transition-all border border-sy-green/20 flex items-center gap-2 shadow-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    معاينة مستندات الطلب
                                </button>
                            </div>

                            <div className="p-8 space-y-8 h-[600px] overflow-y-auto custom-scrollbar">
                                {viewMode === 'pending' ? (
                                    <>
                                        {/* مراجعة سريعة للبيانات */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* عرض الغايات التجارية */}
                                            <div className="glass-card p-5 space-y-4 shadow-xl border-sy-green/20 col-span-full">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-[11px] flex items-center gap-2">
                                                        <ListChecks className="w-4 h-4 text-sy-green" />
                                                        الغايات التجارية المختارة
                                                    </h4>
                                                    <span className="text-[9px] bg-sy-green/10 text-sy-green px-2 py-0.5 rounded-full font-bold">
                                                        {activeConsult.selectedPurposes?.length || 0} أنشطة
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                    راجع قائمة الأنشطة والمتممات المحددة من قبل مقدم الطلب للتأكد من مطابقتها للاختصاص.
                                                </p>
                                                <button
                                                    onClick={() => setShowPurposesModal(true)}
                                                    className="w-full py-2 bg-sy-green/10 text-sy-green border border-sy-green/20 rounded-xl text-[10px] font-bold hover:bg-sy-green hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    عرض تفاصيل الغايات
                                                </button>
                                            </div>
                                        </div>

                                        {/* نتيجة الفحص السريع */}
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-sy-gold" />
                                                    تحديد محصلة الفحص الفني
                                                </div>

                                                {/* زر الاستلام داخل الصفحة في حال لم يتم الاستلام بعد */}
                                                {viewMode === "pending" && !activeConsult.ipExpertId && (
                                                    <button
                                                        onClick={() => setShowConfirmTake({ id: activeConsult.id, name: activeConsult.companyName })}
                                                        className="px-4 py-1.5 bg-sy-gold text-white rounded-lg text-[10px] font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
                                                    >
                                                        <ShieldCheck className="w-3 h-3" />
                                                        استلام الطلب الآن
                                                    </button>
                                                )}
                                            </label>

                                            {/* رسالة تنبيهية في حال عدم الاستلام */}
                                            {viewMode === "pending" && !canEdit && (
                                                <div className="p-4 bg-sy-red/5 border border-sy-red/20 rounded-2xl flex items-center gap-3 text-sy-red animate-pulse">
                                                    <AlertCircle className="w-5 h-5" />
                                                    <p className="text-[11px] font-bold">يجب استلام الطلب أولاً لتتمكن من إضافة التقرير ورفع الملف.</p>
                                                </div>
                                            )}

                                            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${!canEdit ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                                                <button
                                                    disabled={!canEdit}
                                                    onClick={() => setVerdict("لا مانع قانوني")}
                                                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all group ${verdict === 'لا مانع قانوني'
                                                        ? 'bg-sy-green text-white border-sy-green'
                                                        : 'border-sy-green/20 bg-sy-green/5 text-sy-green hover:bg-sy-green hover:text-white'
                                                        }`}
                                                >
                                                    <FileCheck className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs font-bold">متاح قانونياً</span>
                                                    <span className="text-[9px] opacity-70 mt-1">لا يتعارض مع أي علامة</span>
                                                </button>
                                                <button
                                                    onClick={() => setVerdict("الاسم محمي")}
                                                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all group ${verdict === 'الاسم محمي'
                                                        ? 'bg-sy-red text-white border-sy-red'
                                                        : 'border-sy-red/20 bg-sy-red/5 text-sy-red hover:bg-sy-red hover:text-white'
                                                        }`}
                                                >
                                                    <AlertCircle className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs font-bold">الاسم محمي</span>
                                                    <span className="text-[9px] opacity-70 mt-1">يوجد مطابقة مسجلة مسبقاً</span>
                                                </button>
                                                <button
                                                    onClick={() => setVerdict("يسمح بشروط")}
                                                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all group ${verdict === 'يسمح بشروط'
                                                        ? 'bg-sy-gold text-white border-sy-gold'
                                                        : 'border-sy-gold/20 bg-sy-gold/5 text-sy-gold hover:bg-sy-gold hover:text-white'
                                                        }`}
                                                >
                                                    <Clock className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs font-bold">شروط تقييدية</span>
                                                    <span className="text-[9px] opacity-70 mt-1">يحتاج تعديل طفيف للاعتماد</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* نص التقرير المفصل */}
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4" />
                                                المبررات والتحليلات الفنية
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    value={feedback}
                                                    disabled={!canEdit}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                    placeholder="يرجى كتابة التقرير التحليلي المفصل لعملية فحص الاسم التجاري هنا..."
                                                    className={`w-full h-48 bg-background border border-border rounded-2xl p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-sy-gold/30 shadow-inner transition-all ${!canEdit ? 'opacity-40 grayscale' : ''}`}
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* المرفقات الرسمية */}
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                التقرير الرسمي (PDF الموقّع إلكترونياً)
                                            </label>

                                            <label className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all bg-muted/10 hover:bg-muted/30 cursor-pointer group ${!canEdit ? 'opacity-30 grayscale cursor-not-allowed' : pdfFile ? 'border-sy-green bg-sy-green/10' : 'border-border'}`}>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf"
                                                    disabled={!canEdit}
                                                    onChange={(e) => {
                                                        const selected = e.target.files?.[0] || null;
                                                        if (selected && selected.size > 20 * 1024 * 1024) {
                                                            setNotification({ message: "حجم الملف كبير جداً (الأقصى 20MB)", type: 'error' });
                                                            return;
                                                        }
                                                        setPdfFile(selected);
                                                    }}
                                                />
                                                <div className={`p-4 rounded-full shadow-md transition-all ${pdfFile ? 'bg-sy-green text-white rotate-[360deg]' : 'bg-background'}`}>
                                                    {pdfFile ? <CheckCircle2 className="w-8 h-8" /> : <Upload className="w-8 h-8 text-sy-gold group-hover:scale-110 transition-transform" />}
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-sm font-bold ${pdfFile ? 'text-sy-green' : ''}`}>
                                                        {pdfFile ? `تم اختيار: ${pdfFile.name}` : 'إسقاط التقرير النهائي هنا'}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">الحد الأقصى للملف 20MB (صيغة PDF فقط)</p>
                                                </div>
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* عرض سجل الردود */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* عرض الغايات التجارية */}
                                            <div className="glass-card p-5 space-y-4 shadow-xl border-sy-green/20 col-span-full">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-[11px] flex items-center gap-2">
                                                        <ListChecks className="w-4 h-4 text-sy-green" />
                                                        الغايات التجارية المختارة
                                                    </h4>
                                                    <span className="text-[9px] bg-sy-green/10 text-sy-green px-2 py-0.5 rounded-full font-bold">
                                                        {activeConsult.selectedPurposes?.length || 0} أنشطة
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => setShowPurposesModal(true)}
                                                    className="w-full py-2 bg-sy-green/10 text-sy-green border border-sy-green/20 rounded-xl text-[10px] font-bold hover:bg-sy-green hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    عرض تفاصيل الغايات
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-sy-green/5 border border-sy-green/10 rounded-2xl space-y-4">
                                            <div className="flex items-center gap-3 text-sy-green">
                                                <CheckCircle2 className="w-6 h-6" />
                                                <h4 className="font-bold text-lg">محصلة الفحص الفني المسجلة</h4>
                                            </div>
                                            <div className="p-4 bg-white rounded-xl border border-sy-green/10 flex items-center justify-between">
                                                <span className="font-bold text-sy-green">{activeConsult.ipExpertFeedback?.split(":")[0] || "لا مانع قانوني"}</span>
                                                <span className="text-[10px] text-muted-foreground">تاريخ المراجعة: {activeConsult.updatedAt ? new Date(activeConsult.updatedAt).toLocaleDateString() : ""}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 text-right">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4 text-muted-foreground/60" />
                                                تفاصيل المبررات والتحليلات
                                            </label>
                                            <div className="p-6 bg-muted/10 rounded-2xl border border-border/40 text-sm leading-relaxed whitespace-pre-wrap font-medium h-48 overflow-y-auto">
                                                {activeConsult.ipExpertFeedback?.split(":").slice(1).join(":") || activeConsult.ipExpertFeedback || "لا توجد تفاصيل إضافية"}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-sm">
                                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                                    <FileCheck className="w-4 h-4 text-sy-green" />
                                                    التقرير الفني المعتمد
                                                </label>
                                                {activeConsult.ipReportPath ? (
                                                    <button
                                                        onClick={() => handlePreviewFile(activeConsult.ipReportPath)}
                                                        className="w-full flex items-center justify-center gap-2 py-3 bg-sy-green text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-md shadow-sy-green/20"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        معاينة التقرير الرسمي
                                                    </button>
                                                ) : (
                                                    <div className="text-[10px] text-muted-foreground italic p-3 text-center border border-dashed rounded-lg">
                                                        لا يوجد ملف تقرير مرفق
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-sm">
                                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                                    <Inbox className="w-4 h-4 text-sy-gold" />
                                                    المستندات الأساسية
                                                </label>
                                                <button
                                                    onClick={() => handlePreviewFile(activeConsult.mainPdfPath)}
                                                    className="w-full flex items-center justify-center gap-2 py-3 bg-sy-gold/10 text-sy-gold border border-sy-gold/20 rounded-xl font-bold hover:bg-sy-gold/20 transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    معاينة ملفات الطلب
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-6 bg-muted/30 border-t border-border mt-auto flex items-center justify-between">
                                <p className="text-[10px] text-muted-foreground italic flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5" /> {viewMode === 'pending' ? 'سيتم إرسال هذا الرد مباشرة للمديرية المركزية لاتخاذ القرار.' : 'هذا التقرير نهائي وتم إرساله للمديرية المركزية.'}
                                </p>
                                {viewMode === 'pending' && activeConsult.ipExpertId && (
                                    <button
                                        onClick={() => setShowConfirmSubmit(true)}
                                        disabled={submitting || !isReportReady}
                                        className="bg-sy-green text-white px-12 py-4 rounded-2xl font-bold shadow-2xl shadow-sy-green/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 border border-sy-green/20 disabled:opacity-50"
                                    >
                                        {submitting ? 'جاري الإرسال...' : 'إرسال الدراسة'}
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card h-full flex flex-col items-center justify-center p-32 text-center gap-8 opacity-60">
                            <div className="relative">
                                <div className="w-32 h-32 bg-muted/20 rounded-full flex items-center justify-center animate-pulse">
                                    <ShieldCheck className="w-16 h-16 text-muted-foreground/30" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-sy-gold/10 rounded-full flex items-center justify-center border-4 border-background">
                                    <Clock className="w-5 h-5 text-sy-gold" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold">صندوق الاستشارات الفنية</h3>
                                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed font-medium">
                                    يرجى تحديد طلب من القائمة الجانبية لإجراء الفحص الفني ومطابقة الاسم مع السجلات المحمية.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* نافذة الغايات التجارية المختارة */}
            {showPurposesModal && activeConsult && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 text-right" dir="rtl">
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
                                        {activeConsult.selectedPurposes?.map((p, index) => (
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
                                        {(!activeConsult.selectedPurposes || activeConsult.selectedPurposes.length === 0) && (
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
                                    <p className="text-[11px] font-bold text-sy-gold">توجيهات الفحص الفني:</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        يجب فحص مدى توافق الاسم التجاري المقترح مع طبيعة الأنشطة الاقتصادية المختارة والمتممات القانونية المسجلة.
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

            {/* نافذة تأكيد استلام المهمة (Modern Alert) */}
            {showConfirmTake && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-md rounded-[2.5rem] border border-border shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-sy-gold/10 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-sy-gold/5">
                                <ShieldCheck className="w-10 h-10 text-sy-gold animate-bounce" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">استلام ملف فحص فني</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed px-4">
                                    أنت على وشك استلام مهمة الفحص الفني لشركة <span className="text-sy-gold font-bold">{showConfirmTake.name}</span>.
                                </p>
                            </div>

                            <div className="bg-sy-gold/5 p-4 rounded-2xl border border-sy-gold/10 text-[10px] text-sy-gold font-bold leading-tight">
                                عند التأكيد، سيتم تعيينك كخبير فني لهذا الطلب وستتمكن من رفع التقرير الرسمي.
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        const id = showConfirmTake.id;
                                        setShowConfirmTake(null);
                                        handleTake(id);
                                    }}
                                    className="w-full bg-sy-gold text-white py-4 rounded-2xl text-xs font-black shadow-xl shadow-sy-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    تأكيد الاستلام والبدء
                                </button>
                                <button
                                    onClick={() => setShowConfirmTake(null)}
                                    className="w-full py-4 rounded-2xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* نافذة تأكيد إرسال التقرير (Modern Alert) */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-md rounded-[2.5rem] border border-border shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-sy-gold/10 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-sy-gold/5">
                                <Send className="w-10 h-10 text-sy-gold animate-pulse" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">اعتماد وإرسال الدراسة الفنية</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed px-4">
                                    هل أنت متأكد من صحة النتائج الفنية المدونة والمرفقات الموقّعة لشركة <span className="text-sy-gold font-bold">{activeConsult?.companyName}</span>؟
                                </p>
                            </div>

                            <div className="bg-sy-gold/5 p-4 rounded-2xl border border-sy-gold/10 text-[10px] text-sy-gold font-bold leading-tight">
                                سيصل التقرير مباشرة إلى المديرية المركزية لاتخاذ القرار النهائي بناءً على نتائجك.
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setShowConfirmSubmit(false);
                                        handleSubmitReport();
                                    }}
                                    disabled={submitting || !isReportReady}
                                    className="w-full bg-sy-gold text-white py-4 rounded-2xl text-xs font-black shadow-xl shadow-sy-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    تأكيد إرسال الدراسة
                                </button>
                                <button
                                    onClick={() => setShowConfirmSubmit(false)}
                                    className="w-full py-4 rounded-2xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                >
                                    مراجعة التقرير
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* نظام الإشعارات الفوري */}
            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            {/* عارض ملفات PDF الاحترافي (Modal) */}
            <PdfViewerModal
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                pdfPath={pdfToView}
                title="معاينة الوثائق الرسمية"
            />
        </div>
    );
}
