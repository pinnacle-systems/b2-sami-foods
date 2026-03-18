"use client";

import Image from "next/image";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  category,
  rating,
  reviews,
  badge,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-56 bg-muted overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badge */}
        {badge && (
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
              badge === "Sale"
                ? "bg-destructive text-white"
                : badge === "Popular"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
            }`}
          >
            {badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <Button
            onClick={handleAddToCart}
            className={`w-full rounded-full font-semibold ${
              isAdded
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground hover:bg-accent"
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdded ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="text-xs text-primary font-medium uppercase tracking-wide">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
