import { Loader2, Calendar, UserPlus, ArrowRight, X, Check, LogIn, CreditCard, XCircle } from "lucide-react";
import { useTableAvailability } from "../../Hook/useTableAvailability";

const getTableStatusStyle = (status: string) => {
  switch (status) {
    case "Còn trống": return "bg-white/5 border-green-500/30 hover:border-green-500/60";
    case "Có khách":  return "bg-blue-500/10 border-blue-500/50";
    case "Đã đặt":   return "bg-yellow-500/10 border-yellow-500/50";
    case "Đang dọn": return "bg-red-500/10 border-red-500/50";
    default:          return "bg-white/5 border-white/10";
  }
};

const getStatusDot = (status: string) => {
  const color =
    status === "Còn trống" ? "bg-green-500" :
    status === "Có khách"  ? "bg-blue-500"  :
    status === "Đã đặt"    ? "bg-yellow-500":
    status === "Đang dọn"  ? "bg-red-500"   : "bg-gray-500";
  return <span className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />;
};

const translateType = (type: string) => {
  const map: Record<string, string> = {
    Standard: "Tiêu chuẩn", Combo: "Combo",
    Birthday: "Sinh nhật",  Corporate: "Khách đoàn",
  };
  return map[type] || type;
};

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    Pending:   "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Seated:    "Đang dùng bữa",
    Completed: "Đã hoàn thành",
    Cancelled: "Đã hủy",
  };
  return map[status] || status;
};

