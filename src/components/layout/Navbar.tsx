"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User, Menu, X, LogOut, Store, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-amber-800">
          <Store className="h-6 w-6" />
          <span>Heritage Hub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-amber-800 transition-colors">
            Shop
          </Link>
          <Link href="/products?filter=state" className="text-sm font-medium text-gray-700 hover:text-amber-800 transition-colors">
            States
          </Link>
          <Link href="/products?filter=category" className="text-sm font-medium text-gray-700 hover:text-amber-800 transition-colors">
            Crafts
          </Link>
          {user?.role === "artisan" && (
            <Link href="/dashboard" className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "customer" && (
                <Link href="/customizations">
                  <Button variant="ghost" size="sm">Customizations</Button>
                </Link>
              )}
              <Link href={user.role === "artisan" ? "/dashboard" : "/orders"}>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-amber-800 hover:bg-amber-900">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link href="/products" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>
            Shop
          </Link>
          <Link href="/products?filter=state" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>
            States
          </Link>
          <Link href="/products?filter=category" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>
            Crafts
          </Link>
          {user?.role === "artisan" && (
            <Link href="/dashboard" className="block text-sm font-medium text-amber-700" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
          )}
          <Link href="/cart" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>
            Cart ({totalItems})
          </Link>
          {user ? (
            <>
              <Link href={user.role === "artisan" ? "/dashboard" : "/orders"} className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>
                My Account
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-sm font-medium text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link href="/register" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
