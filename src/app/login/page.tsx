"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-800" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
