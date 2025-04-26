
function Confirmation({ onBack }) {
  return (
    <div className="p-6 max-w-3xl mx-auto text-white text-center animate-fade-in">
      {/* Success Emoji Animation */}
      <div className="text-6xl mb-4 animate-bounce">🎉</div>

      {/* Success Message */}
      <h2 className="text-3xl font-bold text-[#C29F70] mb-2">
        Purchase Successful!
      </h2>
      <p className="text-gray-300 mb-6">
        Thank you for your purchase. Your digital book is ready to download.
      </p>

      {/* Download Button */}
      <a
        href="/book-sample.pdf"
        download
        className="inline-block bg-[#C29F70] text-[#2B1D14] font-semibold px-6 py-3 rounded shadow hover:opacity-90 transition"
      >
        📥 Download Book
      </a>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={onBack}
          className="text-sm text-[#C29F70] underline hover:text-[#e0c388]"
        >
          ← Back to Store
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
