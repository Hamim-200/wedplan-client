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