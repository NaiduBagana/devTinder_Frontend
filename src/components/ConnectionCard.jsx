import React from "react";
import { Mail, Calendar, User, MessageCircle } from "lucide-react";

const ConnectionCard = ({ connection }) => {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
      {/* Profile Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-blue-600/20">
        <img
          src={connection.photoUrl || "https://www.gravatar.com/avatar/?d=mp"}
          alt={`${connection.firstName} ${connection.lastName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://www.gravatar.com/avatar/?d=mp";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center px-2 py-1 bg-green-500/80 backdrop-blur-sm rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
            <span className="text-white text-xs font-medium">Connected</span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-5">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-1">
            {connection.firstName} {connection.lastName}
          </h3>
          {connection.emailId && (
            <p className="text-gray-400 text-sm flex items-center justify-center">
              <Mail className="w-4 h-4 mr-1" />
              {connection.emailId}
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div className="space-y-2 mb-4">
          {connection.age ? (
            <div className="flex items-center text-gray-300 text-sm">
              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
              <span>{connection.age} years old</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-300 text-sm">
              {/* <Calendar className="w-4 h-4 mr-2 text-purple-400" /> */}
              <div className="w-4 h-4 mr-2 "></div>
              <span></span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-600/20 border border-purple-500/30 text-purple-300 rounded-lg hover:from-purple-500/30 hover:to-blue-600/30 transition-all duration-200 text-sm font-medium">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </button>
          <button
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            title="View Profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
