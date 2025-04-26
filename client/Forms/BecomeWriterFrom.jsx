import { useState, useEffect } from "react";
import { FaPenFancy, FaBookOpen, FaCheckCircle } from "react-icons/fa";
import { useDarkMode } from '/src/context/DarkModeContext';
import { useUser } from '/src/context/userContext';

function BecomeWriterForm() {
  const { darkMode } = useDarkMode();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phoneNumber: "",
    location: "",
    experience: "",
    portfolio: "",
    topics: "",
    motivation: "",
    guidelinesAgreement: false,
  });
  const [writingSamples, setWritingSamples] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    isWriter: false,
    issubmitted: false,
    loading: true
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/validation/status", {
          method: "GET",
          credentials: 'include'
        });
        const data = await response.json();
        setStatus({
          isWriter: data.accepted || false,
          issubmitted: data.issubmitted || false,
          loading: false
        });
      } catch (err) {
        console.error("Error checking status:", err);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };
    checkStatus();
  }, [success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    setWritingSamples(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!writingSamples) {
      setError("Please upload writing samples");
      setLoading(false);
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phoneNumber || 
        !formData.location || !formData.experience || !formData.topics || 
        !formData.guidelinesAgreement) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append('writingSamples', writingSamples);

      const response = await fetch('http://localhost:3000/validation/postform', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status.loading) {
    return (
      <div className={`min-h-screen py-8 px-4 ${darkMode ? "bg-gray-800" : "bg-[#F5E6C8]"} transition-all duration-300`}>
        <div className={`relative ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} w-full max-w-4xl mx-auto p-8 rounded-lg shadow-lg`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <FaPenFancy className={darkMode ? "text-[#F5E6C8]" : "text-[#5D4037]"} />
              Loading...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (status.isWriter) {
    return (
      <div className={`min-h-screen py-8 px-4 ${darkMode ? "bg-gray-800" : "bg-[#F5E6C8]"} transition-all duration-300`}>
        <div className={`relative ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} w-full max-w-4xl mx-auto p-8 rounded-lg shadow-lg`}>
          <div className="absolute -bottom-6 -right-6 bg-green-600 p-3 rounded-full shadow-lg">
            <FaCheckCircle className="text-3xl text-white" />
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              
              Welcome Back, Writer!
            </h2>
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              You're already part of our writing team. Thank you for your contributions!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success || status.issubmitted) {
    return (
      <div className={`min-h-screen py-8 px-4 ${darkMode ? "bg-gray-800" : "bg-[#F5E6C8]"} transition-all duration-300`}>
        <div className={`relative ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} w-full max-w-4xl mx-auto p-8 rounded-lg shadow-lg`}>
          <div className="absolute -bottom-6 -right-6 bg-[#5D4037] p-3 rounded-full shadow-lg">
            <FaBookOpen className="text-3xl text-[#F5E6C8]" />
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <FaPenFancy className={darkMode ? "text-[#F5E6C8]" : "text-[#5D4037]"} />
              Application Submitted
            </h2>
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Thank you for your application! We're reviewing your submission and will get back to you soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? "bg-gray-800" : "bg-[#F5E6C8]"} transition-all duration-300`}>
      <div className={`relative ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} w-full max-w-4xl mx-auto p-8 rounded-lg shadow-lg`}>
        <div className="absolute -bottom-6 -right-6 bg-[#5D4037] p-3 rounded-full shadow-lg">
          <FaBookOpen className="text-3xl text-[#F5E6C8]" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <FaPenFancy className={darkMode ? "text-[#F5E6C8]" : "text-[#5D4037]"} />
            Become a Writer
          </h2>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Join our community of passionate writers and share your voice
          </p>
        </div>

        {error && (
          <div className={`mb-4 p-3 rounded-lg ${darkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800"}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode 
                  ? "bg-gray-600 border-gray-500 focus:border-[#F5E6C8]" 
                  : "bg-white border-gray-300 focus:border-[#5D4037]"
                } focus:outline-none focus:ring-1 ${darkMode ? "focus:ring-[#F5E6C8]" : "focus:ring-[#5D4037]"}`}
                required
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode 
                  ? "bg-gray-600 border-gray-500 focus:border-[#F5E6C8]" 
                  : "bg-white border-gray-300 focus:border-[#5D4037]"
                } focus:outline-none focus:ring-1 ${darkMode ? "focus:ring-[#F5E6C8]" : "focus:ring-[#5D4037]"}`}
                required
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode 
                  ? "bg-gray-600 border-gray-500 focus:border-[#F5E6C8]" 
                  : "bg-white border-gray-300 focus:border-[#5D4037]"
                } focus:outline-none focus:ring-1 ${darkMode ? "focus:ring-[#F5E6C8]" : "focus:ring-[#5D4037]"}`}
                required
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Country & City *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode 
                  ? "bg-gray-600 border-gray-500 focus:border-[#F5E6C8]" 
                  : "bg-white border-gray-300 focus:border-[#5D4037]"
                } focus:outline-none focus:ring-1 ${darkMode ? "focus:ring-[#F5E6C8]" : "focus:ring-[#5D4037]"}`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Years of Writing Experience *
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${darkMode 
                ? "bg-gray-600 border-gray-500 focus:border-[#F5E6C8]" 
                : "bg-white border-gray-300 focus:border-[#5D4037]"
              } focus:outline-none focus:ring-1 ${darkMode ? "focus:ring-[#F5E6C8]" : "focus:ring-[#5D4037]"}`}
              required
            >
              <option value="">Select your experience</option>
              <option value="less than a year">Less than a year</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Portfolio Links (optional)
            </label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://example.com/portfolio"
              className={`w-full p-3 rounded-lg border ${darkMode 
                ? "bg-gray-600 border-gray-500 focus:border-[#F5E6C8]" 
                : "bg-white border-gray-300 focus:border-[#5D4037]"
              } focus:outline-none focus:ring-1 ${darkMode ? "focus:ring-[#F5E6C8]" : "focus:ring-[#5D4037]"}`}
            />
          </div>

          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Writing Samples *
            </label>
            <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? "border-gray-500 bg-gray-600" : "border-gray-300 bg-gray-50"}`}>
              <input
                type="file"
                name="writingSamples"
                className="w-full"
                onChange={handleFileUpload}
                required
              />
              {writingSamples && (
                <p className="mt-2 text-sm">
                  Selected file: {writingSamples.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Why do you want to write for us? (optional)
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              rows="4"
              className={`w-full p-3 rounded-lg border ${darkMode 
                ? "bg-gray-600 border-gray-500 focus:border-[#F5E6C8]" 
                : "bg-white border-gray-300 focus:border-[#5D4037]"
              } focus:outline-none focus:ring-1 ${darkMode ? "focus:ring-[#F5E6C8]" : "focus:ring-[#5D4037]"}`}
            ></textarea>
          </div>

          <div>
            <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Topics you specialize in *
            </label>
            <input
              type="text"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              placeholder="e.g., Technology, Health, Finance, etc."
              className={`w-full p-3 rounded-lg border ${darkMode 
                ? "bg-gray-600 border-gray-500 focus:border-[#F5E6C8]" 
                : "bg-white border-gray-300 focus:border-[#5D4037]"
              } focus:outline-none focus:ring-1 ${darkMode ? "focus:ring-[#F5E6C8]" : "focus:ring-[#5D4037]"}`}
              required
            />
          </div>

          <div className="space-y-3">
            <label className={`flex items-start gap-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <input
                type="checkbox"
                name="guidelinesAgreement"
                checked={formData.guidelinesAgreement}
                onChange={handleChange}
                className={`mt-1 rounded ${darkMode ? "accent-[#F5E6C8]" : "accent-[#5D4037]"}`}
                required
              />
              <span>I agree to follow the editorial guidelines *</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-bold text-lg 
              ${
                darkMode 
                  ? "bg-[#003366] text-white hover:bg-[#F5E6C8] hover:text-black" 
                  : "bg-[#F5E6C8] text-black hover:bg-[#003366] hover:text-white"
              }
              transition-colors duration-200 ease-in-out shadow-md flex items-center justify-center gap-2 disabled:opacity-70`}
          >
            {loading ? "Submitting..." : (
              <>
                <FaPenFancy /> Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BecomeWriterForm;