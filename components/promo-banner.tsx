import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { products } from "@/lib/data";

export function PromoBanner() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="p-8 md:p-12 lg:p-16 text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                Get 30% Off On Your First Order
              </h2>

              <p className="text-white/90 text-lg mb-8 max-w-md leading-relaxed">
                Start your healthy journey with our premium organic products.
                Use code <span className="font-bold">ORGANIC30</span> at checkout.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-semibold group"
                >
                  Claim Offer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Countdown */}
              <div className="flex gap-4 mt-10">
                {[
                  { value: "02", label: "Days" },
                  { value: "14", label: "Hours" },
                  { value: "36", label: "Mins" },
                  { value: "48", label: "Secs" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[70px]"
                  >
                    <span className="text-2xl md:text-3xl font-bold block">
                      {item.value}
                    </span>
                    <span className="text-xs text-white/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Marquee */}
            <div className="relative h-80 lg:h-full min-h-[400px] hidden lg:block overflow-hidden rounded-3xl bg-black/5 shadow-inner">
              <div className="absolute inset-x-0 w-full animate-marquee grid grid-cols-2 gap-4 p-4">
                {/* We double the products array so the marquee can seamlessly loop */}
                {[...products, ...products].map((product, idx) => {
                  return (
                    <div key={`${product.id}-${idx}`} className="relative w-full h-32 md:h-48 rounded-2xl overflow-hidden shadow-md bg-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* Decorative overlays */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-secondary to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-secondary to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Background Decorations */}
          <div className="absolute top-0 right-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  );
}
