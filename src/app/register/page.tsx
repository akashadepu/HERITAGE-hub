"use client";

import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-800" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
