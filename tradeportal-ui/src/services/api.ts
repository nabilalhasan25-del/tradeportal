/**
 * خدمة الاتصال بالـ API
 * الطبقة الأساسية للتواصل مع الخادم الخلفي
 * جميع البيانات تأتي من الـ API الحقيقي — لا بيانات وهمية
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiOptions {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
}

export class ApiService {
    public baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    }

    async getPdfBlob(path: string): Promise<Blob> {
        const token = this.getToken();
        try {
            const response = await fetch(`${this.baseUrl}/api/files/view?path=${encodeURIComponent(path)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Handle auth errors
                if (response.status === 401 || response.status === 403) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        if (!window.location.pathname.startsWith('/login')) {
                            window.location.href = '/login';
                        }
                    }
                    throw new Error('انتهت صلاحية الجلسة أو لا تملك الصلاحية.');
                }

                if (response.status === 404) {
                    throw new Error('الملف غير موجود على الخادم.');
                }

                const errorText = await response.text();
                throw new Error(errorText || `فشل جلب الملف: ${response.status}`);
            }

            return await response.blob();
        } catch (error: any) {
            const fullUrl = `${this.baseUrl}/api/files/view?path=${encodeURIComponent(path)}`;
            console.error("Fetch Error for URL:", fullUrl, error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error(`فشل الاتصال بالخادم عند الرابط: ${fullUrl}. يرجى التأكد من تشغيل الـ API وفحص الـ CORS.`);
            }
            throw error;
        }
    }

    async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const token = this.getToken();
        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            // ─── معالجة أخطاء المصادقة والصلاحيات ─────────
            if (response.status === 401 || response.status === 403) {
                // تنظيف بيانات تسجيل الدخول
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    document.cookie = 'auth-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
                    document.cookie = 'user-role=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';

                    // إعادة التوجيه لصفحة الدخول فقط إذا لم نكن فيها بالفعل لتجنب الحلقات اللانهائية
                    if (!window.location.pathname.startsWith('/login')) {
                        window.location.href = '/login';
                    }
                }
                throw new Error(response.status === 401
                    ? 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.'
                    : 'ليس لديك صلاحية للوصول إلى هذا المورد.');
            }
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }

        const responseText = await response.text();
        if (!responseText || response.status === 204) {
            return {} as T;
        }

        try {
            return JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse JSON response:', responseText);
            return {} as T;
        }
    }

    async post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body, headers });
    }

    async put<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'PUT', body, headers });
    }

    async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }

    // ========== File Upload ==========
    async uploadFile(file: File): Promise<{ path: string }> {
        const token = this.getToken();
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/api/upload`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async uploadReceipt(file: File): Promise<{ path: string }> {
        const token = this.getToken();
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/api/upload/receipt`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // ========== Auth ==========
    async login(userName: string, password: string) {
        return this.request<LoginResponse>('/api/auth/login', {
            method: 'POST',
            body: { userName, password },
        });
    }

    async register(data: RegisterData) {
        return this.request<LoginResponse>('/api/auth/register', {
            method: 'POST',
            body: data,
        });
    }

    // ========== Dashboard ==========
    async getDashboardStats() {
        return this.request<DashboardStats>('/api/dashboard/stats');
    }

    // ========== Requests ==========
    async getRequests(statusId?: number, provinceId?: number) {
        const params = new URLSearchParams();
        if (statusId) params.append('statusId', statusId.toString());
        if (provinceId) params.append('provinceId', provinceId.toString());
        const qs = params.toString() ? `?${params.toString()}` : '';
        return this.request<RequestDto[]>(`/api/requests${qs}`);
    }

    async createRequest(data: CreateRequestData) {
        return this.request<RequestDto>('/api/requests', {
            method: 'POST',
            body: data,
        });
    }

    async updateRequestStatus(id: number, data: UpdateStatusData) {
        return this.request<void>(`/api/requests/${id}/status`, {
            method: 'PUT',
            body: data,
        });
    }

    async takeRequest(id: number) {
        return this.request<void>(`/api/requests/${id}/take`, { method: 'POST' });
    }

    async releaseRequest(id: number) {
        return this.request<void>(`/api/requests/${id}/release`, { method: 'POST' });
    }

    async confirmPayment(id: number, receiptNum: string, receiptPath?: string) {
        return this.request<RequestDto>(`/api/requests/${id}/confirm-payment`, {
            method: 'POST',
            body: { receiptNum, receiptPath }
        });
    }

    async forwardToLeadership(id: number, targetRole: string, note: string) {
        return this.request<void>(`/api/requests/${id}/forward-leadership`, {
            method: 'POST',
            body: { targetRole, note }
        });
    }

    async directorDecision(id: number, action: 'forward' | 'return', note: string) {
        return this.request<void>(`/api/requests/${id}/director-decision`, {
            method: 'POST',
            body: { action, note }
        });
    }

    async ministerDecision(id: number, isApproved: boolean, note: string) {
        return this.request<void>(`/api/requests/${id}/minister-decision`, {
            method: 'POST',
            body: { isApproved, note }
        });
    }

    async validateName(data: NameValidationRequest) {
        return this.request<NameValidationResult>('/api/naming/validate', {
            method: 'POST',
            body: data
        });
    }

    async finalizeRegistry(id: number, data: { registryNumber: string, registryDate: string }) {
        return this.request<void>(`/api/requests/${id}/finalize-registry`, {
            method: 'POST',
            body: data
        });
    }

    async releaseName(id: number) {
        return this.request<void>(`/api/requests/${id}/release-name`, { method: 'POST' });
    }

    async addTechnicalReport(id: number, data: { feedback: string, reportPath?: string }) {
        return this.request<RequestDto>(`/api/requests/${id}/technical-report`, {
            method: 'POST',
            body: data
        });
    }

    async checkTradeName(name: string, excludeId?: number) {
        const url = `/api/requests/check-name?name=${encodeURIComponent(name)}${excludeId ? `&excludeId=${excludeId}` : ''}`;
        return this.request<NameCheckResult>(url);
    }

    // ========== Users Management ==========
    async getUsers() {
        return this.request<UserListItem[]>('/api/users');
    }

    async updateUser(id: number, data: UpdateUserData) {
        return this.request<void>(`/api/users/${id}`, {
            method: 'PUT',
            body: data,
        });
    }

    async resetUserPassword(id: number) {
        return this.request<void>(`/api/users/${id}/reset-password`, { method: 'POST' });
    }

    async deactivateUser(id: number) {
        return this.request<void>(`/api/users/${id}`, { method: 'DELETE' });
    }

    async deleteUser(id: number) {
        return this.request<void>(`/api/users/${id}/delete`, { method: 'DELETE' });
    }

    async getAvailableRoles() {
        return this.request<string[]>('/api/users/available-roles');
    }

    // ========== Lookups ==========
    async getProvinces() {
        return this.request<LookupItem[]>('/api/lookups/provinces');
    }
    async addProvince(nameAr: string) {
        return this.request<LookupItem>('/api/lookups/provinces', { method: 'POST', body: { nameAr } });
    }
    async updateProvince(id: number, data: { nameAr?: string; isActive?: boolean }) {
        return this.request<LookupItem>(`/api/lookups/provinces/${id}`, { method: 'PUT', body: data });
    }
    async deleteProvince(id: number) {
        return this.request<void>(`/api/lookups/provinces/${id}`, { method: 'DELETE' });
    }

    // Province Fees
    async getProvinceFees(provinceId: number) {
        return this.request<ProvinceFeeRuleDto[]>(`/api/lookups/provinces/${provinceId}/fees`);
    }
    async addProvinceFeeRule(data: ProvinceFeeRuleCreateDto) {
        return this.request<ProvinceFeeRuleDto>('/api/lookups/province-fees', { method: 'POST', body: data });
    }
    async updateProvinceFeeRule(id: number, data: ProvinceFeeRuleUpdateDto) {
        return this.request<ProvinceFeeRuleDto>(`/api/lookups/province-fees/${id}`, { method: 'PUT', body: data });
    }
    async deleteProvinceFeeRule(id: number) {
        return this.request<void>(`/api/lookups/province-fees/${id}`, { method: 'DELETE' });
    }

    async getCompanyTypes() {
        return this.request<LookupItem[]>('/api/lookups/company-types');
    }
    async addCompanyType(nameAr: string) {
        return this.request<LookupItem>('/api/lookups/company-types', { method: 'POST', body: { nameAr } });
    }
    async updateCompanyType(id: number, data: { nameAr?: string; isActive?: boolean }) {
        return this.request<LookupItem>(`/api/lookups/company-types/${id}`, { method: 'PUT', body: data });
    }
    async deleteCompanyType(id: number) {
        return this.request<void>(`/api/lookups/company-types/${id}`, { method: 'DELETE' });
    }

    async getStatuses() {
        return this.request<StatusItem[]>('/api/lookups/statuses');
    }
    async addStatus(nameAr: string, colorCode?: string) {
        return this.request<StatusItem>('/api/lookups/statuses', { method: 'POST', body: { nameAr, colorCode } });
    }
    async updateStatus(id: number, data: { nameAr?: string; colorCode?: string; isActive?: boolean }) {
        return this.request<StatusItem>(`/api/lookups/statuses/${id}`, { method: 'PUT', body: data });
    }
    async deleteStatus(id: number) {
        return this.request<void>(`/api/lookups/statuses/${id}`, { method: 'DELETE' });
    }

    // ========== Checklist Templates ==========
    async getChecklistTemplates() {
        return this.request<ChecklistTemplateItem[]>('/api/lookups/checklist-templates');
    }
    async addChecklistTemplate(nameAr: string) {
        return this.request<ChecklistTemplateItem>('/api/lookups/checklist-templates', { method: 'POST', body: { nameAr } });
    }
    async updateChecklistTemplate(id: number, data: { nameAr?: string; isActive?: boolean }) {
        return this.request<ChecklistTemplateItem>(`/api/lookups/checklist-templates/${id}`, { method: 'PUT', body: data });
    }
    async deleteChecklistTemplate(id: number) {
        return this.request<void>(`/api/lookups/checklist-templates/${id}`, { method: 'DELETE' });
    }

    // ========== Roles & Permissions ==========
    async getRolesLookup() {
        return this.request<string[]>('/api/lookups/roles');
    }
    async getPermissionsLookup() {
        return this.request<string[]>('/api/lookups/permissions');
    }

    async getPermissionMatrix() {
        return this.request<RolePermissionMatrix>('/api/permissions/matrix');
    }

    async updateRolePermissions(roleId: number, permissions: string[]) {
        return this.request<void>('/api/permissions/update', {
            method: 'POST',
            body: { roleId, permissions }
        });
    }

    // ========== Audit Logs ==========
    async getAuditLogs(params?: {
        page?: number;
        pageSize?: number;
        action?: string;
        entityName?: string;
        userId?: number;
        search?: string;
    }) {
        const query = new URLSearchParams();
        if (params?.page) query.set('page', params.page.toString());
        if (params?.pageSize) query.set('pageSize', params.pageSize.toString());
        if (params?.action) query.set('action', params.action);
        if (params?.entityName) query.set('entityName', params.entityName);
        if (params?.userId) query.set('userId', params.userId.toString());
        if (params?.search) query.set('search', params.search);
        const qs = query.toString();
        return this.request<AuditLogResponse>(`/api/auditlog${qs ? '?' + qs : ''}`);
    }

    async getAuditActions() {
        return this.request<string[]>('/api/auditlog/actions');
    }

    async getAuditEntities() {
        return this.request<string[]>('/api/auditlog/entities');
    }

    // ========== System Settings ==========
    async getSettings() {
        return this.request<SystemSetting[]>('/api/settings');
    }

    async updateSetting(key: string, value: string) {
        return this.request<void>(`/api/settings/${key}`, {
            method: 'PUT',
            body: { value }
        });
    }

    async getProfile() {
        return this.request<UserDto>('/api/auth/profile');
    }

    // ========== Business Purposes ==========
    async searchBusinessPurposes(q: string, page = 1, pageSize = 20) {
        return this.request<BusinessPurposeSearchResponse>(
            `/api/BusinessPurposes/search?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`
        );
    }

    // ========== Notifications ==========
    async getNotifications() {
        return this.request<NotificationItem[]>('/api/notifications');
    }

    async markNotificationRead(id: number) {
        return this.request<void>('/api/notifications/mark-read', {
            method: 'POST',
            body: { notificationId: id }
        });
    }

    async markAllNotificationsRead() {
        return this.request<void>('/api/notifications/mark-all-read', {
            method: 'POST'
        });
    }

    async clearAllNotifications() {
        return this.request<void>('/api/notifications/clear-all', {
            method: 'DELETE'
        });
    }
}

// ========== Types ==========

export interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: 'new' | 'success' | 'info' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
    requestId?: number;
}

export interface UserDto {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    provinceId: number | null;
    roles: string[];
    permissions: string[];
}

export interface SystemSetting {
    id: number;
    key: string;
    value: string;
    description: string;
    group: string;
}

export interface LoginResponse {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    provinceId: number | null;
    token: string;
    roles: string[];
    permissions: string[];
}

export interface RegisterData {
    userName: string;
    email: string;
    fullName: string;
    password: string;
    provinceId?: number;
    role: string;
}

export interface DashboardStats {
    totalRequests: number;
    newRequests: number;
    inReview: number;
    awaitingIp: number;
    ipResponded: number;
    accepted: number;
    rejected: number;
    activeUsers: number;
    totalProvinces: number;
    recentRequests: RecentRequest[];
    provinceBreakdown: ProvinceStat[];
}

export interface RecentRequest {
    id: number;
    companyName: string;
    companyTypeName?: string | null;
    provinceName: string;
    statusName: string;
    statusColor: string | null;
    createdAt: string;
}

export interface ProvinceStat {
    provinceId: number;
    provinceName: string;
    requestCount: number;
}

export interface BusinessPurposeDto {
    id: number;
    activityCode: string;
    activityName: string;
    isic4Code: string;
    authorityName: string | null;
    approvalRequirement: string | null;
    minimumCapital: number | null;
    complement: string | null;
}

export interface RequestDto {
    id: number;
    companyName: string;
    nameEn: string;
    companyTypeId: number;
    companyTypeName: string;
    provinceId: number;
    provinceName: string;
    statusId: number;
    statusName: string;
    statusColor: string;
    auditorFeedback?: string;
    ipVerdict?: string;
    lockedById?: number;
    lockedByName?: string;
    lockedAt?: string;
    mainPdfPath?: string;
    createdAt: string;
    submissionDate: string;
    updatedAt: string;
    ipExpertId?: number;
    ipExpertUserName?: string;
    ipExpertFeedback?: string;
    ipReportPath?: string;

    // Registry details
    registryNumber?: string;
    registryDate?: string;
    reservationExpiryDate?: string;

    // Invoice details
    invoiceId?: number;
    invoiceNum?: string;
    isPaid?: boolean;
    receiptNum?: string;
    receiptPath?: string;

    selectedPurposes: BusinessPurposeDto[];
    checklistItems: RequestChecklistItemDto[];
    history: RequestActionDto[];
}

export interface NameValidationRequest {
    nameAr: string;
    nameEn: string;
    companyTypeId: number;
}

export interface NameValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    goldenAdvice: string;
    similarExistingNames: {
        requestId: number;
        name: string;
        similarityScore: number;
    }[];
}

export interface RequestActionDto {
    userId: number;
    userName?: string;
    role?: string;
    actionType: string;
    note?: string;
    isInternal: boolean;
    createdAt: string;
}

export interface RequestChecklistItemDto {
    templateId: number;
    templateName?: string;
    isProvided: boolean;
}

export interface CreateRequestData {
    companyName: string;
    nameEn?: string;
    companyTypeId: number;
    provinceId: number;
    mainPdfPath?: string;
    isPaid?: boolean;
    selectedPurposes: { purposeId: number; complement?: string }[];
    checklistItems: { templateId: number; isProvided: boolean }[];
}

export interface BusinessPurposeSearchResponse {
    items: BusinessPurposeDto[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface UpdateStatusData {
    statusId: number;
    comment?: string;
    auditorFeedback?: string;
    ipVerdict?: string;
}

export interface UserListItem {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    provinceId: number | null;
    provinceName: string | null;
    isActive: boolean;
    createdAt: string;
    roles: string[];
}

export interface UpdateUserData {
    fullName?: string;
    email?: string;
    isActive?: boolean;
    role?: string;
    provinceId?: number;
}

export interface LookupItem {
    id: number;
    nameAr: string;
    isActive: boolean;
}

export interface StatusItem {
    id: number;
    nameAr: string;
    colorCode: string;
    isActive: boolean;
}

export interface ChecklistTemplateItem {
    id: number;
    nameAr: string;
    isMandatory: boolean;
    isActive: boolean;
}

export interface ProvinceFeeRuleDto {
    id: number;
    provinceId: number;
    feeName: string;
    amount: number;
    isActive: boolean;
}

export interface ProvinceFeeRuleCreateDto {
    provinceId: number;
    feeName: string;
    amount: number;
}

export interface ProvinceFeeRuleUpdateDto {
    feeName?: string;
    amount?: number;
    isActive?: boolean;
}

export interface AuditLogEntry {
    id: number;
    action: string;
    entityName: string;
    entityId: string | null;
    oldValues: string | null;
    newValues: string | null;
    ipAddress: string | null;
    createdAt: string;
    userName: string;
    userRole: string;
}

export interface AuditLogResponse {
    data: AuditLogEntry[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface NameCheckResult {
    isAvailable: boolean;
    count: number;
    matches: {
        id: number;
        companyName: string;
        statusId: number;
        statusName: string;
        provinceName: string;
        createdAt: string;
    }[];
}

export interface RolePermissionMatrix {
    roles: RolePermissionData[];
    allPermissions: string[];
}

export interface RolePermissionData {
    id: number;
    name: string;
    permissions: string[];
    isSmartRole: boolean;
}

// Singleton instance
const api = new ApiService(API_BASE_URL.replace(/\/+$/, ''));
export default api;
