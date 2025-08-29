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
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "printing",
    total: 50000,
    items: [
      {
        id: "4",
        name: "Custom Design Tee",
        image: "/api/placeholder/100/100",
        quantity: 2,
        price: 25000,
        size: "L",
        color: "Black"
      }
    ],
    estimatedDelivery: "Jan 28, 2024",
    shippingAddress: {
      name: "Alex Johnson",
      address: "789 Independence Ave",
      city: "Kampala",
      country: "Uganda"
    }
  }
];

const statusConfig = {
  "awaiting-payment": {
    label: "Awaiting Payment",
    color: "bg-warning",
    icon: Clock,
    description: "Complete your payment to process this order"
  },
  "paid": {
    label: "Payment Confirmed",
    color: "bg-success", 
    icon: CheckCircle,
    description: "Payment received, preparing for printing"
  },
  "printing": {
    label: "Printing",
    color: "bg-primary",
    icon: Package,
    description: "Your design is being printed on premium fabric"
  },
  "shipped": {
    label: "Shipped",
    color: "bg-accent",
    icon: Truck,
    description: "Package is on its way to you"
  },
  "delivered": {
    label: "Delivered",
    color: "bg-success",
    icon: CheckCircle,
    description: "Order successfully delivered"
  }
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userOrders = await db.getOrdersForUser(user.id);
        setOrders(userOrders || mockOrders); // Fallback to mock data for now
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders(mockOrders); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      "awaiting-payment": 0,
      paid: 0,
      printing: 0,
      shipped: 0,
      delivered: 0
    };
    
    orders.forEach(order => {
      counts[order.status]++;
    });
