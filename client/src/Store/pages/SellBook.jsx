import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SellBook({ darkMode, setDarkMode }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [pages, setPages] = useState(1);
  const [price, setPrice] = useState(1);
  const [coverImage, setCoverImage] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const navigate = useNavigate();
  const genres = ['Fiction', 'Non-Fiction', 'Fantasy', 'Science', 'Biography', 'Romance', 'History', 'Poetry'];

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookFile) {
      alert("Please upload your book file.");
      return;
    }

    let base64Cover = '/default-cover.png';
    if (coverImage) {
      try {
        base64Cover = await convertToBase64(coverImage);
      } catch {
        alert("Failed to read cover image.");
      }
    }

    const newBook = {
      id: Date.now(),
      title,
      author,
      description,
      genre,
      pages: Number(pages),
      price: Number(price),
      cover: base64Cover,
      file: bookFile ? URL.createObjectURL(bookFile) : null,
      fromUser: true,
      reviews: [],
    };

    const existing = JSON.parse(localStorage.getItem('user-books') || '[]');
    localStorage.setItem('user-books', JSON.stringify([...existing, newBook]));
    navigate('/bookstore');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-warmBeige text-[#2B1D14] dark:bg-[#2B1D14] dark:text-white px-4 py-10 transition-colors duration-500">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`relative w-14 h-8 flex items-center rounded-full px-1 transition-colors duration-500 ${darkMode ? 'bg-[#C29F70]' : 'bg-gray-300'}`}
          >
            <span className="absolute left-1 text-xs">🌞</span>
            <span className="absolute right-1 text-xs">🌙</span>
            <div className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-500 ease-in-out ${darkMode ? 'translate-x-6 bg-[#2B1D14]' : 'translate-x-0 bg-white'}`} />
          </button>
        </div>

        <div className="max-w-xl mx-auto bg-[#4E3728] p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-3xl font-bold text-[#C29F70] mb-6 text-center">📤 Upload Your Book</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-1">Book Title</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Author</label>
    <input
      type="text"
      value={author}
      onChange={(e) => setAuthor(e.target.value)}
      required
      className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Description</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
      rows={3}
      className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
    />
  </div>


  <div>
    <label className="block text-sm font-medium mb-1">Genre</label>
    <select
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
      required
      className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
    >
      <option value="">Select a genre</option>
      {genres.map((g) => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  </div>


  <div className="flex gap-4">
    <div className="flex-1">
      <label className="block text-sm font-medium mb-1">Pages</label>
      <input
        type="number"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        required
        min={1}
        className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
      />
    </div>

    <div className="flex-1">
      <label className="block text-sm font-medium mb-1">Price ($)</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        required
        min={0}
        step={1}
        className="w-full p-2 rounded bg-[#2B1D14] text-white border border-[#C29F70]"
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Book Cover</label>
    <input
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      onChange={(e) => setCoverImage(e.target.files[0])}
      className="text-sm"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Book File (PDF or EPUB)</label>
    <input
      type="file"
      accept=".pdf,.epub"
      onChange={(e) => setBookFile(e.target.files[0])}
      className="text-sm"
    />
  </div>

  <button
    type="submit"
    className="w-full mt-4 bg-[#C29F70] text-[#2B1D14] px-6 py-2 rounded font-semibold hover:opacity-90 transition"
  >
    ✅ Publish Book
  </button>

  <button
    type="button"
    onClick={() => navigate('/bookstore')}
    className="w-full mt-2 text-sm underline text-[#C29F70] hover:text-[#e6c98a] text-center"
  >
    ← Back to Store
  </button>
</form>

        </div>
      </div>
    </div>
  );
}

export default SellBook;
