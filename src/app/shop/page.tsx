import { Suspense } from "react";
import ShopContent from "./ShopContent";

export const metadata = {
  title: "Shop | Preshy Beauty",
  description: "Shop apparel and hair extensions at Preshy Beauty, Ndola Town Centre.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-taupe">
          Loading shop…
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
