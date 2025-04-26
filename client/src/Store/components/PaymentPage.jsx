// src/components/PaymentPage.js

function PaymentPage() {
  return (
    <div className="flex flex-col md:flex-row p-6 bg-gray-100 min-h-screen">
      {/* Left Section: Customer Info & Payment Details */}
      <div className="md:w-2/3 p-4 bg-white rounded shadow-md">
        {/* Customer Information Form */}
        {/* Payment Method Selection */}
      </div>

      {/* Right Section: Order Summary */}
      <div className="md:w-1/3 p-4 bg-white rounded shadow-md md:ml-6 mt-6 md:mt-0">
        {/* List of Cart Items */}
        {/* Discount Code Entry */}
        {/* Total Calculation */}
        {/* Secure Payment Button */}
      </div>
    </div>
  );
}

export default PaymentPage;
