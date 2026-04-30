"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getOrders } from "@/lib/data";
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadOrders();
    else setLoading(false);
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders(user?.uid);
    setOrders(data);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-600">Please log in to view your orders</h2>
        <Link href="/login?redirect=/orders">
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

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 text-amber-700 mb-4">
          <Package className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-amber-950">No orders yet</h2>
        <p className="text-gray-600 mt-2">Your order history will appear here once you make a purchase.</p>
        <Link href="/products">
          <Button className="mt-6 bg-amber-800 hover:bg-amber-900">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-950 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono font-medium text-amber-900">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-amber-900">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                  {order.status}
                </Badge>
              </div>
              <div className="border-t pt-4 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.productName} x {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 text-sm text-gray-500">
                <p>Ship to: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="mt-1">Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"} ({order.paymentStatus})</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
