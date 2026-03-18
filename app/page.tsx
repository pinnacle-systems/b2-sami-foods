import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Categories } from "@/components/categories";
import { FeaturedProducts } from "@/components/featured-products";
import { PromoBanner } from "@/components/promo-banner";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <PromoBanner />
      <Testimonials />
      <Footer />
    </main>
  );
}
