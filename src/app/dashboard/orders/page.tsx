"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getOrders, updateOrderStatus } from "@/lib/data";
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const nextStatus: Record<string, Order["status"]> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
};

export default function ArtisanOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders(undefined, user!.uid);
    setOrders(data);
    setLoading(false);
  };

  const handleUpdate = async (id: string, current: Order["status"]) => {
    const next = nextStatus[current];
    if (!next) return;
    await updateOrderStatus(id, next);
    loadOrders();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-950">Orders</h1>
        <p className="text-gray-600">Manage and update order statuses</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <ShoppingBag className="h-12 w-12 text-amber-300 mx-auto mb-4" />
          <h3 className="font-semibold text-amber-950">No orders yet</h3>
          <p className="text-sm text-gray-500 mt-1">Orders containing your products will appear here.</p>
        </div>
      ) : (
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
                  <p className="text-sm text-gray-500">Items from you:</p>
                  {order.items
                    .filter((i) => i.artisanId === user?.uid)
                    .map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.productName} x {item.quantity}</span>
                        <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                </div>

                <div className="border-t mt-4 pt-4 text-sm text-gray-500">
                  <p>Customer: {order.customerName} ({order.customerEmail})</p>
                  <p>Ship to: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                </div>

                {nextStatus[order.status] && (
                  <div className="mt-4">
                    <Button
                      className="bg-amber-800 hover:bg-amber-900"
                      onClick={() => handleUpdate(order.id, order.status)}
                    >
                      Mark as {nextStatus[order.status]}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
