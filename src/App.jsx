import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Public Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Partners from './pages/Partners';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Downloads from './pages/Downloads';
import ContactUs from './pages/ContactUs';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';

// Admin Core & Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/admin/Login';
import DashboardLayout from './pages/admin/DashboardLayout';
import DashboardHome from './pages/admin/DashboardHome';

// Admin Modules Managers
import BannerManager from './pages/admin/BannerManager';
import ReviewManager from './pages/admin/ReviewManager';
import GalleryManager from './pages/admin/GalleryManager';
import JobManager from './pages/admin/JobManager';
import ProfileManager from './pages/admin/ProfileManager';
import PolicyManager from './pages/admin/PolicyManager';
import BrandManager from './pages/admin/BrandManager';
import CategoryManager from './pages/admin/CategoryManager';
import ProductManager from './pages/admin/ProductManager';
import NewsManager from './pages/admin/NewsManager';
import BlogManager from './pages/admin/BlogManager';
import DownloadManager from './pages/admin/DownloadManager';
import InquiryManager from './pages/admin/InquiryManager';
import Settings from './pages/admin/Settings';

// Scroll Restoration helper
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public Layout containing public Header & Footer
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          
          {/* Public Views */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
          </Route>

          {/* Admin Login Gateway outside default layout */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Dashboard Protected Nested Paths */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="banners" element={<BannerManager />} />
            <Route path="reviews" element={<ReviewManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="jobs" element={<JobManager />} />
            <Route path="profile" element={<ProfileManager />} />
            <Route path="policies" element={<PolicyManager />} />
            <Route path="brands" element={<BrandManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="blogs" element={<BlogManager />} />
            <Route path="downloads" element={<DownloadManager />} />
            <Route path="inquiries" element={<InquiryManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
