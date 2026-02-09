import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct, getAdminCategories } from '../lib/api';

function ProductsAdmin() {
  const { token } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '', imageURLs: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Please log in as an admin');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAdminProducts(token),
          getAdminCategories(token),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        imageURLs: form.imageURLs ? [form.imageURLs] : [],
      };
      if (editingId) {
        const updatedProduct = await updateAdminProduct(token, editingId, productData);
        setProducts(products.map(p => (p._id === editingId ? updatedProduct : p)));
        alert('Product updated');
      } else {
        const newProduct = await createAdminProduct(token, productData);
        setProducts([...products, newProduct]);
        alert('Product created');
      }
      setForm({ name: '', description: '', price: '', stock: '', categoryId: '', imageURLs: '' });
      setEditingId(null);
    } catch (error) {
      alert(error.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId?._id || '',
      imageURLs: product.imageURLs?.[0] || '',
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteAdminProduct(token, id);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted');
    } catch (error) {
      alert(error.message || 'Failed to delete product');
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Please log in as an admin.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

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
      {error}
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
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Manage Products</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded-lg p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border rounded-lg p-2 w-full"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border rounded-lg p-2 w-full"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="border rounded-lg p-2 w-full"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="url"
              value={form.imageURLs}
              onChange={(e) => setForm({ ...form, imageURLs: e.target.value })}
              className="border rounded-lg p-2 w-full"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          {editingId ? 'Update Product' : 'Create Product'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: '', description: '', price: '', stock: '', categoryId: '', imageURLs: '' });
              setEditingId(null);
            }}
            className="mt-4 ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List */}
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">Products List</h2>
      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <p className="text-gray-600">Category: {product.categoryId?.name || 'Uncategorized'}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsAdmin;