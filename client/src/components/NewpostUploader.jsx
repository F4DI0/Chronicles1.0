import { GiScrollQuill } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { FaFileImage, FaFilePdf } from "react-icons/fa";
import { useState } from "react";

function NewpostUploader() {
  const [uploadData, setUploadData] = useState(false);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [genre, setGenre] = useState("");
  const [value, setValue] = useState("Upload");
  const [previewUrl, setPreviewUrl] = useState(null);

  // Function to create a post by sending data to the backend
  const handleCreatePost = async (description, file, genre) => {
    try {
      const formData = new FormData();
      formData.append("title", description);
      formData.append("genre", genre);
      formData.append("file", file); // Attach the file

      // Send a POST request to the backend to upload the post
      const response = await fetch("http://localhost:3000/posts/upload", {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData,
        credentials: "include", // Ensure session cookies are sent with the request
      });

      if (response.ok) {
        console.log("Post uploaded successfully!");
        setUploadData(false); // Close the uploader modal
        // Optionally, you can update the UI after post creation
      } else {
        console.log("Failed to upload post.");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  // Handle file selection & preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreatePost(desc, file, genre); // Call the backend function
  };

  return (
    <div className="w-full lg:w-4/5 rounded-xl px-3 py-2 bg-black/20 flex items-center justify-center flex-col">
      {/* Open Post Uploader */}
      <span className="flex items-center justify-center w-full my-3">
        <label
          className="flex items-center justify-center bg-black/40 px-4 py-2 rounded-lg cursor-pointer hover:bg-black/60 transition"
          onClick={() => setUploadData(true)}
        >
          <GiScrollQuill className="text-green-600 mx-2 text-lg" />
          <h3 className="text-white text-sm font-semibold">Create a Post</h3>
        </label>
      </span>

      {/* Modal - Post Uploader */}
      {uploadData && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <form
            className="w-full max-w-lg bg-[#1f1410] shadow-lg rounded-lg flex flex-col p-6 text-white relative"
            onSubmit={handleSubmit}
          >
            {/* Close Button */}
            <ImCross
              fontSize={20}
              className="absolute top-3 right-3 cursor-pointer hover:text-gray-400"
              onClick={() => setUploadData(false)}
            />

            <h2 className="text-xl font-semibold text-center mb-4">Create New Post</h2>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">Description</label>
              <textarea
                name="description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-700 outline-none focus:border-gray-500 text-sm"
                placeholder="Write something about your post..."
                rows="2"
              ></textarea>
            </div>

            {/* Genre Selection */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">Genre / Tag</label>
              <input
                type="text"
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-700 outline-none focus:border-gray-500 text-sm"
                placeholder="Enter a genre (e.g., Fiction, Science, History)"
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">Attach a File (Image or PDF)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="block w-full text-white bg-gray-800 p-2 rounded-md border border-gray-700 cursor-pointer text-sm"
                onChange={handleFileChange}
              />
            </div>

            {/* File Preview */}
            {previewUrl && (
              <div className="w-full flex items-center justify-center bg-gray-900 p-3 rounded-lg mt-3">
                {file?.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-auto max-h-40 rounded-md object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <FaFilePdf className="text-red-500 text-3xl mb-2" />
                    <p className="text-xs">{file.name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setUploadData(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md text-sm"
                disabled={!desc && !file}
              >
                {value}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NewpostUploader;
