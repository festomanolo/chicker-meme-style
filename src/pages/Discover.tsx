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
