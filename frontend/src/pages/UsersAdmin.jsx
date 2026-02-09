import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../lib/api';
import { toast } from 'react-toastify';

function UsersAdmin() {
  const { token } = useCart();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
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
        const usersData = await getAdminUsers(token);
        setUsers(usersData);
      } catch (error) {
        setError(error.message || 'Failed to load users');
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
        const updateData = { name: form.name, email: form.email, role: form.role };
        if (form.password) updateData.password = form.password;
        const updatedUser = await updateAdminUser(token, editingId, updateData);
        setUsers(users.map(u => (u._id === editingId ? updatedUser : u)));
        toast.success('User updated successfully');
      } else {
        if (!form.password) {
          toast.error('Password is required for new users');
          return;
        }
        const newUser = await createAdminUser(token, form);
        setUsers([...users, newUser]);
        toast.success('User created successfully');
      }
      setForm({ name: '', email: '', password: '', role: 'user' });
      setEditingId(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteAdminUser(token, id);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500 text-lg font-semibold">Please log in as an admin.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
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
      <p className="text-lg font-semibold">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Manage Users</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">
          {editingId ? 'Edit User' : 'Create User'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              {editingId ? 'New Password (optional)' : 'Password'}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={editingId ? 'Leave blank to keep unchanged' : ''}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            {editingId ? 'Update User' : 'Create User'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({ name: '', email: '', password: '', role: 'user' });
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">Users List</h2>
      {users.length === 0 ? (
        <p className="text-gray-600">No users available.</p>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center hover:shadow-xl transition-shadow duration-300">
              <div>
                <p className="text-gray-800 font-medium">Name: {user.name}</p>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Role: {user.role}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  disabled={user.role === 'admin'}
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

export default UsersAdmin;