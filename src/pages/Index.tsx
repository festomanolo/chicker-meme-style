import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products, featuredProducts } from "@/data/products";
import { TrendingUp, Sparkles, ArrowRight, Star, Truck, Shield, Flashlight, Clock, Grid2X2, Shirt, Smartphone, HeartPulse, Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useMemo, useState } from "react";

const Index = () => {
  const isMobile = useIsMobile();

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);

  useEffect(() => {
    try {
      const rawViewed = localStorage.getItem("recentlyViewedProducts");
      const list: { id: string; ts: number }[] = rawViewed ? JSON.parse(rawViewed) : [];
      setRecentlyViewed(list.map((l) => l.id));
    } catch {}
    try {
      const rawLiked = localStorage.getItem("likedProducts");
      setLiked(rawLiked ? JSON.parse(rawLiked) : []);
    } catch {}
  }, []);

  const recentlyViewedProducts = useMemo(() => {
    const map = new Map(products.map(p => [p.id, p]));
    return recentlyViewed.map(id => map.get(id)).filter(Boolean);
  }, [recentlyViewed]);

  const likedProducts = useMemo(() => products.filter(p => liked.includes(p.id)), [liked]);

  const trendingNearYou = useMemo(() => products.filter(p => p.isTrending).slice(0, 8), []);

  const forYou = useMemo(() => {
    const combined = [...likedProducts, ...recentlyViewedProducts, ...trendingNearYou, ...featuredProducts];
    const seen = new Set<string>();
    const unique = combined.filter(p => {
      if (!p) return false as any;
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    return unique.slice(0, 12);
  }, [likedProducts, recentlyViewedProducts, trendingNearYou]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-12 sm:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
