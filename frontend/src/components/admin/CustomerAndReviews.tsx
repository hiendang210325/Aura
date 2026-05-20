import { Eye, Filter, Loader2, Search, X } from "lucide-react";
import { useCustomerAndReviews } from "../../Hook/useCustomerAndReviews";

interface Reservation {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  type: string;
  area: string;
  table: string;
  status: string;
  createdAt?: string;
}

const TYPE_FILTERS = ["Tất cả", "Khách VIP", "Khách đoàn", "Khách quay lại", "Khách mới"];

const getCustomerTypeBadge = (type: string) => {
  switch (type) {
    case "Khách VIP":
      return "bg-gold/10 text-gold border-gold/20";
    case "Khách đoàn":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Khách quay lại":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Khách mới":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const formatDate = (date: string) => {
  if (!date) return "Chưa có";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("vi-VN").format(parsed);
};

const formatReservationDateTime = (reservation: Reservation) => {
  const date = formatDate(reservation.date);
  return reservation.time ? `${date} • ${reservation.time}` : date;
};

const translateReservationType = (type: string) => {
  const map: Record<string, string> = {
    Standard: "Tiêu chuẩn",
    Combo: "Combo",
    Birthday: "Sinh nhật",
    Corporate: "Khách đoàn",
  };
  return map[type] || type;
};

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    Pending: "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Seated: "Đang dùng bữa",
    Completed: "Đã hoàn thành",
    Cancelled: "Đã hủy",
  };
  return map[status] || status;
};

export default function CustomerAndReviews() {
  const {
    reservations,
    loading,
    error,
    search,
    setSearch,
    activeType,
    setActiveType,
    viewingCustomer,
    setViewingCustomer,
    customers,
    filteredCustomers,
  } = useCustomerAndReviews();

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-gold">Khách hàng</h2>
            <p className="text-sm text-cream/50 mt-1">
              Tổng hợp từ dữ liệu đặt bàn — {customers.length} khách / {reservations.length} lượt đặt
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm khách hàng..."
                className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors w-full sm:w-56"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none w-full sm:w-44"
              >
                {TYPE_FILTERS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-400 text-sm border-b border-red-500/20 text-center">
            {error}
          </div>
        )}

        <div className="overflow-x-auto min-h-[360px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gold">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-cream/50 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Khách hàng</th>
                  <th className="px-6 py-4 font-medium">Liên hệ</th>
                  <th className="px-6 py-4 font-medium">Lịch sử đặt bàn</th>
                  <th className="px-6 py-4 font-medium">Phân loại</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-cream/50">
                      Không tìm thấy khách hàng nào.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.phone || customer.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-cream">{customer.name}</div>
                        <div className="text-cream/50 text-xs mt-0.5">{customer.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-cream">{customer.phone}</div>
                        <div className="text-cream/50 text-xs mt-0.5">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-cream">{customer.bookings} lần đặt</div>
                        <div className="text-cream/50 text-xs mt-0.5">Gần nhất: {customer.lastVisit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getCustomerTypeBadge(customer.type)}`}>
                          {customer.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setViewingCustomer(customer)}
                          className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 text-sm font-medium transition-colors"
                        >
                          <Eye size={15} />
                          Xem hồ sơ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-gold">{viewingCustomer.name}</h3>
                <p className="text-sm text-cream/50 mt-1">{viewingCustomer.phone}</p>
              </div>
              <button
                onClick={() => setViewingCustomer(null)}
                className="text-cream/50 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-black/30 rounded-lg border border-white/5 p-3">
                  <div className="text-cream/40 text-xs mb-1">Số lần đặt</div>
                  <div className="text-cream font-medium">{viewingCustomer.bookings}</div>
                </div>
                <div className="bg-black/30 rounded-lg border border-white/5 p-3">
                  <div className="text-cream/40 text-xs mb-1">Tổng số khách</div>
                  <div className="text-cream font-medium">{viewingCustomer.totalGuests}</div>
                </div>
                <div className="bg-black/30 rounded-lg border border-white/5 p-3">
                  <div className="text-cream/40 text-xs mb-1">Phân loại</div>
                  <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getCustomerTypeBadge(viewingCustomer.type)}`}>
                    {viewingCustomer.type}
                  </span>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg border border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 text-sm text-cream/50">
                  Lịch sử đặt bàn
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {viewingCustomer.history.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="px-4 py-3 border-b border-white/5 last:border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm"
                    >
                      <div>
                        <div className="text-cream font-medium">{formatReservationDateTime(reservation)}</div>
                        <div className="text-cream/50 text-xs mt-0.5">
                          {reservation.guests} khách • {translateReservationType(reservation.type)}
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-cream/70">{reservation.area}</div>
                        <div className="text-cream/40 text-xs mt-0.5">
                          {reservation.table} • {translateStatus(reservation.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-2 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
