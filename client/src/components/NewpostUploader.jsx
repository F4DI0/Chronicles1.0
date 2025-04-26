import { GiScrollQuill } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { FaFileImage, FaFilePdf } from "react-icons/fa";
import { useState } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";

function NewpostUploader() {
  const [uploadData, setUploadData] = useState(false);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [genre, setGenre] = useState("");
  const [value, setValue] = useState("Upload");
  const [previewUrl, setPreviewUrl] = useState(null);
  const { darkMode } = useDarkMode();

  const handleCreatePost = async (description, file, genre) => {
    try {
      const formData = new FormData();
      formData.append("title", description);
      formData.append("genre", genre);
      formData.append("file", file);

      setValue("Uploading...");
      const response = await fetch("http://localhost:3000/posts/upload", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        setUploadData(false);
        setDesc("");
        setGenre("");
        setFile(null);
        setPreviewUrl(null);
      } else {
        console.log("Failed to upload post.");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      setValue("Upload");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreatePost(desc, file, genre);
  };

  return (
    <div className={`w-full rounded-xl p-4 transition-colors duration-300 ${
      darkMode ? "bg-gray-900/50" : "bg-warmBeige"
    }`}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setUploadData(true)}
        className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-colors duration-300 ${
          darkMode 
            ? "bg-gray-800 hover:bg-gray-700 text-gray-100" 
            : "bg-warmBrown hover:bg-amber-700 text-warmBeige"
        }`}
      >
        <GiScrollQuill className="text-xl" />
        <span className="font-semibold">Create a Post</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {uploadData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onSubmit={handleSubmit}
              className={`w-full max-w-md rounded-xl shadow-xl ${
                darkMode ? "bg-gray-800 text-gray-100" : "bg-warmBeige text-warmText"
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b ${
                darkMode ? "border-gray-700 bg-gray-900" : "border-warmBrown bg-amber-50"
              }`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Create New Post</h2>
                  <button
                    type="button"
                    onClick={() => setUploadData(false)}
                    className={`p-1 rounded-full ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-amber-100"
                    }`}
                  >
                    <ImCross className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 focus:ring-amber-500 focus:border-amber-500" 
                        : "bg-white border-amber-200 focus:ring-amber-400 focus:border-amber-400"
                    }`}
                    rows="3"
                    placeholder="What's on your mind?"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium mb-1">Genre / Tag</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 focus:ring-amber-500 focus:border-amber-500" 
                        : "bg-white border-amber-200 focus:ring-amber-400 focus:border-amber-400"
                    }`}
                    placeholder="Fiction, Science, Poetry..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">Attachment</label>
                  <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    darkMode 
                      ? "border-gray-600 hover:border-amber-500 bg-gray-700/50" 
                      : "border-amber-300 hover:border-amber-500 bg-white"
                  }`}>
                    {previewUrl ? (
                      file?.type.startsWith("image/") ? (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-h-40 rounded-md object-contain" 
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <FaFilePdf className={`text-4xl ${
                            darkMode ? "text-red-400" : "text-red-500"
                          } mb-2`} />
                          <p className="text-xs">{file.name}</p>
                        </div>
                      )
                    ) : (
                      <>
                        <FaFileImage className={`text-3xl mb-2 ${
                          darkMode ? "text-amber-400" : "text-amber-500"
                        }`} />
                        <span className="text-sm">Click to upload image or PDF</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className={`p-4 border-t ${
                darkMode ? "border-gray-700 bg-gray-900" : "border-warmBrown bg-amber-50"
              } flex justify-end gap-3`}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUploadData(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600" 
                      : "bg-amber-200 hover:bg-amber-300"
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!desc && !file}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                    (!desc && !file) 
                      ? "bg-gray-500 cursor-not-allowed" 
                      : darkMode 
                        ? "bg-amber-600 hover:bg-amber-500" 
                        : "bg-warmBrown hover:bg-amber-700"
                  }`}
                >
                  {value}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NewpostUploader;