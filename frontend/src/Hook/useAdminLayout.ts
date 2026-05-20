import { useState } from "react";

export const useAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((current) => !current);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isProfileOpen,
    setIsProfileOpen,
    toggleSidebar,
  };
};
