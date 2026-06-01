import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Armchair,
  CalendarDays,
  ChevronDown,
  Clock,
  History,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHeader } from "../Hook/useHeader";
import { useAppDispatch, useAppSelector } from "../Hook/useStore";
import { logoutSession } from "../services/authClient";
import { logout as logoutAction } from "../store/slices/authSlice";

type HeaderProps = {
  activePage?: "Home" | "Menu" | "Reservation" | "Gallery" | "Contact";
};

type ReservationHistoryItem = {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  area?: string;
  table?: string;
  status: string;
  type?: string;
  combo?: string;
  notes?: string;
  tableInfo?: {
    _id: string;
    tableId: string;
    area: string;
    capacity: number;
    status: string;
  } | null;
};

const statusLabel: Record<string, string> = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Seated: "Đang dùng bữa",
  Completed: "Đã hoàn thành",
  Cancelled: "Đã hủy",
};

const typeLabel: Record<string, string> = {
  Standard: "Tiêu chuẩn",
  Combo: "Combo",
  Birthday: "Sinh nhật",
  Corporate: "Khách đoàn",
};

const formatDate = (date?: string) => {
  if (!date) return "Chưa có ngày";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
};

const getInitials = (name?: string) => {
  const initials = String(name || "AURA")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "AU";
};

