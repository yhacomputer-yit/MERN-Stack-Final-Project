import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaList, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  const { token, setToken } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome className="mr-3 text-xl" /> },
    { path: '/admin/products', label: 'Products', icon: <FaBox className="mr-3 text-xl" /> },
    { path: '/admin/orders', label: 'Orders', icon: <FaShoppingCart className="mr-3 text-xl" /> },
    { path: '/admin/users', label: 'Users', icon: <FaUsers className="mr-3 text-xl" /> },
    { path: '/admin/categories', label: 'Categories', icon: <FaList className="mr-3 text-xl" /> },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      setToken(null);
      window.location.href = '/login';
    }
  };

  if (!token) return null;

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-orange-600 text-white p-2 rounded-lg shadow-lg hover:bg-orange-700 transition-all duration-300 focus:ring-2 focus:ring-orange-400"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-orange-600 to-orange-700 text-white w-64 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:w-64 z-40 pt-16 md:pt-0 border-r border-orange-800/20 overflow-hidden`}
      >
        <div className="p-6 border-b border-orange-800/20">
          <h2 className="text-2xl font-bold text-center text-white tracking-tight">YHA Shop Admin</h2>
        </div>
        <nav className="mt-4 flex flex-col px-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 mx-2 rounded-lg hover:bg-orange-800/50 hover:scale-105 transition-all duration-200 ${
                location.pathname === item.path ? 'bg-orange-800 text-white shadow-md' : 'text-orange-100'
              }`}
              onClick={() => setIsOpen(false)}
              aria-label={`Navigate to ${item.label}`}
            >
              {item.icon}
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 mx-2 mt-4 rounded-lg text-orange-100 hover:bg-red-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-red-400"
            aria-label="Logout"
          >
            <FaSignOutAlt className="mr-3 text-xl" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Sidebar;