import { Suspense } from "react";
import BookContent from "./BookContent";

export const metadata = {
  title: "Book Appointment | Preshy Beauty",
  description:
    "Book wig installation, Spanish curls, fish tails, deep wave, bone straight and more at Preshy Beauty, Ndola.",
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-taupe">
          Loading booking form…
        </div>
      }
    >
      <BookContent />
    </Suspense>
  );
}
