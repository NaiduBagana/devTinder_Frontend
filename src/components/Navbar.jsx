import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-hot-toast";
import { Heart, User, Users, Bell, LogOut, Code2 } from "lucide-react";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      dispatch(removeUser());
      const response = await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Logout successful ✅");
        navigate("/login");
      } else {
        toast.error("Logout failed ❌");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      toast.error("Error during logout: " + err.message);
    }
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                  <Heart className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Dev
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Tinder
                </span>
                <Code2 className="w-5 h-5 text-gray-400 ml-1" />
              </div>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-200">
                    Welcome back,
                  </p>
                  <p className="text-sm text-gray-400">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            )}

            {/* Avatar Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-sm opacity-0 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-700 hover:ring-pink-500/50 transition-all duration-200">
                    {!user ? (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        alt="User Avatar"
                        src={
                          user.photoUrl ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              {user && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                  <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-500/30">
                        <img
                          alt="User Avatar"
                          src={
                            user.photoUrl ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-200">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-150 group/item"
                    >
                      <User className="w-4 h-4 text-gray-400 group-hover/item:text-pink-400" />
                      <span className="text-gray-200 group-hover/item:text-white">
                        Profile
                      </span>
                      <span className="ml-auto bg-pink-500/20 text-pink-400 text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    </Link>

                    <Link
                      to="/connections"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-150 group/item"
                    >
                      <Users className="w-4 h-4 text-gray-400 group-hover/item:text-pink-400" />
                      <span className="text-gray-200 group-hover/item:text-white">
                        My Connections
                      </span>
                    </Link>

                    <Link
                      to="/requests"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-150 group/item"
                    >
                      <Bell className="w-4 h-4 text-gray-400 group-hover/item:text-pink-400" />
                      <span className="text-gray-200 group-hover/item:text-white">
                        Requests
                      </span>
                    </Link>

                    <div className="border-t border-gray-700/50 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors duration-150 group/item w-full"
                      >
                        <LogOut className="w-4 h-4 text-gray-400 group-hover/item:text-red-400" />
                        <span className="text-gray-200 group-hover/item:text-red-400">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
