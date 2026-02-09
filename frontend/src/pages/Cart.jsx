// Cart.js
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, updateItem, removeItem } = useCart();

  console.log('Current cart state:', cart); // Debug log to verify cart state

  const handleQuantityChange = (productId, delta) => {
    const item = cart?.items?.find(item => item.productId._id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity >= 1) {
        updateItem(productId, newQuantity);
      }
    }
  };

  if (!cart || !cart.items) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-orange-600 mb-10">Your Cart</h1>
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 3l2 18h14l2-18H3zm5 7h8" />
          </svg>
          <p className="mt-4 text-xl text-gray-600">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-semibold">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => (item.productId ? sum + item.productId.price * item.quantity : sum),
    0
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-5xl font-extrabold text-orange-600 mb-10">Your Cart</h1>
      {cart.items.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 3l2 18h14l2-18H3zm5 7h8" />
          </svg>
          <p className="mt-4 text-xl text-gray-600">Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-semibold">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.items.map(item => {
            if (!item.productId) {
              console.warn('Invalid cart item:', item);
              return null;
            }
            return (
              <div
                key={item.productId._id}
                className="flex flex-col sm:flex-row items-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.productId.imageURLs?.[0] || 'https://via.placeholder.com/100'}
                  alt={item.productId.name || 'Unknown Product'}
                  className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                  loading="lazy"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/100')}
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-800 truncate">{item.productId.name || 'Unknown Product'}</h3>
                  <p className="text-lg font-extrabold text-orange-600">${item.productId.price?.toFixed(2) || '0.00'}</p>
                  <div className="flex items-center justify-center sm:justify-start mt-4 space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, -1)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-gray-800 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, 1)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId._id)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="text-right mt-10">
            <h2 className="text-2xl font-extrabold text-gray-800">Total: ${total.toFixed(2)}</h2>
            <Link
              to="/checkout"
              className="inline-block mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;