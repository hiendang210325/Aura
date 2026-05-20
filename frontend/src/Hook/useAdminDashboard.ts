import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminInfoStr = localStorage.getItem("adminInfo");

    if (!token || !adminInfoStr) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return {
    activeTab,
    setActiveTab,
  };
};
