import AdminLayout from "../components/admin/AdminLayout";
import DashboardOverview from "../components/admin/DashboardOverview";
import ReservationManager from "../components/admin/ReservationManager";
import TableAvailability from "../components/admin/TableAvailability";
import MenuManager from "../components/admin/MenuManager";
import ComboManager from "../components/admin/ComboManager";
import CustomerAndReviews from "../components/admin/CustomerAndReviews";
import UserManager from "../components/admin/UserManager";
import PromotionsManager from "../components/admin/PromotionsManager";
import ReviewsManager from "../components/admin/ReviewsManager";
import SettingsPreview from "../components/admin/SettingsPreview";
import { useAdminDashboard } from "../Hook/useAdminDashboard";

export default function AdminDashboard() {
  const { activeTab, setActiveTab, isCheckingAuth } = useAdminDashboard();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "reservations":
        return <ReservationManager />;
      case "tables":
        return <TableAvailability />;
      case "menu":
        return <MenuManager />;
      case "combos":
        return <ComboManager />;
      case "customers":
        return <CustomerAndReviews />;
      case "users":
        return <UserManager />;
      case "reviews":
        return <ReviewsManager />;
      case "promotions":
        return <PromotionsManager />;
      case "settings":
        return <SettingsPreview />;
      default:
        return <DashboardOverview />;
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-cream flex items-center justify-center">
        <div className="rounded-lg border border-white/10 bg-[#121212] px-6 py-4 text-sm text-cream/70">
          Đang kiểm tra phiên đăng nhập...
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-500">{renderContent()}</div>
    </AdminLayout>
  );
}
