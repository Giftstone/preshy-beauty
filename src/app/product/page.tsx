"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      router.replace(`/product/${id}`);
    } else {
      router.replace("/shop");
    }
  }, [id, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-taupe">
      Loading product…
    </div>
  );
}

export default function ProductRedirectPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-taupe">Loading…</div>}>
      <RedirectInner />
    </Suspense>
  );
}
