import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

const PerformanceChart = () => {
  const data = [
    { day: "Mon", applications: 4, jobs: 2 },
    { day: "Tue", applications: 3, jobs: 3 },
    { day: "Wed", applications: 5, jobs: 1 },
    { day: "Thu", applications: 7, jobs: 4 },
    { day: "Fri", applications: 6, jobs: 3 },
    { day: "Sat", applications: 8, jobs: 2 },
    { day: "Sun", applications: 5, jobs: 3 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="jobs"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
