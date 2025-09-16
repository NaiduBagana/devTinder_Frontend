import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-hot-toast";
import {
  Heart,
  X,
  Code,
  Mail,
  Calendar,
  User,
  Clock,
  RefreshCw,
  UserPlus,
  Bell,
  CheckCircle,
  XCircle,
  Sparkles,
  Star,
} from "lucide-react";

const Requests = () => {
  const user = useSelector((store) => store.user?.user);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const getRequests = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/requests/received`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      const requestData = data.requests || [];
      setRequests(requestData);
      console.log("Requests data:", requestData);
    } catch (err) {
      console.error("Requests error:", err);
      if (err.message.includes("401")) {
        toast.error("Please login to view requests");
      } else {
        toast.error("Error fetching requests: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (status, reqId, userName) => {
    if (actionLoading[reqId]) return;

    setActionLoading((prev) => ({ ...prev, [reqId]: status }));

    try {
      const response = await fetch(
        `${BASE_URL}/request/review/${status}/${reqId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update request");
      }

      const result = await response.json();

      // Remove the request from the list
      setRequests((prev) => prev.filter((req) => req._id !== reqId));

      if (status === "accepted") {
        toast.success(`🎉 You're now connected with ${userName}!`, {
          duration: 4000,
          icon: "💝",
        });
      } else {
        toast.success(`Request declined politely`, {
          icon: "👋",
        });
      }
    } catch (err) {
      console.error("Request action error:", err);
      toast.error("Error: " + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [reqId]: null }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (user) {
      getRequests();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-gray-400">
            You need to be logged in to view requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DevTinder</h1>
                <p className="text-gray-400 text-sm">Connection Requests</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg px-3 py-2">
                <Bell className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">
                  {requests.length} Request{requests.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={getRequests}
                disabled={loading}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh Requests"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-300 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && requests.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Loading Requests
              </h2>
              <p className="text-gray-400">
                Fetching your connection requests...
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center max-w-md">
              <UserPlus className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                No Connection Requests
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                No one has sent you connection requests yet. Keep using
                DevTinder and amazing developers will start reaching out!
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Discover Developers
              </button>
            </div>
          </div>
        )}

        {/* Requests List */}
        {requests.length > 0 && (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl"
              >
                <div className="md:flex">
                  {/* Profile Image */}
                  <div className="md:w-48 h-48 md:h-auto relative bg-gradient-to-br from-purple-500/20 to-blue-600/20">
                    <img
                      src={
                        request.fromUserId?.photoUrl ||
                        "https://www.gravatar.com/avatar/?d=mp"
                      }
                      alt={`${request.fromUserId?.firstName} ${request.fromUserId?.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://www.gravatar.com/avatar/?d=mp";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r"></div>

                    {/* Request Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center px-3 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full">
                        <Heart className="w-4 h-4 text-white mr-1" />
                        <span className="text-white text-xs font-medium">
                          Interested
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      {/* Profile Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {request.fromUserId?.firstName}{" "}
                              {request.fromUserId?.lastName}
                            </h3>
                            {request.fromUserId?.emailId && (
                              <p className="text-gray-400 text-sm flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {request.fromUserId?.emailId}
                              </p>
                            )}
                          </div>

                          {/* Time */}
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          {request.fromUserId?.age && (
                            <div className="flex items-center text-gray-300 text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                              <span>{request.fromUserId.age} years old</span>
                            </div>
                          )}
                        </div>

                        {/* Skills Preview */}
                        {request.fromUserId?.skills &&
                          request.fromUserId.skills.length > 0 && (
                            <div className="mb-6">
                              <div className="flex items-center mb-2">
                                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-300">
                                  Skills
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {request.fromUserId.skills
                                  .slice(0, 4)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-600/20 border border-purple-500/30 text-purple-300 rounded-full text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {request.fromUserId.skills.length > 4 && (
                                  <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                                    +{request.fromUserId.skills.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            handleRequest(
                              "rejected",
                              request._id,
                              request.fromUserId?.firstName
                            )
                          }
                          disabled={actionLoading[request._id]}
                          className="flex-1 flex items-center justify-center px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-400 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none font-semibold"
                        >
                          {actionLoading[request._id] === "rejected" ? (
                            <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin mr-2"></div>
                          ) : (
                            <XCircle className="w-5 h-5 mr-2" />
                          )}
                          {actionLoading[request._id] === "rejected"
                            ? "Declining..."
                            : "Decline"}
                        </button>

                        <button
                          onClick={() =>
                            handleRequest(
                              "accepted",
                              request._id,
                              request.fromUserId?.firstName
                            )
                          }
                          disabled={actionLoading[request._id]}
                          className="flex-1 flex items-center justify-center px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500 text-green-400 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none font-semibold"
                        >
                          {actionLoading[request._id] === "accepted" ? (
                            <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin mr-2"></div>
                          ) : (
                            <CheckCircle className="w-5 h-5 mr-2" />
                          )}
                          {actionLoading[request._id] === "accepted"
                            ? "Accepting..."
                            : "Accept"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {requests.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p className="mb-1">
              💡 Take your time to review each connection request
            </p>
            <p>✅ Accept to connect • ❌ Decline to pass</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
