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
    // Navigate to checkout page (you can create this later)
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-card border-b border-card-border px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-headline text-3xl font-bold text-foreground">
                Shopping Cart
              </h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <Loading className="py-16" size="lg" />
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cart Items</span>
                    <Badge variant="secondary">{items.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = "/api/placeholder/100/100";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg leading-tight">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>Size: {item.size}</span>
                                <span>Color: {item.color}</span>
                              </div>
                              {!item.inStock && (
                                <Badge variant="destructive" className="mt-2">
                                  Out of Stock
                                </Badge>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">
                                  TZS {item.price.toLocaleString()}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    TZS {item.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                TZS {(item.price * item.quantity).toLocaleString()} total
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

