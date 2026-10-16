import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Palette,
  Plus,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  MessageSquare,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const COLOR_HEX_MAP: Record<string, string> = {
  White: "#FFFFFF",
  Black: "#18181B",
  Gray: "#71717A",
  Navy: "#1E3A8A",
  Yellow: "#FACC15",
  Blue: "#2563EB",
  Charcoal: "#3F3F46",
  Heather: "#A1A1AA",
};

const DEFAULT_REVIEWS: Record<string, ProductReview[]> = {
  "1": [
    {
      id: "r1",
      author: "Baraka M.",
      rating: 5,
      comment: "Super soft cotton and the print quality is sharp even after 5 washes!",
      date: "2025-10-12",
    },
    {
      id: "r2",
      author: "Neema K.",
      rating: 5,
      comment: "Everyone at the office in Masaki asked where I got this WiFi cat tee.",
      date: "2025-11-04",
    },
  ],
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("White");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState(user?.name || "");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes.includes("L") ? "L" : product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQuantity(1);

    try {
      const raw = localStorage.getItem("likedProducts");
      const likedIds: string[] = raw ? JSON.parse(raw) : [];
      setIsLiked(likedIds.includes(product.id));
    } catch {
      setIsLiked(false);
    }

    try {
      const rawReviews = localStorage.getItem(`product_reviews_${product.id}`);
      if (rawReviews) {
        setReviews(JSON.parse(rawReviews));
      } else {
        setReviews(
          DEFAULT_REVIEWS[product.id] || [
            {
              id: "default-1",
              author: "Juma S.",
              rating: 5,
              comment: "Awesome fit and fast delivery within Dar es Salaam!",
              date: "2025-09-19",
            },
          ]
        );
      }
    } catch {
      setReviews([]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The meme apparel item you are looking for does not exist or has been moved.
          </p>
          <Button onClick={() => navigate("/discover")}>Browse All Memes</Button>
        </Card>
      </div>
    );
  }

  const handleToggleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    try {
      const raw = localStorage.getItem("likedProducts");
      const likedIds: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(likedIds);
      if (next) set.add(product.id);
      else set.delete(product.id);
      localStorage.setItem("likedProducts", JSON.stringify(Array.from(set)));
      window.dispatchEvent(new Event("liked-products-updated"));
      toast({
        title: next ? "Added to Wishlist" : "Removed from Wishlist",
        description: product.name,
      });
    } catch {
      // noop
    }
  };

  const handleAddToCart = async (goToCheckout = false) => {
    await addItem(
      product.id,
      quantity,
      product.price,
      product.name,
      selectedSize,
      selectedColor,
      product.image
    );
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} (${selectedSize}, ${selectedColor})`,
    });
    if (goToCheckout) {
      navigate("/cart");
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const review: ProductReview = {
      id: `rev_${Date.now()}`,
      author: newAuthor.trim() || user?.name || "Verified Buyer",
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    setNewComment("");
    try {
      localStorage.setItem(`product_reviews_${product.id}`, JSON.stringify(updated));
    } catch {
      // noop
    }
    toast({
      title: "Review Submitted",
      description: "Thank you for sharing your feedback!",
    });
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isTrending))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Back Breadcrumb */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Button>

        {/* Product Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Preview */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted/30 shadow-macos">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.isNew && <Badge className="bg-success text-white">New</Badge>}
                {product.isTrending && (
                  <Badge className="bg-accent text-accent-foreground">🔥 Trending</Badge>
                )}
                {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleToggleLike}
                className={`absolute top-4 right-4 rounded-full glass ${
                  isLiked ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Product Details & Configuration */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold mb-2">
                <span>{product.category === "tees" ? "T-Shirt" : product.category === "hoodies" ? "Hoodie" : "Tank Top"}</span>
                <span>•</span>
                <span>In Stock</span>
              </div>
              <h1 className="text-headline text-2xl sm:text-4xl font-bold text-foreground">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < Math.round(product.rating)
                          ? "fill-warning text-warning"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="font-semibold text-sm ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews + reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                TZS {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    TZS {product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <Separator />

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Color: {selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const hex = COLOR_HEX_MAP[color] || "#CCCCCC";
                  const active = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        active
                          ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-border flex items-center justify-center"
                        style={{ backgroundColor: hex }}
                      >
                        {active && (
                          <Check
                            className={`h-2.5 w-2.5 ${
                              color === "White" || color === "Yellow" ? "text-black" : "text-white"
                            }`}
                          />
                        )}
                      </span>
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Size: {selectedSize}</span>
                <span className="text-xs text-muted-foreground">Unisex Relaxed Fit</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className="min-w-[48px] font-semibold"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <span className="text-sm font-semibold">Quantity</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-xl bg-card">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 font-semibold text-sm">{quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Subtotal: <strong className="text-foreground">TZS {(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => handleAddToCart(false)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleAddToCart(true)}
                className="flex-1 font-semibold"
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(`/customize?product=${product.id}`)}
                className="glass border-glass-border font-semibold"
              >
                <Palette className="h-4 w-4 mr-2 text-primary" />
                Customize Design
              </Button>
            </div>

            {/* Features & Specs */}
            {product.features && (
              <Card className="glass-card">
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-semibold text-sm">Fabric & Print Highlights</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card/50">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free delivery on orders over TZS 50,000</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card/50">
                <Shield className="h-4 w-4 text-success" />
                <span>30-day quality & print guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="glass-card lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Write a Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-xs font-medium mb-1 block">Your Name</label>
                  <Input
                    placeholder="e.g. Asha M."
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= newRating ? "fill-warning text-warning" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Your Review</label>
                  <Textarea
                    rows={3}
                    placeholder="How is the fit, fabric, and meme print?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Post Review
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold">Customer Reviews ({reviews.length})</h3>
            {reviews.map((rev) => (
              <Card key={rev.id} className="glass-card">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{rev.author}</span>
                    <span className="text-xs text-muted-foreground">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating ? "fill-warning text-warning" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{rev.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="responsive-grid">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
