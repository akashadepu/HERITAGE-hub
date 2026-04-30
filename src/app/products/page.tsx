"use client";

import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-800" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
