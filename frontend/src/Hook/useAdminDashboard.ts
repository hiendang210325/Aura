import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  getProfile,
  refreshSession,
} from "../services/authClient";
import { logout, setCredentials } from "../store/slices/authSlice";
import { useAppDispatch } from "./useStore";

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyAdminSession = async () => {
      try {
        let refreshedSession: Awaited<ReturnType<typeof refreshSession>> | null = null;
        const profile = await getProfile().catch(async () => {
          refreshedSession = await refreshSession();
          return refreshedSession.user;
        });

        if (profile.role !== "admin") {
          throw new Error("Admin role required");
        }

        if (isMounted) {
          if (refreshedSession) {
            dispatch(setCredentials(refreshedSession));
          }
          setIsCheckingAuth(false);
        }
      } catch (error) {
        clearAuthSession();

        if (isMounted) {
          dispatch(logout());
          navigate("/admin/login", { replace: true });
        }
      }
    };

    verifyAdminSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate]);

  return {
    activeTab,
    setActiveTab,
    isCheckingAuth,
  };
};
