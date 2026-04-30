import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, MapPin, HandHeart, Truck } from "lucide-react";

const featuredCategories = [
  { name: "Madhubani Painting", state: "Bihar", image: "/images/madhubani.jpg" },
  { name: "Bandhani Textile", state: "Gujarat", image: "/images/bandhani.jpg" },
  { name: "Dhokra Craft", state: "Chhattisgarh", image: "/images/dhokra.jpg" },
  { name: "Blue Pottery", state: "Rajasthan", image: "/images/pottery.jpg" },
];

const states = ["Bihar", "Gujarat", "Rajasthan", "Karnataka", "Odisha", "Uttar Pradesh"];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800">
                <HandHeart className="h-4 w-4" />
                Supporting 10,000+ Artisans
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-amber-950 leading-tight">
                Preserving Heritage, <br />
                <span className="text-amber-700">Empowering Artisans</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Discover authentic handmade crafts from every corner of India. Customize products directly with artisans and become part of a movement that keeps ancient traditions alive.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-amber-800 hover:bg-amber-900 text-white">
                    Explore Crafts <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register?role=artisan">
                  <Button size="lg" variant="outline" className="border-amber-800 text-amber-800 hover:bg-amber-50">
                    Join as Artisan
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-amber-600" />
                  <span>100+ Crafts</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <span>28 States</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-amber-600" />
                  <span>All India Shipping</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="h-48 rounded-2xl bg-amber-200/60 flex items-center justify-center text-amber-800 font-medium">
                    Madhubani Art
                  </div>
                  <div className="h-64 rounded-2xl bg-orange-200/60 flex items-center justify-center text-orange-800 font-medium">
                    Bandhani Textiles
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 rounded-2xl bg-rose-200/60 flex items-center justify-center text-rose-800 font-medium">
                    Dhokra Metal
                  </div>
                  <div className="h-48 rounded-2xl bg-amber-200/60 flex items-center justify-center text-amber-800 font-medium">
                    Blue Pottery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-950">Featured Crafts</h2>
            <p className="text-gray-600 mt-2">Handpicked traditional art forms from master artisans</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group block rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-40 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                  <Palette className="h-10 w-10 text-amber-700" />
                </div>
                <h3 className="font-semibold text-amber-900">{cat.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {cat.state}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* States */}
      <section className="py-16 bg-amber-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-950">Explore by State</h2>
            <p className="text-gray-600 mt-2">Every state has a story to tell through its crafts</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {states.map((state) => (
              <Link
                key={state}
                href={`/products?state=${encodeURIComponent(state)}`}
                className="flex flex-col items-center justify-center rounded-xl bg-white border p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
              >
                <MapPin className="h-6 w-6 text-amber-600 mb-2" />
                <span className="text-sm font-medium text-gray-800 text-center">{state}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-950">How Heritage Hub Works</h2>
            <p className="text-gray-600 mt-2">From artisan&apos;s hands to your home</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discover", desc: "Browse authentic crafts from artisans across India filtered by state or category." },
              { step: "02", title: "Customize", desc: "Request personalized designs by sending instructions directly to the artisan." },
              { step: "03", title: "Connect", desc: "Artisans handcraft your product with generations of skill and tradition." },
              { step: "04", title: "Receive", desc: "Get your unique handmade craft delivered with a story of its origin." },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-amber-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You an Artisan?</h2>
          <p className="text-amber-100 max-w-xl mx-auto mb-8">
            Join thousands of traditional craftspeople selling their handmade products to customers across India and the world. Get started in minutes.
          </p>
          <Link href="/register?role=artisan">
            <Button size="lg" variant="secondary" className="bg-white text-amber-900 hover:bg-amber-50">
              Start Selling Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
