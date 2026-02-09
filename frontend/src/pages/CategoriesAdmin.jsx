import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../lib/api';

function CategoriesAdmin() {
  const { token } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
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
        const categoriesData = await getAdminCategories(token);
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedCategory = await updateAdminCategory(token, editingId, form);
        setCategories(categories.map(c => (c._id === editingId ? updatedCategory : c)));
        alert('Category updated');
      } else {
        const newCategory = await createAdminCategory(token, form);
        setCategories([...categories, newCategory]);
        alert('Category created');
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
    } catch (error) {
      alert(error.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setForm({
      name: category.name,
      description: category.description || '',
    });
    setEditingId(category._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteAdminCategory(token, id);
      setCategories(categories.filter(c => c._id !== id));
      alert('Category deleted');
    } catch (error) {
      alert(error.message || 'Failed to delete category');
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
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Manage Categories</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">{editingId ? 'Edit Category' : 'Add Category'}</h2>
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
          <div className="md:col-span-2">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded-lg p-2 w-full"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          {editingId ? 'Update Category' : 'Create Category'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: '', description: '' });
              setEditingId(null);
            }}
            className="mt-4 ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List */}
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">Categories List</h2>
      {categories.length === 0 ? (
        <p className="text-gray-600">No categories available.</p>
      ) : (
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                <p className="text-gray-600">{category.description || 'No description'}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
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

export default CategoriesAdmin;