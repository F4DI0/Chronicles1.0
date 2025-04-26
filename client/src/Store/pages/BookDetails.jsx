import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import books from '../data/books';

function BookDetails() {
  const { id } = useParams();
  
  // Convert the id from string to number to match the books' id format
  const book = books.find((b) => b.id === parseInt(id));

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (book) {
      const saved = JSON.parse(localStorage.getItem(`reviews-${id}`) || '[]');
      setReviews(saved);
    }
  }, [id, book]);

  const hasReviewed = reviews.some((r) => r.name === reviewerName.trim());

  const handleAddReview = () => {
    if (!reviewerName.trim() || !newReview.trim()) return;

    const updated = [...reviews, { name: reviewerName, text: newReview, rating }];
    setReviews(updated);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updated));
    setNewReview('');
    setReviewerName('');
    setRating(5);
  };

  // If no book is found, display an error message
  if (!book) return <div className="text-center p-8 text-[#C29F70]">Book not found.</div>;

  return (
    <div className="min-h-screen px-4 py-10 text-white bg-[#2B1D14] dark:bg-[#2B1D14]">
      <div className="max-w-3xl mx-auto bg-[#4E3728] p-6 rounded-lg shadow-lg">
        <img
          src={book.cover || '/default-cover.png'}
          alt={book.title}
          className="w-full h-auto mb-4 rounded"
        />
        <h1 className="text-3xl font-bold text-[#C29F70] mb-2">{book.title}</h1>
        <p className="text-sm text-gray-300 mb-2">By {book.author}</p>
        <p className="mb-4">{book.description}</p>
        <p className="mb-4 text-[#C29F70] font-bold">
          {Number(book.price) === 0 ? 'Free' : `$${Number(book.price).toFixed(2)}`}
        </p>

        {/* Reviews Section */}
        <h2 className="text-xl font-semibold mb-2">📋 Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {reviews.map((r, i) => (
              <li key={i} className="bg-[#2B1D14] p-2 rounded border border-[#C29F70]">
                <div className="text-sm font-semibold text-[#C29F70]">{r.name} ⭐ {r.rating} / 5</div>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Add Review */}
        <div className="space-y-2">
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Your name"
            className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
          />
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
          />
          <div>
            <label className="mr-2">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="bg-[#2B1D14] border border-[#C29F70] text-white rounded px-2 py-1"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddReview}
            disabled={hasReviewed}
            className={`w-full bg-[#C29F70] text-[#2B1D14] px-4 py-2 rounded font-semibold transition ${hasReviewed ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {hasReviewed ? 'You already reviewed' : '✅ Submit Review'}
          </button>
        </div>

        <Link
          to="/bookstore"
          className="block mt-6 text-sm underline text-[#C29F70] hover:text-[#e6c98a]"
        >
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}

export default BookDetails;
