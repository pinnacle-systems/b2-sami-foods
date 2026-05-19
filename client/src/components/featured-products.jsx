import { useGetProductsQuery } from "@/redux/services/productApi";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedProducts() {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();

  const featured = products.filter((p) => p.productStatus).slice(0, 10);

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          <Button variant="outline" asChild className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 w-fit">
            <Link to="/shop">
              View All Products <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <p className="text-center text-muted-foreground py-12">
            Failed to load products. Please try again later.
          </p>
        )}

        {/* Grid */}
        {!isLoading && !isError && (
          featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No products available yet.
            </p>
          )
        )}
      </div>
    </section>
  );
}
