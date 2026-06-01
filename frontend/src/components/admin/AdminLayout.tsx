import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  Coffee,
  Users,
  ShieldCheck,
  Tag,
  Star,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAdminLayout } from "../../Hook/useAdminLayout";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Tổng Quan", icon: LayoutDashboard },
  { id: "reservations", label: "Đặt Bàn", icon: CalendarDays },
  { id: "tables", label: "Sơ Đồ Bàn", icon: UtensilsCrossed },
  { id: "menu", label: "Thực Đơn", icon: Coffee },
  { id: "combos", label: "Combo Ăn Uống", icon: Coffee }, // Could use a different icon
  { id: "customers", label: "Khách Hàng", icon: Users },
  { id: "users", label: "Người Dùng", icon: ShieldCheck },
  { id: "promotions", label: "Khuyến Mãi", icon: Tag },
  { id: "reviews", label: "Đánh Giá", icon: Star },
  { id: "settings", label: "Cài Đặt", icon: Settings },
];

export default function AdminLayout({
  children,
  activeTab,
  setActiveTab,
}: AdminLayoutProps) {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isProfileOpen,
    setIsProfileOpen,
    toggleSidebar,
    adminName,
    adminInitials,
    handleLogout,
  } = useAdminLayout();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-cream flex overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#121212] border-r border-white/5 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <h1 className="text-2xl font-serif font-bold text-gold tracking-widest">
            AURA
          </h1>
          <button
            className="lg:hidden text-cream/70 hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-gold/10 text-gold font-medium"
                      : "text-cream/60 hover:bg-white/5 hover:text-cream"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-gold" : "opacity-70"}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-cream/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-cream/70 hover:text-white"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-medium hidden sm:block">
              {NAV_ITEMS.find((i) => i.id === activeTab)?.label || "Tổng Quan"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-[#1a1a1a] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 w-64 transition-colors"
              />
            </div>

            <button className="relative text-cream/70 hover:text-gold transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium border border-gold/30">
                  {adminInitials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-cream">{adminName}</p>
                  <p className="text-xs text-cream/50">Quản Lý</p>
                </div>
                <ChevronDown
                  size={14}
                  className="text-cream/50 hidden md:block"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <button className="w-full text-left px-4 py-2 text-sm text-cream/70 hover:text-cream hover:bg-white/5">
                    Hồ Sơ Cài Đặt
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 mt-1"
                  >
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0a0a0a] custom-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
