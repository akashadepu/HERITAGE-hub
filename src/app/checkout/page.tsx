"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  if (items.length === 0 && !success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-600">Your cart is empty</h2>
        <Link href="/products">
          <Button className="mt-4 bg-amber-800 hover:bg-amber-900">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.images[0] || "",
        price: i.product.price,
        quantity: i.quantity,
        artisanId: i.product.artisanId,
      }));
      const id = await createOrder({
        customerId: user.uid,
        customerName: user.displayName,
        customerEmail: user.email,
        items: orderItems,
        artisanIds: [...new Set(orderItems.map((i) => i.artisanId))],
        totalAmount: totalPrice,
        shippingAddress: address,
        status: "pending",
        paymentMethod: "cod",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setOrderId(id);
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-amber-950">Order Placed!</h2>
        <p className="text-gray-600 mt-2">Thank you for supporting Indian artisans. Your order has been received.</p>
        <div className="bg-amber-50 rounded-lg p-4 mt-6 text-left">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono font-medium text-amber-900">{orderId}</p>
          <p className="text-sm text-gray-500 mt-2">Payment Method</p>
          <p className="font-medium text-amber-900">Cash on Delivery</p>
        </div>
        <div className="flex gap-3 justify-center mt-6">
          <Link href="/orders">
            <Button className="bg-amber-800 hover:bg-amber-900">View My Orders</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-amber-800 mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to cart
      </Link>

      <h1 className="text-3xl font-bold text-amber-950 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-amber-950">Shipping Address</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input id="pincode" required value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-amber-950 mb-4">Payment Method</h3>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-amber-50/50">
                <div className="h-4 w-4 rounded-full border-4 border-amber-800 bg-white" />
                <div>
                  <p className="font-medium text-amber-950">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900" size="lg" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Place Order (₹{totalPrice.toLocaleString()})
            </Button>

            {!user && (
              <p className="text-sm text-gray-500 text-center">You will be redirected to login before placing the order.</p>
            )}
          </form>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-amber-950">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                    <span className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-amber-950 text-base pt-2 border-t">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
