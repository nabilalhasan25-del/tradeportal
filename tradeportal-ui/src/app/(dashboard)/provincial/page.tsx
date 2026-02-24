"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    FilePlus,
    Upload,
    CheckSquare,
    AlertCircle,
    Info,
    CheckCircle2,
    Trash2,
    History,
    Search,
    Eye,
    MessageCircle,
    FileText,
    Send,
    ChevronRight,
    ChevronLeft,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    Lock,
    FileCheck,
    Plus,
    X,
    Briefcase,
    GripVertical,
    Building2,
    Banknote,
    DollarSign,
    Sparkles
} from "lucide-react";
import { useLookups } from "@/context/LookupsContext";
import { useLayout } from "@/context/LayoutContext";
import { useAuth } from "@/context/AuthContext";
import api, { RequestDto } from "@/services/api";
import { translateError } from "@/utils/errorTranslator";
import { useSignalR } from "@/context/SignalRContext";
import { NotificationToast } from "@/components/NotificationToast";
import FileViewerModal from "@/components/FileViewerModal";
import { Pagination } from "@/components/Pagination";
import { FilterPopover, FilterItem } from "@/components/FilterPopover";
import GoldenAdviceModal from "@/components/GoldenAdviceModal";

/**
 * صفحة مديرية المحافظة (المديرية الفرعية)
 * مربوطة بالـ API الحقيقي: تدعم تقديم الطلبات ومتابعة السجل
 */
