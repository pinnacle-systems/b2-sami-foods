export const categories = [
  {
    id: 1,
    name: "Podi",
    description: "Authentic homemade podi varieties",
    image: "/B2/idlypodi.jpeg",
    itemCount: 6,
  },
  {
    id: 2,
    name: "Mix",
    description: "Healthy and instant mixes",
    image: "/B2/karupukanunikanjimix.jpeg",
    itemCount: 1,
  },
  {
    id: 3,
    name: "Masala",
    description: "Aromatic spice blends for everyday cooking",
    image: "/B2/chickenmasala.jpeg",
    itemCount: 5,
  },
];

export const products = [
  // Podi
  { id: 1, name: "Idly Podi", price: 4.99, image: "/B2/idlypodi.jpeg", category: "podi", rating: 4.9, reviews: 89, badge: "Popular" },
  { id: 2, name: "Ellu Podi", price: 5.49, image: "/B2/ellusathapodi.jpeg", category: "podi", rating: 4.8, reviews: 56 },
  { id: 3, name: "Moringa Podi", price: 6.99, image: "/B2/murungaikeeraisathampodi.jpeg", category: "podi", rating: 4.7, reviews: 42 },
  { id: 4, name: "Garlic Podi", price: 4.29, image: "/B2/poondusathapodi.jpeg", category: "podi", rating: 4.9, reviews: 110, badge: "Best Seller" },
  { id: 5, name: "Parupu Podi", price: 5.99, image: "/B2/paruppupodi.jpeg", category: "podi", rating: 4.6, reviews: 34 },
  { id: 6, name: "Rasam Podi", price: 3.99, image: "/B2/rasampodi.jpeg", category: "podi", rating: 4.8, reviews: 145 },
  
  // Mix
  { id: 7, name: "Karuppu Kavuni Kanji", price: 8.99, image: "/B2/karupukanunikanjimix.jpeg", category: "mix", rating: 5.0, reviews: 200, badge: "Healthy" },
  
  // Masala
  { id: 8, name: "Mutton Masala", price: 6.49, image: "/B2/muttonmasala.jpeg", category: "masala", rating: 4.8, reviews: 88 },
  { id: 9, name: "Sambar Masala", price: 4.49, image: "/B2/sambarpodi.jpeg", category: "masala", rating: 4.7, reviews: 92 },
  { id: 10, name: "Chicken Masala", price: 6.99, image: "/B2/chickenmasala.jpeg", category: "masala", rating: 4.9, reviews: 150, badge: "Popular" },
  { id: 11, name: "Biriyani Masala", price: 7.49, image: "/B2/biriyanimasala.jpeg", category: "masala", rating: 4.9, reviews: 210 },
  { id: 12, name: "Kari Masala", price: 5.99, image: "/B2/karimasala.jpeg", category: "masala", rating: 4.6, reviews: 45 },
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
  { name: "About", href: "/#" },
  { name: "Contact", href: "/#" },
];

export const footerLinks = {
  shop: [
    { name: "All Products", href: "/#" },
    { name: "Fresh Fruits", href: "/#" },
    { name: "Vegetables", href: "/#" },
    { name: "Dairy & Eggs", href: "/#" },
    { name: "Bakery", href: "/#" },
  ],
  company: [
    { name: "About Us", href: "/#" },
    { name: "Our Story", href: "/#" },
    { name: "Careers", href: "/#" },
    { name: "Press", href: "/#" },
  ],
  support: [
    { name: "Contact Us", href: "/#" },
    { name: "FAQs", href: "/#" },
    { name: "Shipping Info", href: "/#" },
    { name: "Returns", href: "/#" },
  ],
};
