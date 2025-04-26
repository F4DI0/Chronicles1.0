// src/components/PurchaseHistory.js
import React from 'react';

function PurchaseHistory({ history, onBack, onClear, onRemove }) {
  // Flatten all purchased items from each transaction
  const allItems = history.flatMap((purchase) => purchase.items || []);

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-4 text-sm text-[#C29F70] hover:underline"
      >
        ← Back to store
      </button>

      <h2 className="text-3xl font-bold text-[#C29F70] mb-6">📖 Purchase History</h2>

      {allItems.length === 0 ? (
        <p className="text-center text-gray-300">No previous purchases.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {allItems.map((item, index) => (
              <li
                key={index}
                className="bg-[#4E3728] rounded p-4 flex justify-between items-center"
              >
                <div>
                  <span>{item.title}</span>
                  <div className="text-xs text-gray-400">${item.price.toFixed(2)}</div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-400 text-xs hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Clear All */}
          <div className="mt-6 text-center">
            <button
              onClick={onClear}
              className="text-sm text-red-400 underline hover:text-red-300"
            >
              🗑️ Clear Purchase History
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PurchaseHistory;
