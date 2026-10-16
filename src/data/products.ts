// Import the generated meme t-shirt images
import memeTshirt1 from "@/assets/meme-tshirt-1.jpg";
import memeTshirt2 from "@/assets/meme-tshirt-2.jpg";
import memeTshirt3 from "@/assets/meme-tshirt-3.jpg";
import memeTshirt4 from "@/assets/meme-tshirt-4.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  isNew?: boolean;
  isTrending?: boolean;
  category: "tees" | "hoodies" | "tanks";
  collection?: "back-to-school" | "holiday" | "summer";
  description: string;
  sizes: string[];
  colors: string[];
  features?: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Confused Cat WiFi Meme Tee",
    price: 25000,
    originalPrice: 35000,
    image: memeTshirt1,
    rating: 4.8,
    reviews: 127,
    isNew: true,
    isTrending: true,
    category: "tees",
    collection: "back-to-school",
    description: "When you open your phone and forget what you were going to do — the eternal struggle captured on ultra-soft 100% combed East African cotton.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"],
    features: [
      "100% Combed Ring-Spun Tanzanian Cotton (200 GSM)",
      "High-definition DTG print that never cracks or peels",
      "Pre-shrunk relaxed unisex streetwear fit",
      "Double-needle stitched sleeves and bottom hem"
    ]
  },
  {
    id: "2",
    name: "Dog Explaining WiFi Tech Tee",
    price: 22000,
    image: memeTshirt2,
    rating: 4.6,
    reviews: 89,
    badge: "Bestseller",
    category: "tees",
    collection: "back-to-school",
    description: "Me explaining to my mom how WiFi works — every tech person's daily scenario turned into wearable street art.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Charcoal"],
    features: [
      "Breathable 190 GSM organic cotton jersey",
      "Eco-friendly water-based pigment inks",
      "Reinforced crew neckline with ribbed collar",
      "Machine washable cold, tumble dry low"
    ]
  },
  {
    id: "3",
    name: "SpongeBob Deadline Panic Tee",
    price: 28000,
    image: memeTshirt3,
    rating: 4.9,
    reviews: 203,
    isTrending: true,
    category: "tees",
    collection: "back-to-school",
    description: "When the deadline is tomorrow at 8 AM and you haven't even opened the brief — SpongeBob captures that energy perfectly!",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Yellow", "White", "Black", "Blue"],
    features: [
      "Vibrant full-spectrum chest graphic",
      "Soft-touch enzyme-washed finish",
      "Tagless printed neck label for zero itch",
      "Designed & printed in Dar es Salaam"
    ]
  },
  {
    id: "4",
    name: "Drake Tech Choices Meme Tee",
    price: 26000,
    originalPrice: 32000,
    image: memeTshirt4,
    rating: 4.7,
    reviews: 156,
    badge: "Staff Pick",
    category: "tees",
    collection: "holiday",
    description: "Drake pointing at tech choices — rejecting manual deployment on Friday, approving automated CI/CD. Essential developer drip.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "White", "Heather"],
    features: [
      "Heavyweight 220 GSM streetwear cut",
      "Fade-resistant reactive dye fabric",
      "Dropped shoulder silhouette",
      "Ethically sourced East African cotton"
    ]
  },
  {
    id: "5",
    name: "This Is Fine Coding Fire Hoodie",
    price: 45000,
    originalPrice: 55000,
    image: memeTshirt3,
    rating: 4.9,
    reviews: 94,
    isNew: true,
    isTrending: true,
    badge: "Cozy Drop",
    category: "hoodies",
    collection: "holiday",
    description: "Production server on fire? Sip your coffee in comfort with our heavyweight brushed-fleece 'This Is Fine' pullover hoodie.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Navy", "Gray"],
    features: [
      "350 GSM heavyweight brushed fleece interior",
      "Double-lined cozy hood with matte metal aglets",
      "Kangaroo front pouch pocket with hidden phone sleeve",
      "Rib-knit cuffs and waistband with spandex recovery"
    ]
  },
  {
    id: "6",
    name: "Bongo Flava Vibes Oversized Hoodie",
    price: 42000,
    image: memeTshirt4,
    rating: 4.8,
    reviews: 71,
    category: "hoodies",
    collection: "holiday",
    description: "Late-night studio & coding sessions call for our ultra-plush Bongo meme hoodie with high-density puff print detailing.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Navy", "Black", "Heather", "White"],
    features: [
      "320 GSM cotton-poly fleece blend",
      "Crack-resistant plastisol & puff print hybrid",
      "Relaxed boxy fit for effortless layering",
      "Pre-washed for zero shrinkage"
    ]
  },
  {
    id: "7",
    name: "Dar Beach Sun & Memes Tank Top",
    price: 19000,
    originalPrice: 24000,
    image: memeTshirt1,
    rating: 4.7,
    reviews: 63,
    isNew: true,
    category: "tanks",
    collection: "summer",
    description: "Built for Coco Beach weekends and gym sessions — featherlight breathable cotton tank featuring our viral cat meme print.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Yellow", "Blue", "Black"],
    features: [
      "160 GSM ultra-breathable combed cotton",
      "Bound neck and armholes for durability",
      "Moisture-wicking soft finish for tropical heat",
      "Athletic relaxed cut"
    ]
  },
  {
    id: "8",
    name: "Hakuna Stress Gym & Chill Tank",
    price: 20000,
    image: memeTshirt2,
    rating: 4.6,
    reviews: 48,
    badge: "Summer Hit",
    category: "tanks",
    collection: "summer",
    description: "Zero stress, maximum airflow. Keep cool in Dar es Salaam heat while repping the funniest tech & street memes.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "White"],
    features: [
      "100% ring-spun cotton jersey",
      "Soft-hand screen print that breathes with the fabric",
      "Curved hem detail",
      "Machine wash cold"
    ]
  }
];

export const featuredProducts = products.filter(p => p.isTrending || p.isNew);
export const newProducts = products.filter(p => p.isNew);
export const trendingProducts = products.filter(p => p.isTrending);