import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CheckoutSuccess() {
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo({ ...buyerInfo, [name]: value });
    setErrors({ ...errors, [name]: '' }); // clear error when typing
  };

  const isValidExpiry = (expiry) => {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const [_, month, year] = match;
    const exp = new Date(`20${year}`, parseInt(month) - 1);
    const now = new Date();
    return parseInt(month) >= 1 && parseInt(month) <= 12 && exp >= now;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!/^\d{16}$/.test(buyerInfo.cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
    }

    if (!isValidExpiry(buyerInfo.expiry)) {
      newErrors.expiry = 'Invalid expiry format or date (MM/YY).';
    }

    if (!/^\d{3}$/.test(buyerInfo.cvv)) {
      newErrors.cvv = 'CVV must be 3 digits.';
    }

    if (!buyerInfo.name) {
      newErrors.name = 'Name is required.';
    }

    if (!buyerInfo.email) {
      newErrors.email = 'Email is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#2B1D14] text-white text-center px-4">
        <div className="animate-bounce text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2 text-[#C29F70]">Thank you for your purchase!</h1>
        <p className="text-lg mb-4 text-gray-300">
          Name: {buyerInfo.name} <br />
          Email: {buyerInfo.email} <br />
          Payment: Visa ending in {buyerInfo.cardNumber.slice(-4)}
        </p>

        <a
          href="/book-sample.pdf"
          download
          className="bg-[#C29F70] text-[#2B1D14] px-6 py-2 rounded font-semibold hover:opacity-90 transition"
        >
          ⬇️ Download Book
        </a>

        <Link
          to="/bookstore"
          className="mt-6 text-sm underline text-[#C29F70] hover:text-[#d6b976] transition"
        >
          ← Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2B1D14] text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#4E3728] p-8 rounded shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-[#C29F70] text-center">Enter Payment Info</h2>

        <div>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={buyerInfo.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={buyerInfo.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            name="cardNumber"
            type="text"
            placeholder="Card Number"
            value={buyerInfo.cardNumber}
            onChange={handleChange}
            maxLength="16"
            className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
          />
          {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <input
              name="expiry"
              type="text"
              placeholder="MM/YY"
              value={buyerInfo.expiry}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
            />
            {errors.expiry && <p className="text-red-400 text-sm mt-1">{errors.expiry}</p>}
          </div>

          <div className="flex-1">
            <input
              name="cvv"
              type="text"
              placeholder="CVV"
              value={buyerInfo.cvv}
              onChange={handleChange}
              maxLength="3"
              className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
            />
            {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#C29F70] text-[#2B1D14] font-semibold py-2 rounded hover:opacity-90 transition"
        >
          Complete Payment
        </button>
      </form>
    </div>
  );
}

export default CheckoutSuccess;
