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
  Eye,
  Download,
  RefreshCw,
  Shirt,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";
import { db } from "@/lib/database";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { products } from "@/data/products";

interface Order {
  id: string;
  date: string;
  status: "awaiting-payment" | "paid" | "printing" | "shipped" | "delivered";
  total: number;
  items: {
    id: string;
    product_id?: string;
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
    id: "ORD-2025-001",
    date: "2025-11-15",
    status: "delivered",
    total: 75000,
    items: [
      {
        id: "1",
        product_id: "1",
        name: "Confused Cat WiFi Meme Tee",
        image: products[0]?.image || "/placeholder.svg",
        quantity: 2,
        price: 25000,
        size: "L",
        color: "White",
      },
      {
        id: "2",
        product_id: "4",
        name: "Drake Tech Choices Meme Tee",
        image: products[3]?.image || "/placeholder.svg",
        quantity: 1,
        price: 25000,
        size: "M",
        color: "Gray",
      },
    ],
    tracking: "TZ123456789",
    estimatedDelivery: "Delivered",
    shippingAddress: {
      name: "Demo User",
      address: "123 Uhuru Street",
      city: "Dar es Salaam",
      country: "Tanzania",
    },
  },
  {
    id: "ORD-2025-002",
    date: "2025-12-02",
    status: "shipped",
    total: 28000,
    items: [
      {
        id: "3",
        product_id: "3",
        name: "SpongeBob Deadline Panic Tee",
        image: products[2]?.image || "/placeholder.svg",
        quantity: 1,
        price: 28000,
        size: "XL",
        color: "Yellow",
      },
    ],
    tracking: "TZ987654321",
    estimatedDelivery: "In Transit — Dar Express",
    shippingAddress: {
      name: "Demo User",
      address: "456 Kenyatta Drive",
      city: "Dar es Salaam",
      country: "Tanzania",
    },
  },
];

const statusConfig = {
  "awaiting-payment": {
    label: "Awaiting Payment",
    color: "bg-warning",
    icon: Clock,
    description: "Complete your payment to process this order",
  },
  paid: {
    label: "Payment Confirmed",
    color: "bg-success",
    icon: CheckCircle,
    description: "Payment received, preparing for DTG printing",
  },
  printing: {
    label: "Printing",
    color: "bg-primary",
    icon: Package,
    description: "Your design is being printed on premium East African cotton",
  },
  shipped: {
    label: "Shipped",
    color: "bg-accent",
    icon: Truck,
    description: "Package is on its way to you",
  },
  delivered: {
    label: "Delivered",
    color: "bg-success",
    icon: CheckCircle,
    description: "Order successfully delivered",
  },
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const ownerId = user?.id || "guest";
        const userOrders = await db.getOrdersForUser(ownerId);
        setOrders(userOrders && userOrders.length > 0 ? userOrders : mockOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders(mockOrders);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      "awaiting-payment": 0,
      paid: 0,
      printing: 0,
      shipped: 0,
      delivered: 0,
    };

    orders.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const reorder = async (order: Order) => {
    for (const item of order.items) {
      await addItem(
        item.product_id || item.id,
        item.quantity,
        item.price,
        item.name,
        item.size,
        item.color,
        item.image
      );
    }
    toast({
      title: "Items Added to Cart",
      description: `Added ${order.items.length} item(s) from ${order.id} to your cart.`,
    });
    navigate("/cart");
  };

  const downloadInvoice = (order: Order) => {
    const lines = [
      `============================================`,
      `        CHICKER MEME APPAREL INVOICE        `,
      `============================================`,
      `Order ID:   ${order.id}`,
      `Date:       ${order.date}`,
      `Status:     ${order.status.toUpperCase()}`,
      `Customer:   ${order.shippingAddress.name}`,
      `Address:    ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`,
      `--------------------------------------------`,
      `ITEMS:`,
      ...order.items.map(
        (i) =>
          `- ${i.quantity}x ${i.name} (${i.size}, ${i.color}) @ TZS ${i.price.toLocaleString()} = TZS ${(
            i.price * i.quantity
          ).toLocaleString()}`
      ),
      `--------------------------------------------`,
      `TOTAL:      TZS ${order.total.toLocaleString()}`,
      `============================================`,
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Invoice Downloaded",
      description: `Saved Invoice-${order.id}.txt`,
    });
  };

  const trackOrder = (tracking: string) => {
    toast({
      title: `Tracking #${tracking}`,
      description: "Courier Status: Dispatched from Dar es Salaam Print Hub.",
    });
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
                Track your meme t-shirt orders and download invoices
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="secondary" className="text-xs">
                {statusCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="paid" className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3" />
              Confirmed
              <Badge variant="secondary" className="text-xs">
                {statusCounts.paid}
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
                  const statusInfo = statusConfig[order.status] || statusConfig.paid;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <Card
                      key={order.id}
                      className="glass-card hover:shadow-macos transition-all duration-300"
                    >
                      <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <CardTitle className="text-lg">{order.id}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                Ordered on {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>

                            <Badge
                              className={`${statusInfo.color} text-white flex items-center gap-1`}
                            >
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
                              onClick={() =>
                                setSelectedOrder(
                                  selectedOrder?.id === order.id ? null : order
                                )
                              }
                              className="glass border-glass-border"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {selectedOrder?.id === order.id ? "Hide" : "Details"}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {selectedOrder?.id === order.id && (
                        <CardContent className="space-y-6">
                          {/* Status Timeline */}
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
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
                                  Tracking: {order.tracking}
                                </span>
                              </div>
                            )}

                            {order.estimatedDelivery && (
                              <p className="text-sm text-muted-foreground mt-2">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                Estimated delivery: {order.estimatedDelivery}
                              </p>
                            )}
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-semibold mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-4 p-3 glass rounded-lg"
                                >
                                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                    {item.image &&
                                    !item.image.startsWith("/api/placeholder") ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Shirt className="h-6 w-6 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium">{item.name}</h5>
                                    <p className="text-sm text-muted-foreground">
                                      Size: {item.size} | Color: {item.color} | Qty:{" "}
                                      {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      TZS {(item.price * item.quantity).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      TZS {item.price.toLocaleString()} each
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-semibold mb-3">Shipping Address</h4>
                            <div className="p-3 glass rounded-lg">
                              <p className="font-medium">{order.shippingAddress.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.shippingAddress.address}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.country}
                              </p>
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                            <Button
                              variant="outline"
                              onClick={() => reorder(order)}
                              className="glass border-glass-border"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reorder Items
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => downloadInvoice(order)}
                              className="glass border-glass-border"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "You haven't placed any orders yet"}
                </p>
                <Button onClick={() => navigate("/discover")}>Start Shopping</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;