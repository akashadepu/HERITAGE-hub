import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { Product, Order, CustomizationRequest, UserProfile } from "@/types";

const productsCol = collection(db, "products");
const ordersCol = collection(db, "orders");
const customizationsCol = collection(db, "customizationRequests");
const usersCol = collection(db, "users");

export async function getProducts(filters?: { state?: string; category?: string; artisanId?: string }) {
  let q = query(productsCol, orderBy("createdAt", "desc"));
  if (filters?.state) {
    q = query(productsCol, where("state", "==", filters.state), orderBy("createdAt", "desc"));
  }
  if (filters?.category) {
    q = query(productsCol, where("craftCategory", "==", filters.category), orderBy("createdAt", "desc"));
  }
  if (filters?.artisanId) {
    q = query(productsCol, where("artisanId", "==", filters.artisanId), orderBy("createdAt", "desc"));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProduct(id: string) {
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Product;
}

export async function createProduct(data: Omit<Product, "id">) {
  const docRef = await addDoc(productsCol, { ...data, createdAt: new Date().toISOString() });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, data);
}

export async function deleteProduct(id: string) {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}

export async function getUserProfile(uid: string) {
  const docRef = doc(db, "users", uid);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { uid: snapshot.id, ...snapshot.data() } as UserProfile;
}

export async function getOrders(userId?: string, artisanId?: string) {
  let q = query(ordersCol, orderBy("createdAt", "desc"));
  if (userId) {
    q = query(ordersCol, where("customerId", "==", userId), orderBy("createdAt", "desc"));
  }
  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
  if (artisanId) {
    return orders.filter((o) => o.items.some((i) => i.artisanId === artisanId));
  }
  return orders;
}

export async function createOrder(data: Omit<Order, "id">) {
  const artisanIds = [...new Set(data.items.map((i) => i.artisanId))];
  const docRef = await addDoc(ordersCol, { ...data, artisanIds, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return docRef.id;
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const docRef = doc(db, "orders", id);
  await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
}

export async function getCustomizationRequests(filters: { customerId?: string; artisanId?: string }) {
  let q = query(customizationsCol, orderBy("createdAt", "desc"));
  if (filters.customerId) {
    q = query(customizationsCol, where("customerId", "==", filters.customerId), orderBy("createdAt", "desc"));
  }
  if (filters.artisanId) {
    q = query(customizationsCol, where("artisanId", "==", filters.artisanId), orderBy("createdAt", "desc"));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CustomizationRequest));
}

export async function createCustomizationRequest(data: Omit<CustomizationRequest, "id">) {
  const docRef = await addDoc(customizationsCol, { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return docRef.id;
}

export async function updateCustomizationRequest(id: string, data: Partial<CustomizationRequest>) {
  const docRef = doc(db, "customizationRequests", id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
}

export function subscribeToCollection(
  collectionName: string,
  callback: (snapshot: QuerySnapshot<DocumentData>) => void
) {
  const col = collection(db, collectionName);
  const q = query(col, orderBy("createdAt", "desc"));
  return onSnapshot(q, callback);
}

export const SAMPLE_PRODUCTS: Omit<Product, "id">[] = [
  {
    name: "Traditional Madhubani Painting",
    description: "Hand-painted Madhubani artwork depicting scenes from Indian mythology. Created using natural dyes on handmade paper by master artisans from Mithila region.",
    price: 2499,
    originalPrice: 3500,
    images: [],
    state: "Bihar",
    craftCategory: "Madhubani Painting",
    artisanId: "artisan_1",
    artisanName: "Sita Devi",
    stock: 5,
    customEnabled: true,
    rating: 4.8,
    reviewCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Bandhani Silk Dupatta",
    description: "Vibrant Gujarati Bandhani tie-dye silk dupatta with intricate patterns. Each knot tied by hand to create unique designs.",
    price: 1899,
    originalPrice: 2500,
    images: [],
    state: "Gujarat",
    craftCategory: "Bandhani Textile",
    artisanId: "artisan_2",
    artisanName: "Ramesh Patel",
    stock: 8,
    customEnabled: true,
    rating: 4.6,
    reviewCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Brass Dhokra Tribal Figure",
    description: "Lost-wax casting brass sculpture of a tribal musician. Traditional Dhokra art from Bastar region with exquisite detail.",
    price: 3299,
    originalPrice: 4200,
    images: [],
    state: "Chhattisgarh",
    craftCategory: "Dhokra Metal Craft",
    artisanId: "artisan_3",
    artisanName: "Kondagaon Crafts Collective",
    stock: 3,
    customEnabled: true,
    rating: 4.9,
    reviewCount: 15,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Jaipur Blue Pottery Vase",
    description: "Handcrafted quartz pottery vase with traditional Persian-inspired floral motifs. Unique glaze technique from Jaipur.",
    price: 1599,
    originalPrice: 2100,
    images: [],
    state: "Rajasthan",
    craftCategory: "Blue Pottery",
    artisanId: "artisan_4",
    artisanName: "Ajay Kumar",
    stock: 6,
    customEnabled: false,
    rating: 4.5,
    reviewCount: 6,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Channapatna Wooden Elephant",
    description: "Traditional lacquerware wooden toy elephant from Channapatna. Made from sustainable wood with natural vegetable dyes.",
    price: 899,
    originalPrice: 1200,
    images: [],
    state: "Karnataka",
    craftCategory: "Channapatna Toys",
    artisanId: "artisan_5",
    artisanName: "Lakshmi Toys Workshop",
    stock: 12,
    customEnabled: true,
    rating: 4.7,
    reviewCount: 20,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Pattachitra Scroll Painting",
    description: "Traditional Odisha Pattachitra painting on cloth depicting the story of Krishna. Natural mineral colors on treated cloth.",
    price: 4599,
    originalPrice: 6000,
    images: [],
    state: "Odisha",
    craftCategory: "Pattachitra",
    artisanId: "artisan_6",
    artisanName: "Raghurajpur Artists",
    stock: 4,
    customEnabled: true,
    rating: 4.9,
    reviewCount: 10,
    createdAt: new Date().toISOString(),
  },
];
