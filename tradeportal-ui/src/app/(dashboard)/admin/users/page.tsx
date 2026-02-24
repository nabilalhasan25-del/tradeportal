"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Users,
    UserPlus,
    Shield,
    Search,
    Mail,
    MapPin,
    Lock,
    Trash2,
    CheckCircle,
    XCircle,
    Loader2,
    ToggleLeft,
    ToggleRight,
    AlertTriangle,
    Edit
} from "lucide-react";

import { useLayout } from "@/context/LayoutContext";
import api, { UserListItem, LookupItem } from "@/services/api";
import { translateError } from "@/utils/errorTranslator";
import { NotificationToast } from "@/components/NotificationToast";

// خريطة أسماء الأدوار للعرض بالعربي
const ROLE_LABELS: Record<string, string> = {
    "Admin": "مدير النظام",
    "ProvinceAdmin": "مدير مديرية",
    "ProvinceEmployee": "موظف فرعي",
    "CentralAuditorAdmin": "مدير التدقيق",
    "CentralAuditor": "مدقق مركزي",
    "IpExpertAdmin": "مدير الملكية",
    "IpExpert": "خبير ملكية",
};

// Utility removed and moved to src/utils/errorTranslator.ts

/**
 * صفحة إدارة المستخدمين — بيانات حقيقية من الـ API
 * كل مسؤول يرى ويدير فقط المستخدمين ضمن نطاقه
 */
