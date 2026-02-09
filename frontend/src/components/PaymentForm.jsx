import { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

function PaymentForm({ shippingInfo, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const { checkout } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      await checkout(shippingInfo, paymentMethod.id);
      // Redirect or show success message
      toast.success('Payment successful!');
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Card Details</label>
        <div className="border p-2 rounded-md">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default PaymentForm;