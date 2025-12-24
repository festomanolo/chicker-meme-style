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
            <div className="flex justify-center">
              <Badge className="glass px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-4 w-4 mr-2" />
                Trending Now
              </Badge>
            </div>
            
            <h1 className="text-display font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
              Memes That
              <span className="block text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Make You Laugh
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
              Discover the internet's funniest designs on premium quality t-shirts. 
              From viral memes to classic humor, express yourself with style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Button size={isMobile ? "default" : "lg"} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-xl macos-hover shadow-lg shadow-primary/25">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button variant="outline" size={isMobile ? "default" : "lg"} className="glass border-glass-border font-semibold px-8 py-3 rounded-xl macos-hover hover:bg-accent/5">
                View Collection
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* For You - Personalized */}
      <section className="mobile-padding px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-headline font-display text-2xl sm:text-3xl font-bold">For You</h2>
                <p className="text-sm text-muted-foreground">Based on your likes, views, and what’s trending near you</p>
              </div>
            </div>
          </div>
          <div className="responsive-grid">
            {(forYou.length ? forYou : featuredProducts).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Grid2X2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Categories</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {[
              { name: "Fashion", icon: Shirt },
              { name: "Electronics", icon: Smartphone },
              { name: "Beauty", icon: HeartPulse },
              { name: "Home", icon: Home },
            ].map((c) => (
              <button key={c.name} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-foreground whitespace-nowrap macos-hover">
                <c.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Bestsellers
              </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our most popular designs that everyone loves
            </p>
          </div>
          
          <div className="responsive-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="glass border-glass-border font-semibold px-8 py-3 rounded-xl macos-hover hover:bg-accent/5">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      

      {/* Trending Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12 sm:mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-headline font-display text-3xl sm:text-4xl font-bold text-foreground">
                Trending Now
              </h2>
              <p className="text-muted-foreground text-lg">
                The hottest designs everyone's talking about 🔥
              </p>
            </div>
          </div>
          
          <div className="responsive-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sales */}
      <FlashSalesSection />

      {/* Seasonal Collections */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-headline font-display text-3xl sm:text-4xl font-bold">Seasonal Collections</h2>
            <p className="text-muted-foreground">Curated picks for the moment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="glass-card p-8 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-muted/40 to-transparent">
              <div>
                <h3 className="text-xl font-semibold">Back-to-School</h3>
                <p className="text-sm text-muted-foreground mt-2">Smart, funny tees for a fresh start</p>
              </div>
              <Button variant="outline" className="mt-6 self-start glass border-glass-border">Explore</Button>
            </div>
            <div className="glass-card p-8 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-primary/10 to-transparent">
              <div>
                <h3 className="text-xl font-semibold">Holiday Gifts</h3>
                <p className="text-sm text-muted-foreground mt-2">Crowd-pleasers for every meme lover</p>
              </div>
              <Button variant="outline" className="mt-6 self-start glass border-glass-border">Explore</Button>
            </div>
            <div className="glass-card p-8 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-accent/10 to-transparent">
              <div>
                <h3 className="text-xl font-semibold">Summer Essentials</h3>
                <p className="text-sm text-muted-foreground mt-2">Light tees with maximum laughs</p>
              </div>
              <Button variant="outline" className="mt-6 self-start glass border-glass-border">Explore</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-headline font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Express Your Humor?
            </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of customers who love our meme tees. Start shopping now and add some humor to your wardrobe!
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-4 rounded-xl macos-hover shadow-lg shadow-primary/25">
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

function FlashSalesSection() {
  const [deadline] = useState(() => Date.now() + 1000 * 60 * 60 * 2 + 1000 * 45);
  const [, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
