import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, Leaf } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen pt-20 md:pt-24 overflow-hidden bg-gradient-to-b from-secondary to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                100% Organic Products
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Fresh & Healthy{" "}
              <span className="text-primary">Organic Food</span> For Your Family
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Discover the finest selection of organic fruits, vegetables, and
              farm-fresh products delivered straight to your doorstep. Taste the
              difference of natural goodness.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-accent text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold group"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Free Delivery
                  </p>
                  <p className="text-xs text-muted-foreground">On $50+ orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Secure Pay
                  </p>
                  <p className="text-xs text-muted-foreground">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Certified
                  </p>
                  <p className="text-xs text-muted-foreground">100% organic</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Background Circle */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow" />
              <div className="absolute inset-4 rounded-full bg-primary/10" />

              {/* Main Image */}
              <div className="absolute inset-8 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-fruits.jpg"
                  alt="Fresh organic fruits and vegetables"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute top-4 right-4 bg-card rounded-2xl p-4 shadow-lg animate-float">
                <p className="text-2xl font-bold text-primary">25%</p>
                <p className="text-xs text-muted-foreground">OFF Today</p>
              </div>

              <div className="absolute bottom-8 left-0 bg-card rounded-2xl p-4 shadow-lg animate-float-delayed">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      500+
                    </p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
}
