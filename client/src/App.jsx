import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/components/cart-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Auth routes — full screen, no header/footer */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main site routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
          <Route path="/shop/:category" element={<MainLayout><CategoryPage /></MainLayout>} />
          <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
          <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
