import { useState, useEffect } from "react";
import { useDarkMode } from "/src/context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaFileAlt } from "react-icons/fa";

function AdminValidator() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [pendingForms, setPendingForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingValidator, setCheckingValidator] = useState(true);

  useEffect(() => {
    const checkIfValidator = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/myprofile", {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to verify user");

        if (!data.isvalidator) {
          navigate("/home"); // not a validator ➔ redirect home
        } else {
          setCheckingValidator(false); // allowed
        }
      } catch (err) {
        console.error("Validator check failed:", err);
        navigate("/home"); // error checking ➔ redirect home
      }
    };

    checkIfValidator();
  }, [navigate]);

  useEffect(() => {
    if (checkingValidator) return; // wait until validator check finishes

    const fetchPendingForms = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/validation/allpendingforms", {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch pending forms.");
        setPendingForms(data);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingForms();
  }, [checkingValidator]);

  const handleApprove = async (formId) => {
    if (!window.confirm("Are you sure you want to validate this user?")) return;
    try {
      const response = await fetch(`http://localhost:3000/validation/approve/${formId}`, {
        method: "PATCH",
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to approve form.");

      setPendingForms(prev => prev.filter(form => form._id !== formId));
      alert("User successfully validated!");
    } catch (err) {
      console.error("Error approving form:", err);
      alert("Error validating user. Try again.");
    }
  };

  const handleDecline = async (formId) => {
    if (!window.confirm("Are you sure you want to decline this application?")) return;
    try {
      const response = await fetch(`http://localhost:3000/validation/decline/${formId}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to decline form.");

      setPendingForms(prev => prev.filter(form => form._id !== formId));
      alert("Form declined successfully.");
    } catch (err) {
      console.error("Error declining form:", err);
      alert("Error declining form. Try again.");
    }
  };

  if (checkingValidator) {
    return (
      <div className={`p-10 ${darkMode ? "bg-gray-900 text-white" : "bg-warmBeige text-black"}`}>
        <h2 className="text-2xl font-bold">Checking authorization...</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`p-10 ${darkMode ? "bg-gray-900 text-white" : "bg-warmBeige text-black"}`}>
        <h2 className="text-2xl font-bold">Loading pending forms...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-10 ${darkMode ? "bg-gray-900 text-white" : "bg-warmBeige text-black"}`}>
        <h2 className="text-2xl font-bold">Error: {error}</h2>
      </div>
    );
  }

  if (pendingForms.length === 0) {
    return (
      <div className={`p-10 ${darkMode ? "bg-gray-900 text-white" : "bg-warmBeige text-black"}`}>
        <h2 className="text-2xl font-bold">No pending forms to validate.</h2>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-warmBeige text-black"}`}>
      <div className="max-w-7xl mx-auto overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full table-auto">
          <thead className={darkMode ? "bg-gray-800" : "bg-warmBrown"}>
            <tr>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Experience</th>
              <th className="px-4 py-2">Topics</th>
              <th className="px-4 py-2">Sample</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingForms.map((form) => (
              <tr key={form._id} className={darkMode ? "border-b border-gray-700" : "border-b border-gray-300"}>
                <td className="px-4 py-2">{form.full_name}</td>
                <td className="px-4 py-2">{form.email}</td>
                <td className="px-4 py-2">{form.phoneNumber}</td>
                <td className="px-4 py-2">{form.location}</td>
                <td className="px-4 py-2 capitalize">{form.experience}</td>
                <td className="px-4 py-2">{form.specializedTopics}</td>
                <td className="px-4 py-2">
                  <a
                    href={`http://localhost:3000/validation/view/${form.writingSamples.split('/')[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-2"
                  >
                    <FaFileAlt /> View
                  </a>
                </td>
                <td className="px-4 py-2 flex items-center gap-3">
                  <button
                    onClick={() => handleApprove(form._id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded flex items-center gap-1"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleDecline(form._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded flex items-center gap-1"
                  >
                    <FaTimes /> Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminValidator;