export default function UsersManagement() {
    const { userRole, userProvince } = useLayout();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [provinces, setProvinces] = useState<LookupItem[]>([]);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

    // Edit User Data
    const [editData, setEditData] = useState({
        fullName: "",
        email: "",
        role: "",
        provinceId: undefined as number | undefined
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [editSubmitError, setEditSubmitError] = useState<string | null>(null);

    // Notification State
    const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

    // Confirm Dialog State
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        actionLabel: string;
        actionVariant: 'danger' | 'warning';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        actionLabel: 'تأكيد',
        actionVariant: 'warning',
        onConfirm: () => { }
    });

    // بيانات إضافة مستخدم جديد
    const [newUser, setNewUser] = useState({
        userName: "",
        fullName: "",
        email: "",
        password: "",
        role: "",
        provinceId: undefined as number | undefined,
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    // Fetch all data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersData, provincesData, rolesData] = await Promise.all([
                    api.getUsers(),
                    api.getProvinces(),
                    api.getAvailableRoles(),
                ]);
                setUsers(usersData);
                setProvinces(provincesData);
                setAvailableRoles(rolesData);
                if (rolesData.length > 0) {
                    setNewUser(prev => ({ ...prev, role: rolesData[0] }));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "فشل في تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // فلترة بالبحث
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.fullName.includes(searchQuery) ||
            user.email.includes(searchQuery) ||
            user.userName.includes(searchQuery)
        );
    }, [users, searchQuery]);

    // إضافة مستخدم جديد
    const handleAddUser = async () => {
        if (!newUser.userName || !newUser.fullName || !newUser.email || !newUser.password || !newUser.role) {
            setSubmitError("يرجى تعبئة جميع الحقول المطلوبة");
            return;
        }
        try {
            setSubmitting(true);
            setSubmitError(null);
            await api.register({
                userName: newUser.userName,
                fullName: newUser.fullName,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
                provinceId: newUser.provinceId,
            });
            setSubmitSuccess("تم إنشاء الحساب بنجاح!");
            // Refresh users list
            const updatedUsers = await api.getUsers();
            setUsers(updatedUsers);
            // Reset form
            setTimeout(() => {
                setShowAddModal(false);
                setSubmitSuccess(null);
                setNewUser({ userName: "", fullName: "", email: "", password: "", role: availableRoles[0] || "", provinceId: undefined });
            }, 1500);
        } catch (err) {
            const rawError = err instanceof Error ? err.message : "فشل في إنشاء الحساب";
            setSubmitError(translateError(rawError));
        } finally {
            setSubmitting(false);
        }
    };

    // تبديل حالة حساب مستخدم (نشط / معطل)
    const handleToggleActive = async (user: UserListItem) => {
        const actionName = user.isActive ? "تعطيل" : "تفعيل";

        setConfirmDialog({
            isOpen: true,
            title: `${actionName} الحساب`,
            message: `هل أنت متأكد من ${actionName} حساب الموظف "${user.fullName}"؟`,
            actionLabel: actionName,
            actionVariant: 'warning',
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                try {
                    await api.deactivateUser(user.id);
                    const updatedUsers = await api.getUsers();
                    setUsers(updatedUsers);
                    setNotification({ message: `تم ${actionName} حساب المشغل بنجاح`, type: 'success' });
                } catch (err) {
                    setNotification({ message: err instanceof Error ? err.message : `فشل في ${actionName} الحساب`, type: 'error' });
                }
            }
        });
    };

    // حذف مستخدم نهائياً (Soft Delete)
    const handleDelete = async (user: UserListItem) => {
        setConfirmDialog({
            isOpen: true,
            title: 'حذف الحساب',
            message: `هل أنت متأكد من حذف حساب "${user.fullName}" بشكل نهائي؟ (حذف منطقي ولن يظهر في القوائم)`,
            actionLabel: 'حذف نهائي',
            actionVariant: 'danger',
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                try {
                    await api.deleteUser(user.id);
                    const updatedUsers = await api.getUsers();
                    setUsers(updatedUsers);
                    setNotification({ message: `تم حذف حساب ${user.fullName} بنجاح`, type: 'success' });
                } catch (err) {
                    setNotification({ message: err instanceof Error ? err.message : "فشل في حذف الحساب", type: 'error' });
                }
            }
        });
    };

    // فتح نافذة التعديل
    const openEditModal = (user: UserListItem) => {
        setSelectedUser(user);
        setEditData({
            fullName: user.fullName,
            email: user.email,
            role: user.roles[0] || "",
            provinceId: user.provinceId === null ? undefined : user.provinceId
        });
        setEditSubmitError(null);
        setShowEditModal(true);
    };

    // إرسال التعديل
    const handleEditSubmit = async () => {
        if (!selectedUser) return;
        if (!editData.fullName || !editData.email || !editData.role) {
            setEditSubmitError("يرجى تعبئة جميع الحقول المطلوبة");
            return;
        }

        try {
            setIsUpdating(true);
            setEditSubmitError(null);
            await api.updateUser(selectedUser.id, {
                fullName: editData.fullName,
                email: editData.email,
                role: editData.role,
                provinceId: editData.provinceId
            });
            setShowEditModal(false);
            setNotification({ message: "تم تحديث بيانات المستخدم بنجاح", type: "success" });

            // تحديث القائمة فوراً للتجربة السلسة
            const updatedUsers = await api.getUsers();
            setUsers(updatedUsers);
        } catch (err) {
            setEditSubmitError(err instanceof Error ? err.message : "فشل في تحديث بيانات المستخدم");
        } finally {
            setIsUpdating(false);
        }
    };

    // إعادة تعيين كلمة المرور
    const handleResetPassword = () => {
        if (!selectedUser) return;
        setConfirmDialog({
            isOpen: true,
            title: 'إعادة تعيين كلمة المرور',
            message: `هل أنت متأكد من إعادة تعيين كلمة مرور الحساب "${selectedUser.fullName}"؟ ستصبح كلمة المرور الافتراضية "Syria@123"`,
            actionLabel: 'تأكيد',
            actionVariant: 'warning',
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                try {
                    setShowEditModal(false);
                    await api.resetUserPassword(selectedUser.id);
                    setNotification({ message: `تم إعادة تعيين كلمة المرور بنجاح للمستخدم ${selectedUser.fullName}`, type: 'success' });
                } catch (err) {
                    setNotification({ message: err instanceof Error ? err.message : "فشل في إعادة تعيين كلمة المرور", type: 'error' });
                }
            }
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-sy-green" />
                    <span className="text-sm">جاري تحميل بيانات المستخدمين...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                    <XCircle className="w-12 h-12 mx-auto mb-3 text-sy-red/50" />
                    <p className="font-bold">فشل في تحميل البيانات</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-sy-green text-white rounded-lg text-sm">
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    // العنوان حسب الدور
    const getTitle = () => {
        switch (userRole) {
            case "IP_EXPERT_ADMIN": return "إدارة صلاحيات الملكية";
            case "CENTRAL_AUDITOR_ADMIN": return "إدارة موظفي التدقيق";
            case "PROVINCIAL_ADMIN": return `إدارة موظفي ${userProvince}`;
            default: return "إدارة المستخدمين";
        }
    };

    const getSubtitle = () => {
        switch (userRole) {
            case "IP_EXPERT_ADMIN": return "إدارة حسابات الخبراء الفنيين والتدقيق في صلاحيات الوصول للبحث الملكي";
            case "CENTRAL_AUDITOR_ADMIN": return "إدارة حسابات المدققين المركزيين وصلاحيات التدقيق";
            case "PROVINCIAL_ADMIN": return `إدارة حسابات الموظفين التابعين لمديرية ${userProvince}`;
            default: return "إدارة حسابات كافة الموظفين وتعديل صلاحيات الوصول على مستوى القطر";
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* الترحيب والعنوان */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sy-gold/10 rounded-2xl">
                        <Users className="w-8 h-8 text-sy-gold" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{getTitle()}</h2>
                        <p className="text-muted-foreground text-sm">{getSubtitle()}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-sy-green text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-sy-green/20 flex items-center gap-2 hover:scale-105 transition-all"
                >
                    <UserPlus className="w-5 h-5" />
                    إضافة مستخدم جديد
                </button>
            </div>

            {/* أدوات البحث */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="بحث عن موظف (بالاسم أو البريد)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg pr-10 pl-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sy-green transition-all"
                    />
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {filteredUsers.length} مستخدم
                </div>
            </div>

            {/* جدول المستخدمين */}
            <div className="glass-card overflow-x-auto">
                <table className="w-full text-right min-w-[800px] lg:min-w-full">
                    <thead className="bg-background/50 text-xs text-muted-foreground uppercase border-b border-border">
                        <tr>
                            <th className="px-6 py-4">الموظف</th>
                            <th className="px-6 py-4">الدور الوظيفي</th>
                            <th className="px-6 py-4">المرجع الجغرافي</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">لا يوجد مستخدمون {searchQuery ? "مطابقون للبحث" : ""}</p>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-background/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-sy-gold/10 flex items-center justify-center font-bold text-sy-gold border border-sy-gold/20">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">{user.fullName}</span>
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-sy-green" />
                                            {user.roles.map(r => ROLE_LABELS[r] || r).join(", ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3" />
                                            {user.provinceName || "مركزي"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${user.isActive
                                            ? "bg-sy-green/10 text-sy-green border-sy-green/20"
                                            : "bg-muted text-muted-foreground border-border"
                                            }`}>
                                            {user.isActive ? "نشط" : "معطل"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleToggleActive(user)}
                                                className={`p-2 rounded-lg transition-colors border border-transparent ${user.isActive ? 'hover:bg-orange-500/10 text-orange-500 hover:border-orange-500/20' : 'hover:bg-blue-500/10 text-blue-500 hover:border-blue-500/20'}`}
                                                title={user.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
                                            >
                                                {user.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 hover:bg-sy-green/10 text-sy-green rounded-lg transition-colors border border-transparent hover:border-sy-green/20"
                                                title="تعديل المستخدم"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="p-2 hover:bg-sy-red/10 text-sy-red rounded-lg transition-colors border border-transparent hover:border-sy-red/20"
                                                title="حذف الحساب"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* نافذة إضافة مستخدم جديد */}
            {
                showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
                        <div className="glass-card w-full max-w-lg overflow-hidden shadow-2xl border-sy-green/20 animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-border bg-sy-green text-white flex justify-between items-center">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <UserPlus className="w-6 h-6" />
                                    إضافة موظف جديد
                                </h3>
                                <button onClick={() => { setShowAddModal(false); setSubmitError(null); setSubmitSuccess(null); }} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {submitSuccess && (
                                    <div className="p-3 bg-sy-green/10 border border-sy-green/20 rounded-lg text-sy-green text-sm font-bold flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        {submitSuccess}
                                    </div>
                                )}
                                {submitError && (
                                    <div className="p-3 bg-sy-red/10 border border-sy-red/20 rounded-lg text-sy-red text-sm font-bold">
                                        {submitError}
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 flex flex-col items-start w-full">
                                        <label className="text-xs font-bold px-1">اسم المستخدم</label>
                                        <input
                                            type="text"
                                            value={newUser.userName}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, userName: e.target.value }))}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="space-y-1.5 flex flex-col items-start w-full">
                                        <label className="text-xs font-bold px-1">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            value={newUser.fullName}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none"
                                            placeholder="أدخل الاسم الكامل"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 flex flex-col items-start w-full">
                                    <label className="text-xs font-bold px-1">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none"
                                        placeholder="email@domain.com"
                                    />
                                </div>
                                <div className="space-y-1.5 flex flex-col items-start w-full">
                                    <label className="text-xs font-bold px-1">كلمة المرور</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none"
                                        placeholder="6 أحرف على الأقل"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 flex flex-col items-start w-full">
                                        <label className="text-xs font-bold px-1">الدور الوظيفي</label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                                            disabled={availableRoles.length <= 1}
                                            className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none ${availableRoles.length <= 1 ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}
                                        >
                                            {availableRoles.map((role) => (
                                                <option key={role} value={role}>{ROLE_LABELS[role] || role}</option>
                                            ))}
                                        </select>
                                        {availableRoles.length <= 1 && (
                                            <p className="text-[9px] text-sy-gold font-bold pr-1">
                                                مُصرح لك فقط بإضافة &apos;{ROLE_LABELS[availableRoles[0]] || availableRoles[0]}&apos;
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5 flex flex-col items-start w-full">
                                        <label className="text-xs font-bold px-1">المحافظة</label>
                                        <select
                                            value={newUser.provinceId || ""}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, provinceId: e.target.value ? parseInt(e.target.value) : undefined }))}
                                            disabled={userRole === "PROVINCIAL_ADMIN"}
                                            className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-green outline-none ${userRole === "PROVINCIAL_ADMIN" ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}
                                        >
                                            <option value="">بدون محافظة (مركزي)</option>
                                            {provinces.map((prov) => (
                                                <option key={prov.id} value={prov.id}>{prov.nameAr}</option>
                                            ))}
                                        </select>
                                        {userRole === "PROVINCIAL_ADMIN" && (
                                            <p className="text-[9px] text-sy-gold font-bold pr-1">مُقيد بمحافظتك الحالية</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddUser}
                                    disabled={submitting}
                                    className="w-full py-3 bg-sy-green text-white rounded-xl font-bold mt-4 shadow-lg shadow-sy-green/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                                    {submitting ? "جاري الإنشاء..." : "إنشاء الحساب"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* نافذة تعديل بيانات المستخدم */}
            {
                showEditModal && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
                        <div className="glass-card w-full max-w-lg overflow-hidden shadow-2xl border-sy-gold/20 animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-border bg-sy-gold text-white flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Edit className="w-6 h-6" />
                                    <div className="text-right">
                                        <h3 className="text-lg font-bold">تعديل المستخدم</h3>
                                        <p className="text-[10px] opacity-80">@{selectedUser.userName}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowEditModal(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {editSubmitError && (
                                    <div className="p-3 bg-sy-red/10 border border-sy-red/20 rounded-lg text-sy-red text-sm font-bold">
                                        {editSubmitError}
                                    </div>
                                )}

                                <div className="space-y-1.5 flex flex-col items-start w-full">
                                    <label className="text-xs font-bold px-1">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        value={editData.fullName}
                                        onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-gold outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5 flex flex-col items-start w-full">
                                    <label className="text-xs font-bold px-1">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-gold outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 flex flex-col items-start w-full">
                                        <label className="text-xs font-bold px-1">الدور الوظيفي</label>
                                        <select
                                            value={editData.role}
                                            onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                                            disabled={availableRoles.length <= 1}
                                            className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-gold outline-none ${availableRoles.length <= 1 ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}
                                        >
                                            {availableRoles.map((role) => (
                                                <option key={role} value={role}>{ROLE_LABELS[role] || role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 flex flex-col items-start w-full">
                                        <label className="text-xs font-bold px-1">المحافظة</label>
                                        <select
                                            value={editData.provinceId || ""}
                                            onChange={(e) => setEditData(prev => ({ ...prev, provinceId: e.target.value ? parseInt(e.target.value) : undefined }))}
                                            disabled={userRole === "PROVINCIAL_ADMIN"}
                                            className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sy-gold outline-none ${userRole === "PROVINCIAL_ADMIN" ? "opacity-60 cursor-not-allowed bg-muted/30" : ""}`}
                                        >
                                            <option value="">بدون محافظة (مركزي)</option>
                                            {provinces.map((prov) => (
                                                <option key={prov.id} value={prov.id}>{prov.nameAr}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-border mt-4 flex justify-between items-center bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-sy-red flex items-center gap-1">
                                            <Lock className="w-4 h-4" /> كلمة المرور
                                        </span>
                                        <span className="text-[10px] text-muted-foreground mt-1">تصبح Syria@123 للاستخدام مرة واحدة</span>
                                    </div>
                                    <button
                                        onClick={handleResetPassword}
                                        className="px-4 py-2 bg-sy-red text-white text-xs font-bold rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        إعادة تعيين
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-background transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    disabled={isUpdating}
                                    className="px-6 py-2.5 bg-sy-gold text-white rounded-xl text-sm font-bold shadow-lg shadow-sy-gold/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ التعديلات"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <Users className="w-5 h-5 text-sy-gold" />
                        ملخص المستخدمين
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border">
                            <span className="text-sm font-medium">إجمالي المستخدمين</span>
                            <span className="text-sm font-bold text-sy-green">{users.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border">
                            <span className="text-sm font-medium">المستخدمين النشطين</span>
                            <span className="text-sm font-bold text-sy-green">{users.filter(u => u.isActive).length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border">
                            <span className="text-sm font-medium">المستخدمين المعطلين</span>
                            <span className="text-sm font-bold text-sy-red">{users.filter(u => !u.isActive).length}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 space-y-4 border-sy-green/20">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-sy-green" />
                            حالة أمان المستخدمين
                        </h3>
                        <span className="text-[10px] bg-sy-green/10 text-sy-green px-2 py-1 rounded-full font-bold">مؤمن</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        يتم تتبع كافة حركات الدخول والخروج في سجلات النظام. جميع كلمات المرور مشفرة ولا يمكن الوصول إليها حتى من قبل الإدارة المركزية.
                    </p>
                    <div className="pt-2">
                        <button className="text-primary text-xs font-bold hover:underline">عرض سجل الأمان الكامل ←</button>
                    </div>
                </div>
            </div>

            {/* نافذة التأكيد (Confirm Modal) */}
            {confirmDialog.isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
                    <div className={`glass-card w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border ${confirmDialog.actionVariant === 'danger' ? 'border-sy-red/20' : 'border-sy-gold/20'}`}>
                        <div className={`p-4 border-b border-border text-white flex justify-between items-center ${confirmDialog.actionVariant === 'danger' ? 'bg-sy-red' : 'bg-sy-gold'}`}>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                {confirmDialog.actionVariant === 'danger' ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                {confirmDialog.title}
                            </h3>
                            <button onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-medium leading-relaxed">{confirmDialog.message}</p>
                            <div className="flex gap-3 mt-6 justify-end">
                                <button
                                    onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                                    className="px-4 py-2 text-sm font-bold bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={confirmDialog.onConfirm}
                                    className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-lg ${confirmDialog.actionVariant === 'danger'
                                        ? 'bg-sy-red hover:bg-red-700 shadow-sy-red/20'
                                        : 'bg-sy-gold hover:bg-yellow-600 shadow-sy-gold/20'
                                        }`}
                                >
                                    {confirmDialog.actionLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* إشعار (Toast) للعمليات */}
            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}
