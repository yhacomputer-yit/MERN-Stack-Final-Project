import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getOrders } from '../lib/api';
import { toast } from 'react-toastify';

function Orders() {
  const { token } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const ordersData = await getOrders(token);
        setOrders(ordersData);
      } catch (error) {
        setError(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  if (!token) return null;

  if (loading) return (
    <div className="container mx-auto p-4 text-center">
      <svg className="animate-spin h-8 w-8 text-orange-600 mx-auto" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
      </svg>
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4 text-center text-red-500">
      <p className="text-lg font-semibold">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-800 font-medium">Order ID: {order._id}</p>
              <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
              <p className="text-gray-600">Status: {order.status}</p>
              <p className="text-gray-600">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
              <div className="mt-2">
                <p className="text-gray-700 font-medium">Items:</p>
                <ul className="list-disc pl-5">
                  {order.items.map(item => (
                    <li key={item._id} className="text-gray-600">
                      {item.productId?.name || 'Unknown Product'} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;