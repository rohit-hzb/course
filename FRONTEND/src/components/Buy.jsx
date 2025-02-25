import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) setToken(user.token);
  }, []);

  const handlePurchase = async () => {
    if (!token) {
      toast.error("Please login to purchase the course");
      navigate("/login");
      return;
    }

    if (!courseId) {
      toast.error("Invalid course ID");
      return;
    }

    try {
      setLoading(true);

      // Debugging: Log API URL

      const response = await axios.post(
        `http://localhost:3001/api/v1/course/buy/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      toast.success(response.data.message || "Course purchased successfully!");
      navigate("/purchases");
    } catch (error) {
      console.error("Purchase Error:", error);

      const errorMessage = error?.response?.data?.errors || "Purchase failed. Try again.";

      if (error?.response?.status === 404) {
        toast.error("Course not found.");
      } else if (error?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (error?.response?.status === 400) {
        toast.error("You have already purchased this course.");
        navigate("/purchases");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handlePurchase} disabled={loading}>
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}

export default Buy;
