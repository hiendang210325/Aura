import { Filter, Search, MoreVertical, Check, X, Eye, Edit2, Loader2, Plus } from "lucide-react";
import { useReservationManager } from "../../Hook/useReservationManager";

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
  combo?: string;
  notes?: string;
  source?: string;
  status: string;
  createdAt?: string;
}

interface Table {
  _id: string;
  tableId: string;
  area: string;
  capacity: number;
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Confirmed": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Seated": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Completed": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    "Pending": "Chờ xác nhận",
    "Confirmed": "Đã xác nhận",
    "Seated": "Đang dùng bữa",
    "Completed": "Đã hoàn thành",
    "Cancelled": "Đã hủy"
  };
  return map[status] || status;
};

const translateType = (type: string) => {
  const map: Record<string, string> = {
    "Standard": "Tiêu chuẩn",
    "Combo": "Combo",
    "Birthday": "Sinh nhật",
    "Corporate": "Khách đoàn"
  };
  return map[type] || type;
};

export default function ReservationManager() {
  const {
    reservations,
    tablesList,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    viewingRes,
    setViewingRes,
    handleDelete,
    handleStatusUpdate,
    openAddModal,
    openEditModal,
    handleSubmit,
  } = useReservationManager();

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-lg overflow-hidden relative">
      
      {/* Header & Actions */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-gold">Đặt bàn gần đây</h2>
          <p className="text-sm text-cream/50 mt-1">Quản lý tất cả yêu cầu đặt bàn</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors w-full md:w-48"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors">
            <Filter size={16} />
            <span>Bộ lọc</span>
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Đặt bàn mới
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 text-sm border-b border-red-500/20 text-center">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gold">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-cream/50 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Ngày & Giờ</th>
                <th className="px-6 py-4 font-medium">Chi tiết</th>
                <th className="px-6 py-4 font-medium">Bàn</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-cream/50">
                    Không tìm thấy đặt bàn nào.
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-cream">{res.name}</div>
                        {res.source === 'customer' && (
                          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-medium">KH</span>
                        )}
                      </div>
                      <div className="text-cream/50 text-xs mt-0.5">{res.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-cream">{res.date}</div>
                      <div className="text-gold font-medium text-xs mt-0.5">{res.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-cream">{res.guests} Khách</div>
                      <div className="text-cream/50 text-xs mt-0.5">{translateType(res.type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-white/5 rounded text-cream/80 text-xs font-mono">
                        {res.table}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(res.status)}`}>
                        {translateStatus(res.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingRes(res)}
                          className="p-1.5 text-cream/50 hover:text-gold hover:bg-gold/10 rounded transition-colors" title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => openEditModal(res)}
                          className="p-1.5 text-cream/50 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors" title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        {res.status === "Pending" && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(res._id, "Confirmed")}
                              className="p-1.5 text-cream/50 hover:text-green-400 hover:bg-green-400/10 rounded transition-colors" title="Xác nhận"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(res._id, "Cancelled")}
                              className="p-1.5 text-cream/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Hủy bỏ"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(res._id)}
                          className="p-1.5 text-cream/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Xóa"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination (Mock appearance) */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-cream/50">
        <div>Hiển thị {reservations.length} kết quả</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-50" disabled>Trước</button>
          <button className="px-3 py-1 bg-gold text-charcoal font-medium rounded">1</button>
          <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-50" disabled>Sau</button>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-gold">
                {editingId ? "Chỉnh sửa đặt bàn" : "Đặt bàn mới"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-cream/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Tên khách hàng</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Số điện thoại</label>
                  <input 
                    type="text" required
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Ngày</label>
                  <input 
                    type="date" required
                    value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Giờ</label>
                  <input 
                    type="time" required
                    value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-sm text-cream/70 mb-2">Loại đặt bàn</label>
                  <select 
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="Standard">Tiêu chuẩn</option>
                    <option value="Combo">Combo</option>
                    <option value="Birthday">Sinh nhật</option>
                    <option value="Corporate">Khách đoàn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Khu vực</label>
                  <select 
                    value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value, table: ""})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="Sảnh chính">Sảnh chính</option>
                    <option value="Phòng VIP">Phòng VIP</option>
                    <option value="Khu gia đình">Khu gia đình</option>
                    <option value="Khu ngoài trời">Khu ngoài trời</option>
                    <option value="Khu sự kiện">Khu sự kiện</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Bàn / Phòng</label>
                  <select 
                    required
                    value={formData.table} onChange={(e) => setFormData({...formData, table: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="">-- Chọn bàn --</option>
                    {tablesList.filter(t => t.area === formData.area).map(table => (
                      <option key={table._id} value={table.tableId}>
                        {table.tableId} ({table.capacity} khách)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Trạng thái</label>
                  <select 
                    value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="Pending">Chờ xác nhận</option>
                    <option value="Confirmed">Đã xác nhận</option>
                    <option value="Seated">Đang dùng bữa</option>
                    <option value="Completed">Đã hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm text-cream hover:bg-white/5 transition-colors border border-white/10"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors"
                >
                  {editingId ? "Lưu thay đổi" : "Tạo đặt bàn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Detail Modal ─────────────────────────────────── */}
      {viewingRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-gold">Chi tiết đặt bàn</h3>
              <button
                onClick={() => setViewingRes(null)}
                className="text-cream/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Status badge */}
              <div className="flex items-center justify-between">
                <span className="text-cream/50 text-sm">Trạng thái</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewingRes.status)}`}>
                  {translateStatus(viewingRes.status)}
                </span>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-cream/50 text-sm flex-shrink-0">Khách hàng</span>
                  <div className="text-right">
                    <div className="text-cream font-medium">{viewingRes.name}</div>
                    <div className="text-cream/50 text-xs">{viewingRes.phone}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-cream/50 text-sm">Ngày đặt</span>
                  <span className="text-cream">{viewingRes.date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-cream/50 text-sm">Giờ</span>
                  <span className="text-gold font-medium">{viewingRes.time}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-cream/50 text-sm">Số khách</span>
                  <span className="text-cream">{viewingRes.guests} người</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-cream/50 text-sm">Loại đặt bàn</span>
                  <span className="text-cream">{translateType(viewingRes.type)}</span>
                </div>

                {viewingRes.area && (
                  <div className="flex items-center justify-between">
                    <span className="text-cream/50 text-sm">Khu vực</span>
                    <span className="text-cream">{viewingRes.area}</span>
                  </div>
                )}

                {viewingRes.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-cream/50 text-sm">Email</span>
                    <span className="text-cream text-sm">{viewingRes.email}</span>
                  </div>
                )}

                {viewingRes.combo && (
                  <div className="flex items-center justify-between">
                    <span className="text-cream/50 text-sm">Combo</span>
                    <span className="text-gold text-sm">{viewingRes.combo}</span>
                  </div>
                )}

                {viewingRes.notes && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-cream/50 text-sm flex-shrink-0">Ghi chú</span>
                    <span className="text-cream text-sm text-right">{viewingRes.notes}</span>
                  </div>
                )}

                {viewingRes.source && (
                  <div className="flex items-center justify-between">
                    <span className="text-cream/50 text-sm">Nguồn</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${viewingRes.source === 'customer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                      {viewingRes.source === 'customer' ? 'Khách đặt online' : 'Admin tạo'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-cream/50 text-sm">Bàn / Phòng</span>
                  <span className="px-2.5 py-1 bg-white/5 rounded text-cream font-mono text-sm">{viewingRes.table}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => { setViewingRes(null); openEditModal(viewingRes); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-cream rounded-lg text-sm transition-colors"
              >
                <Edit2 size={14} /> Chỉnh sửa
              </button>
              <button
                onClick={() => setViewingRes(null)}
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
