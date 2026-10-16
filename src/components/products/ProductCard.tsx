import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCartStore } from "@/lib/cart-store";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  isNew?: boolean;
  isTrending?: boolean;
  sizes?: string[];
  colors?: string[];
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge,
  isNew,
  isTrending,
  sizes,
  colors,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const syncLike = () => {
      try {
        const raw = localStorage.getItem("likedProducts");
        const likedIds: string[] = raw ? JSON.parse(raw) : [];
        setIsLiked(likedIds.includes(id));
      } catch {
        // noop
      }
    };
    syncLike();
    window.addEventListener("liked-products-updated", syncLike);
    return () => window.removeEventListener("liked-products-updated", syncLike);
  }, [id]);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isLiked;
    setIsLiked(next);
    try {
      const raw = localStorage.getItem("likedProducts");
      const likedIds: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(likedIds);
      if (next) set.add(id);
      else set.delete(id);
      localStorage.setItem("likedProducts", JSON.stringify(Array.from(set)));
      window.dispatchEvent(new Event("liked-products-updated"));
      toast({
        title: next ? "Saved to Wishlist" : "Removed from Wishlist",
        description: name,
      });
    } catch {
      // noop
    }
  };

  const markRecentlyViewed = () => {
    try {
      const raw = localStorage.getItem("recentlyViewedProducts");
      const list: { id: string; ts: number }[] = raw ? JSON.parse(raw) : [];
      const without = list.filter((p) => p.id !== id);
      const next = [{ id, ts: Date.now() }, ...without].slice(0, 20);
      localStorage.setItem("recentlyViewedProducts", JSON.stringify(next));
    } catch {
      // noop
    }
  };

  const handleOpenProduct = () => {
    markRecentlyViewed();
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const defaultSize = sizes?.[1] || sizes?.[0] || "L";
      const defaultColor = colors?.[0] || "White";
      await addItem(id, 1, price, name, defaultSize, defaultColor, image);
      toast({
        title: "Added to Cart",
        description: `${name} (${defaultSize}, ${defaultColor})`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomize = (e: React.MouseEvent) => {
    e.stopPropagation();
    markRecentlyViewed();
    navigate(`/customize?product=${id}`);
  };

  return (
    <Card
      onClick={handleOpenProduct}
      className="group glass-card hover:shadow-macos transition-all duration-300 macos-hover overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-muted/30">
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-success text-white font-medium text-xs">New</Badge>
            )}
            {isTrending && (
              <Badge className="bg-accent text-accent-foreground font-medium text-xs">🔥</Badge>
            )}
            {badge && (
              <Badge variant="secondary" className="bg-glass border-glass-border text-xs">
                {badge}
              </Badge>
            )}
          </div>

          {/* Action Buttons (Wishlist + Customize) */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              title={isLiked ? "Remove from Wishlist" : "Save to Wishlist"}
              className={`glass ${
                isLiked ? "text-destructive" : "text-muted-foreground"
              } hover:text-destructive transition-colors duration-200 macos-hover h-8 w-8`}
              onClick={toggleLike}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              title="Customize this design"
              className="glass text-muted-foreground hover:text-primary transition-colors duration-200 macos-hover h-8 w-8"
              onClick={handleCustomize}
            >
              <Palette className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <CardContent className="p-3 sm:p-4">
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-warning text-warning" />
                <span className="text-xs font-medium text-foreground">{rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-lg font-bold text-foreground">
                TZS {price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  TZS {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isLoading}
          size={isMobile ? "sm" : "default"}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg macos-transition text-xs sm:text-sm"
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}