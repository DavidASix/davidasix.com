import Link from "next/link";
import { api } from "~/trpc/server";
import { PizzaRating } from "./_components/pizza-rating";

export default async function PizzaListPage() {
  const posts = await api.pizza.getAllPosts();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1
            className="text-foreground mb-6 text-6xl md:text-7xl lg:text-[7rem] leading-none"
            style={{ fontFamily: "var(--font-bagel-fat-one)" }}
          >
            <span className="hidden lg:inline">🍕</span> Pizza Reviews
          </h1>
          <p className="text-muted-foreground text-xl">
            A journey through pizza in Kitchener Waterloo
          </p>
        </div>

        {/* Pizza Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/pizza/${post.slug}`}
              className="group border-border bg-card/70 relative overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-[1.01] hover:border-amber-700 hover:shadow-xl"
            >
              <div className="p-6">
                {/* Shop Name */}
                <h2
                  className="text-foreground mb-3 text-3xl transition-all group-hover:text-amber-700"
                  style={{ fontFamily: "var(--font-bagel-fat-one)" }}
                >
                  {post.frontMatter["pizza-shop"]}
                </h2>

                {/* Purchase Date */}
                <p className="text-muted-foreground mb-4 text-sm">
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
                {post.frontMatter["better-than-ginos"] === true ? (
                  <div className="mb-4 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                    ✓ Better than Gino&apos;s
                  </div>
                ) : post.frontMatter["better-than-ginos"] === false ? (
                  <div className="mb-4 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    ✗ Not better than Gino&apos;s
                  </div>
                ) : null}

                {/* TLDR */}
                <p className="text-muted-foreground text-sm italic">
                  &quot;{post.frontMatter.tldr}&quot;
                </p>

                {/* Read More Indicator */}
                <div className="mt-4 text-sm font-semibold text-amber-700">
                  Read full review →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center">
            <p className="text-foreground text-xl">
              No pizza reviews yet. Time to eat some pizza! 🍕
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
