import { useGetProductCategoriesQuery } from "@/redux/services/productCategoryApi";
import { CategoryCard } from "./category-card";

export function Categories() {
  const { data: categories = [], isLoading, isError } = useGetProductCategoriesQuery();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Browse by Category
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 text-balance">
            Shop Our Fresh Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide selection of organic products carefully sorted into
            categories to help you find exactly what you need.
          </p>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <p className="text-center text-muted-foreground py-12">
            Failed to load categories. Please try again later.
          </p>
        )}

        {/* Grid */}
        {!isLoading && !isError && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
