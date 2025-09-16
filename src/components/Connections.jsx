import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-hot-toast";
import ConnectionCard from "./ConnectionCard";
import {
  Users,
  Code,
  Mail,
  Calendar,
  User,
  Heart,
  MessageCircle,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  Sparkles,
} from "lucide-react";

const Connections = () => {
  const user = useSelector((store) => store.user?.user);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConnections, setFilteredConnections] = useState([]);

  const getConnections = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/viewConnections`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch connections");
      }

      const data = await response.json();
      const connectionData = data?.data || [];
      setConnections(connectionData);
      setFilteredConnections(connectionData);
      console.log("Connections data:", connectionData);
    } catch (err) {
      console.error("Connections error:", err);
      if (err.message.includes("401")) {
        toast.error("Please login to view connections");
      } else {
        toast.error("Error fetching connections: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter((connection) => {
        const fullName =
          `${connection.firstName} ${connection.lastName}`.toLowerCase();
        const email = connection.emailId?.toLowerCase() || "";
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase())
        );
      });
      setFilteredConnections(filtered);
    }
  }, [searchTerm, connections]);

  useEffect(() => {
    if (user) {
      getConnections();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-gray-400">
            You need to be logged in to view connections
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10 ">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DevTinder</h1>
                <p className="text-gray-400 text-sm">
                  Your Developer Connections
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg px-3 py-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">
                  {filteredConnections.length} Connection
                  {filteredConnections.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={getConnections}
                disabled={loading}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh Connections"
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        {connections.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search connections by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Results Count */}
              <div className="text-gray-400 text-sm">
                {searchTerm && (
                  <span>
                    Showing {filteredConnections.length} of {connections.length}{" "}
                    connections
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && connections.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Loading Connections
              </h2>
              <p className="text-gray-400">
                Fetching your developer network...
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && connections.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center max-w-md">
              <UserCheck className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                No Connections Yet
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Start connecting with amazing developers! Swipe right on
                profiles you're interested in to build your network.
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

        {/* No Search Results */}
        {!loading &&
          searchTerm &&
          filteredConnections.length === 0 &&
          connections.length > 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-md">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  No Results Found
                </h2>
                <p className="text-gray-400 mb-4">
                  No connections match your search for "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

        {/* Connections Grid */}
        {filteredConnections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredConnections.map((connection) => (
              <ConnectionCard key={connection._id} connection={connection}/>
            ))}
          </div>
        )}

        {/* Load More Button (Future Enhancement) */}
        {filteredConnections.length > 0 && filteredConnections.length >= 12 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-medium">
              Load More Connections
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
