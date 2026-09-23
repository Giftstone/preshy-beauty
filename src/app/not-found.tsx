import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-4xl mb-4">Page not found</h1>
      <p className="text-taupe mb-8">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="inline-block bg-charcoal text-cream px-8 py-3 rounded-full text-sm font-medium"
      >
        Back to home
      </Link>
    </main>
  );
}
