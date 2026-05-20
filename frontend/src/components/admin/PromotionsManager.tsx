import {
  Calendar,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { usePromotionsManager } from "../../Hook/usePromotionsManager";

type PromotionStatus = "Đang áp dụng" | "Tạm dừng";

const STATUS_FILTERS = ["Tất cả", "Đang áp dụng", "Tạm dừng"] as const;

const getStatusStyle = (status: PromotionStatus) =>
  status === "Đang áp dụng"
    ? "bg-green-500/10 text-green-400 border-green-500/20"
    : "bg-gray-500/10 text-gray-400 border-gray-500/20";

const formatDate = (date?: string) => {
  if (!date) return "Không giới hạn";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("vi-VN").format(parsed);
};

export default function PromotionsManager() {
  const {
    promotions,
    loading,
    error,
    search,
    setSearch,
    activeStatus,
    setActiveStatus,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    submitting,
    filteredPromotions,
    openAddModal,
    openEditModal,
    handleSubmit,
    toggleStatus,
    handleDelete,
  } = usePromotionsManager();

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-xl font-serif font-bold text-gold">Chương trình Khuyến mãi</h2>
          <p className="text-sm text-cream/50 mt-1">
            Quản lý ưu đãi hiển thị trên website — {promotions.length} khuyến mãi
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="relative sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
            <input
              type="text"
              placeholder="Tìm khuyến mãi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value as (typeof STATUS_FILTERS)[number])}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors"
          >
            <Plus size={18} />
            <span>Tạo Khuyến mãi</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gold">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : filteredPromotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-cream/40 gap-3">
          <Tag size={36} />
          <p className="text-sm">Không tìm thấy khuyến mãi nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPromotions.map((promo) => (
            <div
              key={promo._id}
              className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group flex flex-col"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Tag size={64} className="text-gold" />
              </div>

              <div className="flex flex-wrap gap-2 items-start mb-4 relative z-10">
                <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getStatusStyle(promo.status)}`}>
                  {promo.status}
                </span>
                {promo.featured && (
                  <span className="px-2.5 py-1 rounded text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                    Nổi bật
                  </span>
                )}
              </div>

              <div className="text-gold text-2xl font-serif italic mb-2 relative z-10">{promo.highlight}</div>
              <h3 className="text-lg font-serif font-bold text-cream mb-2 relative z-10">{promo.title}</h3>
              <p className="text-sm text-cream/70 mb-4 flex-1 relative z-10">{promo.description}</p>

              {promo.condition && (
                <div className="text-xs text-cream/50 bg-white/5 rounded-lg px-3 py-2 mb-4 relative z-10">
                  {promo.condition}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gold/70 bg-gold/5 w-fit px-3 py-1.5 rounded-lg mb-6">
                <Calendar size={14} />
                <span>Hạn dùng: {formatDate(promo.validUntil)}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto relative z-10">
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => openEditModal(promo)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors text-cream/70 text-sm"
                  >
                    <Edit2 size={16} /> Sửa
                  </button>
                  <button
                    onClick={() => toggleStatus(promo)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 rounded-lg transition-colors text-cream/70 text-sm"
                  >
                    {promo.status === "Đang áp dụng" ? <EyeOff size={16} /> : <Eye size={16} />}
                    {promo.status === "Đang áp dụng" ? "Tạm dừng" : "Áp dụng"}
                  </button>
                  <button
                    onClick={() => handleDelete(promo)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-cream/70 text-sm"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: "90vh" }}>
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-serif font-bold text-gold">
                {editingId ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-cream/50 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cream/70 mb-2">Tiêu đề *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="VD: Giảm 10% khi đặt bàn online"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cream/70 mb-2">Điểm nhấn *</label>
                    <input
                      type="text"
                      required
                      value={formData.highlight}
                      onChange={(e) => setFormData((current) => ({ ...current, highlight: e.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="VD: 10% Off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cream/70 mb-2">Hạn dùng</label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData((current) => ({ ...current, validUntil: e.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cream/70 mb-2">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.displayOrder}
                      onChange={(e) => setFormData((current) => ({ ...current, displayOrder: Number(e.target.value) }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cream/70 mb-2">Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value as PromotionStatus }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                    >
                      <option value="Đang áp dụng">Đang áp dụng</option>
                      <option value="Tạm dừng">Tạm dừng</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5">
                    <button
                      type="button"
                      onClick={() => setFormData((current) => ({ ...current, featured: !current.featured }))}
                      className={`p-1.5 rounded-lg transition-colors ${
                        formData.featured ? "text-gold bg-gold/10" : "text-cream/30 hover:text-cream/60"
                      }`}
                    >
                      <Star size={18} fill={formData.featured ? "currentColor" : "none"} />
                    </button>
                    <div>
                      <p className="text-sm text-cream font-medium">Ưu đãi nổi bật</p>
                      <p className="text-xs text-cream/40">Ưu tiên hiển thị trên banner</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-cream/70 mb-2">Mô tả *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors resize-none"
                    placeholder="Mô tả ưu đãi..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-cream/70 mb-2">Điều kiện áp dụng</label>
                  <textarea
                    rows={2}
                    value={formData.condition}
                    onChange={(e) => setFormData((current) => ({ ...current, condition: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors resize-none"
                    placeholder="VD: Áp dụng cho nhóm từ 6 khách, không cộng dồn ưu đãi khác..."
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm text-cream hover:bg-white/5 transition-colors border border-white/10"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors disabled:opacity-60"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? "Lưu thay đổi" : "Tạo khuyến mãi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
