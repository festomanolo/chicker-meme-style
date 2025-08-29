import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  ArrowRight, 
  CreditCard,
  Truck,
  Shield,
  Tag
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  inStock: boolean;
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Confused Cat WiFi Meme Tee",
    price: 25000,
    originalPrice: 35000,
    image: "/api/placeholder/100/100",
    quantity: 2,
    size: "L",
    color: "White",
    inStock: true
  },
  {
    id: "2",
    name: "Drake Tech Choices Meme Tee",
    price: 26000,
    image: "/api/placeholder/100/100",
    quantity: 1,
    size: "M",
    color: "Gray",
    inStock: true
  },
  {
    id: "3",
    name: "SpongeBob Deadline Panic Tee",
    price: 28000,
    image: "/api/placeholder/100/100",
    quantity: 1,
    size: "XL",
    color: "Yellow",
    inStock: false
  }
];

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotal, isLoading } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(id);
      return;
    }
    await updateQuantity(id, Math.max(1, newQuantity));
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
  };

  const moveToWishlist = async (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      console.log("Moving to wishlist:", item.name);
      await removeItem(id);
      // Here you would add to wishlist API call
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "MEME20") {
      setAppliedPromo("MEME20");
      setPromoCode("");
      console.log("Promo code applied:", promoCode);
    } else {
      alert("Invalid promo code");
    }
  };

  const subtotal = getTotal();
  const discount = appliedPromo === "MEME20" ? subtotal * 0.2 : 0;
  const shipping = subtotal > 50000 ? 0 : 5000; // Free shipping over TZS 50,000
  const total = subtotal - discount + shipping;

  const proceedToCheckout = () => {
    console.log("Proceeding to checkout with items:", items);
