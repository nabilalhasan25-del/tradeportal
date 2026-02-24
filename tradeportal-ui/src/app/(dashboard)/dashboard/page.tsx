"use client";

import React, { useEffect, useState } from "react";
import {
    FileText,
    Clock,
    CheckCircle,
    Users,
    MapPin,
    ShieldAlert,
    Zap,
    TrendingUp,
    XCircle,
    Loader2
} from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import api, { DashboardStats } from "@/services/api";

/**
 * صفحة لوحة التحكم — بيانات حقيقية من الـ API
 * كل أدمن يرى فقط الإحصائيات الخاصة بقسمه أو محافظته
 */
export default function AdminDashboard() {
    const { userRole, userProvince } = useLayout();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await api.getDashboardStats();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "فشل في تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // منطق العنوان حسب الدور
    const getTitle = () => {
        switch (userRole) {
            case "PROVINCIAL_ADMIN": return `لوحة مديرية ${userProvince}`;
            case "CENTRAL_AUDITOR_ADMIN": return "لوحة التدقيق المركزي";
            case "IP_EXPERT_ADMIN": return "لوحة خبراء الملكية الفكرية";
            default: return "نظرة عامة على النظام";
        }
    };

    const getSubtitle = () => {
        switch (userRole) {
            case "PROVINCIAL_ADMIN": return `متابعة حركات الطلبات والموظفين في مديرية ${userProvince}`;
            case "CENTRAL_AUDITOR_ADMIN": return "مراجعة ومتابعة عمليات التدقيق المركزي";
            case "IP_EXPERT_ADMIN": return "مراجعة العلامات التجارية والأسماء التجارية والبت في النزاعات الفنية";
            default: return "مرحباً بك في لوحة تحكم مديرية الشركات المركزية";
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-sy-green" />
                    <span className="text-sm">جاري تحميل البيانات...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                    <XCircle className="w-12 h-12 mx-auto mb-3 text-sy-red/50" />
                    <p className="font-bold">فشل في تحميل البيانات</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-sy-green text-white rounded-lg text-sm"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    // بناء بطاقات الإحصائيات حسب الدور
    const getStatCards = () => {
        if (userRole === "CENTRAL_AUDITOR_ADMIN") {
            return [
                { name: "إجمالي طلبات التدقيق", value: stats.totalRequests, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
                { name: "طلبات جديدة", value: stats.newRequests, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                { name: "قيد التدقيق", value: stats.inReview, icon: ShieldAlert, color: "text-blue-500", bg: "bg-blue-500/10" },
                { name: "موظفي التدقيق", value: stats.activeUsers, icon: Users, color: "text-sy-green", bg: "bg-sy-green/10" },
            ];
        }
        if (userRole === "IP_EXPERT_ADMIN") {
            return [
                { name: "طلبات بانتظار الملكية", value: stats.awaitingIp, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                { name: "تقارير فنية منجزة", value: stats.ipResponded, icon: CheckCircle, color: "text-sy-green", bg: "bg-sy-green/10" },
                { name: "إجمالي الطلبات", value: stats.totalRequests, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
                { name: "موظفي الملكية", value: stats.activeUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            ];
        }
        if (userRole === "PROVINCIAL_ADMIN") {
            return [
                { name: `إجمالي طلبات ${userProvince}`, value: stats.totalRequests, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
                { name: "بانتظار الرد", value: stats.newRequests + stats.inReview, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                { name: "مقبولة نهائياً", value: stats.accepted, icon: CheckCircle, color: "text-sy-green", bg: "bg-sy-green/10" },
                { name: `موظفي ${userProvince}`, value: stats.activeUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            ];
        }
        // Admin الرئيسي
        return [
            { name: "إجمالي الطلبات", value: stats.totalRequests, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
            { name: "قيد التدقيق", value: stats.inReview, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { name: "تم قبولها", value: stats.accepted, icon: CheckCircle, color: "text-sy-green", bg: "bg-sy-green/10" },
            { name: "المستخدمين النشطين", value: stats.activeUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        ];
    };

    const statCards = getStatCards();

    // لون الحالة
    const getStatusClasses = (statusColor: string | null) => {
        switch (statusColor) {
            case "green": return "bg-sy-green/10 text-sy-green border-sy-green/20";
            case "red": return "bg-sy-red/10 text-sy-red border-sy-red/20";
            case "amber": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "blue": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "purple": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "indigo": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
            default: return "bg-muted text-muted-foreground border-border";
        }
    };

    // تاريخ مقروء
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        const diffDays = Math.floor(diffHours / 24);
        return `منذ ${diffDays} يوم`;
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* الترحيب والعنوان */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{getTitle()}</h2>
                    <p className="text-muted-foreground mt-1">{getSubtitle()}</p>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg text-sm">
                    <Clock className="w-4 h-4 text-sy-gold" />
                    <span>آخر تحديث: الآن</span>
                </div>
            </div>

            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="glass-card p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
                            <h3 className="text-3xl font-bold text-foreground">{stat.value.toLocaleString('ar-EG')}</h3>
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-sy-green font-medium">
                                <TrendingUp className="w-3 h-3" />
                                <span>بيانات حقيقية</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* قسم الطلبات الأخيرة وتوزيع المحافظات */}
            <div className={`grid grid-cols-1 gap-8 ${userRole === "ADMIN" ? "lg:grid-cols-3" : "grid-cols-1"}`}>
                {/* جدول الطلبات الأخيرة */}
                <div className={`glass-card overflow-hidden ${userRole === "ADMIN" ? "lg:col-span-2" : "w-full"}`}>
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-sy-green" />
                            أحدث الطلبات
                        </h3>
                        <span className="text-xs text-muted-foreground">{stats.recentRequests.length} طلب</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right min-w-[600px] lg:min-w-full">
                            <thead className="bg-background/50 text-xs text-muted-foreground uppercase border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">الرقم</th>
                                    <th className="px-6 py-4">اسم الشركة</th>
                                    <th className="px-6 py-4">نوع الكيان</th>
                                    <th className="px-6 py-4">المحافظة</th>
                                    <th className="px-6 py-4 text-center">التاريخ</th>
                                    <th className="px-6 py-4 text-center">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {stats.recentRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm">لا توجد طلبات بعد</p>
                                        </td>
                                    </tr>
                                ) : (
                                    stats.recentRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-background/40 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-sy-gold">#{req.id}</td>
                                            <td className="px-6 py-4 text-sm font-bold">{req.companyName}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-primary">{req.companyTypeName}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-muted-foreground" />
                                                    {req.provinceName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-muted-foreground text-center">{formatDate(req.createdAt)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusClasses(req.statusColor)}`}>
                                                    {req.statusName}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* توزيع المحافظات - يظهر فقط للمدير العام */}
                {userRole === "ADMIN" && (
                    <div className="glass-card p-6 flex flex-col h-full">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-sy-green" />
                            توزيع الطلبات جغرافياً
                        </h3>
                        {stats.provinceBreakdown.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-center p-6">
                                <p className="text-sm text-muted-foreground">لا توجد بيانات بعد</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.provinceBreakdown.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm p-3 bg-background/50 rounded-lg">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-sy-green" />
                                            {item.provinceName}
                                        </span>
                                        <span className="font-bold text-sy-gold">{item.requestCount} طلب</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
