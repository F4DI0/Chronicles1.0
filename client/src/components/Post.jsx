import { useEffect, useState } from "react";
import SinglePost from "./SinglePost";

function Post() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Fetch posts from your backend
        const response = await fetch("http://localhost:3000/posts/getall", {
          method: "GET",
          header: {
            "contentType" : "application/json"
          }
        });
        const data = await response.json();

        if (response.ok) {
          setPosts(data); // Update state with the fetched posts
        } else {
          console.error("Failed to fetch posts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (isLoading) {
    return (
      <div className="w-full lg:w-4/5 my-5 lg:px-3 py-2 flex items-center justify-center flex-col-reverse">
        <section className="bg-black/20 dark:bg-gray-900 w-full px-5 rounded-2xl">
          <div className="w-full py-10 mx-auto animate-pulse">
            <div className="w-full">
              <h1 className="w-12 h-12 mb-7 bg-gray-700 rounded-3xl dark:bg-gray-700"></h1>
              <div className="w-full h-72 bg-gray-600 rounded-lg dark:bg-gray-600"></div>
              <h1 className="w-36 h-7 mt-7 bg-gray-700 rounded dark:bg-gray-700"></h1>
              <p className="w-full h-10 mt-7 bg-gray-700 rounded-md dark:bg-gray-700"></p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-4/5 my-2 lg:px-3 py-2 flex items-center justify-center flex-col-reverse">
      {posts.length > 0 ? (
        posts.map((item) => (
          <SinglePost key={item._id} postId={item._id} {...item} />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}

export default Post;
