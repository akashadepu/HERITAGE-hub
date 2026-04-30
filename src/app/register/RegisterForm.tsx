"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2 } from "lucide-react";

export default function RegisterForm() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as "customer" | "artisan") || "customer";

  const [role, setRole] = useState<"customer" | "artisan">(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [bio, setBio] = useState("");
  const [craftSpecialty, setCraftSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const extraData: any = { phone };
      if (role === "artisan") {
        extraData.location = location;
        extraData.state = state;
        extraData.bio = bio;
        extraData.craftSpecialty = craftSpecialty;
        extraData.rating = 0;
        extraData.totalOrders = 0;
      }
      await register(email, password, name, role, extraData);
      router.push(role === "artisan" ? "/dashboard" : "/");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle(role);
      router.push(role === "artisan" ? "/dashboard" : "/");
    } catch (err: any) {
      setError(err.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-amber-50/50 py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-amber-100 text-amber-800">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-amber-950">Create account</h1>
          <p className="text-gray-600">Join Heritage Hub and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                role === "customer"
                  ? "bg-amber-100 border-amber-300 text-amber-900"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("artisan")}
              className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                role === "artisan"
                  ? "bg-amber-100 border-amber-300 text-amber-900"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Artisan
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          {role === "artisan" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="location">Village / Town</Label>
                <Input id="location" placeholder="Your village or town" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="e.g., Bihar" value={state} onChange={(e) => setState(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="craft">Craft Specialty</Label>
                <Input id="craft" placeholder="e.g., Madhubani Painting" value={craftSpecialty} onChange={(e) => setCraftSpecialty(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about yourself and your craft..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Sign up with Google
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-amber-800 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
