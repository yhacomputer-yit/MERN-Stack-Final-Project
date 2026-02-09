import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function ProductCard({ product }) {
  const { addItem } = useContext(CartContext);

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg">
      <img
        src={product.imageURLs[0] || 'https://via.placeholder.com/150'}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-medium">{product.name}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      <button
        onClick={() => addItem(product._id, 1)}
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;