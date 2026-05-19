import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGetProductsQuery } from "@/redux/services/productApi";
import { useGetProductCategoriesQuery } from "@/redux/services/productCategoryApi";
import { ProductCard } from "@/components/product-card";

export default function CategoryPage() {
  const { category: categorySlug = "" } = useParams();

  const { data: products = [], isLoading: isProductsLoading } =
    useGetProductsQuery();
  const { data: categories = [], isLoading: isCatsLoading } =
    useGetProductCategoriesQuery();

  const isLoading = isProductsLoading || isCatsLoading;

  const matchedCategory = categories.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug,
  );

  const categoryProducts = products.filter(
    (p) =>
      p.productStatus &&
      p.productcategory?.name.toLowerCase().replace(/\s+/g, "-") ===
        categorySlug,
  );

  const title =
    matchedCategory?.name ??
    categorySlug.charAt(0).toUpperCase() +
      categorySlug.slice(1).replace(/-/g, " ");

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <Link
            to={`/#category-${categorySlug}`}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-semibold hover:border-primary hover:bg-primary/5 transition-all duration-300 group shadow-sm hover:shadow-md w-fit"
          >
            <div className="bg-secondary rounded-full p-1.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </div>
            Back to Home
          </Link>
        </div>

        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
          {matchedCategory?.description && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {matchedCategory.description}
            </p>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-3xl bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && categoryProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && categoryProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No products available in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
