import Link from "next/link";
import { api } from "~/trpc/server";
import { PizzaRating } from "~/app/_components/pizza-rating";

export default async function PizzaListPage() {
  const posts = await api.pizza.getAllPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-900 via-orange-800 to-yellow-700">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-6xl font-extrabold text-white drop-shadow-lg">
            🍕 Pizza Reviews
          </h1>
          <p className="text-xl text-amber-100">
            A tongue-in-cheek journey through pizza excellence (and mediocrity)
          </p>
        </div>

        {/* Pizza Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/pizza/${post.slug}`}
              className="group relative overflow-hidden rounded-lg border-4 border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:bg-white/20 hover:shadow-2xl"
            >
              <div className="p-6">
                {/* Shop Name */}
                <h2 className="mb-2 text-2xl font-bold text-white group-hover:text-amber-300">
                  {post.frontMatter["pizza-shop"]}
                </h2>

                {/* Purchase Date */}
                <p className="mb-3 text-sm text-amber-200">
                  {new Date(
                    post.frontMatter["purchase-date"],
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {/* Rating */}
                <div className="mb-4">
                  <PizzaRating rating={post.frontMatter.rating} />
                </div>

                {/* Better than Gino's Badge */}
                {post.frontMatter["better-than-ginos"] ? (
                  <div className="mb-3 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                    ✓ Better than Gino's
                  </div>
                ) : (
                  <div className="mb-3 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    ✗ Not better than Gino's
                  </div>
                )}

                {/* TLDR */}
                <p className="text-sm italic text-gray-200">
                  "{post.frontMatter.tldr}"
                </p>

                {/* Read More Indicator */}
                <div className="mt-4 text-sm font-semibold text-amber-300 group-hover:text-white">
                  Read full review →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center">
            <p className="text-xl text-white">
              No pizza reviews yet. Time to eat some pizza! 🍕
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
