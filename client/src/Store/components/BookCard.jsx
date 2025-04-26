import { useState } from 'react';

function BookCard({ book, onAddToCart, onClick }) {
  const [expanded, setExpanded] = useState(false);

  // Defensive fallback values
  if (!book || typeof book !== 'object') return null;

  const {
    cover = '/default-cover.png',
    title = 'Untitled',
    author = 'Unknown',
    genre = 'Uncategorized',
    description = '',
    price = 0,
    reviews = [],
  } = book;

  // Calculate average rating
  const averageRating = 
  Array.isArray(reviews) && reviews.length > 0
    ? reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / reviews.length
    : null;

  return (
    <div 
      className="bg-[#4E3728] rounded-lg shadow-md p-4 text-white w-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <img
        src={cover}
        alt={title}
        className="w-full h-64 object-cover object-top rounded mb-4"
      />

      <h3 className="text-xl font-semibold text-[#C29F70]">{title}</h3>
      <p className="text-sm text-gray-300">by {author}</p>

      <span className="inline-block bg-[#C29F70] text-[#2B1D14] text-xs font-bold mt-2 px-3 py-1 rounded-full">
        {genre}
      </span>

      {/* Average Rating */}
      {averageRating && (
        <div className="flex items-center gap-1 text-yellow-400 mt-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const full = Math.floor(averageRating);
            const half = averageRating - full >= 0.5;
            if (i < full) return <span key={i}>★</span>;
            if (i === full && half) return <span key={i}>⯪</span>;
            return <span key={i}>☆</span>;
          })}
          <span className="text-xs text-white ml-1">
            ({averageRating.toFixed(1)} from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      )}

      <span className="text-lg font-bold text-[#C29F70] mt-2">
        {Number(price) === 0 ? 'Free' : `$${Number(price).toFixed(2)}`}
      </span>

      <p className={`mt-3 text-gray-200 text-sm ${!expanded ? 'line-clamp-3 min-h-[4.5rem]' : ''}`}>
        {description}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        className="mt-1 text-[#C29F70] text-xs underline self-start"
      >
        {expanded ? 'Read Less' : 'Read More'}
      </button>

      <div className="mt-auto flex flex-col gap-2 pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(book);
          }}
          className="bg-[#C29F70] text-[#2B1D14] px-4 py-2 rounded font-semibold hover:opacity-90 transition"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}

export default BookCard;