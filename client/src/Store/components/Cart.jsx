
function Cart({ cartItems, onClose, onRemove, onCheckout, onViewHistory }) {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      {/* Back button */}
      <button
        onClick={onClose}
        className="mb-4 text-sm text-[#C29F70] hover:underline"
      >
        ← Back to store
      </button>
     
     
      



      <h2 className="text-3xl font-bold text-[#C29F70] mb-6">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-300">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="bg-[#4E3728] rounded p-4 flex justify-between items-center"
              >
                <div>
                  <span>{item.title}</span>
                  <div className="text-xs text-gray-400">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-400 text-sm hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right text-lg text-[#C29F70] font-bold">
            Total: ${total.toFixed(2)}
          </div>

          {/* Proceed to Checkout */}
          <div className="text-right mt-4">
            <button
              onClick={onCheckout}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
