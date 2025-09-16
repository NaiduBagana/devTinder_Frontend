import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-hot-toast";
import {
  Heart,
  X,
  Star,
  Code,
  RefreshCw,
  User,
  Sparkles,
  Calendar,
  Mail,
  Info,
  ChevronDown,
  ChevronUp,
  Users,
  Briefcase,
} from "lucide-react";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user?.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [swipeAnimation, setSwipeAnimation] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const getFeed = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      const feedData = response?.data?.data;
      dispatch(addFeed(feedData));
      console.log("Feed data:", feedData);
    } catch (err) {
      console.error("Feed error:", err);
      if (err.response?.status === 401) {
        toast.error("Please login to view feed");
      } else {
        toast.error(
          "Error fetching feed: " + (err.response?.data?.message || err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (status, targetUserId) => {
    if (actionLoading) return;
    setActionLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/request/send/${status}/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (status === "interested") {
        toast.success("Connection request sent! 💝");
      } else {
        toast.success("Profile passed 👋");
      }

      // Remove user from feed and move to next
      dispatch(removeUserFromFeed(targetUserId));
      setShowDetails(false); // Reset details view
    } catch (err) {
      console.error("Connection request error:", err);
      const errorMsg = err.response?.data?.message || err.message;
      toast.error("Error: " + errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (!feed || feed.length === 0 || actionLoading) return;

    const currentUser = feed[currentIndex];
    if (!currentUser) return;

    // Set animation
    setSwipeAnimation(direction === "left" ? "swipe-left" : "swipe-right");

    // Wait for animation
    setTimeout(async () => {
      const status = direction === "left" ? "ignored" : "interested";
      await sendConnectionRequest(status, currentUser._id);
      setSwipeAnimation("");

      // Move to next card or refresh if no more cards
      if (currentIndex >= feed.length - 1) {
        setCurrentIndex(0);
        if (feed.length <= 1) {
          getFeed(); // Load more users
        }
      }
    }, 300);
  };

  const handleKeyPress = (event) => {
    if (event.key === "ArrowLeft") {
      handleSwipe("left");
    } else if (event.key === "ArrowRight") {
      handleSwipe("right");
    } else if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      setShowDetails(!showDetails);
    }
  };

  const getGenderEmoji = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "👨";
      case "female":
        return "👩";
      case "other":
        return "👤";
      default:
        return "";
    }
  };

  const formatJoinDate = (createdAt) => {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  useEffect(() => {
    if (!user) return;
    if (!feed || feed.length === 0) {
      getFeed();
    }
  }, [user]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentIndex, feed, actionLoading, showDetails]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-gray-400">
            You need to be logged in to view the feed
          </p>
        </div>
      </div>
    );
  }

  if (loading && (!feed || feed.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Feed</h2>
          <p className="text-gray-400">Finding amazing developers for you...</p>
        </div>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            No More Profiles!
          </h2>
          <p className="text-gray-400 mb-6">
            You've seen all available developers. Check back later for new
            profiles!
          </p>
          <button
            onClick={getFeed}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 mx-auto disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Loading..." : "Refresh Feed"}
          </button>
        </div>
      </div>
    );
  }

  const currentUser = feed[currentIndex];
  const nextUser = feed[currentIndex + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DevTinder</h1>
                <p className="text-gray-400 text-sm">
                  Discover Amazing Developers
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-gray-400">
              <span className="text-sm">
                {feed.length > 0
                  ? `${currentIndex + 1} of ${feed.length}`
                  : "0 profiles"}
              </span>
              <button
                onClick={getFeed}
                disabled={loading}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Refresh Feed"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="max-w-md mx-auto p-4 pt-8">
        <div className="relative h-auto min-h-[600px]">
          {/* Next Card (Background) */}
          {nextUser && !showDetails && (
            <div className="absolute inset-0 transform scale-95 opacity-30 z-0">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 h-[600px] p-6">
                <div className="relative h-full">
                  <img
                    src={nextUser.photoUrl}
                    alt={`${nextUser.firstName} ${nextUser.lastName}`}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                    onError={(e) => {
                      e.target.src = "https://www.gravatar.com/avatar/?d=mp";
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Current Card */}
          {currentUser && (
            <div
              className={`relative z-10 transition-all duration-300 ${
                swipeAnimation === "swipe-left"
                  ? "transform -translate-x-full opacity-0 rotate-12"
                  : swipeAnimation === "swipe-right"
                  ? "transform translate-x-full opacity-0 -rotate-12"
                  : ""
              }`}
            >
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                {/* Profile Image Section */}
                <div className="relative h-80">
                  <img
                    src={currentUser.photoUrl}
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://www.gravatar.com/avatar/?d=mp";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  {/* Basic Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-end justify-between">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-1 flex items-center">
                          {currentUser.firstName} {currentUser.lastName}
                          {currentUser.age && (
                            <span className="text-2xl font-normal text-gray-300 ml-2">
                              {currentUser.age}
                            </span>
                          )}
                          {currentUser.gender && (
                            <span className="ml-2 text-2xl">
                              {getGenderEmoji(currentUser.gender)}
                            </span>
                          )}
                        </h2>
                        {currentUser.emailId && (
                          <div className="flex items-center text-gray-300 text-sm">
                            <Mail className="w-4 h-4 mr-1" />
                            {currentUser.emailId}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        title={showDetails ? "Hide Details" : "Show Details"}
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6">
                  {/* About Section */}
                  {currentUser.about &&
                    currentUser.about !==
                      "Hey there! I am using DevTinder 🚀" && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-400" />
                          About
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {currentUser.about}
                        </p>
                      </div>
                    )}

                  {/* Skills */}
                  {currentUser.skills && currentUser.skills.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-400" />
                        Skills & Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.skills
                          .slice(0, showDetails ? undefined : 6)
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-600/20 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        {!showDetails && currentUser.skills.length > 6 && (
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                            +{currentUser.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Extended Details */}
                  {showDetails && (
                    <div className="space-y-6 border-t border-gray-700 pt-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-green-400" />
                          Personal Information
                        </h3>
                        <div className="space-y-3">
                          {currentUser.age && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Age</span>
                              <span className="text-gray-300 text-sm">
                                {currentUser.age} years old
                              </span>
                            </div>
                          )}
                          {currentUser.gender &&
                            currentUser.gender !== "prefer not to say" && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">
                                  Gender
                                </span>
                                <span className="text-gray-300 text-sm capitalize flex items-center">
                                  {getGenderEmoji(currentUser.gender)}{" "}
                                  {currentUser.gender}
                                </span>
                              </div>
                            )}
                          {currentUser.createdAt && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">
                                Joined DevTinder
                              </span>
                              <span className="text-gray-300 text-sm flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatJoinDate(currentUser.createdAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Mail className="w-5 h-5 mr-2 text-cyan-400" />
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Email</span>
                            <span className="text-gray-300 text-sm">
                              {currentUser.emailId}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Profile Stats */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-orange-400" />
                          Profile Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">
                              Skills Listed
                            </span>
                            <span className="text-gray-300 text-sm">
                              {currentUser.skills?.length || 0} / 10
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">
                              Profile Status
                            </span>
                            <span className="text-green-400 text-sm flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle Details Button */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors mx-auto"
                    >
                      <span className="text-sm">
                        {showDetails ? "Show Less" : "Show More Details"}
                      </span>
                      {showDetails ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Action Hint */}
                  <div className="text-center pt-4 border-t border-gray-700/50 mt-6">
                    <p className="text-gray-400 text-sm mb-2">
                      Swipe right to connect • Swipe left to pass
                    </p>
                    <p className="text-gray-500 text-xs">
                      Use arrow keys ← → or spacebar for details
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center space-x-8 mt-8">
          {/* Pass Button */}
          <button
            onClick={() => handleSwipe("left")}
            disabled={actionLoading || !currentUser}
            className="w-16 h-16 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-400 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:transform-none"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Details Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-12 h-12 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500 text-blue-400 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
            title="Toggle Details"
          >
            <Info className="w-6 h-6" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => handleSwipe("right")}
            disabled={actionLoading || !currentUser}
            className="w-16 h-16 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500 text-green-400 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:transform-none"
          >
            <Heart className="w-8 h-8" />
          </button>
        </div>

        {/* Action Loading Indicator */}
        {actionLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-white">Processing...</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p className="mb-1">
            💡 Pro tip: Press spacebar to toggle details, use arrows to swipe!
          </p>
          <p>❤️ Right = Interested • ✖️ Left = Pass • ℹ️ Info = Details</p>
        </div>
      </div>
    </div>
  );
};

export default Feed;
