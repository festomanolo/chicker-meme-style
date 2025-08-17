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
