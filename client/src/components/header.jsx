import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Heart, User, LogIn } from "lucide-react";
import { navLinks } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount, wishlist } = useCart();
    return (<header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/navlogo.png" alt="Logo" width={50} height={50} className="object-cover"/>
            </div>
            <span className="text-xl font-bold text-foreground">
              B2{"   "}   <span className="text-primary">Sami Foods</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (<Link key={link.name} to={link.href} className="text-muted-foreground hover:text-primary transition-colors font-medium">
                {link.name}
              </Link>))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative p-2 hover:bg-muted rounded-full transition-colors hidden sm:flex">
              <Heart className="w-6 h-6 text-foreground"/>
              {wishlist.length > 0 && (<span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>)}
            </Link>

            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-foreground"/>
              {cartCount > 0 && (<span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>)}
            </Link>

            {/* Auth buttons – desktop */}
            <Link to="/login" className="hidden md:flex">
              <Button variant="outline" className="rounded-full px-5 border-border flex items-center gap-2">
                <LogIn size={15} /> Login
              </Button>
            </Link>
            <Link to="/register" className="hidden md:flex">
              <Button className="rounded-full px-5 bg-primary hover:bg-accent text-primary-foreground flex items-center gap-2">
                <User size={15} /> Register
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 hover:bg-muted rounded-full transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? (<X className="w-6 h-6 text-foreground"/>) : (<Menu className="w-6 h-6 text-foreground"/>)}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-80" : "max-h-0"}`}>
        <nav className="px-4 py-4 bg-card border-t border-border">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (<Link key={link.name} to={link.href} className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>))}
            <div className="mt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-full flex items-center gap-2">
                  <LogIn size={15} /> Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-full flex items-center gap-2">
                  <User size={15} /> Register
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>);
}
