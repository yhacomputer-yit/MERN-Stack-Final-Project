import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductsAdmin from './pages/ProductsAdmin';
import OrdersAdmin from './pages/OrdersAdmin';
import UsersAdmin from './pages/UsersAdmin';
import CategoriesAdmin from './pages/CategoriesAdmin';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from './context/CartContext';
import jwtDecode from 'jwt-decode';

function AdminLayout({ children }) {
  const { token } = useCart();
  const { user } = useAuth();

// check is admin

  const isAdmin = token ? jwtDecode(token).role === 'admin' : false;
  if(!token || !isAdmin) { 
     return <Navigate to="/login" />; 
  } 

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="md:w-64">
        <Sidebar />
      </div>
      <div className="flex-grow p-6">{children}</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/admin"
                  element={
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminLayout>
                      <ProductsAdmin />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminLayout>
                      <OrdersAdmin />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminLayout>
                      <UsersAdmin />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <AdminLayout>
                      <CategoriesAdmin />
                    </AdminLayout>
                  }
                />
                <Route path="*" element={<div className="container mx-auto p-4 text-center text-red-500">404: Page Not Found</div>} />
              </Routes>
            </main>
            <ToastContainer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;