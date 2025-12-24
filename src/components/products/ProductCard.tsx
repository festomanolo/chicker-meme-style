import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("likedProducts");
      const likedIds: string[] = raw ? JSON.parse(raw) : [];
      setIsLiked(likedIds.includes(id));
    } catch {
      // noop
    }
  }, [id]);

  const persistLike = (next: boolean) => {
    try {
      const raw = localStorage.getItem("likedProducts");
      const likedIds: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(likedIds);
      if (next) set.add(id); else set.delete(id);
      localStorage.setItem("likedProducts", JSON.stringify(Array.from(set)));
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

  const handleAddToCart = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  return (
    <Card className="group glass-card hover:shadow-macos transition-all duration-300 macos-hover overflow-hidden">
      <div className="relative" onClick={markRecentlyViewed}>
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
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

        {/* Wishlist Button */}
        <Button
          variant="ghost"
