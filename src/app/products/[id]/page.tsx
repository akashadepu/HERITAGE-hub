"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/lib/data";
import { Product } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Palette, Star, ShoppingCart, MessageSquare, User, ArrowLeft, Loader2 } from "lucide-react";
import { createCustomizationRequest } from "@/lib/data";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [customMessage, setCustomMessage] = useState("");
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customSuccess, setCustomSuccess] = useState(false);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const data = await getProduct(id as string);
    setProduct(data);
    setLoading(false);
  };

  const handleCustomization = async () => {
    if (!user || user.role !== "customer") {
      router.push("/login?redirect=" + encodeURIComponent(`/products/${id}`));
      return;
    }
    if (!customMessage.trim()) return;
    setCustomSubmitting(true);
    try {
      await createCustomizationRequest({
        customerId: user.uid,
        customerName: user.displayName,
        customerEmail: user.email,
        artisanId: product!.artisanId,
        productId: product!.id,
        productName: product!.name,
        productImage: product!.images[0] || "",
        message: customMessage,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setCustomSuccess(true);
      setCustomMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setCustomSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-600">Product not found</h2>
        <Link href="/products">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-amber-800 mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-amber-100 flex items-center justify-center">
            <Palette className="h-24 w-24 text-amber-300" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.craftCategory}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {product.state}
              </Badge>
              {product.customEnabled && <Badge className="bg-amber-600">Customizable</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-amber-950">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-amber-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 text-sm">
            <span className={`px-3 py-1 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              className="bg-amber-800 hover:bg-amber-900"
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            {product.customEnabled && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="border-amber-800 text-amber-800 hover:bg-amber-50">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Customize
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Request Customization</DialogTitle>
                  </DialogHeader>
                  {customSuccess ? (
                    <div className="py-6 text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-3">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-green-800">Request Submitted!</h3>
                      <p className="text-sm text-gray-600 mt-1">The artisan will review your request and respond soon.</p>
                      <Button className="mt-4" onClick={() => setCustomSuccess(false)}>Send Another</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Describe your customization idea for <strong>{product.name}</strong>. The artisan will review and respond with possibilities and pricing.
                      </p>
                      <Textarea
                        placeholder="e.g., I want this painting with peacock motifs instead of floral designs..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={5}
                      />
                      <Button
                        className="w-full bg-amber-800 hover:bg-amber-900"
                        onClick={handleCustomization}
                        disabled={customSubmitting || !customMessage.trim()}
                      >
                        {customSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Send Request
                      </Button>
                      {!user && (
                        <p className="text-xs text-gray-500 text-center">You will be redirected to login first</p>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Crafted by</p>
                <Link href={`/artisans/${product.artisanId}`} className="font-semibold text-amber-900 hover:underline">
                  {product.artisanName}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
