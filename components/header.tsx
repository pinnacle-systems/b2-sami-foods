"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Leaf } from "lucide-react";
import { navLinks } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/navlogo.png"   // make sure file name matches
                alt="Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              B2{"   "}   <span className="text-primary">Sami Foods</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <Button className="hidden md:flex bg-primary hover:bg-accent text-primary-foreground rounded-full px-6">
              Shop Now
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-80" : "max-h-0"
          }`}
      >
        <nav className="px-4 py-4 bg-card border-t border-border">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button className="mt-2 bg-primary hover:bg-accent text-primary-foreground rounded-full">
              Shop Now
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
