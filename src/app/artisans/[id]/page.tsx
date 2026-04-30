"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUserProfile, getProducts } from "@/lib/data";
import { UserProfile, Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Palette, ArrowLeft, Loader2, User } from "lucide-react";

export default function ArtisanProfilePage() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    const [profile, items] = await Promise.all([
      getUserProfile(id as string),
      getProducts({ artisanId: id as string }),
    ]);
    setArtisan(profile);
    setProducts(items);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-600">Artisan not found</h2>
      </div>
    );
  }

  const artisanData = artisan as any;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-amber-800 mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to products
      </Link>

      <div className="bg-white rounded-xl border p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <User className="h-12 w-12 text-amber-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-amber-950">{artisan.displayName}</h1>
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" /> {artisanData.location}, {artisanData.state}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{artisanData.craftSpecialty}</Badge>
              {artisanData.rating > 0 && (
                <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-500" /> {artisanData.rating}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mt-4 leading-relaxed">{artisanData.bio}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-amber-950 mb-4">Products by {artisan.displayName}</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No products listed yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/products/${product.id}`}>
                <div className="h-48 bg-amber-100 flex items-center justify-center">
                  <Palette className="h-10 w-10 text-amber-300" />
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-amber-950 group-hover:text-amber-700">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-amber-900">₹{product.price.toLocaleString()}</span>
                  {product.customEnabled && <Badge className="bg-amber-600">Customizable</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
