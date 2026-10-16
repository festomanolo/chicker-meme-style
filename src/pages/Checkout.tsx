import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  MapPin,
  Shield,
  ArrowLeft,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+255 ",
    address: "",
    city: "Dar es Salaam",
    country: "Tanzania",
  });

  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const subtotal = getTotal();
  const shipping = subtotal > 50000 ? 0 : 5000;
  const total = subtotal + shipping;

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const processOrder = async () => {
    if (!shippingInfo.name.trim() || !shippingInfo.address.trim()) {
      toast({
        title: "Missing Shipping Details",
        description: "Please enter your full name and delivery address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const ownerId = user?.id || "guest";
      const orderId = await db.createOrder(ownerId, items, total, shippingInfo);
      setPlacedOrderId(orderId);
      await clearCart();
      setOrderComplete(true);
      toast({
        title: "Order Confirmed!",
        description: `Order ${orderId} has been placed.`,
      });
    } catch (error) {
      console.error("Order processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto glass-card">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
            {placedOrderId && (
              <Badge variant="secondary" className="mb-3">
                Order Reference: {placedOrderId}
              </Badge>
            )}
            <p className="text-muted-foreground mb-6">
              Thank you, {shippingInfo.name}! Your meme apparel is queued for printing in Dar es Salaam.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/orders")} className="w-full">
                Track My Orders
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Cart is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some meme tees or custom designs before checking out.
            </p>
            <Button onClick={() => navigate("/discover")} className="w-full">
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-card border-b border-card-border px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">Complete your order</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Asha Mwinyi"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="asha@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (M-Pesa / Delivery)</Label>
                  <Input
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+255 712 345 678"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Street Address / Landmark</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="e.g. Haile Selassie Rd, Masaki"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="mpesa"
                      name="payment"
                      value="mpesa"
                      checked={paymentMethod === "mpesa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer">
                      Vodacom M-Pesa / Tigo Pesa / Airtel Money
                      <Badge variant="secondary">Instant</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="card" className="cursor-pointer">
                      Credit / Debit Card (Visa / Mastercard)
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium">{item.quantity}x</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} • Size: {item.size} • {item.color}
                          </p>
                        </div>
                        <span className="font-medium text-sm">
                          TZS {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>TZS {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          `TZS ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>TZS {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button onClick={processOrder} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Place Order (TZS {total.toLocaleString()})
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const summary = items
                        .map((i) => `${i.quantity}x ${i.name} (${i.size}, ${i.color})`)
                        .join(", ");
                      const msg = encodeURIComponent(
                        `Hi Chicker! I'd like to confirm my order: ${summary} — Total TZS ${total.toLocaleString()}.`
                      );
                      window.open(`https://wa.me/255123456789?text=${msg}`, "_blank");
                    }}
                    className="w-full text-xs gap-1.5"
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    Order via WhatsApp Instead
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;