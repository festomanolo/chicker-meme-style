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
  description: string;
  sizes: string[];
  colors: string[];
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
    description: "When you open your phone and forget what you were going to do - the eternal struggle captured in a perfect meme tee!",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"]
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
    description: "Me explaining to my mom how WiFi works - every tech person's nightmare scenario made into wearable art!",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Charcoal"]
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
    description: "When the deadline is tomorrow but you haven't started - SpongeBob captures that panic perfectly!",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Yellow", "White", "Black", "Blue"]
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
    description: "Drake pointing at tech choices - rejecting the old way, approving the new. A perfect developer meme!",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "White", "Heather"]
  }
];

export const featuredProducts = products.filter(p => p.isTrending || p.isNew);
export const newProducts = products.filter(p => p.isNew);
export const trendingProducts = products.filter(p => p.isTrending);