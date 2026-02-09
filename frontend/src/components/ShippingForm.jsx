import { useState } from 'react';

function ShippingForm({ onSubmit }) {
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(shippingInfo);
  };

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={shippingInfo.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={shippingInfo.city}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium">Postal Code</label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={shippingInfo.postalCode}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          value={shippingInfo.country}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Continue to Payment
      </button>
    </form>
  );
}

export default ShippingForm;