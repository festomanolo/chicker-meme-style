import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { products } from "@/data/products";
import { Search, SlidersHorizontal, Grid3X3, List, TrendingUp, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const categories = [
  { id: "all", name: "All Categories", count: products.length },
  { id: "tees", name: "T-Shirts", count: products.filter(p => p.category === "tees").length },
  { id: "hoodies", name: "Hoodies", count: products.filter(p => p.category === "hoodies").length },
  { id: "tanks", name: "Tank Tops", count: products.filter(p => p.category === "tanks").length },
];

const colors = ["White", "Black", "Gray", "Navy", "Yellow", "Blue", "Charcoal", "Heather"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0 && !selectedColors.some(color => product.colors.includes(color))) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, selectedColors, selectedSizes, sortBy]);

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 50000]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortBy("trending");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="glass-card border-b border-card-border px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <h1 className="text-headline text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                Discover Memes
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Browse our collection of {products.length} hilarious meme t-shirts from East African creators
              </p>
            </div>
            
            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-auto w-full">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isMobile ? "Search memes..." : "Search memes, styles, creators..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-input-border rounded-lg"
                />
              </div>
              
              <div className="flex gap-2">
                {!isMobile && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={`${viewMode === "grid" ? "bg-primary text-primary-foreground" : ""} glass border-glass-border`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={`${viewMode === "list" ? "bg-primary text-primary-foreground" : ""} glass border-glass-border`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="glass border-glass-border"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="glass-card sticky top-24">
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base sm:text-lg">Filters</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary text-xs sm:text-sm">
                      Clear All
                    </Button>
                    {isMobile && (
                      <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="lg:hidden">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Categories</h4>
                  <div className="space-y-1 sm:space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-sm ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-hover"
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Price Range (TZS)</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={50000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>TZS {priceRange[0].toLocaleString()}</span>
                      <span>TZS {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Colors</h4>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2">
                    {colors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={color}
                          checked={selectedColors.includes(color)}
                          onCheckedChange={() => toggleColor(color)}
                        />
                        <label htmlFor={color} className="text-xs sm:text-sm font-medium cursor-pointer">
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Sizes</h4>
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSize(size)}
                        className={`text-xs ${
                          selectedSizes.includes(size)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "glass border-glass-border"
                        }`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
