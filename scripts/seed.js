const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    name: "Traditional Madhubani Painting",
    description: "Hand-painted Madhubani artwork depicting scenes from Indian mythology. Created using natural dyes on handmade paper by master artisans from Mithila region.",
    price: 2499,
    originalPrice: 3500,
    images: [],
    state: "Bihar",
    craftCategory: "Madhubani Painting",
    artisanId: "demo_artisan_1",
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
    artisanId: "demo_artisan_2",
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
    artisanId: "demo_artisan_3",
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
    artisanId: "demo_artisan_4",
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
    artisanId: "demo_artisan_5",
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
    artisanId: "demo_artisan_6",
    artisanName: "Raghurajpur Artists",
    stock: 4,
    customEnabled: true,
    rating: 4.9,
    reviewCount: 10,
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  const productsCol = collection(db, "products");
  for (const product of sampleProducts) {
    await addDoc(productsCol, product);
    console.log(`Added: ${product.name}`);
  }
  console.log("Seeding complete!");
}

seed().catch(console.error);
