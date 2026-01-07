import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const RecentActivity = ({ applications }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="text-green-500" size={16} />;
      case "rejected":
        return <XCircle className="text-red-500" size={16} />;
      case "pending":
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent applications</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">
                {app.clientId?.name?.charAt(0) || "C"}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {app.jobId?.title || "Untitled Job"}
              </h4>
              <p className="text-sm text-gray-500">
                {app.clientId?.name || "Unknown Client"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {getStatusIcon(app.status)}
              <span className="text-sm capitalize">
                {app.status || "pending"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(app.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
