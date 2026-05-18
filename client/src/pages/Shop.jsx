import { products, categories } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function Shop() {
    return (<div className="min-h-screen pt-24 pb-12 bg-background">
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

        <div className="space-y-16">
          {categories.map((category) => {
            const categoryProducts = products.filter((p) => p.category.toLowerCase() === category.name.toLowerCase());
            if (categoryProducts.length === 0)
                return null;
            return (<section key={category.id} className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{category.name}</h2>
                    <p className="text-muted-foreground mt-1">{category.description}</p>
                  </div>
                  <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10">
                    <Link to={`/shop/${category.name.toLowerCase().replace(' ', '-')}`}>
                      View All <ArrowRight className="w-4 h-4 ml-2"/>
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {categoryProducts.map((product) => (<ProductCard key={product.id} product={product}/>))}
                </div>
                <div className="mt-6 sm:hidden text-center">
                  <Button variant="outline" asChild className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link to={`/shop/${category.name.toLowerCase().replace(' ', '-')}`}>
                      View All {category.name}
                    </Link>
                  </Button>
                </div>
              </section>);
        })}
        </div>
      </div>
    </div>);
}
