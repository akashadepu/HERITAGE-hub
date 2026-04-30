"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts, getOrders, getCustomizationRequests } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, MessageSquare, TrendingUp, Loader2 } from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, customizations: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const loadStats = async () => {
    setLoading(true);
    const [products, orders, customizations] = await Promise.all([
      getProducts({ artisanId: user!.uid }),
      getOrders(undefined, user!.uid),
      getCustomizationRequests({ artisanId: user!.uid }),
    ]);
    const earnings = orders.reduce((sum, o) => {
      const artisanItems = o.items.filter((i) => i.artisanId === user!.uid);
      return sum + artisanItems.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);
    setStats({ products: products.length, orders: orders.length, customizations: customizations.length, earnings });
    setLoading(false);
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
        <h1 className="text-2xl font-bold text-amber-950">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.displayName}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-950">{stats.products}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-950">{stats.orders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Customizations</CardTitle>
            <MessageSquare className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-950">{stats.customizations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-950">₹{stats.earnings.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-6">
            <h3 className="font-semibold text-amber-950 mb-2">Add New Product</h3>
            <p className="text-sm text-gray-600 mb-4">Showcase your craft to thousands of potential buyers.</p>
            <Link href="/dashboard/products">
              <Button className="bg-amber-800 hover:bg-amber-900">Manage Products</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-6">
            <h3 className="font-semibold text-amber-950 mb-2">Pending Requests</h3>
            <p className="text-sm text-gray-600 mb-4">Review and respond to customer customization requests.</p>
            <Link href="/dashboard/customizations">
              <Button className="bg-amber-800 hover:bg-amber-900">View Requests</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
