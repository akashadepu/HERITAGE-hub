export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "customer" | "artisan" | "admin";
  phone?: string;
  address?: Address;
  createdAt: string;
}

export interface ArtisanProfile extends UserProfile {
  role: "artisan";
  location: string;
  state: string;
  bio: string;
  craftSpecialty: string;
  rating: number;
  totalOrders: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  state: string;
  craftCategory: string;
  artisanId: string;
  artisanName: string;
  stock: number;
  customEnabled: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  artisanIds: string[];
  totalAmount: number;
  shippingAddress: Address;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "online";
  paymentStatus: "pending" | "paid";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  artisanId: string;
}

export interface CustomizationRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  artisanId: string;
  productId: string;
  productName: string;
  productImage: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  responseMessage?: string;
  proposedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const CRAFT_CATEGORIES = [
  "Madhubani Painting", "Bandhani Textile", "Dhokra Metal Craft",
  "Channapatna Toys", "Pattachitra", "Warli Painting", "Blue Pottery",
  "Wood Carving", "Brassware", "Handloom Weaving", "Terracotta",
  "Embroidery", "Bamboo Craft", "Leather Craft", "Jewelry"
];
