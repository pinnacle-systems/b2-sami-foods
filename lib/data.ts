export const categories = [
  {
    id: 1,
    name: "Fresh Fruits",
    description: "Hand-picked organic fruits",
    image: "/images/category-fruits.jpg",
    itemCount: 45,
  },
  {
    id: 2,
    name: "Vegetables",
    description: "Farm-fresh vegetables daily",
    image: "/images/category-vegetables.jpg",
    itemCount: 62,
  },
  {
    id: 3,
    name: "Dairy & Eggs",
    description: "Organic dairy products",
    image: "/images/category-dairy.jpg",
    itemCount: 28,
  },
  {
    id: 4,
    name: "Bakery",
    description: "Freshly baked goods",
    image: "/images/category-bakery.jpg",
    itemCount: 35,
  },
];

export const products = [
  {
    id: 1,
    name: "Organic Avocados",
    price: 4.99,
    originalPrice: 6.99,
    image: "/images/product-avocado.jpg",
    category: "Fruits",
    rating: 4.8,
    reviews: 124,
    badge: "Sale",
  },
  {
    id: 2,
    name: "Fresh Strawberries",
    price: 5.49,
    image: "/images/product-strawberry.jpg",
    category: "Fruits",
    rating: 4.9,
    reviews: 89,
    badge: "Popular",
  },
  {
    id: 3,
    name: "Organic Spinach",
    price: 3.29,
    image: "/images/product-spinach.jpg",
    category: "Vegetables",
    rating: 4.7,
    reviews: 56,
  },
  {
    id: 4,
    name: "Farm Fresh Eggs",
    price: 6.99,
    image: "/images/product-eggs.jpg",
    category: "Dairy",
    rating: 4.9,
    reviews: 203,
    badge: "Best Seller",
  },
  {
    id: 5,
    name: "Organic Bananas",
    price: 2.99,
    image: "/images/product-banana.jpg",
    category: "Fruits",
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 6,
    name: "Fresh Broccoli",
    price: 3.99,
    originalPrice: 4.99,
    image: "/images/product-broccoli.jpg",
    category: "Vegetables",
    rating: 4.5,
    reviews: 67,
    badge: "Sale",
  },
  {
    id: 7,
    name: "Greek Yogurt",
    price: 4.49,
    image: "/images/product-yogurt.jpg",
    category: "Dairy",
    rating: 4.8,
    reviews: 145,
  },
  {
    id: 8,
    name: "Organic Tomatoes",
    price: 4.29,
    image: "/images/product-tomato.jpg",
    category: "Vegetables",
    rating: 4.7,
    reviews: 92,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Health Enthusiast",
    content:
      "The quality of produce from Organic Market is exceptional. Everything is always fresh and you can really taste the difference. I've been a loyal customer for over 2 years now!",
    avatar: "/images/avatar-1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Home Chef",
    content:
      "As someone who cooks daily, having access to fresh organic ingredients has transformed my meals. The delivery is always on time and the packaging is eco-friendly.",
    avatar: "/images/avatar-2.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Fitness Trainer",
    content:
      "I recommend Organic Market to all my clients. The variety of organic options and the consistent quality make healthy eating so much easier and enjoyable.",
    avatar: "/images/avatar-3.jpg",
    rating: 5,
  },
];

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Fresh Fruits", href: "/shop/fruits" },
    { name: "Vegetables", href: "/shop/vegetables" },
    { name: "Dairy & Eggs", href: "/shop/dairy" },
    { name: "Bakery", href: "/shop/bakery" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
  ],
};
