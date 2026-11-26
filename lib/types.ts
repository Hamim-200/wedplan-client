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