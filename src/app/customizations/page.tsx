"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getCustomizationRequests } from "@/lib/data";
import { CustomizationRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function CustomerCustomizationsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CustomizationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadRequests();
    else setLoading(false);
  }, [user]);

  const loadRequests = async () => {
    setLoading(true);
    const data = await getCustomizationRequests({ customerId: user!.uid });
    setRequests(data);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-600">Please log in to view your requests</h2>
        <Link href="/login?redirect=/customizations">
          <Button className="mt-4 bg-amber-800 hover:bg-amber-900">Login</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 text-amber-700 mb-4">
          <MessageSquare className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-amber-950">No customization requests</h2>
        <p className="text-gray-600 mt-2">Browse products and request customizations from artisans.</p>
        <Link href="/products">
          <Button className="mt-6 bg-amber-800 hover:bg-amber-900">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-950 mb-8">My Customization Requests</h1>
      <div className="space-y-4 max-w-3xl">
        {requests.map((req) => (
          <Card key={req.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Link href={`/products/${req.productId}`}>
                  <h3 className="font-semibold text-amber-950 hover:text-amber-700">{req.productName}</h3>
                </Link>
                <Badge className={statusColors[req.status] || "bg-gray-100 text-gray-800"}>{req.status}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
              <div className="bg-amber-50/50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-500">Your message:</p>
                <p className="text-gray-800 text-sm">{req.message}</p>
              </div>
              {req.responseMessage && (
                <div className="bg-green-50/50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Artisan response:</p>
                  <p className="text-gray-800 text-sm">{req.responseMessage}</p>
                  {req.proposedPrice && (
                    <p className="text-sm font-medium text-amber-900 mt-1">Proposed Price: ₹{req.proposedPrice.toLocaleString()}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
