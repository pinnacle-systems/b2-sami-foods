import { useState } from "react";
import { ShoppingCart, Heart, Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

export function ProductCard({ product }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { cart, addToCart, updateQuantity, toggleWishlist, isInWishlist } =
    useCart();
  const cartItem = cart.find((item) => item.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(product.id);

  const name = product.productName;
  const rawImage = product.productImage;
  const image = rawImage
    ? rawImage.startsWith("http") ||
      rawImage.startsWith("/") ||
      rawImage.startsWith("data:")
      ? rawImage
      : `/${rawImage}`
    : null;
  const price = product.productPrice ?? product.originalPrice ?? 0;
  const origPrice = product.originalPrice;
  const badge = product.productLabel;
  const category = product.productcategory?.name;
  const ratingsVal = product.ratings;
  const starsCount = typeof ratingsVal === "number" && ratingsVal <= 5 ? Math.max(0, Math.min(5, ratingsVal)) : 4;

  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col border border-border w-full max-w-[220px] mx-auto">
      {/* Image */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {/* Skeleton shimmer shown until image loads */}
        {(!image || !imgLoaded) && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
            {badge}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex-grow flex flex-col">
        {category && (
          <span className="text-[9px] leading-tight text-primary font-medium uppercase tracking-wide">
            {category}
          </span>
        )}
        <h3 className="text-[11px] font-bold text-foreground mt-0.5 mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Star Ratings */}
        {ratingsVal !== null && ratingsVal !== undefined && (
          <div className="flex items-center gap-0.5 mt-0.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= starsCount
                      ? "fill-amber-400 stroke-amber-400"
                      : "text-muted-foreground/30 stroke-muted-foreground/30 fill-none"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium ml-1">
              ({ratingsVal})
            </span>
          </div>
        )}

        {/* Price & Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-primary">
              ₹{Number(price).toFixed(2)}
            </span>
            {origPrice && Number(origPrice) > Number(price) && (
              <span className="text-[9px] text-muted-foreground line-through">
                ₹{Number(origPrice).toFixed(2)}
              </span>
            )}
          </div>

          <div className="pt-0.5 h-8">
            {qty === 0 ? (
              <Button
                onClick={() => addToCart(product, 1)}
                className="w-full h-8 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
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
                <span className="font-semibold text-xs text-foreground w-6 text-center">
                  {qty}
                </span>
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
