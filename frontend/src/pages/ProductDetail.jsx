import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct, getReviews, createReview } from '../lib/api';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

function StarRating({ rating, setRating, readOnly = false }) {
  const handleClick = (value) => {
    if (!readOnly && setRating) {
      setRating(value);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${
            !readOnly ? 'cursor-pointer hover:text-yellow-500 transition-colors duration-200' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          onClick={() => handleClick(star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { token, addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await getProduct(id);
        setProduct(productData);
        const reviewsData = await getReviews(id);
        setReviews(reviewsData);

        // Store in recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const newItem = {
          _id: productData._id,
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          imageURLs: productData.imageURLs,
          categoryId: productData.categoryId,
        };
        const updated = [
          newItem,
          ...recentlyViewed.filter(item => item._id !== productData._id)
        ].slice(0, 5);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      } catch (error) {
        setError(error.message || 'Failed to load product or reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please log in to submit a review');
      navigate('/login');
      return;
    }
    if (reviewForm.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.error('Comment is required');
      return;
    }
    try {
      const decoded = jwt_decode(token);
      const reviewData = {
        productId: id,
        userId: decoded.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      };
      const newReview = await createReview(token, reviewData);
      setReviews([...reviews, newReview]);
      setReviewForm({ rating: 0, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please log in to add to cart');
      navigate('/login');
      return;
    }
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    try {
      await addItem(id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="container mx-auto p-4 sm:p-8 text-center">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
      <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4 sm:p-8 text-center">
      <p className="text-lg text-red-500">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto p-4 sm:p-8 text-center">
      <p className="text-lg text-red-500">Product not found</p>
      <Link to="/" className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-semibold">
        Back to Products
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-orange-600 mb-8 sm:mb-10">{product.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        <div>
          <img
            src={product.imageURLs?.[0] || 'https://via.placeholder.com/150'}
            alt={product.name}
            className="w-full h-64 sm:h-[32rem] object-cover rounded-xl"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-lg font-extrabold text-orange-600">Price: ${product.price?.toFixed(2)}</p>
            <p className={`text-sm mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            <p className="text-gray-600">Category: {product.categoryId?.name || 'Uncategorized'}</p>
            <p className="text-gray-800 mt-4">{product.description}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-6 px-6 py-3 rounded-xl transition-all duration-300 ${
              product.stock > 0
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      <section className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-extrabold text-orange-600 mb-6">Reviews</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-white/90 rounded-xl border border-gray-200">
            <p className="text-lg text-gray-600">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="bg-white/90 rounded-xl border border-gray-200 p-4 sm:p-6 flex items-start hover:shadow-xl transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                    {review.userId?.name?.[0] || 'A'}
                  </div>
                </div>
                <div className="ml-4">
                  <StarRating rating={review.rating} readOnly />
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                  <p className="text-gray-500 text-sm">By {review.userId?.name || 'Anonymous'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="mt-8 bg-white/90 p-6 sm:p-8 rounded-xl border border-gray-200">
          <h3 className="text-lg sm:text-xl font-extrabold text-orange-600 mb-4">Write a Review</h3>
          <div className="grid gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="rating">Rating</label>
              <StarRating
                rating={reviewForm.rating}
                setRating={(value) => setReviewForm({ ...reviewForm, rating: value })}
              />
            </div>
            <div className="relative">
              <textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="peer border rounded-lg p-3 w-full focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                rows="4"
                required
                placeholder=" "
              />
              <label
                htmlFor="comment"
                className="absolute top-0 left-3 -translate-y-1/2 bg-white/90 px-1 text-gray-700 text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all"
              >
                Comment
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
            aria-label="Submit review"
          >
            Submit Review
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProductDetail;