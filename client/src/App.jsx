import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ScrollToHash } from '@/components/ScrollToHash'
import { CartProvider } from '@/components/cart-provider'
import { AuthModalProvider } from '@/components/auth-modal-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import AdminRoute from '@/components/AdminRoute'
import Home from './pages/Home'
import Shop from './pages/Shop'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductCategoryMaster from './pages/admin/ProductCategoryMaster'
import ProductMaster from './pages/admin/ProductMaster'
import ProfilePage from './pages/ProfilePage'

function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollToHash />
      <CartProvider>
        <AuthModalProvider>
          <Routes>
            {/* Customer auth */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Storefront */}
            <Route path="/"               element={<MainLayout><Home /></MainLayout>} />
            <Route path="/shop"           element={<MainLayout><Shop /></MainLayout>} />
            <Route path="/shop/:category" element={<MainLayout><CategoryPage /></MainLayout>} />
            <Route path="/cart"           element={<MainLayout><CartPage /></MainLayout>} />
            <Route path="/wishlist"       element={<MainLayout><WishlistPage /></MainLayout>} />
            <Route path="/profile"        element={<MainLayout><ProfilePage /></MainLayout>} />

            {/* ── Admin area ── */}
            <Route path="/admin">
              {/* /admin → login page */}
              <Route index element={<AdminLogin />} />

              {/* /admin/* → protected, wrapped in AdminRoute + AdminLayout */}
              <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route path="dashboard"        element={<AdminDashboard />} />
                <Route path="product-category" element={<ProductCategoryMaster />} />
                <Route path="product-master"   element={<ProductMaster />} />
              </Route>
            </Route>
          </Routes>
        </AuthModalProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
