import { useState } from "react";

function Settings() {
  const [username, setUsername] = useState("YourUsername");
  const [email, setEmail] = useState("your.email@example.com");
  const [bio, setBio] = useState("Tell something about yourself...");
  const [isDisabled, setIsDisabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="w-full lg:w-3/5 mx-auto bg-black text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Account Settings</h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/user.png"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-gray-500"
        />
        <button className="mt-2 text-sm text-blue-400 hover:underline cursor-pointer">
          Change Profile Picture
        </button>
      </div>

      {/* Edit Personal Information */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Username</label>
        <input
          type="text"
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled // Email is not editable
        />
        <p className="text-gray-400 text-xs">Email cannot be changed.</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Bio</label>
        <textarea
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white"
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {/* Change Password */}
      <div className="mb-6">
        <label className="block text-sm mb-1">New Password</label>
        <input
          type="password"
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white"
          placeholder="Enter new password"
        />
        <button className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-700 transition">
                Change Password
              </button>
      </div>

      {/* Account Settings */}
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 text-yellow-400 bg-gray-700 border-gray-600 rounded-md"
            checked={isDisabled}
            onChange={() => setIsDisabled(!isDisabled)}
          />
          <span className="text-sm">Disable Account</span>
        </label>
      </div>

      {/* Delete Account */}
      <button
        onClick={() => setShowDeleteModal(true)}
        className="w-full p-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Delete Account
      </button>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-white">Confirm Deletion</h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
