import { useGetProductsQuery } from "@/redux/services/productApi";
import { useGetProductCategoriesQuery } from "@/redux/services/productCategoryApi";
import { ProductCard } from "@/components/product-card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Shop() {
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery();
  const { data: categories = [], isLoading: isCatsLoading } = useGetProductCategoriesQuery();

  const isLoading = isProductsLoading || isCatsLoading;

  const activeProducts = products.filter((p) => p.productStatus);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            All Products
          </span>
          <h1 className="text-4xl font-bold text-foreground mt-2 mb-4">
            Shop By Category
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our complete collection of natural, homemade organic products.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-16">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-72 rounded-3xl bg-muted animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grouped by category */}
        {!isLoading && (
          <div className="space-y-16">
            {categories.map((category) => {
              const categoryProducts = activeProducts.filter(
                (p) => p.productCategoryId === category.id
              );
              if (categoryProducts.length === 0) return null;

              const slug = category.name.toLowerCase().replace(/\s+/g, "-");

              return (
                <section key={category.id} className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">{category.name}</h2>
                      {category.description && (
                        <p className="text-muted-foreground mt-1">{category.description}</p>
                      )}
                    </div>
                    <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10">
                      <Link to={`/shop/${slug}`}>
                        View All <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <div className="mt-6 sm:hidden text-center">
                    <Button variant="outline" asChild className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link to={`/shop/${slug}`}>View All {category.name}</Link>
                    </Button>
                  </div>
                </section>
              );
            })}

            {categories.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No products available yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
