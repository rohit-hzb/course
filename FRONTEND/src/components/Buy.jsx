// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

// function Buy() {
//   const { courseId } = useParams();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch course details
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user.token;

//   // Handle purchase
//   const handlePurchase = async () => {
//     if (!token) {
//       toast.error("please login to purchase the courses");
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = axios.post(
//         `http://localhost:3001/api/v1/course/buy/${courseId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );
//       toast.success(response.data.message || "Course purchased successfully!");
//       navigate("/purchases");
//       setLoading(false);
//     } catch (error) {
//         setLoading(false)
//         if(error.response?.status===400){
//             toast.error("You have already purchased this course")
//         }else{
//             toast.error(error.response?.data?.error)
//         }
//     }

// //     setLoading(true);
// //     try {
// //       const response = await axios.post(
// //         `http://localhost:3001/api/v1/course/buy/${courseId}`,
// //         {},
// //         { withCredentials: true }
// //       );
// //       toast.success(response.data.message);
// //     } catch (error) {
// //       console.error("Purchase error:", error);
// //       toast.error(error.response?.data?.message || "Purchase failed!");
// //     } finally {
// //       setLoading(false);
// //     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       {course ? (
//         <div className="p-6 border shadow-md rounded-md text-center">
//           <img
//             src={course.image?.url || "https://via.placeholder.com/150"}
//             alt={course.title}
//             className="w-64 h-40 object-cover rounded mb-4"
//           />
//           <h1 className="text-xl font-semibold">{course.title}</h1>
//           <p className="text-gray-600">{course.description}</p>
//           <p className="text-lg font-bold mt-2">₹{course.price}</p>
//           <button
//             className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-800 disabled:bg-gray-400"
//             onClick={handlePurchase}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Buy Now"}
//           </button>
//         </div>
//       ) : (
//         <p className="text-gray-500">Loading course details...</p>
//       )}
//     </div>
//   );
// }

// export default Buy;

import React from 'react'

function Buy() {
  return (
    <div>
      Buy
    </div>
  )
}

export default Buy
