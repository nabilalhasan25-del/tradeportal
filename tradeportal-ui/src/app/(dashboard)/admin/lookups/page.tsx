"use client";

import React, { useState } from "react";
import {
    Database,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    MapPin,
    Building2,
    Search,
    Loader2,
    AlertCircle,
    RefreshCw,
    Palette,
    FileCheck,
    Users,
    Shield,
    Banknote
} from "lucide-react";
import { useLookups } from "@/context/LookupsContext";

/**
 * صفحة إدارة البيانات الأساسية (Lookups/Dictionaries)
 * مربوطة بالـ API الحقيقي — CRUD كامل
 */

type TabId = "provinces" | "companyTypes" | "statuses" | "attachments" | "fees" | "roles" | "permissions";

interface Tab {
    id: TabId;
    name: string;
    icon: React.ElementType;
}

export default function LookupsManagement() {
    const {
        provinces, companyTypes, statuses, lookups, provinceFees,
        isLoading, error, refresh,
        addProvince, updateProvince, deleteProvince,
        addCompanyType, updateCompanyType, deleteCompanyType,
        addStatus, updateStatus, deleteStatus,
        addAttachment, updateAttachment, deleteAttachment,
        loadProvinceFees, addProvinceFee, updateProvinceFee, deleteProvinceFee
    } = useLookups();

    const [activeTab, setActiveTab] = useState<TabId>("provinces");
    const [newItem, setNewItem] = useState("");
    const [newColor, setNewColor] = useState("#007A3D");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [editingColor, setEditingColor] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Provincial Fees State
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [newFeeAmount, setNewFeeAmount] = useState<number>(0);
    const [editingAmount, setEditingAmount] = useState<number>(0);

    const tabs: Tab[] = [
        { id: "provinces", name: "المحافظات السورية", icon: MapPin },
        { id: "companyTypes", name: "أنواع الشركات", icon: Building2 },
        { id: "statuses", name: "حالات الطلبات", icon: Palette },
        { id: "attachments", name: "الوثائق المطلوبة", icon: FileCheck },
        { id: "fees", name: "رسوم المحافظات", icon: Banknote },
        { id: "roles", name: "أدوار النظام", icon: Users },
        { id: "permissions", name: "الصلاحيات", icon: Shield },
    ];

    // تحميل الرسوم عند تغيير المحافظة المختارة
    React.useEffect(() => {
        if (activeTab === "fees" && selectedProvinceId) {
            loadProvinceFees(selectedProvinceId);
        }
    }, [activeTab, selectedProvinceId, loadProvinceFees]);

    // البيانات حسب التبويب النشط
    const getItems = () => {
        switch (activeTab) {
            case "provinces": return provinces;
            case "companyTypes": return companyTypes;
            case "statuses": return statuses;
            case "attachments": return lookups.attachmentsList;
            case "fees": return provinceFees.map(f => ({ id: f.id, nameAr: f.feeName, amount: f.amount, isActive: f.isActive }));
            case "roles": return lookups.roles.map((r, i) => ({ id: i, nameAr: r, isActive: true }));
            case "permissions": return lookups.permissions.map((p, i) => ({ id: i, nameAr: p, isActive: true }));
            default: return [];
        }
    };

    const items = getItems();

    // إضافة عنصر جديد
    const handleAdd = async () => {
        if (!newItem.trim() || actionLoading) return;
        setActionLoading(true);
        try {
            if (activeTab === "provinces") await addProvince(newItem.trim());
            else if (activeTab === "companyTypes") await addCompanyType(newItem.trim());
            else if (activeTab === "attachments") await addAttachment(newItem.trim());
            else if (activeTab === "fees") {
                if (!selectedProvinceId) return;
                await addProvinceFee({ provinceId: selectedProvinceId, feeName: newItem.trim(), amount: newFeeAmount });
                setNewFeeAmount(0);
            }
            setNewItem("");
        } catch (err) {
            alert(err instanceof Error ? err.message : "فشلت العملية");
        } finally {
            setActionLoading(false);
        }
    };

    // بدء التعديل
    const startEdit = (id: number, nameAr: string, colorCode?: string, amount?: number) => {
        setEditingId(id);
        setEditingValue(nameAr);
        setEditingColor(colorCode || "#007A3D");
        if (amount !== undefined) setEditingAmount(amount);
    };

    // حفظ التعديل
    const handleSave = async () => {
        if (!editingValue.trim() || editingId === null || actionLoading) return;
        setActionLoading(true);
        try {
            if (activeTab === "provinces") await updateProvince(editingId, editingValue.trim());
            else if (activeTab === "companyTypes") await updateCompanyType(editingId, editingValue.trim());
            else if (activeTab === "attachments") await updateAttachment(editingId, editingValue.trim());
            else if (activeTab === "fees") {
                await updateProvinceFee(editingId, { feeName: editingValue.trim(), amount: editingAmount });
            }
            setEditingId(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "فشلت العملية");
        } finally {
            setActionLoading(false);
        }
    };

    // حذف عنصر (soft delete)
    const handleDelete = async (id: number) => {
        if (actionLoading) return;
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        setActionLoading(true);
        try {
            if (activeTab === "provinces") await deleteProvince(id);
            else if (activeTab === "companyTypes") await deleteCompanyType(id);
            else if (activeTab === "attachments") await deleteAttachment(id);
            else if (activeTab === "fees") await deleteProvinceFee(id);
        } catch (err) {
            alert(err instanceof Error ? err.message : "فشلت العملية");
        } finally {
            setActionLoading(false);
        }
    };

    // هل التبويب الحالي يسمح بالإضافة والتعديل؟
    const isReadOnly = activeTab === "roles" || activeTab === "permissions" || activeTab === "statuses";

    // حالة التحميل
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-sy-green animate-spin" />
                    <p className="text-sm text-muted-foreground">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    // حالة الخطأ
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <AlertCircle className="w-12 h-12 text-sy-red" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <button onClick={refresh} className="bg-sy-green text-white px-6 py-2 rounded-xl font-bold hover:brightness-110 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* رأس الصفحة */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sy-green/10 rounded-2xl">
                        <Database className="w-8 h-8 text-sy-green" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">إدارة البيانات الأساسية</h2>
                        <p className="text-muted-foreground text-sm">تخصيص الخيارات والقوائم المنسدلة — مرتبطة بقاعدة البيانات</p>
                    </div>
                </div>
                <button
                    onClick={refresh}
                    disabled={actionLoading}
                    className="flex items-center gap-2 text-xs font-bold text-sy-green bg-sy-green/10 px-4 py-2 rounded-xl border border-sy-green/20 hover:bg-sy-green/20 transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
                    تحديث البيانات
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* قائمة الفئات */}
                <div className="lg:col-span-1 space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2 mb-4 hidden lg:block">فئات البيانات</h3>
                    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 px-1 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setEditingId(null); }}
                                className={`flex-shrink-0 lg:w-full flex items-center lg:justify-between px-4 py-3 rounded-xl text-xs lg:text-sm font-bold transition-all border ${activeTab === tab.id
                                    ? "bg-sy-green text-white border-sy-green shadow-lg shadow-sy-green/20 scale-[1.02]"
                                    : "bg-card text-muted-foreground border-border hover:border-sy-green/50 hover:text-foreground"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon className="w-4 h-4" />
                                    <span className="whitespace-nowrap">{tab.name}</span>
                                </div>
                                {tab.id !== "fees" && (
                                    <span className="hidden lg:inline text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                                        {tab.id === "provinces" ? provinces.length :
                                            tab.id === "companyTypes" ? companyTypes.length :
                                                tab.id === "statuses" ? statuses.length :
                                                    tab.id === "attachments" ? lookups.attachmentsList.length :
                                                        tab.id === "roles" ? lookups.roles.length : lookups.permissions.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* منطقة الإدارة */}
                <div className="lg:col-span-3 space-y-6">
                    {/* إضافة عنصر جديد (يختفي في وضع القراءة فقط) */}
                    {!isReadOnly && (
                        <div className="glass-card p-6 border-sy-green/20">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-sy-green" />
                                    إضافة خيار جديد لـ ({tabs.find(t => t.id === activeTab)?.name})
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {activeTab === "fees" && (
                                        <select
                                            value={selectedProvinceId || ""}
                                            onChange={(e) => setSelectedProvinceId(Number(e.target.value))}
                                            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sy-green outline-none shadow-inner min-w-[150px]"
                                        >
                                            <option value="">اختر المحافظة...</option>
                                            {provinces.map(p => (
                                                <option key={p.id} value={p.id}>{p.nameAr}</option>
                                            ))}
                                        </select>
                                    )}
                                    <input
                                        type="text"
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                        placeholder={activeTab === "fees" ? "اسم الرسم (مثال: رسوم طابع)" : "اكتب القيمة الجديدة هنا..."}
                                        className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sy-green outline-none shadow-inner"
                                    />
                                    {activeTab === "fees" && (
                                        <input
                                            type="number"
                                            value={newFeeAmount}
                                            onChange={(e) => setNewFeeAmount(Number(e.target.value))}
                                            placeholder="المبلغ"
                                            className="w-32 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sy-green outline-none shadow-inner"
                                        />
                                    )}
                                    {/* Status color picker removed as it is now read-only */}
                                    <button
                                        onClick={handleAdd}
                                        disabled={!newItem.trim() || actionLoading}
                                        className="bg-sy-green text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-sy-green/20"
                                    >
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "إضافة"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* قائمة العناصر الحالية */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                {isReadOnly ? "القيم المتاحة (للعرض فقط)" : "القائمة الحالية"}
                            </h4>
                            {!isReadOnly && <span className="text-[10px] text-muted-foreground italic">يمكنك تعديل أو حذف أي خيار من القائمة</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
                            {items.map((item) => (
                                <div key={item.id} className={`bg-card p-4 flex items-center justify-between group hover:bg-background/80 transition-colors ${!item.isActive ? 'opacity-50' : ''}`}>
                                    {editingId === item.id ? (
                                        <div className="flex flex-1 gap-2 mr-2">
                                            <input
                                                type="text"
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                autoFocus
                                                className="flex-1 bg-background border border-sy-gold rounded-lg px-2 py-1 text-sm outline-none"
                                            />
                                            {/* Status color picker removed */}
                                            {activeTab === "fees" && (
                                                <input
                                                    type="number"
                                                    value={editingAmount}
                                                    onChange={(e) => setEditingAmount(Number(e.target.value))}
                                                    className="w-24 bg-background border border-sy-gold rounded-lg px-2 py-1 text-sm outline-none"
                                                />
                                            )}
                                            <button onClick={handleSave} disabled={actionLoading} className="p-1.5 bg-sy-green text-white rounded-lg disabled:opacity-50">
                                                <Save className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 bg-muted text-foreground rounded-lg">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {"colorCode" in item && (
                                                <div
                                                    className="w-4 h-4 rounded-full border border-border"
                                                    style={{ backgroundColor: (item as { colorCode: string }).colorCode }}
                                                />
                                            )}
                                            <span className="text-sm font-medium">{item.nameAr}</span>
                                            {"amount" in item && (
                                                <span className="text-sm font-black text-sy-green mr-auto ml-4">
                                                    {(item as any).amount.toLocaleString()} ل.س
                                                </span>
                                            )}
                                            {!item.isActive && (
                                                <span className="text-[10px] bg-sy-red/10 text-sy-red px-2 py-0.5 rounded-full">معطّل</span>
                                            )}
                                        </div>
                                    )}

                                    {!isReadOnly && (
                                        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${editingId === item.id ? "hidden" : ""}`}>
                                            <button
                                                onClick={() => startEdit(item.id, item.nameAr, "colorCode" in item ? (item as any).colorCode : undefined, "amount" in item ? (item as any).amount : undefined)}
                                                className="p-2 hover:bg-sy-gold/10 text-sy-gold rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={actionLoading}
                                                className="p-2 hover:bg-sy-red/10 text-sy-red rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {items.length === 0 && (
                            <div className="p-12 text-center text-muted-foreground">
                                <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>القائمة فارغة، قم بإضافة عناصر جديدة للبدء</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
