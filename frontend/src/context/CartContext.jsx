// CartContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart, updateCart, removeFromCart } from '../lib/api';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (token) {
          const cartData = await getCart(token);
          console.log('Fetched cart:', cartData);
          setCart({ ...cartData });
        } else {
          setCart(null);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        toast.error(error.message || 'Failed to load cart');
        setCart(null);
      }
    };
    fetchCart();
  }, [token]);

  const addItem = async (productId, quantity) => {
    try {
      if (!token) throw new Error('Please log in to add items to cart');
      await addToCart(token, productId, quantity);
      const updatedCart = await getCart(token); // Refetch cart
      console.log('Refetched cart after add:', updatedCart);
      setCart({ ...updatedCart });
      return updatedCart;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
      const cartData = await getCart(token);
      setCart({ ...cartData });
      throw error;
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      if (!token) throw new Error('Please log in to update cart');
      await updateCart(token, productId, quantity);
      const updatedCart = await getCart(token);
      console.log('Refetched cart after update:', updatedCart);
      setCart({ ...updatedCart });
      return updatedCart;
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error(error.message || 'Failed to update cart');
      const cartData = await getCart(token);
      setCart({ ...cartData });
      throw error;
    }
  };

  const removeItem = async (productId) => {
    try {
      if (!token) throw new Error('Please log in to remove items from cart');
      await removeFromCart(token, productId);
      const updatedCart = await getCart(token);
      console.log('Refetched cart after remove:', updatedCart);
      setCart({ ...updatedCart });
      return updatedCart;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error(error.message || 'Failed to remove item from cart');
      const cartData = await getCart(token);
      setCart({ ...cartData });
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, token, setToken, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};