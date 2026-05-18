import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
export function CategoryCard({ name, description, image, itemCount, }) {
    return (<Link to={`/shop/${name.toLowerCase().replace(" ", "-")}`} className="group block scroll-mt-24" id={`category-${name.toLowerCase().replace(" ", "-")}`}>
      <div className="relative overflow-hidden rounded-3xl bg-card shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent"/>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-white/80 text-sm mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">{itemCount} Products</span>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowRight className="w-5 h-5 text-white"/>
            </div>
          </div>
        </div>
      </div>
    </Link>);
}
