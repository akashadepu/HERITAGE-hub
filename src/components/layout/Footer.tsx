import Link from "next/link";
import { Store, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-amber-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-amber-900">
              <Store className="h-5 w-5" />
              <span>Heritage Hub</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Preserving India&apos;s rich cultural heritage by connecting traditional artisans with the world. Every purchase supports a craftsman and keeps ancient art forms alive.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-amber-900 mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/products" className="hover:text-amber-800">All Products</Link></li>
              <li><Link href="/products?filter=state" className="hover:text-amber-800">By State</Link></li>
              <li><Link href="/products?filter=category" className="hover:text-amber-800">By Craft</Link></li>
              <li><Link href="/products?custom=true" className="hover:text-amber-800">Customizable</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-amber-900 mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/login" className="hover:text-amber-800">Login</Link></li>
              <li><Link href="/register" className="hover:text-amber-800">Register</Link></li>
              <li><Link href="/orders" className="hover:text-amber-800">My Orders</Link></li>
              <li><Link href="/register?role=artisan" className="hover:text-amber-800">Sell on Heritage Hub</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-amber-900 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@heritagehub.in</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> New Delhi, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Heritage Hub. All rights reserved. Crafted with love for Indian artisans.
        </div>
      </div>
    </footer>
  );
}
