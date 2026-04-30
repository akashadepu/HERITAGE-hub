"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/data";
import { Product } from "@/types";
import { INDIAN_STATES, CRAFT_CATEGORIES } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { MapPin, Palette, ShoppingCart, Star, Search, Loader2 } from "lucide-react";

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const preselectedState = searchParams.get("state");
  const preselectedCategory = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState(preselectedState || "");
  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory || "");
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, [selectedState, selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    const filters: any = {};
    if (selectedState) filters.state = selectedState;
    if (selectedCategory) filters.category = selectedCategory;
    const data = await getProducts(filters);
    setProducts(data);
    setLoading(false);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-950">Explore Crafts</h1>
        <p className="text-gray-600 mt-1">Discover authentic handmade products from artisans across India</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search crafts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All States</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All Crafts</option>
          {CRAFT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No products found matching your criteria.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/products/${product.id}`}>
                <div className="h-52 bg-amber-100 flex items-center justify-center relative">
                  <Palette className="h-12 w-12 text-amber-300" />
                  {product.customEnabled && (
                    <Badge className="absolute top-3 right-3 bg-amber-600">Customizable</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="secondary" className="absolute top-3 left-3">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <MapPin className="h-3 w-3" />
                  {product.state}
                </div>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-amber-950 line-clamp-1 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-amber-900">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <Button size="sm" className="bg-amber-800 hover:bg-amber-900" onClick={() => addItem(product)}>
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
