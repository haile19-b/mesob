export type Role = 'USER' | 'AGENT' | 'VENDOR' | 'ADMIN';
export type OrderType = 'DELIVERY' | 'DINE_IN';
export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED_BY_AGENT'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';
export type AgentStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface User {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  phone?: string | null;
  isApproved?: boolean;
}

export interface Meal {
  id: string;
  name: string;
  imageUrl?: string | null;
  description?: string;
  price: number;
  isDeliveryAvailable?: boolean;
  isFreeDelivery?: boolean;
  vendorId: string;
}

export interface Agent {
  id: string;
  userId: string;
  isApproved: boolean;
  status: AgentStatus;
  accountNumber?: string;
  workingHours?: Array<{ start: string; end: string }>;
  user?: Pick<User, 'name' | 'phone'>;
}

export interface OrderItem {
  id?: string;
  mealId: string;
  quantity: number;
  price?: number;
  meal?: Meal;
}

export interface Order {
  id: string;
  orderType: OrderType;
  status: OrderStatus;
  userId: string;
  vendorId: string;
  agentId?: string | null;
  createdAt: string;
  acceptedAt?: string | null;
  vendor?: Vendor;
  orderItems?: OrderItem[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
