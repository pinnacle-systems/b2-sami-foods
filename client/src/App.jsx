import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ScrollToHash } from '@/components/ScrollToHash'
import { CartProvider } from '@/components/cart-provider'
import { AuthModalProvider } from '@/components/auth-modal-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import AdminRoute from '@/components/AdminRoute'

const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ProductCategoryMaster = lazy(() => import('./pages/admin/ProductCategoryMaster'))
const ProductMaster = lazy(() => import('./pages/admin/ProductMaster'))
const UomMaster = lazy(() => import('./pages/admin/UomMaster'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

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
      <AuthModalProvider>
        <CartProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Customer auth */}
              {/* <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} /> */}

              {/* Storefront */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
              <Route path="/shop/:category" element={<MainLayout><CategoryPage /></MainLayout>} />
              <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
              <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
              <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />

              {/* ── Admin area ── */}
              <Route path="/admin">
                <Route index element={<AdminLogin />} />
                <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="product-category" element={<ProductCategoryMaster />} />
                  <Route path="product-master" element={<ProductMaster />} />
                  <Route path="uom-master" element={<UomMaster />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthModalProvider>
    </BrowserRouter>
  )
}
