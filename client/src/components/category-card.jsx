import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CategoryCard({ category }) {
  const { name, description, productCategoryImage: rawCatImage, id } = category;
  const productCategoryImage = rawCatImage
    ? (rawCatImage.startsWith('http') || rawCatImage.startsWith('/') || rawCatImage.startsWith('data:')
        ? rawCatImage
        : `/${rawCatImage}`)
    : null;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      to={`/shop/${slug}`}
      className="group block scroll-mt-24"
      id={`category-${slug}`}
    >
      <div className="relative overflow-hidden rounded-3xl bg-card shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {productCategoryImage ? (
            <img
              src={productCategoryImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          {description && (
            <p className="text-white/80 text-sm mb-3 line-clamp-1">
              {description}
            </p>
          )}
          <div className="flex items-center justify-end">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
