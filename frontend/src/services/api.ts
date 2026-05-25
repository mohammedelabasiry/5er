// ============================================================
// Charity Governance Platform — API Service Layer
// ============================================================

import axios from 'axios';
import type {
  Token,
  User,
  RegisterRequest,
  BeneficiaryProfile,
  BeneficiaryPublicView,
  BeneficiaryCreateRequest,
  AdminApproveRequest,
  Donation,
  DonationCreateRequest,
  ChatThread,
  ChatMessage,
  SendMessageRequest,
  DashboardStats,
  Entitlement,
} from '@/types';

// ─── Axios Instance ──────────────────────────────────────────

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<User>('/api/v1/auth/register', data).then((r) => r.data),

  login: (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    return api
      .post<Token>('/api/v1/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((r) => r.data);
  },

  getMe: () => api.get<User>('/api/v1/auth/me').then((r) => r.data),
};

// ─── Beneficiaries ───────────────────────────────────────────

export const beneficiaryApi = {
  getPublicList: (params?: { category?: string; search?: string; skip?: number; limit?: number }) =>
    api.get<BeneficiaryPublicView[]>('/api/v1/beneficiaries/public', { params }).then((r) => r.data),

  getPublicDetail: (code: string) =>
    api.get<BeneficiaryPublicView>(`/api/v1/beneficiaries/public/${code}`).then((r) => r.data),

  createProfile: (data: BeneficiaryCreateRequest) =>
    api.post<BeneficiaryProfile>('/api/v1/beneficiaries/profile', data).then((r) => r.data),

  updateProfile: (data: BeneficiaryCreateRequest) =>
    api.put<BeneficiaryProfile>('/api/v1/beneficiaries/profile', data).then((r) => r.data),

  getOwnProfile: () =>
    api.get<BeneficiaryProfile>('/api/v1/beneficiaries/profile').then((r) => r.data),

  // Admin endpoints
  adminList: (params?: { status?: string; skip?: number; limit?: number }) =>
    api.get<BeneficiaryProfile[]>('/api/v1/beneficiaries/admin/list', { params }).then((r) => r.data),

  adminApprove: (id: number, data: AdminApproveRequest) =>
    api.post<BeneficiaryProfile>(`/api/v1/beneficiaries/admin/${id}/approve`, data).then((r) => r.data),

  adminReject: (id: number, reason: string) =>
    api.post<BeneficiaryProfile>(`/api/v1/beneficiaries/admin/${id}/reject`, { reason }).then((r) => r.data),

  adminBlock: (id: number) =>
    api.post<BeneficiaryProfile>(`/api/v1/beneficiaries/admin/${id}/block`).then((r) => r.data),
};

// ─── Donations ───────────────────────────────────────────────

export const donationApi = {
  createPledge: (data: DonationCreateRequest) =>
    api.post<Donation>('/api/v1/donations/pledge', data).then((r) => r.data),

  confirmDonation: (id: number) =>
    api.post<Donation>(`/api/v1/donations/${id}/confirm`).then((r) => r.data),

  getMyDonations: (params?: { skip?: number; limit?: number }) =>
    api.get<Donation[]>('/api/v1/donations/my', { params }).then((r) => r.data),
};

// ─── Chat ────────────────────────────────────────────────────

export const chatApi = {
  getThreads: () =>
    api.get<ChatThread[]>('/api/v1/chat/threads').then((r) => r.data),

  getMessages: (threadId: number) =>
    api.get<ChatMessage[]>(`/api/v1/chat/threads/${threadId}/messages`).then((r) => r.data),

  sendMessage: (threadId: number, data: SendMessageRequest) =>
    api.post<ChatMessage>(`/api/v1/chat/threads/${threadId}/messages`, data).then((r) => r.data),
};

// ─── Admin ───────────────────────────────────────────────────

export const adminApi = {
  getDashboard: () =>
    api.get<DashboardStats>('/api/v1/admin/dashboard').then((r) => r.data),

  getUsers: (params?: { role?: string; status?: string; search?: string; skip?: number; limit?: number }) =>
    api.get<User[]>('/api/v1/admin/users', { params }).then((r) => r.data),

  blockUser: (id: number) =>
    api.post<User>(`/api/v1/admin/users/${id}/block`).then((r) => r.data),

  unblockUser: (id: number) =>
    api.post<User>(`/api/v1/admin/users/${id}/unblock`).then((r) => r.data),
};

// ─── Entitlements ────────────────────────────────────────────

export const entitlementApi = {
  getCurrent: () =>
    api.get<Entitlement>('/api/v1/entitlements/current').then((r) => r.data),

  adminList: (params?: { month?: string; skip?: number; limit?: number }) =>
    api.get<Entitlement[]>('/api/v1/entitlements/admin/list', { params }).then((r) => r.data),
};

export default api;
