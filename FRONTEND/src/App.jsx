import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { Toaster } from 'react-hot-toast';
import Courses from './components/Courses';
import Buy from './components/Buy';
import Purchases from './components/Purchases';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import CourseCreate from './admin/CourseCreate';
import UpdateCourse from './admin/UpdateCourse';
import OurCourses from './admin/OurCourses';

function App() {
  // Safe parsing with try/catch to avoid app crash on bad data
  let user = null;
  let admin = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    console.warn('Invalid user JSON',e);
  }

  try {
    admin = JSON.parse(localStorage.getItem('admin'));
  } catch (e) {
    console.warn('Invalid admin JSON',e);
  }

  return (
    <div className="bg-blend-color-burn">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />

        {/* Protected User Route */}
        <Route
          path="/purchases"
          element={user ? <Purchases /> : <Navigate to="/login" />}
        />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={admin ? <Dashboard /> : <Navigate to="/admin/login" />}
        />
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
