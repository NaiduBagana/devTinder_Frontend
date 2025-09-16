import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Trash2,
  Camera,
  Code,
  Heart,
  Star,
  Award,
  Plus,
  Minus,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "male",
    photoUrl: user?.photoUrl || "",
    about: user?.about || "",
    skills: user?.skills || [],
  });
  const [errors, setErrors] = useState({});

  // If no user data, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.error("Please login to view profile");
    }
  }, [user, navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset edit data to original user data
      setEditData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        age: user?.age || "",
        gender: user?.gender || "male",
        photoUrl: user?.photoUrl || "",
        about: user?.about || "",
        skills: user?.skills || [],
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSkillAdd = () => {
    if (
      newSkill.trim() &&
      editData.skills.length < 10 &&
      !editData.skills.includes(newSkill.trim())
    ) {
      setEditData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    } else if (editData.skills.includes(newSkill.trim())) {
      toast.error("Skill already exists");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editData.firstName || editData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (editData.firstName.trim().length > 50) {
      newErrors.firstName = "First name must be less than 50 characters";
    }

    if (!editData.lastName || editData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (editData.lastName.trim().length > 50) {
      newErrors.lastName = "Last name must be less than 50 characters";
    }

    if (editData.age && (editData.age < 18 || editData.age > 120)) {
      newErrors.age = "Age must be between 18 and 120";
    }

    if (editData.about && editData.about.length > 200) {
      newErrors.about = "About section must be less than 200 characters";
    }

    if (
      editData.photoUrl &&
      editData.photoUrl.trim() &&
      !isValidUrl(editData.photoUrl)
    ) {
      newErrors.photoUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Updating profile...");

    try {
      const response = await axios.patch(
        "http://localhost:3001/profile/edit",
        editData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        // Update Redux store with new data
        const updatedUser = { ...user, ...editData };
        dispatch({ type: "user/updateUser", payload: updatedUser });

        setIsEditing(false);
        toast.dismiss(loadingToast);
        toast.success("Profile updated successfully! 🎉");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update profile";
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Deleting account...");

    try {
      const response = await axios.delete(BASE_URL + "/profile/delete", {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.dismiss(loadingToast);
        toast.success("Account deleted successfully");

        // Remove user from Redux store
        dispatch(removeUser());

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to delete account";
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading or redirect if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DevTinder</h1>
                <p className="text-gray-400 text-sm">Profile Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              {/* Profile Photo */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={
                      (isEditing ? editData.photoUrl : user.photoUrl) ||
                      "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gradient-to-r from-purple-500 to-blue-600"
                    onError={(e) => {
                      e.target.src = "https://www.gravatar.com/avatar/?d=mp";
                    }}
                  />
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-blue-700 transition-all duration-200">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      name="photoUrl"
                      value={editData.photoUrl}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.photoUrl ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="Enter photo URL"
                    />
                    {errors.photoUrl && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.photoUrl}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-400">{user.emailId}</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 mb-6">
                {user.age && (
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-purple-400" />
                    <span>{editData.age} years old</span>
                  </div>
                )}
                {user.gender && (
                  <div className="flex items-center text-gray-300">
                    <User className="w-5 h-5 mr-3 text-blue-400" />
                    <span className="capitalize">{editData.gender}</span>
                  </div>
                )}
                {user.about && (
                  <div className="flex items-start text-gray-300">
                    <Heart className="w-5 h-5 mr-3 mt-1 text-red-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed line-clamp-3">
                        {editData.about}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 mr-3 text-green-400" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
              </div>

              {/* Delete Account */}
              {isEditing && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-all duration-200 border border-red-800 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-400" />
                Basic Information
              </h3>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleInputChange}
                      maxLength="50"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleInputChange}
                      maxLength="50"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Age (Optional)
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={editData.age}
                      onChange={handleInputChange}
                      min="18"
                      max="120"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.age ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="Enter age"
                    />
                    {errors.age && (
                      <p className="text-red-400 text-sm mt-1">{errors.age}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{user.emailId}</p>
                  </div>
                  {user.age && (
                    <div>
                      <p className="text-gray-400 text-sm">Age</p>
                      <p className="text-white font-semibold">
                        {user.age} years
                      </p>
                    </div>
                  )}
                  {user.gender && (
                    <div>
                      <p className="text-gray-400 text-sm">Gender</p>
                      <p className="text-white font-semibold capitalize">
                        {user.gender}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                About Me
              </h3>

              {isEditing ? (
                <div>
                  <textarea
                    name="about"
                    value={editData.about}
                    onChange={handleInputChange}
                    rows="4"
                    maxLength="200"
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.about ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="Tell others about yourself..."
                  />
                  <div className="flex justify-between mt-2">
                    {errors.about && (
                      <p className="text-red-400 text-sm">{errors.about}</p>
                    )}
                    <p className="text-gray-400 text-sm ml-auto">
                      {editData.about?.length || 0}/200
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {user.about || "No description added yet."}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                Skills & Technologies
              </h3>

              {isEditing ? (
                <div>
                  {/* Add new skill */}
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSkillAdd()}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a skill (max 10)"
                      disabled={editData.skills.length >= 10}
                    />
                    <button
                      onClick={handleSkillAdd}
                      disabled={
                        !newSkill.trim() || editData.skills.length >= 10
                      }
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-r-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Skills list */}
                  <div className="flex flex-wrap gap-2">
                    {editData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-600/20 border border-purple-500/30 text-purple-300 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="ml-2 text-purple-400 hover:text-red-400 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    {editData.skills.length}/10 skills
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-600/20 border border-purple-500/30 text-purple-300 rounded-full font-medium"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No skills added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="bg-red-900/50 border border-red-700 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Delete Account
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
