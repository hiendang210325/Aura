import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MenuPage from "./pages/MenuPage";
import MenuDetailPage from "./pages/MenuDetailPage";
import ReservationPage from "./pages/ReservationPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import { useAppDispatch } from "./Hook/useStore";
import { logout, setCredentials } from "./store/slices/authSlice";
import { getStoredUser, refreshSession } from "./services/authClient";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!getStoredUser()) return;

    let isMounted = true;

    refreshSession()
      .then((session) => {
        if (isMounted) {
          dispatch(setCredentials(session));
        }
      })
      .catch(() => {
        if (isMounted) {
          dispatch(logout());
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<MenuDetailPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
