import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import booksData from './data/books';
import BookCard from './components/BookCard';
import Cart from './components/Cart';
import Confirmation from './components/confirmation';
import PurchaseHistory from './components/PurchaseHistory';
import BookDetails from '../Store/pages/BookDetails';
import { useDarkMode } from '../context/DarkModeContext'; // Import dark mode context

function StoreHome() {
  const { darkMode, setDarkMode } = useDarkMode(); // Use the dark mode context
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedBook, setSelectedBook] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const userBooks = JSON.parse(localStorage.getItem('user-books') || '[]');
  const cleanBooks = [...booksData, ...userBooks].filter(book => book && book.title && book.cover);
  const mergedBooks = [...booksData, ...userBooks].map((book) => {
    const savedReviews = JSON.parse(localStorage.getItem(`reviews-${book.id}`) || '[]');
    return { ...book, reviews: savedReviews };
  });

  const [allBooks, setAllBooks] = useState(mergedBooks);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('chronicles-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    const saved = localStorage.getItem('chronicles-history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddReview = (bookId, review) => {
    const updated = allBooks.map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          reviews: [...(book.reviews || []), review],
        };
      }
      return book;
    });
    localStorage.setItem('user-books', JSON.stringify(updated.filter((b) => b.fromUser))); // optional
    setAllBooks(updated);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  useEffect(() => {
    localStorage.setItem('chronicles-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('chronicles-history', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  const handleAddToCart = (book) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === book.id);
      if (!exists) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return [...prev, book];
      }
      return prev;
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    const timestamp = new Date().toISOString();
    const newHistoryItem = {
      id: timestamp,
      items: cart,
      date: timestamp,
      buyer: {
        name: 'John Doe',
        email: 'john@example.com',
        paymentMethod: 'Credit Card',
      },
    };

    setPurchaseHistory((prev) => [...prev, newHistoryItem]);
    setCart([]);
    localStorage.removeItem('chronicles-cart');
    localStorage.setItem('last-buyer-info', JSON.stringify(newHistoryItem));

    navigate('/bookstore/checkout-success');
  };

  const handleRemoveFromHistory = (id) => {
    const updated = purchaseHistory.map((purchase) => ({
      ...purchase,
      items: purchase.items.filter((item) => item.id !== id),
    })).filter((p) => p.items.length > 0);
    setPurchaseHistory(updated);
  };

  const handleClearHistory = () => {
    setPurchaseHistory([]);
    localStorage.removeItem('chronicles-history');
  };

  const genres = ['All', ...new Set(allBooks.map((book) => book.genre))];

  const filteredBooks = allBooks.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOrder) {
      case 'asc': return a.title.localeCompare(b.title);
      case 'desc': return b.title.localeCompare(a.title);
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating-asc': {
        const aAvg = a.reviews?.length ? a.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / a.reviews.length : 0;
        const bAvg = b.reviews?.length ? b.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / b.reviews.length : 0;
        return aAvg - bAvg;
      }
      case 'rating-desc': {
        const aAvg = a.reviews?.length ? a.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / a.reviews.length : 0;
        const bAvg = b.reviews?.length ? b.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / b.reviews.length : 0;
        return bAvg - aAvg;
      }
      default: return 0;
    }
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && visibleCount < sortedBooks.length) {
      setVisibleCount((prev) => prev + 12);
    }
  }, [inView, sortedBooks.length]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen mt-12 bg-warmBeige text-[#2B1D14] dark:bg-[#2B1D14] dark:text-white transition-colors duration-500">


        {showHistory && (
          <div className="fixed inset-0 bg-[#2B1D14]/90 z-50 overflow-y-auto">
            <PurchaseHistory
              history={purchaseHistory}
              onBack={() => setShowHistory(false)}
              onRemove={handleRemoveFromHistory}
              onClear={handleClearHistory}
            />
          </div>
        )}

        {showCart && !showHistory && (
          <div className="fixed inset-0 bg-[#2B1D14]/90 z-50 overflow-y-auto">
            {showConfirmation ? (
              <Confirmation onBack={() => {
                setShowCart(false);
                setShowConfirmation(false);
              }} />
            ) : (
              <Cart
                cartItems={cart}
                onClose={() => setShowCart(false)}
                onRemove={handleRemoveFromCart}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        )}

        <div className="w-full px-4">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/logo.png"
              alt="Chronicles Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#C29F70] tracking-wide">
              Chronicles Bookstore
            </h1>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(4);
              }}
              className="flex-1 p-2 rounded bg-[#4E3728] text-white placeholder:text-[#C29F70] border border-[#C29F70]"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setVisibleCount(4);
                }}
                className="px-4 py-2 rounded bg-[#C29F70] text-[#2B1D14] font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre);
                  setVisibleCount(4);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedGenre === genre ? 'bg-[#C29F70] text-[#2B1D14]' : 'bg-[#4E3728] text-white'}`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setVisibleCount(4);
              }}
              className="bg-[#4E3728] text-white border border-[#C29F70] rounded px-4 py-2"
            >
              <option value="asc">Title: A–Z</option>
              <option value="desc">Title: Z–A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>

          <p className="text-sm text-[#C29F70] mb-4">
            {filteredBooks.length} book{filteredBooks.length !== 1 && 's'} found
          </p>

          {filteredBooks.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-2 gap-y-4">
                {sortedBooks
                  .filter((book) => book && book.title && book.cover !== undefined)
                  .map((book) => (
                    <Link key={book.id} to={`/bookstore/book/${book.id}`}>
                    <BookCard
                      key={book.id}
                      book={book}
                      onAddToCart={handleAddToCart}
                      onClick={() => handleBookClick(book)}
                    />
                    </Link>
                  ))}
              </div>

              <div ref={ref} className="h-10" />
            </>
          ) : (
            <p className="text-center text-[#C29F70] mt-10 font-semibold">
              No books found. Try a different search or genre.
            </p>
          )}
        </div>

        {!showCart && !showHistory && (
          <div className="fixed right-6 bottom-6 flex flex-col items-end space-y-3">
            <button
              onClick={() => { setShowCart(true); setShowHistory(false); }}
              className="bg-[#C29F70] text-[#2B1D14] px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition"
            >
              🛒 Cart ({cart.length})
            </button>

            <button
              onClick={() => setShowHistory(true)}
              className="bg-[#4E3728] text-[#C29F70] px-4 py-2 rounded-full shadow-lg text-sm hover:opacity-90 transition"
            >
              📖 Purchase History
            </button>

            <button
              onClick={() => navigate('/bookstore/sell')}
              className="bg-[#4E3728] text-[#C29F70] px-4 py-2 rounded-full shadow-lg text-sm hover:opacity-90 transition animate-pulse flex items-center gap-2"
            >
              📤 <span className="font-semibold">Upload Book</span>
            </button>
          </div>
        )}

        {showToast && (
          <div className="fixed bottom-28 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
            Book added to cart ✅
          </div>
        )}

        {selectedBook && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative bg-warmBeige dark:bg-[#2B1D14] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedBook(null)} // Close the modal
                className="absolute top-4 right-4 text-2xl"
              >
                &times;
              </button>
              <BookDetails
                book={selectedBook} // Passing the selected book data to BookDetails
                onAddReview={handleAddReview} // Handling adding a review
                onClose={() => setSelectedBook(null)} // Close BookDetails modal
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StoreHome;