const Header = ({ activePage = "Home" }: HeaderProps) => {
  const { isScrolled, mobileMenuOpen, setMobileMenuOpen } = useHeader();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [profileOpen, setProfileOpen] = useState(false);
  const [history, setHistory] = useState<ReservationHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationHistoryItem | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notHomePage = activePage !== "Home";

  const navLinks = [
    { id: "Home", label: "Trang chủ", href: notHomePage ? "/" : "#home" },
    { id: "Menu", label: "Thực đơn", href: "/menu" },
    { id: "Reservation", label: "Đặt bàn", href: "/reservation" },
    { id: "Gallery", label: "Thư viện", href: "/gallery" },
    { id: "Contact", label: "Liên hệ", href: "/contact" },
  ];

  const reservationHref = "/reservation";
  const userFirstName = user?.name?.split(" ")[0] || "AURA";
  const initials = getInitials(user?.name);

  const fetchReservationHistory = async () => {
    if (!isAuthenticated || historyLoading) return;

    try {
      setHistoryLoading(true);
      setHistoryError("");
      const { data } = await axios.get("/api/v1/reservations/me");
      setHistory(data.data || []);
    } catch (error: any) {
      setHistoryError(
        error.response?.data?.message || "Không thể tải lịch sử đặt bàn",
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (profileOpen || mobileMenuOpen) {
      void fetchReservationHistory();
    }
  }, [profileOpen, mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutSession();
    dispatch(logoutAction());
    setProfileOpen(false);
    setMobileMenuOpen(false);
    setHistory([]);
    setSelectedReservation(null);
  };

  const renderHistory = (compact = false) => {
    if (historyLoading) {
      return (
        <div className="flex items-center justify-center py-5 text-gold">
          <Loader2 size={20} className="animate-spin" />
        </div>
      );
    }

    if (historyError) {
      return <div className="py-4 text-sm text-red-300">{historyError}</div>;
    }

    if (history.length === 0) {
      return (
        <div className="py-4 text-sm text-cream/50">
          Chưa có lịch sử đặt bàn cho tài khoản này.
        </div>
      );
    }

    return (
      <div className={compact ? "space-y-2" : "max-h-64 overflow-y-auto custom-scrollbar"}>
        {history.slice(0, 5).map((reservation) => (
          <button
            type="button"
            key={reservation._id}
            onClick={() => setSelectedReservation(reservation)}
            className="block w-full border-b border-white/5 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm text-cream">
                  <CalendarDays size={14} className="text-gold" />
                  <span>{formatDate(reservation.date)}</span>
                  <Clock size={14} className="text-gold/70" />
                  <span>{reservation.time}</span>
                </div>
                <p className="mt-1 truncate text-xs text-cream/50">
                  {reservation.guests} khách · Bàn {reservation.table || "chưa phân"}
                </p>
              </div>
              <span className="shrink-0 rounded border border-gold/20 bg-gold/10 px-2 py-1 text-[11px] text-gold">
                {statusLabel[reservation.status] || reservation.status}
              </span>
            </div>
            <div className="mt-2 text-xs text-gold/75">Bấm để xem thông tin bàn</div>
          </button>
        ))}
      </div>
    );
  };

  const userPanel = (
    <>
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/15 text-sm font-semibold text-gold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-cream">{user?.name}</p>
            <p className="truncate text-xs text-cream/50">{user?.email}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[20px_1fr] gap-x-3 gap-y-2 text-sm">
          <UserCircle size={17} className="text-gold/80" />
          <div>
            <div className="text-cream/45 text-xs">Thông tin người dùng</div>
            <div className="text-cream/80">
              {user?.role === "admin" ? "Quản trị viên" : "Khách hàng"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cream">
          <History size={16} className="text-gold" />
          Lịch sử đặt bàn
        </div>
        {renderHistory()}
      </div>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b editorial-border ${
        isScrolled
          ? "bg-charcoal/95 backdrop-blur-md py-3 md:py-4"
          : "bg-charcoal/95 py-4 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-xl sm:text-2xl tracking-[2px] text-gold font-bold uppercase">
            Aura
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] uppercase tracking-[1.5px] font-medium">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`transition-colors ${
                activePage === link.id
                  ? "text-gold"
                  : "text-cream-muted hover:text-gold"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-3 text-cream-muted transition-colors hover:border-gold/40 hover:text-gold"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/15 text-xs font-semibold text-gold">
                  {initials}
                </span>
                <span className="max-w-24 truncate text-xs">{userFirstName}</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-80 overflow-hidden rounded-lg border border-white/10 bg-[#161616] shadow-2xl"
                    role="menu"
                  >
                    {userPanel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <a
              href="/login"
              className="hidden md:inline-flex text-xs uppercase tracking-[1.5px] text-cream-muted transition-colors hover:text-gold"
            >
              Đăng nhập
            </a>
          )}

          <div className="hidden md:block">
            <a
              href={reservationHref}
              className="lux-button whitespace-nowrap px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm"
            >
              Đặt Bàn Ngay
            </a>
          </div>

          <button
            className="lg:hidden text-cream p-1 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-charcoal-light absolute top-full left-0 w-full border-b border-gold/20 shadow-2xl"
          >
            <div className="flex flex-col items-center py-8 gap-6 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-lg font-serif tracking-wide transition-colors ${
                    activePage === link.id
                      ? "text-gold"
                      : "text-cream hover:text-gold"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              <div className="w-full max-w-xs md:hidden mt-2 border-t border-gold/10 pt-6">
                {isAuthenticated ? (
                  <div className="mb-4 overflow-hidden rounded-lg border border-white/10 bg-black/20 text-left">
                    {userPanel}
                  </div>
                ) : (
                  <a
                    href="/login"
                    className="mb-4 block text-center text-cream/75 transition-colors hover:text-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </a>
                )}

                <a
                  href={reservationHref}
                  className="lux-button block w-full px-8 py-3.5 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đặt Bàn Ngay
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-lg overflow-hidden rounded-lg border border-white/10 bg-[#161616] shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[2px] text-gold">
                    Chi tiết đặt bàn
                  </p>
                  <h3 className="mt-1 text-2xl font-serif font-semibold text-cream">
                    {formatDate(selectedReservation.date)} · {selectedReservation.time}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReservation(null)}
                  className="rounded-md p-1.5 text-cream/50 transition-colors hover:text-cream"
                  aria-label="Đóng chi tiết đặt bàn"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <div className="flex items-center gap-2 text-xs text-cream/45">
                      <Users size={14} className="text-gold" />
                      Số khách
                    </div>
                    <div className="mt-1 text-sm font-medium text-cream">
                      {selectedReservation.guests} người
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <div className="flex items-center gap-2 text-xs text-cream/45">
                      <CalendarDays size={14} className="text-gold" />
                      Loại đặt
                    </div>
                    <div className="mt-1 text-sm font-medium text-cream">
                      {typeLabel[selectedReservation.type || ""] ||
                        selectedReservation.type ||
                        "Tiêu chuẩn"}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <div className="flex items-center gap-2 text-xs text-cream/45">
                      <Clock size={14} className="text-gold" />
                      Trạng thái
                    </div>
                    <div className="mt-1 text-sm font-medium text-gold">
                      {statusLabel[selectedReservation.status] || selectedReservation.status}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gold/20 bg-gold/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gold">
                    <Armchair size={17} />
                    Thông tin bàn
                  </div>

                  {selectedReservation.tableInfo ? (
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <div className="text-cream/45 text-xs">Mã bàn</div>
                        <div className="mt-1 font-mono text-cream">
                          {selectedReservation.tableInfo.tableId}
                        </div>
                      </div>
                      <div>
                        <div className="text-cream/45 text-xs">Khu vực</div>
                        <div className="mt-1 flex items-center gap-2 text-cream">
                          <MapPin size={14} className="text-gold/80" />
                          {selectedReservation.tableInfo.area}
                        </div>
                      </div>
                      <div>
                        <div className="text-cream/45 text-xs">Sức chứa</div>
                        <div className="mt-1 text-cream">
                          {selectedReservation.tableInfo.capacity} khách
                        </div>
                      </div>
                      <div>
                        <div className="text-cream/45 text-xs">Trạng thái bàn</div>
                        <div className="mt-1 text-cream">
                          {selectedReservation.tableInfo.status}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-cream/60">
                      {selectedReservation.table &&
                      selectedReservation.table !== "Chưa phân"
                        ? `Bàn ${selectedReservation.table} đã được ghi nhận, nhưng chưa có dữ liệu chi tiết trong sơ đồ bàn.`
                        : "Bàn chưa được phân. Khi admin xác nhận và chọn bàn, thông tin bàn sẽ hiển thị tại đây."}
                    </div>
                  )}
                </div>

                {(selectedReservation.combo || selectedReservation.notes) && (
                  <div className="space-y-3 rounded-lg border border-white/10 bg-black/25 p-4 text-sm">
                    {selectedReservation.combo && (
                      <div className="flex justify-between gap-4">
                        <span className="text-cream/45">Combo</span>
                        <span className="text-right text-cream">{selectedReservation.combo}</span>
                      </div>
                    )}
                    {selectedReservation.notes && (
                      <div className="flex justify-between gap-4">
                        <span className="text-cream/45">Ghi chú</span>
                        <span className="text-right text-cream">{selectedReservation.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 p-4 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedReservation(null)}
                  className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-charcoal transition-colors hover:bg-yellow-600"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
