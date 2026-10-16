import { useState } from "react";
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
  Tag,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const PROMO_CODES: Record<string, number> = {
  MEME20: 0.2,
  BONGO15: 0.15,
  CHICKER10: 0.1,
};

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotal, isLoading } = useCartStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(id);
      return;
    }
    await updateQuantity(id, Math.max(1, newQuantity));
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
    toast({
      title: "Item Removed",
      description: "Removed item from your shopping cart.",
    });
  };

  const moveToWishlist = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      try {
        const raw = localStorage.getItem("likedProducts");
        const likedIds: string[] = raw ? JSON.parse(raw) : [];
        const set = new Set(likedIds);
        set.add(item.product_id);
        localStorage.setItem("likedProducts", JSON.stringify(Array.from(set)));
        window.dispatchEvent(new Event("liked-products-updated"));
      } catch {
        // noop
      }
      await removeItem(id);
      toast({
        title: "Saved to Wishlist",
        description: `${item.name || "Item"} moved to your wishlist.`,
      });
    }
  };

  const applyPromoCode = () => {
    const normalized = promoCode.trim().toUpperCase();
    if (PROMO_CODES[normalized]) {
      setAppliedPromo(normalized);
      setPromoCode("");
      toast({
        title: "Promo Code Applied!",
        description: `Code "${normalized}" gives you ${Math.round(PROMO_CODES[normalized] * 100)}% off.`,
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "Try MEME20 (20% off), BONGO15 (15% off), or CHICKER10 (10% off).",
        variant: "destructive",
      });
    }
  };

  const subtotal = getTotal();
  const discountRate = appliedPromo ? PROMO_CODES[appliedPromo] || 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 5000;
  const total = subtotal - discount + shipping;

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  const resolveImage = (productId: string, itemImage?: string) => {
    if (itemImage && !itemImage.startsWith("/api/placeholder")) return itemImage;
    const found = products.find((p) => p.id === productId);
    return found?.image || "/placeholder.svg";
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
                {items.length} {items.length === 1 ? "item" : "items"} in your cart
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
                  {items.map((item, index) => {
                    const imgSrc = resolveImage(item.product_id, item.image);
                    return (
                      <div key={item.id}>
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
                            <img
                              src={imgSrc}
                              alt={item.name || "Product"}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg leading-tight">
                                  {item.name || `Meme Tee #${item.product_id}`}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span>Size: {item.size || "L"}</span>
                                  <span>Color: {item.color || "White"}</span>
                                </div>
                                {item.customDesign && (
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    Custom Studio ({item.customDesign.view} view)
                                  </Badge>
                                )}
                              </div>

                              <div className="text-right">
                                <div className="flex items-center gap-2 justify-end">
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
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center border border-border rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleUpdateQuantity(item.id, item.quantity - 1)
                                    }
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
                                    onClick={() =>
                                      handleUpdateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveToWishlist(item.id)}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Heart className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {index < items.length - 1 && <Separator className="mt-6" />}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Tag className="h-5 w-5 text-primary" />
                    Promo Code (Try MEME20, BONGO15, or CHICKER10)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <span className="text-success font-medium">
                        Promo code "{appliedPromo}" applied! ({Math.round(discountRate * 100)}% off)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAppliedPromo(null)}
                        className="text-success hover:text-success/80"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code (e.g. MEME20)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={applyPromoCode} variant="outline">
                        Apply
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>TZS {subtotal.toLocaleString()}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-success">
                          <span>Discount ({Math.round(discountRate * 100)}%)</span>
                          <span>-TZS {discount.toLocaleString()}</span>
                        </div>
                      )}

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

                    <Button
                      onClick={proceedToCheckout}
                      className="w-full bg-primary hover:bg-primary-hover"
                      disabled={items.length === 0}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    {shipping > 0 && (
                      <p className="text-sm text-muted-foreground text-center">
                        Add TZS {(50000 - subtotal).toLocaleString()} more for free shipping
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Security & Shipping Info */}
                <Card className="glass-card">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-success" />
                      <span>Secure checkout with 256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>Free shipping on orders over TZS 50,000</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-accent" />
                      <span>M-Pesa, Airtel Money & card payments accepted</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any meme tees or custom designs to your cart yet.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate("/discover")} className="bg-primary hover:bg-primary-hover">
                Browse Memes
              </Button>
              <Button variant="outline" onClick={() => navigate("/customize")}>
                Design Your Own
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;