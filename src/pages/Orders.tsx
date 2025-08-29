import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Search, 
  Filter,
  Eye,
  Download,
  RefreshCw,
  Star,
  Shirt
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { db } from "@/lib/database";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";

interface Order {
  id: string;
  date: string;
  status: "awaiting-payment" | "paid" | "printing" | "shipped" | "delivered";
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }[];
  tracking?: string;
  estimatedDelivery?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
}

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 75000,
    items: [
      {
        id: "1",
        name: "Confused Cat WiFi Meme Tee",
        image: "/api/placeholder/100/100",
        quantity: 2,
        price: 25000,
        size: "L",
        color: "White"
      },
      {
        id: "2",
        name: "Drake Tech Choices Meme Tee",
        image: "/api/placeholder/100/100",
        quantity: 1,
        price: 25000,
        size: "M",
        color: "Gray"
      }
    ],
    tracking: "TZ123456789",
    estimatedDelivery: "Delivered",
    shippingAddress: {
      name: "John Doe",
      address: "123 Uhuru Street",
      city: "Dar es Salaam",
      country: "Tanzania"
    }
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 28000,
    items: [
      {
        id: "3",
        name: "SpongeBob Deadline Panic Tee",
        image: "/api/placeholder/100/100",
        quantity: 1,
        price: 28000,
        size: "XL",
        color: "Yellow"
      }
    ],
    tracking: "TZ987654321",
    estimatedDelivery: "Jan 25, 2024",
    shippingAddress: {
      name: "Jane Smith",
      address: "456 Kenyatta Avenue",
      city: "Nairobi",
      country: "Kenya"
    }
