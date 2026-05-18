import { testimonials } from "@/lib/data";
import { Star, Quote } from "lucide-react";
export function Testimonials() {
    return (<section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 text-balance">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover why thousands of health-conscious families trust Organic
            Market for their daily organic produce needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (<div key={testimonial.id} className="bg-card rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Quote Icon */}
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-primary"/>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {`"${testimonial.content}"`}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <img src={testimonial.avatar} alt={testimonial.name} className="absolute inset-0 w-full h-full object-cover"/>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