export default function TableAvailability() {
  const {
    tables,
    loading,
    error,
    activeArea,
    setActiveArea,
    selectedDate,
    setSelectedDate,
    selectedCard,
    setSelectedCard,
    actionLoading,
    unassignedReservations,
    areas,
    filtered,
    handleStatusUpdate,
    handleAssignTable,
  } = useTableAvailability();

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-xl font-serif font-bold text-gold">Sơ đồ bàn</h2>
          <p className="text-sm text-cream/50 mt-1">
            Trạng thái bàn cập nhật theo đơn đặt bàn thực tế
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {/* Date picker */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gold" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm text-cream/70">
            {([
              ["Còn trống", "bg-green-500"],
              ["Đã đặt",    "bg-yellow-500"],
              ["Có khách",  "bg-blue-500"],
              ["Đang dọn",  "bg-red-500"],
            ] as [string, string][]).map(([label, color]) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 text-center">
          ⚠️ {error}
        </div>
      )}

      {/* ── Đơn chưa phân bàn (từ khách hàng online) ──────────── */}
      {!loading && unassignedReservations.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-orange-500/20 shadow-lg overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <UserPlus size={16} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-orange-400">
                Đơn đặt chưa phân bàn ({unassignedReservations.length})
              </h3>
              <p className="text-xs text-cream/40">
                Khách đặt online — cần admin phân bàn tại mục Đặt bàn
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {unassignedReservations.map(res => (
              <div key={res._id} className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-serif font-bold text-sm">
                    {res.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-cream text-sm font-medium">{res.name}</span>
                      <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-medium">
                        {res.source === "customer" ? "Online" : "Admin"}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        res.status === "Pending" 
                          ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" 
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {translateStatus(res.status)}
                      </span>
                    </div>
                    <div className="text-xs text-cream/50 mt-0.5">
                      {res.phone} · {res.time} · {res.guests} khách · {translateType(res.type)}
                      {res.area && res.area !== "Sảnh chính" && ` · KV: ${res.area}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-cream/40">
                  <span>Cần phân bàn</span>
                  <ArrowRight size={14} className="text-gold/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Area filter ───────────────────────────────────────── */}
      {!loading && tables.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setActiveArea(area)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeArea === area
                  ? "bg-gold text-charcoal"
                  : "bg-[#1a1a1a] text-cream/70 border border-white/5 hover:text-cream"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      )}

      {/* ── Grid ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gold">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-cream/40 gap-3">
          <Calendar size={40} />
          <p className="text-sm">Chưa có bàn nào trong hệ thống</p>
          <p className="text-xs">Hãy thêm bàn tại phần quản lý bàn trước</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(card => (
            <div
              key={card.tableId}
              onClick={() => setSelectedCard(card)}
              className={`p-4 rounded-xl border text-left transition-all relative group flex flex-col h-36 cursor-pointer ${getTableStatusStyle(card.displayStatus)}`}
            >
              {/* ─ Card ─ */}
              <div className="flex justify-between items-start w-full">
                <span className="font-serif text-lg font-bold text-cream truncate pr-2">
                  {card.tableId}
                </span>
                {getStatusDot(card.displayStatus)}
              </div>

              <div className="text-xs text-cream/50 mt-0.5 truncate">
                {card.area} · {card.capacity} chỗ
              </div>

              <div className="mt-auto w-full">
                <span className="text-sm font-medium text-cream">{card.displayStatus}</span>
                {card.primaryRes && (
                  <div className="text-xs text-cream/50 mt-0.5 truncate">
                    {card.primaryRes.name} · {card.primaryRes.time}
                  </div>
                )}
              </div>

              {/* ─ Hover tooltip ─ */}
              <div className="absolute inset-0 bg-[#0d0d0d]/95 backdrop-blur-sm rounded-xl border border-gold/40 opacity-0 group-hover:opacity-100 flex flex-col justify-center p-3 transition-opacity duration-200 z-10">
                {card.primaryRes ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-gold text-[10px] font-bold uppercase tracking-wider border-b border-gold/20 pb-1.5 mb-2">
                      <span>{card.tableId}</span>
                      <span>{translateStatus(card.primaryRes.status)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cream text-xs font-medium">
                      <span>👤</span>
                      <span className="truncate">{card.primaryRes.name}</span>
                      {card.primaryRes.source === "customer" && (
                        <span className="px-1 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[9px]">Online</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-cream/80 text-xs">
                      <span>🕐</span>
                      <span>{card.primaryRes.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cream/80 text-xs">
                      <span>👥</span>
                      <span>
                        {card.primaryRes.guests} khách · {translateType(card.primaryRes.type)}
                      </span>
                    </div>
                    {card.primaryRes.phone && (
                      <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                        <span>📞</span>
                        <span>{card.primaryRes.phone}</span>
                      </div>
                    )}
                    {card.reservations.length > 1 && (
                      <div className="text-gold/60 text-[10px] pt-1 border-t border-white/5">
                        +{card.reservations.length - 1} đơn khác trong ngày
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <p className="text-cream/60 text-xs">{card.tableId}</p>
                    <p className="text-green-400 text-sm font-medium">Còn trống</p>
                    <p className="text-cream/40 text-[10px]">{card.capacity} chỗ ngồi</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail Modal ──────────────────────────────────────── */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCard(null)}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-cream ${
                  selectedCard.displayStatus === 'Còn trống' ? 'bg-green-500/10 border border-green-500/30' :
                  selectedCard.displayStatus === 'Đã đặt' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                  selectedCard.displayStatus === 'Có khách' ? 'bg-blue-500/10 border border-blue-500/30' :
                  'bg-white/5 border border-white/10'
                }`}>
                  {selectedCard.tableId.slice(-2)}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-gold">{selectedCard.tableId}</h3>
                  <p className="text-xs text-cream/50">{selectedCard.area} · {selectedCard.capacity} chỗ</p>
                </div>
              </div>
              <button onClick={() => setSelectedCard(null)} className="text-cream/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {selectedCard.reservations.filter(r => r.status !== 'Cancelled' && r.status !== 'Completed').length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-6 space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check size={24} className="text-green-400" />
                    </div>
                    <p className="text-cream/60 text-sm">Bàn này hiện đang trống</p>
                  </div>

                  {/* Hiển thị tất cả đơn chưa phân bàn */}
                  {unassignedReservations.length > 0 && (
                    <div className="border-t border-white/5 pt-4">
                      <p className="text-xs text-orange-400 font-medium mb-3 flex items-center gap-2">
                        <UserPlus size={14} />
                        Đơn chưa phân bàn ({unassignedReservations.length}) — chọn để gán vào {selectedCard.tableId}:
                      </p>
                      <div className="space-y-2">
                        {unassignedReservations
                          .map(res => (
                          <div key={res._id} className="bg-orange-500/5 rounded-lg border border-orange-500/15 p-3 flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-cream text-sm font-medium truncate">{res.name}</span>
                                <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px]">Online</span>
                              </div>
                              <div className="text-xs text-cream/50 mt-0.5">
                                {res.time} · {res.guests} khách · {res.phone}
                              </div>
                            </div>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleAssignTable(res._id, selectedCard.tableId)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-gold border border-gold/30 rounded-lg text-xs font-medium hover:bg-gold/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              <ArrowRight size={12} /> Phân bàn này
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-cream/40 uppercase tracking-wider mb-3">
                    Đơn đặt bàn ngày {selectedDate} ({selectedCard.reservations.filter(r => r.status !== 'Cancelled' && r.status !== 'Completed').length})
                  </p>
                  {selectedCard.reservations
                    .filter(r => r.status !== 'Cancelled' && r.status !== 'Completed')
                    .map(res => (
                    <div key={res._id} className="bg-black/30 rounded-xl border border-white/5 p-4 space-y-3">
                      {/* Info */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-cream font-medium text-sm">{res.name}</span>
                            {res.source === 'customer' && (
                              <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px]">Online</span>
                            )}
                          </div>
                          <div className="text-xs text-cream/50 mt-1">{res.phone}{res.email ? ` · ${res.email}` : ''}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          res.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          res.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          res.status === 'Seated' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>{translateStatus(res.status)}</span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream/60">
                        <span>🕐 {res.time}</span>
                        <span>👥 {res.guests} khách</span>
                        <span>📋 {translateType(res.type)}</span>
                        {res.combo && <span>🍽️ {res.combo}</span>}
                      </div>

                      {res.notes && (
                        <div className="text-xs text-cream/40 bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5">
                          💬 {res.notes}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        {res.status === 'Pending' && (
                          <>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(res._id, 'Confirmed')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                            >
                              <Check size={12} /> Xác nhận
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(res._id, 'Cancelled')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                              <XCircle size={12} /> Hủy
                            </button>
                          </>
                        )}
                        {res.status === 'Confirmed' && (
                          <>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(res._id, 'Seated')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                            >
                              <LogIn size={12} /> Nhận bàn
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(res._id, 'Cancelled')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                              <XCircle size={12} /> Hủy
                            </button>
                          </>
                        )}
                        {res.status === 'Seated' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleStatusUpdate(res._id, 'Completed')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
                          >
                            <CreditCard size={12} /> Thanh toán & Hoàn tất
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Completed/Cancelled in this day */}
                  {selectedCard.reservations.filter(r => r.status === 'Completed' || r.status === 'Cancelled').length > 0 && (
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-xs text-cream/30 mb-2">Đã hoàn thành / Đã hủy</p>
                      {selectedCard.reservations
                        .filter(r => r.status === 'Completed' || r.status === 'Cancelled')
                        .map(res => (
                          <div key={res._id} className="flex items-center justify-between py-1.5 text-xs text-cream/40">
                            <span>{res.name} · {res.time} · {res.guests} khách</span>
                            <span className={res.status === 'Completed' ? 'text-green-500/60' : 'text-red-500/60'}>
                              {translateStatus(res.status)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-5 py-2 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors"
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
