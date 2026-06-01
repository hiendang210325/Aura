import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, logoutSession } from "../services/authClient";
import { logout as logoutAction } from "../store/slices/authSlice";
import { useAppDispatch } from "./useStore";

export const useAdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminUser] = useState(() => getStoredUser());

  const toggleSidebar = () => setIsSidebarOpen((current) => !current);
  const adminName = adminUser?.name || "Admin User";
  const adminInitials = adminName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AD";

  const handleLogout = async () => {
    await logoutSession();
    dispatch(logoutAction());
    navigate("/admin/login", { replace: true });
  };

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isProfileOpen,
    setIsProfileOpen,
    toggleSidebar,
    adminName,
    adminInitials,
    handleLogout,
  };
};
