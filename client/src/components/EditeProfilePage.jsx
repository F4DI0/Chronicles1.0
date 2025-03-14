import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuImagePlus } from "react-icons/lu";

function EditProfilePage() {
  const navigate = useNavigate();

  // Placeholder user ID (to be replaced with dynamic ID when backend is connected)
  const userId = "hVy5syKOgoPVIG1iy9RtzVKThBp1";

  // Placeholder state for form fields (to be fetched from the backend later)
  const [userData, setUserData] = useState({
    name: "", // Replace with actual dynamic name from backend
    bio: "",  // Replace with actual dynamic bio from backend
    interests: "", // Replace with actual interests from backend
  });

  // Placeholder state for image previews
  const [profilePic, setProfilePic] = useState("/user.png"); // Default profile image
  const [coverPhoto, setCoverPhoto] = useState("/Cover.jpg"); // Default cover photo

  // Handle Input Change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "profile") {
        setProfilePic(imageUrl);
      } else {
        setCoverPhoto(imageUrl);
      }
    }
  };

  // Handle Form Submission (Redirects to Profile Page)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", userData);
    console.log("Profile Pic:", profilePic);
    console.log("Cover Photo:", coverPhoto);
    
    // Redirect to the user's profile page (backend integration later)
    navigate(`/userProfile/${userId}`);
  };

  // Handle Cancel (Redirects to Profile Page)
  const handleCancel = () => {
    navigate(`/userProfile/${userId}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#2B1D14] text-white p-4">
      {/* Cover Photo */}
      <div className="w-full max-w-3xl relative">
        <div className="w-full h-[40vh] md:h-[50vh] overflow-hidden rounded-2xl shadow-md bg-black flex items-center justify-center">
          <label htmlFor="cover-photo" className="cursor-pointer relative">
            <img
              src={coverPhoto}
              alt="Cover"
              className="w-full h-auto object-cover"
            />
            <LuImagePlus
              fontSize={25}
              className="absolute right-4 bottom-4 text-white cursor-pointer"
            />
          </label>
          <input
            type="file"
            id="cover-photo"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "cover")}
          />
        </div>

        {/* Profile Picture */}
        <div className="absolute bottom-[-3rem] left-1/2 transform -translate-x-1/2">
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
            onChange={(e) => handleImageUpload(e, "profile")}
          />
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="mt-20 w-full max-w-3xl bg-[#1f1410] p-6 rounded-lg shadow-md">
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-700 outline-none focus:border-gray-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Bio Input */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Bio</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-700 outline-none focus:border-gray-500"
            placeholder="Tell us about yourself..."
            rows="3"
          ></textarea>
        </div>

        {/* Interests Input */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Favorite Books (comma separated)</label>
          <input
            type="text"
            name="interests"
            value={userData.interests}
            onChange={handleChange}
            className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-700 outline-none focus:border-gray-500"
            placeholder="e.g. 1984, The Great Gatsby, To Kill a Mockingbird"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;
