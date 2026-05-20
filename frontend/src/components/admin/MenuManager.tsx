import { Plus, Edit2, EyeOff, Eye, Trash2, Search, X, Star, Loader2, ImagePlus } from "lucide-react";
import { useMenuManager } from "../../Hook/useMenuManager";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  status: "Còn hàng" | "Hết hàng" | "Tạm ngưng";
  featured: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Tất cả", "Khai vị", "Món chính", "Tráng miệng", "Đồ uống"];
const EDIT_CATEGORIES = ["Khai vị", "Món chính", "Tráng miệng", "Đồ uống"];
const ITEMS_PER_PAGE = 9;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const getStatusStyle = (status: string) => {
  if (status === "Còn hàng")  return "bg-green-500/20 text-green-300 border-green-500/30";
  if (status === "Hết hàng")  return "bg-red-500/20 text-red-300 border-red-500/30";
  return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function MenuManager() {
  const {
    items,
    loading,
    error,
    search,
    activeCategory,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    imagePreview,
    submitting,
    fileInputRef,
    currentPage,
    setCurrentPage,
    filtered,
    totalPages,
    paginated,
    handleImageChange,
    openAddModal,
    openEditModal,
    handleSubmit,
    toggleStatus,
    handleDelete,
    handleSearch,
    handleCategory,
  } = useMenuManager();

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-xl font-serif font-bold text-gold">Quản lý Thực đơn</h2>
          <p className="text-sm text-cream/50 mt-1">Quản lý món ăn và tình trạng — {items.length} món</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm món..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors w-full md:w-48"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors"
          >
            <Plus size={18} />
            <span>Thêm món mới</span>
          </button>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-gold text-charcoal"
                : "bg-[#1a1a1a] text-cream/70 border border-white/5 hover:text-cream"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 text-center">
          ⚠️ {error}
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gold">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-cream/40 gap-3">
          <Search size={36} />
          <p className="text-sm">Không tìm thấy món nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(item => (
              <div
                key={item._id}
                className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-lg overflow-hidden group"
              >
                {/* ─ Image ─ */}
                <div className="relative h-48 overflow-hidden bg-black/30">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/20">
                      <ImagePlus size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium backdrop-blur-md border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                    {item.featured && (
                      <span className="px-2.5 py-1 rounded text-xs font-medium bg-gold/20 text-gold border border-gold/30 backdrop-blur-md">
                        Nổi bật
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 font-bold text-gold text-sm">
                    {formatVND(item.price)}
                  </div>
                </div>

                {/* ─ Info ─ */}
                <div className="p-5">
                  <div className="text-xs text-gold mb-1 font-medium tracking-wider uppercase">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-cream">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-cream/50 mt-1 line-clamp-2">{item.description}</p>
                  )}

                  {/* ─ Actions ─ */}
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors text-cream/70"
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => toggleStatus(item)}
                        className="p-2 bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 rounded-lg transition-colors text-cream/70"
                        title={item.status === "Còn hàng" ? "Đánh dấu hết hàng" : "Đánh dấu còn hàng"}
                      >
                        {item.status === "Còn hàng" ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-cream/70"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-2xl border border-white/5">
              <p className="text-sm text-cream/50">
                Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} / {filtered.length} món
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm border border-white/10 text-cream/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-gold text-charcoal"
                        : "border border-white/10 text-cream/70 hover:bg-white/5"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm border border-white/10 text-cream/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-lg flex flex-col" style={{ maxHeight: "90vh" }}>

            {/* ─ Header (cố định) ─ */}
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-serif font-bold text-gold">
                {editingId ? "Chỉnh sửa món ăn" : "Thêm món mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-cream/50 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* ─ Body (scroll riêng) ─ */}
            <form id="menu-form" onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar">

              {/* Image upload */}
              <div>
                <label className="block text-sm text-cream/70 mb-2">Ảnh món ăn</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-36 rounded-xl border-2 border-dashed border-white/10 hover:border-gold/40 cursor-pointer transition-colors overflow-hidden bg-black/30 flex items-center justify-center"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-sm text-white flex items-center gap-2">
                          <ImagePlus size={18} /> Đổi ảnh
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-cream/30 flex flex-col items-center gap-2">
                      <ImagePlus size={28} />
                      <span className="text-sm">Nhấn để chọn ảnh (tối đa 5MB)</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm text-cream/70 mb-2">Tên món *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="VD: Thăn bò Wagyu"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Danh mục *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    {EDIT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(f => ({ ...f, status: e.target.value as MenuItem["status"] }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                    <option value="Tạm ngưng">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm text-cream/70 mb-2">Giá (VND) *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formData.price}
                    onChange={e => setFormData(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="VD: 250000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 text-sm">₫</span>
                </div>
                {formData.price > 0 && (
                  <p className="text-gold/70 text-xs mt-1">{formatVND(formData.price)}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-cream/70 mb-2">Mô tả</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  placeholder="Mô tả ngắn về món ăn..."
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, featured: !f.featured }))}
                  className={`p-1.5 rounded-lg transition-colors ${formData.featured ? "text-gold bg-gold/10" : "text-cream/30 hover:text-cream/60"}`}
                >
                  <Star size={18} fill={formData.featured ? "currentColor" : "none"} />
                </button>
                <div>
                  <p className="text-sm text-cream font-medium">Món nổi bật</p>
                  <p className="text-xs text-cream/40">Hiển thị trong danh sách ưu tiên</p>
                </div>
              </div>

            </div>

            {/* ─ Footer (cố định) ─ */}
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
                {editingId ? "Lưu thay đổi" : "Thêm món"}
              </button>
            </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
