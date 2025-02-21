import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  const handleLogout = async () => {
    try {
    const response=  axios.get("http://localhost:3001/api/v1/user/logout",{
        withCredentials:true,
      });
      toast.success((await response).data.message);
      setIsLoggedIn(false)
    } catch (error) {
      console.log("Error in loggin out",error);
      toast.error(error.response.data.errors||"Error in loggin out");
    }
  };
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/course/courses",
          { withCredentials: true }
        );
        console.log(response.data.courses);
        setCourses(response.data.courses); // Fixed: Now updating state
      } catch (error) {
        console.log("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="min-h-screen text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl text-orange-500 font-bold">Course</h1>
          </div>
          <div className="space-x-4">
           {
            isLoggedIn?(
              <button onClick={handleLogout} className="bg-transparent text-white py-2 px-4 border border-white rounded">Logout</button>
            ):(<>
             <Link
              to="/login"
              className="bg-transparent text-white py-2 px-4 border border-white rounded-full"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-transparent text-white py-2 px-4 border border-white rounded-full"
            >
              Signup
            </Link>
            </>)
           }
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-4xl font-semibold text-orange-500">Courses</h1>
          <p className="text-gray-500 mt-4">
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className="space-x-4 mt-8">
            <Link to={"/courses"} className="bg-green-500 py-3 px-6 text-white rounded font-semibold hover:bg-white duration-300 hover:text-black">
              Explore courses
            </Link>
            <Link  className="bg-white py-3 px-6 text-black rounded font-semibold hover:bg-green-500 duration-300 hover:text-black">
              Courses video
            </Link>
          </div>
        </section>

        {/* Course Slider */}
        <section className="px-10 ">
          <Slider {...settings} className="h-30">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="relative flex-shrink-0w-92 transation-transform duration-300 transform hover:scale-105">
                  <img
                    className="h-32 w-full object-contain"
                    src={course.image}
                    alt="not image upload"
                  />
                  <div className="p-6 text-center">
                    <h1 className="text-xl font-bold text-white">
                      {course.title}
                    </h1>
                    <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <p className="text-center text-gray-500">No courses available.</p>
        </section>

        <hr />

        {/* Footer */}
        <footer className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left Side */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">
                  CourseHaven
                </h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="#">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="#">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="#">
                    <FaWhatsapp className="text-2xl hover:text-green-400 duration-300" />
                  </a>
                </div>
              </div>
            </div>

            {/* Middle Section */}
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  YouTube - Learn Coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Telegram - Learn Coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  GitHub - Learn Coding
                </li>
              </ul>
            </div>

            {/* Right Side */}
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                Copyright &copy; 2024
              </h3>
              <ul className="space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
