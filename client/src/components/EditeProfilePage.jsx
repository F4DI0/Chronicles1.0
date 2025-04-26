import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuImagePlus } from "react-icons/lu";
import { useUser } from "../context/userContext";

function EditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State for form fields
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("/user.png");
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/users/myprofile", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setBio(data.myinfo.bio || "");

        // If user has a profile picture, fetch it
        if (data.myinfo.profilepic && data.myinfo.profilepic !== "none") {
          const picId = data.myinfo.profilepic.split("/")[1];
          const picResponse = await fetch(`http://localhost:3000/file/${picId}`, {
            credentials: "include",
          });

          if (picResponse.ok) {
            const blob = await picResponse.blob();
            setProfilePic(URL.createObjectURL(blob));
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation (you might want to add more)
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image must be less than 5MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
      setSelectedProfileFile(file);
      setErrorMessage(""); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      console.log(bio);
      // Update bio if changed
      if (bio !== user.preference?.bio) {
        const bioResponse = await fetch("http://localhost:3000/preference/bio", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bio }),
        });

        if (!bioResponse.ok) {
          throw new Error("Failed to update bio");
        }
      }

      // Update profile picture if changed
      if (selectedProfileFile) {
        const formData = new FormData();
        formData.append("file", selectedProfileFile);

        const pfpResponse = await fetch("http://localhost:3000/preference/pfp", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!pfpResponse.ok) {
          throw new Error("Failed to update profile picture");
        }
      }

      // Refresh user data in context
      const userResponse = await fetch("http://localhost:3000/users/myprofile", {
        credentials: "include",
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.myinfo);
      }

      // Redirect to profile page
      navigate(`/userProfile/${user._id}`);
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/userProfile/${user._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2B1D14] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#2B1D14] text-white p-4">
      {/* Profile Picture */}
      <div className="w-full max-w-3xl relative mt-8">
        <div className="flex justify-center">
          <label htmlFor="profile-photo" className="cursor-pointer relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-gray-700 rounded-full object-cover"
            />
            <LuImagePlus
              fontSize={20}
              className="absolute right-0 bottom-0 text-white cursor-pointer"
            />
          </label>
          <input
            type="file"
            id="profile-photo"
            className="hidden"
            accept="image/*"
            onChange={handleProfileUpload}
          />
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-3xl bg-[#1f1410] p-6 rounded-lg shadow-md">
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Bio Input */}
<div className="mb-4">
  <div className="flex justify-between items-center mb-2">
    <label className="block text-gray-300 text-sm">Bio</label>
    <span className={`text-xs ${bio.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>
      {bio.length}/50
    </span>
  </div>
  <textarea
    name="bio"
    value={bio}
    maxLength={50}
    onChange={(e) => {
      if (e.target.value.length <= 50) {
        setBio(e.target.value);
      }
    }}
    className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-700 outline-none focus:ring-2 focus:ring-[#795548]"
    placeholder="Tell us about yourself..."
    rows="3"
  ></textarea>
  {bio.length >= 50 && (
    <p className="text-red-500 text-xs mt-1">Maximum 50 characters reached</p>
  )}
</div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#795548] text-white font-bold rounded-lg hover:bg-[#8D6E63] transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;