"use client";

import Image from "next/image";
import { ShoppingCart, Star, Heart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    badge?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, updateQuantity, toggleWishlist, isInWishlist } = useCart();
  
  const cartItem = cart.find((item) => item.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col border border-border">
      {/* Image Container */}
      <div className="relative h-48 bg-muted overflow-hidden transform-gpu">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu"
        />

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
              product.badge === "Sale"
                ? "bg-destructive text-white"
                : product.badge === "Popular"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex-grow flex flex-col">
        <span className="text-[10px] leading-tight text-primary font-medium uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-foreground mt-0.5 mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price & Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="pt-0.5 h-8">
            {qty === 0 ? (
              <Button
                onClick={() => addToCart(product, 1)}
                className="w-full h-8 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingCart className="w-3 h-3 mr-1.5" />
                Add to Cart
              </Button>
            ) : (
              <div className="w-full h-8 flex items-center justify-between bg-primary/10 rounded-full p-1 border border-primary/20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-background text-primary"
                  onClick={() => updateQuantity(product.id, qty - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="font-semibold text-xs text-foreground w-6 text-center">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-background text-primary"
                  onClick={() => updateQuantity(product.id, qty + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
