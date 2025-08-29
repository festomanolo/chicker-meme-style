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
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  const reorder = (orderId: string) => {
    console.log("Reordering:", orderId);
    alert("Items added to cart!");
  };

  const downloadInvoice = (orderId: string) => {
    console.log("Downloading invoice for:", orderId);
    alert("Invoice downloaded!");
  };

  const trackOrder = (tracking: string) => {
    console.log("Tracking:", tracking);
    alert(`Tracking order: ${tracking}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-card border-b border-card-border px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-headline text-3xl font-bold text-foreground mb-2">
                My Orders
              </h1>
              <p className="text-muted-foreground">
                Track your meme t-shirt orders and view order history
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-input-border w-64"
                />
              </div>
              <Button variant="outline" className="glass border-glass-border">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Order Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="secondary" className="text-xs">
                {statusCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="awaiting-payment" className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Pending
              <Badge variant="secondary" className="text-xs">
                {statusCounts["awaiting-payment"]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="printing" className="flex items-center gap-2">
              <Package className="h-3 w-3" />
              Printing
              <Badge variant="secondary" className="text-xs">
                {statusCounts.printing}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="shipped" className="flex items-center gap-2">
              <Truck className="h-3 w-3" />
              Shipped
              <Badge variant="secondary" className="text-xs">
                {statusCounts.shipped}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="delivered" className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3" />
              Delivered
              <Badge variant="secondary" className="text-xs">
                {statusCounts.delivered}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {isLoading ? (
              <Loading className="py-16" size="lg" />
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status];
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <Card key={order.id} className="glass-card hover:shadow-macos transition-all duration-300">
                      <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <CardTitle className="text-lg">{order.id}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                Ordered on {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <Badge className={`${statusInfo.color} text-white flex items-center gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">
                              TZS {order.total.toLocaleString()}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                              className="glass border-glass-border"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {selectedOrder?.id === order.id ? "Hide" : "View"}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {selectedOrder?.id === order.id && (
                        <CardContent className="space-y-6">
                          {/* Status Timeline */}
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <StatusIcon className="h-5 w-5" />
                              Order Status
                            </h4>
                            <p className="text-muted-foreground mb-4">
                              {statusInfo.description}
                            </p>
                            
                            {order.tracking && (
                              <div className="flex flex-col sm:flex-row gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => trackOrder(order.tracking!)}
                                  className="glass border-glass-border"
                                >
                                  Track Package
                                </Button>
                                <span className="text-sm text-muted-foreground self-center">
