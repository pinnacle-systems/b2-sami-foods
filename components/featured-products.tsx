import { products } from "@/lib/data";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Products
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 text-balance">
              Featured Organic Products
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Handpicked selection of our finest organic produce, delivered fresh
              from local farms to your table.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 w-fit"
          >
            <Link href="/shop">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
