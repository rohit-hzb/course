import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPurchases = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/user/purchases", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.courseData)) {
          setPurchases(response.data.courseData);
        } else {
          setPurchases([]);
        }
      } catch (error) {
        console.error("Failed to fetch purchase data:", error);
        toast.error("Failed to load purchases.");
        setPurchases([]);
      }
    };

    fetchPurchases();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3001/api/v1/user/logout", { withCredentials: true });
      toast.success("Logged out successfully");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}>
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4"><Link to="/" className="flex items-center"><RiHome2Fill className="mr-2" /> Home</Link></li>
            <li className="mb-4"><Link to="/courses" className="flex items-center"><FaDiscourse className="mr-2" /> Courses</Link></li>
            <li className="mb-4"><Link to="/purchases" className="flex items-center text-blue-500"><FaDownload className="mr-2" /> Purchases</Link></li>
            <li className="mb-4"><Link to="/settings" className="flex items-center"><IoMdSettings className="mr-2" /> Settings</Link></li>
            <li>
              {token ? (
                <button onClick={handleLogout} className="flex items-center"><IoLogOut className="mr-2" /> Logout</button>
              ) : (
                <Link to="/login" className="flex items-center"><IoLogIn className="mr-2" /> Login</Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button */}
      <button className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        <h2 className="text-2xl font-semibold mt-6 md:mt-0 mb-6">My Purchases</h2>

        {/* Purchases List */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
                <img
                  className="rounded-lg w-full h-48 object-cover"
                  src={purchase.image?.url || "https://via.placeholder.com/200"}
                  alt={purchase.title || "Course Image"}
                />
                <h3 className="text-lg font-bold mt-3">{purchase.title || "Untitled Course"}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  {purchase.description?.length > 100 ? `${purchase.description.slice(0, 100)}...` : purchase.description || "No description available."}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-green-700 font-semibold text-sm">${purchase.price || "N/A"} only</span>
                  <Link to={`/course/${purchase._id}`} className="text-blue-600 text-sm font-semibold hover:underline">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
}

export default Purchases;
