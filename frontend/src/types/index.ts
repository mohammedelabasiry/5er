// ============================================================
// Charity Governance Platform — TypeScript Type Definitions
// ============================================================

// ─── Auth & Users ────────────────────────────────────────────

export type UserRole = 'admin' | 'donor' | 'beneficiary';
export type UserStatus = 'active' | 'blocked';

export interface User {
  id: number;
  email: string;
  phone: string | null;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: 'donor' | 'beneficiary';
}

// ─── Beneficiary ─────────────────────────────────────────────

export type BeneficiaryCategory = 'A' | 'B' | 'C' | 'D';
export type BeneficiaryStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export interface BeneficiaryProfile {
  id: number;
  user_id: number;
  public_code: string;
  alias_name: string;
  national_id_encrypted: string | null;
  category: BeneficiaryCategory | null;
  monthly_entitlement_amount: number | null;
  family_size: number | null;
  children_count: number | null;
  dependents_count: number | null;
  monthly_income: number | null;
  monthly_rent: number | null;
  employment_status: string | null;
  has_medical_needs: boolean;
  has_education_needs: boolean;
  has_housing_needs: boolean;
  area: string | null;
  address_encrypted: string | null;
  latitude: number | null;
  longitude: number | null;
  status: BeneficiaryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface BeneficiaryPublicView {
  public_code: string;
  alias_name: string;
  area: string | null;
  category: BeneficiaryCategory | null;
  monthly_entitlement_amount: number | null;
  received_this_month: number;
  remaining_amount: number;
  family_size: number | null;
  children_count: number | null;
}

export interface BeneficiaryCreateRequest {
  full_name?: string;
  phone?: string;
  national_id?: string;
  family_size?: number;
  children_count?: number;
  dependents_count?: number;
  monthly_income?: number;
  monthly_rent?: number;
  employment_status?: string;
  has_medical_needs?: boolean;
  has_education_needs?: boolean;
  has_housing_needs?: boolean;
  area?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface AdminApproveRequest {
  category: BeneficiaryCategory;
  monthly_entitlement_amount: number;
}

// ─── Donations ───────────────────────────────────────────────

export type DonationStatus = 'pledged' | 'confirmed' | 'cancelled';

export interface Donation {
  id: number;
  donor_id: number;
  beneficiary_id: number;
  amount: number;
  status: DonationStatus;
  message: string | null;
  created_at: string;
  beneficiary_code?: string;
  beneficiary_alias?: string;
}

export interface DonationCreateRequest {
  beneficiary_code: string;
  amount: number;
  message?: string;
}

// ─── Chat ────────────────────────────────────────────────────

export type ThreadStatus = 'active' | 'closed';

export interface ChatThread {
  id: number;
  donor_id: number;
  beneficiary_id: number;
  beneficiary_code?: string;
  beneficiary_alias?: string;
  status: ThreadStatus;
  created_at: string;
  last_message?: string;
  unread_count?: number;
}

export interface ChatMessage {
  id: number;
  thread_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface SendMessageRequest {
  content: string;
}

// ─── Admin Dashboard ─────────────────────────────────────────

export interface DashboardStats {
  total_beneficiaries: number;
  total_donors: number;
  total_donations_this_month: number;
  total_amount_donated: number;
  fully_funded_count: number;
  pending_applications: number;
}

// ─── Entitlements ────────────────────────────────────────────

export interface Entitlement {
  id: number;
  beneficiary_id: number;
  month: string;
  entitled_amount: number;
  received_amount: number;
  remaining_amount: number;
  is_fully_funded: boolean;
}

// ─── API Response Wrappers ───────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface ApiError {
  detail: string;
}
