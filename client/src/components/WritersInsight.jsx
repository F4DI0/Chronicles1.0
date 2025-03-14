import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Eye, Heart, BookOpen } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";

const WritersInsights = () => {
  const { darkMode } = useDarkMode();

  // Dummy data (Replace with API data)
  const [insights, setInsights] = useState({
    likes: 1234,
    reach: 5678,
    booksSold: 245,
    topPosts: [
      { title: "The Dark Sun", likes: 320, views: 1200 },
      { title: "Winds of Change", likes: 280, views: 1000 },
      { title: "Echoes of the Past", likes: 210, views: 850 },
    ],
  });

  // Mock activity data for graph
  const activityData = [
    { month: "Jan", likes: 120, views: 300, booksSold: 20 },
    { month: "Feb", likes: 150, views: 500, booksSold: 35 },
    { month: "Mar", likes: 180, views: 800, booksSold: 50 },
    { month: "Apr", likes: 200, views: 1200, booksSold: 70 },
  ];

  return (
    <div
      className={`p-6 space-y-6 transition-all ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-warmBeige text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold">📊 Creator Insights</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className={`transition-all ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
          <CardHeader>
            <CardTitle>Total Likes</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Heart className="text-red-500" size={30} />
            <span className={`text-2xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              {insights.likes}
            </span>
          </CardContent>
        </Card>

        <Card className={`transition-all ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
          <CardHeader>
            <CardTitle>Total Reach</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Eye className="text-blue-500" size={30} />
            <span className={`text-2xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              {insights.reach}
            </span>
          </CardContent>
        </Card>

        <Card className={`transition-all ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
          <CardHeader>
            <CardTitle>Books Sold (Last Month)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <BookOpen className="text-green-500" size={30} />
            <span className={`text-2xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              {insights.booksSold}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Activity Graph */}
      <div className={`shadow-md rounded-lg p-6 transition-all ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-bold mb-4">📈 Monthly Growth</h2>
        <LineChart width={500} height={300} data={activityData}>
          <XAxis dataKey="month" stroke={darkMode ? "#FFFFFF" : "#000000"} />
          <YAxis stroke={darkMode ? "#FFFFFF" : "#000000"} />
          <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1E293B" : "#FFFFFF", color: darkMode ? "#FFFFFF" : "#000000" }} />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#FF0000" />
          <Line type="monotone" dataKey="views" stroke="#0000FF" />
          <Line type="monotone" dataKey="booksSold" stroke="#00FF00" />
        </LineChart>
      </div>

      {/* Top Posts */}
      <div className={`shadow-md rounded-lg p-6 transition-all ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-bold mb-4">🔥 Top Performing Posts</h2>
        <div className="space-y-3">
          {insights.topPosts.map((post, index) => (
            <div key={index} className={`flex justify-between border p-3 rounded-lg transition-all ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
              <span className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{post.title}</span>
              <div className="flex space-x-4">
                <span className="text-red-500">❤️ {post.likes}</span>
                <span className="text-blue-500">👀 {post.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          className={`transition-all ${
            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-200 text-gray-900 border-gray-400"
          }`}
        >
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default WritersInsights;
