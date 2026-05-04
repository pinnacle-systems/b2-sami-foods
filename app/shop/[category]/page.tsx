import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { products, categories } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.name.toLowerCase().replace(" ", "-"),
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryStr = resolvedParams.category;

  // Filter products by category
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === categoryStr.toLowerCase()
  );

  if (categoryProducts.length === 0) {
    notFound();
  }

  // Capitalize category name for the title
  const title = categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <Link
            href={`/#category-${categoryStr.toLowerCase()}`}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-semibold hover:border-primary hover:bg-primary/5 transition-all duration-300 group shadow-sm hover:shadow-md w-fit"
          >
            <div className="bg-secondary rounded-full p-1.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </div>
            Back to Home
          </Link>
        </div>

        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {title} Products
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our authentic collection of {title.toLowerCase()} made with natural ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
