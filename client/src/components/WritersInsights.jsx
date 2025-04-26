import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Eye, Heart, BookOpen } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/userContext";

const WritersInsights = () => {
  const { darkMode } = useDarkMode();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState({
    likes: 0,
    reach: 0,
    booksSold: 0,
    topPosts: [],
    activityData: []
  });

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/writers/insights', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        setInsights({
          likes: data.totallikes,
          reach: data.totalviews,
          booksSold: data.totalbooksSold,
          topPosts: data.topPosts,
          activityData: data.activityData
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching insights:", err);
        setError("Failed to load insights. Please try again.");
        setLoading(false);
      }
    };

    if (user?.isWriter) {
      fetchInsights();
    }
  }, [user]);

  if (!user?.isWriter) {
    return (
      <div className={`p-6 text-center ${darkMode ? "bg-gray-900 text-gray-200" : "bg-warmBeige text-gray-900"}`}>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You need to be a writer to access these insights.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`p-6 text-center ${darkMode ? "bg-gray-900 text-gray-200" : "bg-warmBeige text-gray-900"}`}>
        <h1 className="text-2xl font-bold">Loading Insights...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 text-center ${darkMode ? "bg-gray-900 text-gray-200" : "bg-warmBeige text-gray-900"}`}>
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`p-6 space-y-6 transition-all ${darkMode ? "bg-gray-900 text-gray-200" : "bg-warmBeige text-gray-900"
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
              {insights.likes.toLocaleString()}
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
              {insights.reach.toLocaleString()}
            </span>
          </CardContent>
        </Card>

        <Card className={`transition-all ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
          <CardHeader>
            <CardTitle>Books Sold</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <BookOpen className="text-green-500" size={30} />
            <span className={`text-2xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              {insights.booksSold.toLocaleString()}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Activity Graph */}
      <div className={`shadow-md rounded-lg p-6 transition-all ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-bold mb-4">📈 Monthly Activity</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={insights.activityData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="month"
              stroke={darkMode ? "#FFFFFF" : "#000000"}
            />
            <YAxis
              stroke={darkMode ? "#FFFFFF" : "#000000"}
              label={{
                value: 'Count',
                angle: -90,
                position: 'insideLeft',
                style: { fill: darkMode ? "#FFFFFF" : "#000000" }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#1E293B" : "#FFFFFF",
                color: darkMode ? "#FFFFFF" : "#000000",
                borderRadius: '0.5rem',
                border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB'
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            <Line
              type="monotone"
              dataKey="posts"
              name="Posts Published"
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="likes"
              name="Likes Received"
              stroke="#ef4444"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="views"
              name="Views Gained"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Posts */}
      <div className={`shadow-md rounded-lg p-6 transition-all ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-bold mb-4">🔥 Top Performing Posts</h2>
        <div className="space-y-3">
          {insights.topPosts.map((post, index) => (
            <div
              key={index}
              className={`flex justify-between border p-3 rounded-lg transition-all ${darkMode ? "border-gray-700" : "border-gray-300"}`}
            >
              <span className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                {post.title}
              </span>
              <div className="flex space-x-4">
                <span className="text-red-500">❤️ {post.likes.toLocaleString()}</span>
                <span className="text-blue-500">👀 {post.views.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          className={`transition-all ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-200 text-gray-900 border-gray-400"
            }`}
        >
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default WritersInsights;