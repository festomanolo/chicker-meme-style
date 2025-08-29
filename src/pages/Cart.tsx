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
