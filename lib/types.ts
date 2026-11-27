export interface VendorSummary {
  id: string;
  name: string;
  image: string | null;
  businessName: string | null;
  isPremium: boolean;
}

export interface Service {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vendor: VendorSummary | null;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ServiceDetailsResponse {
  service: Service;
  bookable: boolean;
}

// A service as returned to its own vendor (no vendor info attached).
export type MyService = Omit<Service, "vendor">;

export interface VendorStats {
  totalServices: number;
  activeServices: number;
  pendingBookings: number;
  acceptedBookings: number;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt: string | null;
}

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface ServiceSummary {
  id: string;
  serviceName: string;
  category: string;
  price: number;
  location: string;
  image: string | null;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface Booking {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  service: ServiceSummary | null;
  vendor: VendorSummary | null;
  customer: CustomerSummary | null; // only filled for the vendor
}

export interface BookingsResponse {
  bookings: Booking[];
  pagination: Pagination;
}

export interface CustomerStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
}

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  approvedServices: number;
  rejectedServices: number;
  totalTransactions: number;
  revenueCents: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "admin" | "vendor" | "customer";
  isBlocked: boolean;
  businessName: string | null;
  subscriptionPlan: string;
  subscriptionExpiresAt: string | null;
  createdAt: string | null;
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export interface AdminUserDetailsResponse {
  user: AdminUser;
  stats: { services: number; bookings: number };
}

export interface AdminServicesResponse {
  services: Service[];
  pagination: Pagination;
}

export interface Transaction {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId: string | null;
  status: "pending" | "paid" | "failed" | "cancelled";
  createdAt: string;
  vendor: VendorSummary | null;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: Pagination;
}