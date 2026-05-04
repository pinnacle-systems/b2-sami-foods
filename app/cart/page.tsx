"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-primary hover:underline font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-3xl border border-border">
            <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
            <Button asChild className="rounded-full px-8">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-2xl border border-border items-center">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-secondary">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-primary font-bold">₹{item.product.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-secondary rounded-full p-1 border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-background"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-background"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-3xl p-6 border border-border h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{cartTotal > 500 ? "Free" : "₹50.00"}</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl text-primary">
                    ₹{(cartTotal + (cartTotal > 500 || cartTotal === 0 ? 0 : 50)).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Button className="w-full rounded-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
