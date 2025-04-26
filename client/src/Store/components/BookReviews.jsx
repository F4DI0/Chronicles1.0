// src/components/BookReviews.js
import { useState, useEffect } from 'react';

function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem('book-reviews') || '{}');
    setReviews(allReviews[bookId] || []);
  }, [bookId]);

  const handleAddReview = () => {
    if (!reviewText.trim()) return;

    const newReview = {
      text: reviewText,
      rating,
      date: new Date().toLocaleString(),
    };

    const allReviews = JSON.parse(localStorage.getItem('book-reviews') || '{}');
    const bookReviews = allReviews[bookId] || [];

    const updatedReviews = {
      ...allReviews,
      [bookId]: [...bookReviews, newReview],
    };

    localStorage.setItem('book-reviews', JSON.stringify(updatedReviews));
    setReviews(updatedReviews[bookId]);
    setReviewText('');
    setRating(5);
  };

  return (
    <div className="mt-10 p-4 bg-[#4E3728] rounded text-white">
      <h3 className="text-xl font-bold mb-4 text-[#C29F70]">📝 Reviews</h3>
      
      {reviews.length > 0 ? (
        reviews.map((r, i) => (
          <div key={i} className="mb-4 border-b pb-2 border-[#C29F70]">
            <p className="text-sm text-[#C29F70]">{r.date}</p>
            <p className="font-semibold">⭐ {r.rating}/5</p>
            <p>{r.text}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-300">No reviews yet.</p>
      )}

      <div className="mt-6">
        <textarea
          className="w-full p-2 rounded bg-[#2B1D14] border border-[#C29F70] text-white"
          rows={3}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
        />

        <div className="flex items-center justify-between mt-2">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="bg-[#2B1D14] border border-[#C29F70] text-white p-1 rounded"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
            ))}
          </select>

          <button
            onClick={handleAddReview}
            className="bg-[#C29F70] text-[#2B1D14] px-4 py-2 rounded hover:opacity-90"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookReviews;