export default function ProvincialDashboard() {
    const { provinces, companyTypes, statuses, lookups, isLoading: lookupsLoading } = useLookups();
    const { user, hasPermission } = useAuth();

    const canCreate = hasPermission("إنشاء طلب جديد");

    // حالات التبويبات والبيانات
    const [activeTab, setActiveTab] = useState<"submit" | "history">(canCreate ? "submit" : "history");
    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // حالة تقديم الطلب
    const [companyName, setCompanyName] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [companyTypeId, setCompanyTypeId] = useState<number>(0);
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [pendingPaymentRequest, setPendingPaymentRequest] = useState<RequestDto | null>(null);
    const [receiptNum, setReceiptNum] = useState("");
    const [confirmingPayment, setConfirmingPayment] = useState(false);
    const [nameCheckResult, setNameCheckResult] = useState<string | null>(null);
    const [nameValidation, setNameValidation] = useState<any>(null); // NameValidationResult
    const [isCheckingName, setIsCheckingName] = useState(false);
    const [showGoldenAdvice, setShowGoldenAdvice] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    // حالة الإشعارات والربط الفوري
    const [notification, setNotification] = useState<{ message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
    const { lastMessage } = useSignalR();

    // Business Purposes Selection
    const [purposeQuery, setPurposeQuery] = useState("");
    const [purposeSearchResults, setPurposeSearchResults] = useState<any[]>([]);
    const [isSearchingPurposes, setIsSearchingPurposes] = useState(false);
    const [selectedPurposes, setSelectedPurposes] = useState<any[]>([]);
    const [suggestedCapital, setSuggestedCapital] = useState<number>(0);
    const [editingPurposeId, setEditingPurposeId] = useState<number | null>(null);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [provincialFee, setProvincialFee] = useState<number>(0);
    const [isFeeLoading, setIsFeeLoading] = useState(false);

    // منطق سحب وإفلات الأنشطة
    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedItemIndex === null) return;
        const items = [...selectedPurposes];
        const draggedItem = items[draggedItemIndex];
        items.splice(draggedItemIndex, 1);
        items.splice(index, 0, draggedItem);
        setSelectedPurposes(items);
        setDraggedItemIndex(null);
    };

    // حالات البحث والفلترة للسجل
    const [searchQuery, setSearchQuery] = useState("");
    const [historyFilter, setHistoryFilter] = useState<"ongoing" | "completed">("ongoing");
    const [companyTypeFilter, setCompanyTypeFilter] = useState<number | "all">("all");
    const [statusFilter, setStatusFilter] = useState<number | "all">("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // دالة تصفير النموذج بالكامل للبدء بطلب جديد
    const resetForm = () => {
        setCompanyName("");
        setNameEn("");
        setCompanyTypeId(0);
        setSelectedPurposes([]);
        const initial: Record<string, boolean> = {};
        lookups.attachmentsList.forEach((item) => {
            initial[item.id] = false;
        });
        setChecklist(initial);
        setFile(null);
        setReceiptNum("");
        setSubmitSuccess(false);
        setPendingPaymentRequest(null);
        setError(null);
        setNameCheckResult(null);
        setNameValidation(null);
        setShowGoldenAdvice(false);
        setSuggestedCapital(0);
        setShowConfirmSubmit(false);
        setPurposeQuery("");
        setPurposeSearchResults([]);
        setShowPaymentPrompt(false);
        setReceiptFile(null);
    };

    // جلب البيانات عند تغيير التبويب أو الفلتر
    useEffect(() => {
        if (user?.provinceId) {
            const fetchFees = async () => {
                try {
                    setIsFeeLoading(true);
                    const fees = await api.getProvinceFees(user.provinceId!);
                    const total = fees.filter(f => f.isActive).reduce((sum, f) => sum + f.amount, 0);
                    setProvincialFee(total);
                } catch (err) {
                    console.error("Failed to fetch provincial fees:", err);
                } finally {
                    setIsFeeLoading(false);
                }
            };
            fetchFees();
        }
    }, [user?.provinceId]);

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

    const filteredHistory = useMemo(() => {
        return requests.filter(r => {
            const matchesSearch = r.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toString().includes(searchQuery);
            if (!matchesSearch) return false;

            const matchesHistoryType = historyFilter === "ongoing"
                ? ![5, 6].includes(r.statusId) // 5: Accepted, 6: Rejected
                : [5, 6].includes(r.statusId);
            if (!matchesHistoryType) return false;

            if (companyTypeFilter !== "all" && r.companyTypeId !== companyTypeFilter) return false;
            if (statusFilter !== "all" && r.statusId !== statusFilter) return false;

            return true;
        });
    }, [requests, searchQuery, historyFilter, companyTypeFilter, statusFilter]);

    const paginatedHistory = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredHistory.slice(start, start + itemsPerPage);
    }, [filteredHistory, currentPage]);

    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    const historyCounts = useMemo(() => {
        return {
            ongoing: requests.filter(r => ![5, 6].includes(r.statusId)).length,
            completed: requests.filter(r => [5, 6].includes(r.statusId)).length
        };
    }, [requests]);

    // SignalR Integration
    useEffect(() => {
        if (!lastMessage || submitting || confirmingPayment) return;

        if (lastMessage.type === 'RequestCreated') {
            const newReq = lastMessage.data as RequestDto;
            // Provincial dashboard might want to see new requests if they are relevant (e.g. same province)
            // But usually they only see what they created. 
            // However, if we want to be safe and real-time:
            setRequests(prev => {
                if (prev.find(r => r.id === newReq.id)) return prev;
                // Add to top if it matches current filter logic (client-side filtering might be needed but simple prepend is okay for now)
                return [newReq, ...prev];
            });
        }

        if (lastMessage.type === 'RequestUpdated') {
            const updatedReq = lastMessage.data as RequestDto;
            setRequests(prev => prev.map(r => r.id === updatedReq.id ? { ...r, ...updatedReq } : r));

            // If the updated request is the one pending payment or currently viewed
            if (pendingPaymentRequest?.id === updatedReq.id) {
                setPendingPaymentRequest(prev => prev ? { ...prev, ...updatedReq } : null);
            }

            setNotification({
                message: `تم تحديث حالة الطلب #${updatedReq.id}: ${updatedReq.statusName}`,
                type: 'info'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    }, [lastMessage, submitting, confirmingPayment]);

    useEffect(() => {
        if (activeTab === "history") {
            fetchRequests();
        }
        // Reset selection and filters when switching tabs
        setSelectedRequest(null);
        setCurrentPage(1);
        setSearchQuery("");
        setCompanyTypeFilter("all");
        setStatusFilter("all");
    }, [activeTab]);

    // منطق التحقق من توفر الاسم وصحته القانونية (Debounced)
    useEffect(() => {
        if (!companyName || companyName.length < 3 || activeTab !== "submit" || companyTypeId === 0) {
            setNameCheckResult(null);
            setNameValidation(null);
            setIsCheckingName(false);
            return;
        }

        setIsCheckingName(true);

        const handler = setTimeout(async () => {
            if (activeTab !== "submit") return;
            try {
                const result = await api.validateName({
                    nameAr: companyName,
                    nameEn: nameEn,
                    companyTypeId: companyTypeId
                });

                setNameValidation(result);

                if (!result.isValid && result.errors.length > 0) {
                    setNameCheckResult(result.errors[0]);
                } else {
                    setNameCheckResult(null);
                }
            } catch (err) {
                console.error("Name validation error:", err);
            } finally {
                setIsCheckingName(false);
            }
        }, 1000);

        return () => clearTimeout(handler);
    }, [companyName, nameEn, companyTypeId]);

    // البحث عن الغايات التجارية
    useEffect(() => {
        if (!purposeQuery || purposeQuery.length < 2) {
            setPurposeSearchResults([]);
            return;
        }

        setIsSearchingPurposes(true);
        const handler = setTimeout(async () => {
            try {
                const response = await api.searchBusinessPurposes(purposeQuery);
                setPurposeSearchResults(response.items);
            } catch (err) {
                console.error("Search purposes error:", err);
            } finally {
                setIsSearchingPurposes(false);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [purposeQuery]);

    // حساب رأس المال المقترح تلقائياً
    useEffect(() => {
        if (selectedPurposes.length === 0) {
            setSuggestedCapital(0);
            return;
        }

        const maxMinCapital = Math.max(...selectedPurposes.map(p => p.minimumCapital || 0));
        setSuggestedCapital(maxMinCapital);
    }, [selectedPurposes]);

    // تهيئة حالة قائمة التحقق عند تغير الـ lookups
    useEffect(() => {
        const initial: Record<number, boolean> = {};
        lookups.attachmentsList.forEach((item) => {
            initial[item.id] = false;
        });
        setChecklist(initial);
    }, [lookups.attachmentsList]);

    // تحديث حالة القائمة
    const toggleItem = (id: number) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isReady = companyName.trim() !== "" && companyTypeId !== 0 &&
        lookups.attachmentsList.filter(a => a.isActive).some((item) => checklist[item.id]) &&
        file && !nameCheckResult && selectedPurposes.length > 0 && !submitSuccess && provincialFee > 0;

    // إرسال الطلب
    const handleSubmit = async (isPaid: boolean = true) => {
        if (!isReady) return;
        try {
            setSubmitting(true);
            setError(null);
            setShowPaymentPrompt(false);

            // 1. رفع الملف الأساسي أولاً
            let uploadedPath: string | undefined;
            if (file) {
                const uploadResponse = await api.uploadFile(file);
                uploadedPath = uploadResponse.path;
            }

            // 2. إنشاء الطلب بالمسار الحقيقي مع علم الدفع
            const newRequest = await api.createRequest({
                companyName,
                nameEn,
                companyTypeId,
                provinceId: user?.provinceId || 1,
                mainPdfPath: uploadedPath,
                isPaid: isPaid,
                selectedPurposes: selectedPurposes.map(p => ({
                    purposeId: p.id,
                    complement: p.complement
                })),
                checklistItems: lookups.attachmentsList.map(a => ({
                    templateId: a.id,
                    isProvided: !!checklist[a.id]
                }))
            });

            if (isPaid) {
                setPendingPaymentRequest(newRequest);
                setSubmitSuccess(true);
            } else {
                setNotification({ message: "تم إرسال الطلب للتدقيق مباشرة (بدون رسوم)", type: "success" });
                resetForm();
                setActiveTab("history");
                fetchRequests();
            }
        } catch (err: any) {
            setError(translateError(err));
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!pendingPaymentRequest || !receiptNum.trim()) return;
        try {
            setConfirmingPayment(true);

            let receiptPath: string | undefined;
            if (receiptFile) {
                const uploadRes = await api.uploadReceipt(receiptFile);
                receiptPath = uploadRes.path;
            }

            await api.confirmPayment(pendingPaymentRequest.id, receiptNum, receiptPath);

            setNotification({ message: "تم تأكيد الدفع وإرسال الطلب للتدقيق", type: "success" });

            // Reset everything
            resetForm();
            setActiveTab("history");
            fetchRequests();
        } catch (err) {
            setError(translateError(err));
        } finally {
            setConfirmingPayment(false);
        }
    };

    // لون الحالة
    const getStatusClasses = (statusId: number) => {
        switch (statusId) {
            case 5: case 12: return "bg-sy-green/10 text-sy-green border-sy-green/20"; // مقبول أو حجز قطعي
            case 6: case 11: case 13: return "bg-sy-red/10 text-sy-red border-sy-red/20"; // مرفوض أو ملغى
            case 7: return "bg-sy-gold/10 text-sy-gold border-sy-gold/20 animate-pulse"; // بانتظار الدفع
            case 1: return "bg-blue-500/10 text-blue-500 border-blue-500/20"; // جديد
            case 8: case 9: return "bg-purple-500/10 text-purple-500 border-purple-500/20"; // مراجعة قيادية
            default: return "bg-sy-gold/10 text-sy-gold border-sy-gold/20";
        }
    };

    // حالة المودال
    const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfToView, setPdfToView] = useState<string | null>(null);

    // تحميل الشهادة (وهمي حالياً)
    const handleDownloadCertificate = (req: RequestDto) => {
        setNotification({ message: `جاري تحميل كتاب القبول للشركة: ${req.companyName}\n(هذه الميزة ستم تفعيلها قريباً مع نظام التقارير)`, type: "info" });
    };

    // معاينة الملف باستخدام العارض الاحترافي الجديد
    const handlePreviewFile = (path: string | null | undefined) => {
        if (!path) return;
        setPdfToView(path);
        setIsPdfModalOpen(true);
    };

    return (
        <div className="space-y-5 pb-6 animate-in fade-in duration-500">
            {/* نظام التبويبات العلوي */}
            <div className="flex items-center gap-1.5 bg-card border border-border p-1 rounded-xl w-fit shadow-sm">
                {canCreate && (
                    <button
                        onClick={() => { if (!submitting && !confirmingPayment) setActiveTab("submit"); }}
                        disabled={submitting || confirmingPayment}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${submitting || confirmingPayment ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === "submit"
                            ? "bg-sy-green text-white shadow-md shadow-sy-green/10"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <FilePlus className="w-3.5 h-3.5" />
                        تقديم طلب جديد
                    </button>
                )}
                <button
                    onClick={() => { if (!submitting && !confirmingPayment) setActiveTab("history"); }}
                    disabled={submitting || confirmingPayment}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${submitting || confirmingPayment ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === "history"
                        ? "bg-sy-gold text-white shadow-md shadow-sy-gold/10"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                >
                    <History className="w-3.5 h-3.5" />
                    سجل المتابعة
                    {activeTab !== "history" && requests.some(r => r.statusId === 4) && (
                        <span className="w-1.5 h-1.5 bg-sy-red rounded-full animate-pulse" />
                    )}
                </button>
            </div>

            {activeTab === "submit" ? (
                /* القسم الأول: تقديم طلب جديد */
                <section className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-sy-green/10 rounded-lg">
                            <FilePlus className="w-5 h-5 text-sy-green" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight">إصدار إضبارة شركة</h2>
                            <p className="text-[10px] text-muted-foreground font-medium">قم بتعبئة البيانات واستكمال المرفقات القانونية</p>
                        </div>
                    </div>

                    {submitSuccess && pendingPaymentRequest && (
                        <div className="p-6 bg-sy-gold/10 border-2 border-sy-gold/30 rounded-3xl space-y-4 animate-in zoom-in-95 duration-500 shadow-2xl shadow-sy-gold/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <FileText className="w-32 h-32" />
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-sy-gold/20 rounded-2xl">
                                    <Loader2 className="w-8 h-8 text-sy-gold animate-spin" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-extrabold text-sy-gold">بانتظار تأكيد الدفع</h3>
                                    <p className="text-xs font-bold text-muted-foreground">
                                        تم إصدار الفاتورة رقم <span className="text-foreground font-mono bg-sy-gold/10 px-2 py-0.5 rounded">{pendingPaymentRequest.invoiceNum}</span> للطلب رقم <span className="font-mono">#{pendingPaymentRequest.id}</span>.
                                        يرجى تحصيل الرسوم وإدخال رقم الإيصال.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background/50 p-6 rounded-2xl border border-sy-gold/30 shadow-inner relative">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">رقم الفاتورة (Invoice No)</p>
                                    <p className="text-base font-black font-mono tracking-wider text-foreground">{pendingPaymentRequest.invoiceNum || "---"}</p>
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">المبلغ المستحق (Due Amount)</p>
                                    <div className="flex flex-col">
                                        <p className="text-xl font-black text-sy-green">{provincialFee.toLocaleString()} ل.س</p>
                                        <span className="text-[8px] text-muted-foreground font-bold">دفع نقدي أو تحويل مالي</span>
                                    </div>
                                </div>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sy-gold text-[8px] font-black text-white px-3 py-1 rounded-full shadow-sm">
                                    فاتورة رسمية صادرة آلياً
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="text-sm font-extrabold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-sy-gold" />
                                    رقم إيصال الدفع البنكي / المالي
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={receiptNum}
                                        onChange={(e) => setReceiptNum(e.target.value)}
                                        placeholder="أدخل رقم الإيصال هنا..."
                                        className="flex-1 bg-background border-2 border-sy-gold/40 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-sy-gold/20 outline-none transition-all shadow-sm"
                                    />
                                    <div className="flex-1">
                                        {!receiptFile ? (
                                            <label className="border-2 border-dashed border-sy-gold/40 rounded-xl p-2.5 flex items-center justify-between hover:bg-sy-gold/5 transition-colors cursor-pointer group h-full">
                                                <div className="flex items-center gap-2">
                                                    <Upload className="w-4 h-4 text-sy-gold" />
                                                    <span className="text-[10px] font-bold">ارفاق صورة الإيصال</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const selected = e.target.files?.[0] || null;
                                                        if (selected) {
                                                            // حماية: التحقق من الحجم (مثلاً 10 ميغابايت)
                                                            if (selected.size > 10 * 1024 * 1024) {
                                                                setNotification({ message: "حجم ملف الإيصال كبير جداً (الأقصى 10MB)", type: 'error' });
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            // حماية: التحقق من النوع
                                                            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
                                                            if (!allowedTypes.includes(selected.type)) {
                                                                setNotification({ message: "نوع الملف غير مدعوم. يرجى اختيار صورة أو ملف PDF", type: 'error' });
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                        }
                                                        setReceiptFile(selected);
                                                    }}
                                                />
                                            </label>
                                        ) : (
                                            <div className="bg-sy-green/5 border border-sy-green/20 rounded-xl p-2.5 flex items-center justify-between h-full">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <FileText className="w-4 h-4 text-sy-green" />
                                                    <p className="text-[10px] font-bold truncate max-w-[100px]">{receiptFile.name}</p>
                                                </div>
                                                <button onClick={() => setReceiptFile(null)} className="p-1 hover:bg-sy-red/10 rounded text-sy-red transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={handleConfirmPayment}
                                            disabled={!receiptNum.trim() || !receiptFile || confirmingPayment}
                                            className="bg-sy-gold text-white px-8 py-3 rounded-xl font-black text-sm hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-sy-gold/20 flex items-center justify-center gap-2"
                                        >
                                            {confirmingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            تأكيد وإرسال
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (receiptNum.trim() && !confirm("لديك بيانات مدخلة في الحقل، هل أنت متأكد من البدء بطلبات جديدة؟")) return;
                                                resetForm();
                                            }}
                                            className="group relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-sy-green/30 text-sy-green px-6 py-3 rounded-2xl font-black text-xs hover:bg-sy-green hover:text-white hover:border-sy-green transition-all duration-500 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 shadow-lg shadow-sy-green/5"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-sy-green/0 via-white/20 to-sy-green/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            <FilePlus className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform" />
                                            <span className="relative z-10">طلب جديد</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 py-2 px-3 bg-muted/50 rounded-xl border border-border/50">
                                    <div className="w-2 h-2 rounded-full bg-sy-green animate-pulse" />
                                    <p className="text-[10px] text-muted-foreground font-bold">
                                        ملاحظة: يمكنك العودة لهذا الطلب لاحقاً من سجل المتابعة بمجرد توفر الإيصال.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!submitSuccess && (
                        <>
                            {error && (
                                <div className="p-4 bg-sy-red/10 border border-sy-red/20 rounded-2xl flex items-center gap-3 text-sy-red font-bold">
                                    <AlertCircle className="w-6 h-6" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* بيانات الشركة وقائمة التحقق */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="glass-card p-6 space-y-4 shadow-xl border-border">
                                        <h3 className="text-sm font-bold border-b border-border pb-1.5 flex items-center gap-2">
                                            <Info className="w-3.5 h-3.5 text-sy-gold" />
                                            المعلومات الأساسية
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">الاسم التجاري المقترح</label>
                                                <input
                                                    type="text"
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    placeholder="مثال: شركة النماء للاستثمارات"
                                                    className={`w-full bg-background border-2 rounded-xl px-4 py-3 focus:ring-4 outline-none transition-all shadow-sm ${nameCheckResult
                                                        ? "border-sy-red focus:ring-sy-red/20"
                                                        : "border-border focus:ring-sy-green/20"
                                                        }`}
                                                />
                                                <div className="space-y-1 mt-3">
                                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">الاسم بالإنكليزي (اختياري)</label>
                                                    <input
                                                        type="text"
                                                        value={nameEn}
                                                        onChange={(e) => setNameEn(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
                                                        placeholder="Example: Al Namaa Investment"
                                                        dir="ltr"
                                                        className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-sy-gold/20 outline-none transition-all shadow-sm placeholder:text-muted-foreground/50"
                                                    />
                                                </div>
                                                {isCheckingName && (
                                                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground animate-pulse">
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        جاري التحقق من توفر الاسم...
                                                    </div>
                                                )}
                                                {nameCheckResult && (
                                                    <div className="flex items-start gap-2 mt-2 p-2.5 bg-sy-red/5 border border-sy-red/10 rounded-lg text-sy-red text-[10px] font-bold animate-in slide-in-from-top-1">
                                                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                                        <span>{nameCheckResult}</span>
                                                    </div>
                                                )}
                                                {!isCheckingName && !nameCheckResult && companyName.length >= 3 && nameValidation?.isValid && (
                                                    <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-sy-green animate-in slide-in-from-top-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        الاسم مستوفٍ للشروط القانونية ومتاح
                                                    </div>
                                                )}

                                                {/* عرض التحذيرات غير المانعة */}
                                                {nameValidation?.warnings.length > 0 && (
                                                    <div className="space-y-1 mt-2">
                                                        {nameValidation.warnings.map((w: string, i: number) => (
                                                            <div key={i} className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-[9px] font-bold">
                                                                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                                                <span>{w}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* قسم النصيحة الذهبية (الذكاء الاصطناعي) */}
                                                {(companyName.length >= 3 && !isCheckingName) && (
                                                    <div className="mt-4 pt-4 border-t border-border/50">
                                                        <button
                                                            onClick={() => setShowGoldenAdvice(true)}
                                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-sy-gold/30 text-sy-gold hover:bg-sy-gold/5 transition-all text-[10px] font-black group shadow-sm hover:shadow-sy-gold/10"
                                                        >
                                                            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                                                            عرض "التقرير الذهبي الاستشاري" (AI)
                                                        </button>

                                                        <GoldenAdviceModal
                                                            isOpen={showGoldenAdvice}
                                                            onClose={() => setShowGoldenAdvice(false)}
                                                            advice={nameValidation?.goldenAdvice || "جاري توليد التقرير الذهبي..."}
                                                            companyName={companyName}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">نوع الكيان</label>
                                                <select
                                                    value={companyTypeId}
                                                    onChange={(e) => setCompanyTypeId(parseInt(e.target.value))}
                                                    className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-sy-green/20 outline-none transition-all shadow-sm"
                                                >
                                                    <option value={0}>اختر نوع الشركة...</option>
                                                    {/* هنا سنفترض مؤقتاً ID يبدأ من 1 حسب الـ Seed */}
                                                    {lookups.companyTypes.map((type: string, idx: number) => (
                                                        <option key={idx} value={idx + 1}>{type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* اختيار الغايات التجارية (الأنشطة) */}
                                    <div className="glass-card p-4 space-y-4">
                                        <div className="flex items-center justify-between border-b border-border pb-2">
                                            <h3 className="font-bold flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-sy-gold" />
                                                تحديد الغايات التجارية (الأنشطة)
                                            </h3>
                                            <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">لا يقل عن نشاط واحد</span>
                                        </div>

                                        <div className="space-y-4">
                                            {/* محرك البحث عن الأنشطة */}
                                            <div className="relative">
                                                <label className="text-sm font-medium block mb-2">البحث عن نشاط (بالاسم أو كود ISIC)</label>
                                                <div className="relative">
                                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        value={purposeQuery}
                                                        onChange={(e) => setPurposeQuery(e.target.value)}
                                                        placeholder="ابحث عن: تجارة، مقاولات، تصدير..."
                                                        className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-3 focus:ring-2 focus:ring-sy-gold outline-none transition-all"
                                                    />
                                                    {isSearchingPurposes && (
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-background/80 px-2 py-1 rounded-lg backdrop-blur-sm border border-border/50">
                                                            <span className="text-[10px] text-muted-foreground animate-pulse">جاري البحث...</span>
                                                            <Loader2 className="w-3 h-3 animate-spin text-sy-gold" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* نتائج البحث */}
                                                {purposeSearchResults.length > 0 && (
                                                    <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                                        {purposeSearchResults.map((p) => (
                                                            <button
                                                                key={p.id}
                                                                onClick={() => {
                                                                    if (!selectedPurposes.find(sp => sp.id === p.id)) {
                                                                        setSelectedPurposes([...selectedPurposes, { ...p, complement: "" }]);
                                                                    }
                                                                    setPurposeQuery("");
                                                                    setPurposeSearchResults([]);
                                                                }}
                                                                className="w-full text-right px-4 py-3 border-b border-border last:border-0 hover:bg-muted transition-colors flex flex-col gap-1"
                                                            >
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="font-bold text-sm">{p.activityName}</span>
                                                                    <span className="text-[11px] text-muted-foreground font-mono">(#{p.activityCode})</span>
                                                                </div>
                                                                {p.authorityName && (
                                                                    <span className="text-[10px] text-sy-gold flex items-center gap-1">
                                                                        <AlertCircle className="w-3 h-3" />
                                                                        يتطلب موافقة: {p.authorityName}
                                                                    </span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* الأنشطة المختارة */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-medium block">الأنشطة المختارة ({selectedPurposes.length})</label>
                                                {selectedPurposes.length === 0 ? (
                                                    <div className="text-center py-6 bg-muted/30 rounded-xl border-2 border-dashed border-border text-muted-foreground">
                                                        <p className="text-[10px]">لم يتم اختيار أي نشاط بعد</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2 max-h-[350px] overflow-y-auto px-1 custom-scrollbar">
                                                        {selectedPurposes.map((p, idx) => (
                                                            <div
                                                                key={p.id}
                                                                draggable
                                                                onDragStart={() => handleDragStart(idx)}
                                                                onDragOver={handleDragOver}
                                                                onDrop={() => handleDrop(idx)}
                                                                className={`flex flex-col border transition-all duration-300 animate-in fade-in slide-in-from-right-2 overflow-hidden rounded-xl shadow-sm cursor-move
                                                            ${draggedItemIndex === idx ? "opacity-40 scale-95" : ""}
                                                             ${p.complement
                                                                        ? "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30"
                                                                        : "bg-white dark:bg-zinc-800 border-border dark:border-zinc-700 hover:border-sy-gold/30"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between p-2.5">
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <div className="p-1 text-muted-foreground/40 hover:text-primary transition-colors">
                                                                            <GripVertical className="w-3.5 h-3.5" />
                                                                        </div>
                                                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                            <span className="text-[9px] font-bold text-primary">{idx + 1}</span>
                                                                        </div>
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className="font-bold text-[11px] text-foreground truncate">{p.activityName}</span>
                                                                            <span className="text-[8px] text-muted-foreground font-mono">#{p.activityCode}</span>
                                                                        </div>
                                                                        {p.authorityName && (
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-sy-red shrink-0" title={`يتطلب موافقة: ${p.authorityName}`} />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 shrink-0">
                                                                        <button
                                                                            onClick={() => setEditingPurposeId(editingPurposeId === p.id ? null : p.id)}
                                                                            className={`p-1.5 rounded-lg transition-all ${editingPurposeId === p.id || p.complement
                                                                                ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400"
                                                                                : "hover:bg-muted text-muted-foreground/60"
                                                                                }`}
                                                                            title="إضافة/تعديل التفاصيل"
                                                                        >
                                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setSelectedPurposes(selectedPurposes.filter(sp => sp.id !== p.id))}
                                                                            className="p-1.5 hover:bg-sy-red/10 hover:text-sy-red rounded-lg transition-colors text-muted-foreground/40"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* حقل إدخال المتمم (يظهر عند النقر أو إذا كان هناك نص موجود) */}
                                                                {editingPurposeId === p.id && (
                                                                    <div className="px-3 pb-3 pt-1 border-t border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/20 animate-in slide-in-from-top-1 duration-200">
                                                                        <div className="space-y-1.5">
                                                                            <div className="flex items-center justify-between">
                                                                                <label className="text-[9px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">تفاصيل إضافية للنشاط</label>
                                                                                <button onClick={() => setEditingPurposeId(null)} className="text-[9px] text-indigo-500 dark:text-indigo-400 hover:underline">إغلاق</button>
                                                                            </div>
                                                                            <textarea
                                                                                autoFocus
                                                                                value={p.complement || ""}
                                                                                onChange={(e) => {
                                                                                    const newValue = e.target.value;
                                                                                    setSelectedPurposes(selectedPurposes.map(sp =>
                                                                                        sp.id === p.id ? { ...sp, complement: newValue } : sp
                                                                                    ));
                                                                                }}
                                                                                placeholder="مثال: تجارة الأجهزة الكهربائية المنزلية، استيراد قطع التبديل..."
                                                                                className="w-full bg-background dark:bg-zinc-900/60 border border-indigo-500/30 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all resize-none h-20 shadow-sm"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {p.complement && editingPurposeId !== p.id && (
                                                                    <div className="px-3 py-2.5 bg-indigo-50/60 dark:bg-indigo-900/30 border-t border-indigo-500/20 flex items-start gap-2">
                                                                        <MessageCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                                                                        <p className="text-[10px] text-foreground font-semibold dark:text-indigo-50/90 line-clamp-2 leading-relaxed italic">{p.complement}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* متطلبات الموافقات الخاصة */}
                                            {selectedPurposes.some(p => p.approvalRequirement) && (
                                                <div className="p-4 bg-sy-red/5 border border-sy-red/20 rounded-xl space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="w-4 h-4 text-sy-red shrink-0 mt-0.5" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-sy-red uppercase tracking-wider">متطلبات قانونية خاصة:</p>
                                                            <ul className="space-y-1 text-[10px] text-muted-foreground leading-relaxed">
                                                                {selectedPurposes
                                                                    .filter(p => p.approvalRequirement)
                                                                    .map((p, i) => (
                                                                        <li key={i} className="flex gap-2">
                                                                            <span className="text-sy-red font-bold">•</span>
                                                                            <span><strong>{p.activityName}:</strong> {p.approvalRequirement}</span>
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* رفع الملف والإرسال */}
                                <div className="space-y-4">
                                    <div className="glass-card p-4 space-y-3">
                                        <h3 className="font-bold flex items-center gap-2 text-primary">
                                            <Upload className="w-4 h-4" />
                                            <span className="text-sm">تحميل الإضبارة الورقية (PDF)</span>
                                        </h3>

                                        {hasPermission("رفع الملفات (PDF)") ? (
                                            !file ? (
                                                <label className="border-2 border-dashed border-border rounded-xl p-3 flex items-center justify-between hover:bg-background/50 transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-muted/20 rounded-lg group-hover:scale-110 transition-transform">
                                                            <Upload className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[11px] font-bold">ارفاق الإضبارة الورقية (PDF)</p>
                                                            <p className="text-[9px] text-muted-foreground">صيغة PDF فقط (حد أقصى 20MB)</p>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-1 bg-muted/30 rounded-lg text-[9px] font-bold text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                                        اختيار الملف
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept=".pdf"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const selected = e.target.files?.[0] || null;
                                                            if (selected && selected.size > 20 * 1024 * 1024) {
                                                                setNotification({ message: "حجم الملف كبير جداً (الأقصى 20MB)", type: 'error' });
                                                                return;
                                                            }
                                                            setFile(selected);
                                                        }}
                                                    />
                                                </label>
                                            ) : (
                                                <div className="bg-sy-green/5 border border-sy-green/20 rounded-xl p-2.5 flex items-center justify-between shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-sy-green/10 rounded-lg">
                                                            <FileText className="w-5 h-5 text-sy-green" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-xs font-bold truncate max-w-[140px]">{file.name}</p>
                                                            <p className="text-[9px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setFile(null)} className="p-1.5 hover:bg-sy-red/10 rounded-lg text-sy-red transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            <div className="p-6 border-2 border-dashed border-sy-red/20 rounded-xl flex items-center gap-3 bg-sy-red/5">
                                                <Lock className="w-5 h-5 text-sy-red/40" />
                                                <div className="space-y-0.5">
                                                    <p className="text-[11px] font-bold text-sy-red">لا تملك صلاحية رفع الملفات</p>
                                                    <p className="text-[9px] text-muted-foreground">يرجى مراجعة مدير النظام.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="glass-card p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold flex items-center gap-2">
                                                <CheckSquare className="w-4 h-4 text-sy-green" />
                                                <span className="text-sm">المرفقات المطلوبة (Checklist)</span>
                                            </h3>
                                            <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">واحد على الأقل</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {lookups.attachmentsList.filter(a => a.isActive).map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => toggleItem(item.id)}
                                                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${checklist[item.id]
                                                        ? "bg-sy-green/5 border-sy-green/30 shadow-inner"
                                                        : "bg-background border-border hover:border-sy-green/20"
                                                        }`}
                                                >
                                                    <span className="text-[11px] font-medium leading-tight">{item.nameAr}</span>
                                                    {checklist[item.id] ? (
                                                        <CheckCircle2 className="w-4 h-4 text-sy-green" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded border border-border" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {!isFeeLoading && provincialFee === 0 && (
                                        <div className="p-4 bg-sy-red/10 border border-sy-red/20 rounded-2xl flex items-start gap-3 animate-pulse">
                                            <AlertCircle className="w-6 h-6 text-sy-red shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-sy-red">خطأ: لا توجد رسوم معرفة للمحافظة</p>
                                                <p className="text-[10px] text-sy-red/80 font-bold leading-relaxed">
                                                    لا يمكن إرسال الطلب لأن الأدمن لم يقم بإضافة رسوم لهذه المحافظة بعد. يرجى التواصل مع إدارة النظام لإضافة الرسوم أولاً.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setShowPaymentPrompt(true)}
                                        disabled={!isReady || submitting || submitSuccess}
                                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isReady && !submitting && !submitSuccess
                                            ? "bg-sy-green text-white hover:brightness-110 shadow-sy-green/20 scale-100 active:scale-95"
                                            : submitSuccess
                                                ? "bg-sy-green text-white opacity-90 cursor-default"
                                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50 grayscale"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm">
                                                {submitting ? "جاري الإرسال..." : submitSuccess ? "تم الإرسال بنجاح!" : "إرسال الطلب للاعتماد"}
                                            </span>
                                        </div>
                                        {!submitting && !submitSuccess && <Send className="w-3.5 h-3.5" />}
                                        {submitSuccess && <CheckCircle className="w-3.5 h-3.5 animate-in zoom-in" />}
                                    </button>

                                    <div className="p-3 bg-sy-gold/10 border border-sy-gold/20 rounded-xl flex gap-2.5 items-start">
                                        <Info className="w-4 h-4 text-sy-gold shrink-0 mt-0.5" />
                                        <p className="text-[9px] text-sy-gold leading-relaxed font-medium">
                                            سيتم إرسال الطلب للمركز الرئيسي للتدقيق، لا يمكن التراجع أو التعديل بعد هذه الخطوة.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            ) : (
                /* القسم الثاني: سجل المتابعة المربوط بالـ API */
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-sy-gold/10 rounded-2xl">
                                <History className="w-8 h-8 text-sy-gold" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">متابعة حالة الطلبات</h2>
                                <p className="text-muted-foreground text-sm font-medium">استعراض الردود الرسمية والقرارات النهائية للطلبات المرسلة</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="رقم الطلب، اسم الشركة..."
                                    className="w-full bg-card border border-border rounded-xl pr-12 pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sy-gold/50 shadow-sm transition-all"
                                />
                            </div>

                            <FilterPopover
                                isOpen={isFilterOpen}
                                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                                onReset={() => {
                                    setCompanyTypeFilter("all");
                                    setStatusFilter("all");
                                    setCurrentPage(1);
                                }}
                                activeFiltersCount={[companyTypeFilter, statusFilter].filter(f => f !== "all").length}
                            >
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

                                <FilterItem label="حالة الطلب">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => { setStatusFilter(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}
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
                            </FilterPopover>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 border-b border-border pb-px">
                        <button
                            onClick={() => { if (!submitting && !confirmingPayment) { setHistoryFilter("ongoing"); setCurrentPage(1); } }}
                            disabled={submitting || confirmingPayment}
                            className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all relative ${submitting || confirmingPayment ? 'opacity-50 cursor-not-allowed' : ''} ${historyFilter === "ongoing" ? "text-sy-gold" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Clock className="w-3.5 h-3.5" />
                            طلبات قيد المعالجة
                            <span className={`mr-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${historyFilter === "ongoing" ? "bg-sy-gold text-white shadow-sm" : "bg-muted text-muted-foreground"}`}>
                                {historyCounts.ongoing}
                            </span>
                            {historyFilter === "ongoing" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sy-gold rounded-full" />}
                        </button>
                        <button
                            onClick={() => { if (!submitting && !confirmingPayment) { setHistoryFilter("completed"); setCurrentPage(1); } }}
                            disabled={submitting || confirmingPayment}
                            className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all relative ${submitting || confirmingPayment ? 'opacity-50 cursor-not-allowed' : ''} ${historyFilter === "completed" ? "text-sy-green" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            الطلبات المنتهية
                            <span className={`mr-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${historyFilter === "completed" ? "bg-sy-green text-white shadow-sm" : "bg-muted text-muted-foreground"}`}>
                                {historyCounts.completed}
                            </span>
                            {historyFilter === "completed" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sy-green rounded-full" />}
                        </button>
                    </div>

                    <div className="glass-card shadow-2xl border-border/50 overflow-hidden">
                        {loading ? (
                            <div className="p-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                <Loader2 className="w-8 h-8 animate-spin text-sy-gold" />
                                <p className="text-sm">جاري جلب البيانات من الخادم...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right min-w-[900px]">
                                    <thead className="bg-muted/30 text-[10px] text-muted-foreground font-bold uppercase tracking-wider border-b border-border">
                                        <tr>
                                            <th className="px-6 py-5">المعرف المرجعي</th>
                                            <th className="px-6 py-5">اسم المشروع التجاري</th>
                                            <th className="px-6 py-5">المحافظة</th>
                                            <th className="px-6 py-5">نوع الكيان</th>
                                            <th className="px-6 py-5">تاريخ الإرسال</th>
                                            <th className="px-6 py-5">حالة الطلب</th>
                                            <th className="px-6 py-5">ملاحظات المدقق</th>
                                            <th className="px-6 py-5 text-center">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {paginatedHistory.map((req) => (
                                            <tr key={req.id} className="hover:bg-muted/20 transition-colors group">
                                                <td className="px-6 py-5 font-mono text-sy-gold font-bold text-xs">#{req.id}</td>
                                                <td className="px-6 py-5 font-bold text-sm group-hover:text-sy-gold transition-colors">{req.companyName}</td>
                                                <td className="px-6 py-5 text-xs text-muted-foreground">{req.provinceName}</td>
                                                <td className="px-6 py-5 text-[10px] font-bold text-primary">{req.companyTypeName}</td>
                                                <td className="px-6 py-5 text-[11px] text-muted-foreground">
                                                    {new Date(req.createdAt).toLocaleDateString("ar-SY")}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border-2 ${getStatusClasses(req.statusId)}`}>
                                                        {req.statusName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 max-w-sm">
                                                    <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-2xl border border-border/10">
                                                        <MessageCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-1">
                                                            {req.auditorFeedback || "طلبك قيد المراجعة الفنية من قبل المركز الرئيسي..."}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => !submitting && !confirmingPayment && setSelectedRequest(req)}
                                                            disabled={submitting || confirmingPayment}
                                                            className={`p-3 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded-2xl text-blue-600 transition-all hover:scale-105 shadow-sm ${submitting || confirmingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            title="عرض التفاصيل"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>

                                                        {req.statusId === 7 && (
                                                            <button
                                                                onClick={() => {
                                                                    setPendingPaymentRequest(req);
                                                                    setReceiptNum(""); // Clear previous input
                                                                    setReceiptFile(null); // Clear previous file
                                                                    setSubmitSuccess(true); // Re-set to true to show the result/payment screen
                                                                    setActiveTab("submit");
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                className="p-3 bg-sy-green text-white hover:brightness-110 rounded-2xl transition-all hover:scale-105 shadow-md flex items-center gap-2"
                                                                title="إكمال عملية الدفع"
                                                            >
                                                                <Banknote className="w-5 h-5" />
                                                                <span className="text-xs font-bold px-1 text-white">إكمال الدفع</span>
                                                            </button>
                                                        )}
                                                        {req.statusId === 5 && (
                                                            <button
                                                                onClick={() => handleDownloadCertificate(req)}
                                                                className="p-3 bg-sy-green/10 border border-sy-green/20 text-sy-green hover:bg-sy-green hover:text-white rounded-2xl transition-all hover:scale-105 shadow-sm"
                                                                title="تحميل كتاب القبول"
                                                            >
                                                                <FileCheck className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedHistory.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground italic">
                                                    لا توجد طلبات تطابق معايير البحث الحالية
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                // Optional: scroll to top of table
                            }}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredHistory.length}
                            className="!mt-0 !bg-transparent !border-t border-b-0 border-x-0 !rounded-none p-6"
                        />
                    </div>
                </section >
            )
            }

            {/* نافذة تفاصيل الطلب */}
            {
                selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-card w-full max-w-lg max-h-[90vh] rounded-3xl border border-border shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 flex flex-col">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="absolute top-4 left-4 p-2 bg-muted/50 hover:bg-muted text-foreground rounded-full transition-all border border-border shadow-sm active:scale-95 z-10"
                                title="الرجوع للقائمة"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 border-b border-border pb-4 mb-4">
                                <div className="p-3 bg-sy-gold/10 rounded-2xl">
                                    <FileText className="w-8 h-8 text-sy-gold" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">تفاصيل الطلب #{selectedRequest.id}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-muted-foreground">{selectedRequest.companyName}</p>
                                        <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">{selectedRequest.companyTypeName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 text-right overflow-y-auto pr-1 custom-scrollbar scroll-smooth flex-1">

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted/30 rounded-2xl space-y-1">
                                        <p className="text-[10px] text-muted-foreground">نوع الشركة</p>
                                        <p className="font-bold text-sm">{selectedRequest.companyTypeName}</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-2xl space-y-1">
                                        <p className="text-[10px] text-muted-foreground">تاريخ التقديم</p>
                                        <p className="font-bold text-sm font-mono">{new Date(selectedRequest.createdAt).toLocaleDateString("ar-SY")}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">حالة الطلب الحالية</label>
                                    <div className={`p-3 rounded-xl border flex items-center gap-3 ${getStatusClasses(selectedRequest.statusId)}`}>
                                        <Info className="w-5 h-5" />
                                        <span className="font-bold text-sm">{selectedRequest.statusName}</span>
                                    </div>
                                </div>

                                {selectedRequest.auditorFeedback && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground">ملاحظات المدقق (المركزي)</label>
                                        <div className="p-4 bg-sy-gold/5 border border-sy-gold/20 rounded-2xl text-sm leading-relaxed">
                                            {selectedRequest.auditorFeedback}
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.ipVerdict && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground">رأي خبير الملكية</label>
                                        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-sm leading-relaxed">
                                            {selectedRequest.ipVerdict}
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.selectedPurposes && selectedRequest.selectedPurposes.length > 0 && (
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-sy-gold" />
                                            الأنشطة والغايات التجارية
                                        </label>
                                        <div className="space-y-3">
                                            {selectedRequest.selectedPurposes.map((p, idx) => (
                                                <div key={idx} className="p-4 bg-muted/30 rounded-2xl border border-border/50 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-foreground">{p.activityName}</span>
                                                            <span className="text-[10px] text-muted-foreground font-mono">#{p.activityCode}</span>
                                                        </div>
                                                    </div>
                                                    {p.complement && (
                                                        <div className="p-3 bg-background/50 rounded-xl border border-border/30 text-xs text-muted-foreground leading-relaxed italic">
                                                            {p.complement}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.mainPdfPath && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground">معاينة الملف المرفق</label>
                                        <div className="p-4 bg-zinc-900 rounded-2xl border border-border flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg">
                                                    <FileText className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-white mb-0.5">الإضبارة الورقية</p>
                                                    <p className="text-[10px] text-white/50 font-mono">{selectedRequest.mainPdfPath}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handlePreviewFile(selectedRequest.mainPdfPath!)}
                                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] rounded-lg transition-colors"
                                            >
                                                معاينة
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.checklistItems && selectedRequest.checklistItems.length > 0 && (
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4 text-sy-green" />
                                            المرفقات والمستندات
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {selectedRequest.checklistItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/50">
                                                    <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[140px]">{item.templateName}</span>
                                                    {item.isProvided ? (
                                                        <div className="flex items-center gap-1 text-sy-green">
                                                            <span className="text-[8px] font-bold">مكتمل</span>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-sy-red">
                                                            <span className="text-[8px] font-bold">نقص</span>
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={() => setSelectedRequest(null)}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-background hover:bg-muted text-sm font-bold text-foreground rounded-xl border border-border transition-all shadow-sm active:scale-95"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                        الرجوع للقائمة
                                    </button>
                                </div>
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
                title="معاينة المرفقات الرسمية"
            />

            {/* نظام الإشعارات الفوري */}
            <div className="hidden">Notifications managed via toast component at bottom</div>
            {/* نافذة سؤال الدفع (Payment Prompt) */}
            {
                showPaymentPrompt && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="bg-card w-full max-w-md rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-in scale-95 duration-300">
                            <div className="p-8 text-center space-y-6">
                                <div className="w-20 h-20 bg-sy-gold/10 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-sy-gold/5">
                                    <DollarSign className="w-10 h-10 text-sy-gold" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-black tracking-tight">تحديد حالة الرسوم</h3>
                                    <p className="text-sm text-muted-foreground font-medium px-4">
                                        هل الطلب لشركة <span className="text-foreground font-bold">{companyName}</span> بحاجة لدفع رسوم مالية؟
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleSubmit(true)}
                                        disabled={submitting}
                                        className="bg-sy-green text-white p-6 rounded-3xl font-black text-sm shadow-xl shadow-sy-green/20 hover:scale-[1.05] active:scale-95 transition-all flex flex-col items-center gap-3 group"
                                    >
                                        <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform">
                                            <Banknote className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span>نعم، يحتاج دفع</span>
                                            <span className="text-[10px] opacity-80 font-mono">({provincialFee.toLocaleString()} ل.س)</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleSubmit(false)}
                                        disabled={submitting}
                                        className="bg-muted text-foreground p-6 rounded-3xl font-black text-sm border-2 border-transparent hover:border-sy-gold/30 hover:bg-sy-gold/5 hover:scale-[1.05] active:scale-95 transition-all flex flex-col items-center gap-3 group"
                                    >
                                        <div className="p-3 bg-sy-gold/10 rounded-2xl group-hover:-rotate-12 transition-transform">
                                            <FileCheck className="w-6 h-6 text-sy-gold" />
                                        </div>
                                        <span>لا، معفى من الرسوم</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowPaymentPrompt(false)}
                                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    إلغاء والعودة للنموذج
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                notification && (
                    <NotificationToast
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )
            }
        </div >
    );
}
