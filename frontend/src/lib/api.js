const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  console.log(`Response status for ${response.url}: ${response.status}`);
  const contentType = response.headers.get('content-type');
  console.log(`Content-Type: ${contentType}`);

  if (!response.ok) {
    const text = await response.text();
    console.log(`Raw response: ${text.slice(0, 100)}...`);
    throw new Error(`HTTP error: ${response.status}, Response: ${text.slice(0, 100)}...`);
  }

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Expected JSON, got ${contentType}: ${text.slice(0, 100)}...`);
  }

  return response.json();
};

// Auth
export const login = async (credentials) => {
  console.log('Logging in to:', `${API_URL}/auth/login`);
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const register = async (userData) => {
  console.log('Registering to:', `${API_URL}/auth/register`);
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Products
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return handleResponse(response);
};

export const getProduct = async (id) => {
  console.log('Fetching product from:', `${API_URL}/products/${id}`);
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
};

// Reviews
export const getReviews = async (productId) => {
  console.log('Fetching reviews from:', `${API_URL}/reviews/${productId}`);
  const response = await fetch(`${API_URL}/reviews/${productId}`);
  return handleResponse(response);
};

export const createReview = async (token, reviewData) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  return handleResponse(response);
};

// Cart
export const getCart = async (token) => {
  console.log('Fetching cart from:', `${API_URL}/cart`);
  const response = await fetch(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const addToCart = async (token, productId, quantity) => {
  console.log('Adding to cart:', { productId, quantity });
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(response);
};

export const updateCart = async (token, productId, quantity) => {
  console.log('Updating cart:', { productId, quantity });
  const response = await fetch(`${API_URL}/cart`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(response);
};

export const removeFromCart = async (token, productId) => {
  console.log('Removing from cart:', { productId });
  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};


// Orders
export const createOrder = async (token, orderData) => {
  console.log('Creating order at:', `${API_URL}/orders`, orderData);
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

export const getOrders = async (token) => {
  console.log('Fetching orders from:', `${API_URL}/orders`);
  const response = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// Admin - Products
export const getAdminProducts = async (token) => {
  console.log('Fetching admin products from:', `${API_URL}/admin/products`);
  const response = await fetch(`${API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createAdminProduct = async (token, productData) => {
  console.log('Creating product:', productData);
  const response = await fetch(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const updateAdminProduct = async (token, id, productData) => {
  console.log('Updating product:', id, productData);
  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const deleteAdminProduct = async (token, id) => {
  console.log('Deleting product:', id);
  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};


// Admin - Users
export const getAdminUsers = async (token) => {
  console.log('Fetching admin users from:', `${API_URL}/admin/users`);
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createAdminUser = async (token, userData) => {
  console.log('Creating user:', userData);
  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const updateAdminUser = async (token, id, userData) => {
  console.log('Updating user:', id, userData);
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const deleteAdminUser = async (token, id) => {
  console.log('Deleting user:', id);
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// Admin - Categories
export const getAdminCategories = async (token) => {
  console.log('Fetching admin categories from:', `${API_URL}/admin/categories`);
  const response = await fetch(`${API_URL}/admin/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createAdminCategory = async (token, categoryData) => {
  console.log('Creating category:', categoryData);
  const response = await fetch(`${API_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  return handleResponse(response);
};

export const updateAdminCategory = async (token, id, categoryData) => {
  console.log('Updating category:', id, categoryData);
  const response = fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  return handleResponse(response);
};

export const deleteAdminCategory = async (token, id) => {
  console.log('Deleting category:', id);
  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};


// Admin order
 export const getAdminOrders = async (token) => { 
  console.log('Fetching admin orders from:', `${API_URL}/admin/orders`); 
   const response = await fetch(`${API_URL}/admin/orders`, { 
    headers: { Authorization: `Bearer ${token}` }, 
  }); 
  return handleResponse(response); 
 }; 
 
 export const updateAdminOrder = async (token, id, orderData) => { 
 console.log('Updating order:', id, orderData); 
 const response = await fetch(`${API_URL}/admin/orders/${id}`, { 
    method: 'PUT', 
    headers: { 
     'Content-Type': 'application/json', 
     Authorization: `Bearer ${token}`, 
    }, 
    body: JSON.stringify(orderData), 
   }); 
   return handleResponse(response); 
 }; 