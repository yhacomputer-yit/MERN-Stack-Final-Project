import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminProducts, getAdminOrders, getAdminUsers, deleteAdminUser } from '../lib/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) {
        setError('Please log in as an admin');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log('Fetching admin data with token:', token.slice(0, 10) + '...');
        const [productsData, ordersData, usersData] = await Promise.all([
          getAdminProducts(token),
          getAdminOrders(token),
          getAdminUsers(token),
        ]);
        console.log('Admin products:', productsData);
        console.log('Admin orders:', ordersData);
        console.log('Admin users:', usersData);
        setProducts(productsData);
        setOrders(ordersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setError(error.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      console.log('Deleting user:', userId);
      await deleteAdminUser(token, userId);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-500 text-lg font-semibold">Please log in as an admin to access the dashboard.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) return (
    <div className="container mx-auto p-6 text-center">
      <svg className="animate-spin h-10 w-10 text-orange-600 mx-auto" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
      </svg>
      <p className="mt-4 text-lg text-gray-600">Loading admin data...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-6 text-center text-red-500">
      <p className="text-lg font-semibold">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-8 text-center">Admin Dashboard - YHA Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-gray-800">Total Products</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-gray-800">Total Orders</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{users.length}</p>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-orange-600">Products</h2>
          <Link to="/admin/products" className="text-orange-500 hover:text-orange-600 font-medium">Manage Products</Link>
        </div>
        {products.length === 0 ? (
          <p className="text-gray-600">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map(product => (
              <div key={product._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <p className="text-gray-600">Category: {product.categoryId?.name || 'Uncategorized'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-orange-600">Orders</h2>
          <Link to="/admin/orders" className="text-orange-500 hover:text-orange-600 font-medium">Manage Orders</Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders available.</p>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                <p className="text-gray-800">Order ID: {order._id}</p>
                <p className="text-gray-600">User: {order.userId?.name || 'Unknown'}</p>
                <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
                <p className="text-gray-600">Status: {order.status}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-orange-600">Users</h2>
          <Link to="/admin/users" className="text-orange-500 hover:text-orange-600 font-medium">Manage Users</Link>
        </div>
        {users.length === 0 ? (
          <p className="text-gray-600">No users available.</p>
        ) : (
          <div className="space-y-4">
            {users.slice(0, 5).map(user => (
              <div key={user._id} className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition-shadow duration-300">
                <div>
                  <p className="text-gray-800 font-medium">Name: {user.name}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">Role: {user.role}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  disabled={user.role === 'admin'}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;