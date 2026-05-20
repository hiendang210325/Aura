import {
  Edit2,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useComboManager } from "../../Hook/useComboManager";

type ComboStatus = "Đang hoạt động" | "Ngừng hoạt động";

const ITEMS_PER_PAGE = 6;
const STATUS_FILTERS = ["Tất cả", "Đang hoạt động", "Ngừng hoạt động"] as const;

const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

const getStatusStyle = (status: ComboStatus) =>
  status === "Đang hoạt động"
    ? "bg-green-500/10 text-green-400 border-green-500/20"
    : "bg-gray-500/10 text-gray-400 border-gray-500/20";

export default function ComboManager() {
  const {
    combos,
    loading,
    error,
    search,
    activeStatus,
    currentPage,
    setCurrentPage,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    imagePreview,
    submitting,
    viewingCombo,
    setViewingCombo,
    fileInputRef,
    filteredCombos,
    totalPages,
    paginatedCombos,
    handleSearch,
    handleStatusFilter,
    handleImageChange,
    openAddModal,
    openEditModal,
    handleSubmit,
    toggleStatus,
    handleDelete,
  } = useComboManager();

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-xl font-serif font-bold text-gold">Combo dùng bữa</h2>
          <p className="text-sm text-cream/50 mt-1">
            Quản lý set menu và gói đặc biệt — {combos.length} combo
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="relative sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
            <input
              type="text"
              placeholder="Tìm combo..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          <select
            value={activeStatus}
            onChange={(e) => handleStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number])}
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
            <span>Tạo Combo mới</span>
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
      ) : filteredCombos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-cream/40 gap-3">
          <Search size={36} />
          <p className="text-sm">Không tìm thấy combo nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {paginatedCombos.map((combo) => (
              <div
                key={combo._id}
                className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-black/30">
                  {combo.image ? (
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/20">
                      <ImagePlus size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium border backdrop-blur-md ${getStatusStyle(combo.status)}`}>
                      {combo.status}
                    </span>
                    {combo.featured && (
                      <span className="px-2.5 py-1 rounded text-xs font-medium bg-gold/20 text-gold border border-gold/30 backdrop-blur-md">
                        Nổi bật
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-gold/30 font-bold text-gold">
                    {formatVND(combo.price)}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col -mt-8 relative z-10">
                  <h3 className="text-xl font-serif font-bold text-cream line-clamp-2 pr-4">
                    {combo.name}
                  </h3>

                  {combo.description && (
                    <p className="text-sm text-cream/60 mt-2 line-clamp-2">{combo.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 my-5">
                    <div className="flex items-center gap-2 text-cream/70 text-sm bg-white/5 p-2 rounded-lg">
                      <Users size={16} className="text-gold" />
                      <span>{combo.guests} khách</span>
                    </div>
                    <div className="flex items-center gap-2 text-cream/70 text-sm bg-white/5 p-2 rounded-lg">
                      <FileText size={16} className="text-gold" />
                      <span>{combo.dishes?.length || 0} món</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <button
                      onClick={() => setViewingCombo(combo)}
                      className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors"
                    >
                      <Eye size={16} />
                      Chi tiết
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(combo)}
                        className="p-2 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors text-cream/70"
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => toggleStatus(combo)}
                        className="p-2 bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 rounded-lg transition-colors text-cream/70"
                        title={combo.status === "Đang hoạt động" ? "Ngừng hoạt động" : "Kích hoạt"}
                      >
                        {combo.status === "Đang hoạt động" ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(combo)}
                        className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-cream/70"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1a1a1a] p-4 rounded-2xl border border-white/5">
              <p className="text-sm text-cream/50">
                Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredCombos.length)} / {filteredCombos.length} combo
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm border border-white/10 text-cream/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
            <div className="flex flex-shrink-0 items-center justify-between border-b border-white/5 px-5 py-4">
              <h3 className="text-xl font-serif font-bold text-gold">
                {editingId ? "Chỉnh sửa combo" : "Tạo combo mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-cream/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4">
                <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-cream/70">Ảnh combo</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/10 bg-black/30 transition-colors hover:border-gold/40 lg:h-44"
                      >
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                              <span className="flex items-center gap-2 text-sm text-white">
                                <ImagePlus size={18} /> Đổi ảnh
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-center text-cream/30">
                            <ImagePlus size={28} />
                            <span className="text-sm">Chọn ảnh, tối đa 5MB</span>
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

                    <div>
                      <label className="mb-2 block text-sm text-cream/70">Trạng thái</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value as ComboStatus }))}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-cream transition-colors focus:border-gold/50 focus:outline-none"
                      >
                        <option value="Đang hoạt động">Đang hoạt động</option>
                        <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/30 p-3">
                      <button
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, featured: !current.featured }))}
                        className={`rounded-lg p-1.5 transition-colors ${
                          formData.featured ? "bg-gold/10 text-gold" : "text-cream/30 hover:text-cream/60"
                        }`}
                      >
                        <Star size={18} fill={formData.featured ? "currentColor" : "none"} />
                      </button>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-cream">Combo nổi bật</p>
                        <p className="text-xs text-cream/40">Ưu tiên hiển thị trong danh sách</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-cream/70">Tên combo *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))}
                          className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-cream transition-colors focus:border-gold/50 focus:outline-none"
                          placeholder="VD: Combo Gia đình Đặc biệt"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-cream/70">Số khách *</label>
                        <input
                          type="text"
                          required
                          value={formData.guests}
                          onChange={(e) => setFormData((current) => ({ ...current, guests: e.target.value }))}
                          className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-cream transition-colors focus:border-gold/50 focus:outline-none"
                          placeholder="VD: 4-6"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-cream/70">Giá (VND) *</label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min={0}
                            step={1000}
                            value={formData.price}
                            onChange={(e) => setFormData((current) => ({ ...current, price: Number(e.target.value) }))}
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 pr-10 text-cream transition-colors focus:border-gold/50 focus:outline-none"
                            placeholder="VD: 2800000"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-cream/40">₫</span>
                        </div>
                        {formData.price > 0 && <p className="mt-1 text-xs text-gold/70">{formatVND(formData.price)}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-cream/70">Mô tả</label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))}
                        className="w-full resize-none rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-cream transition-colors focus:border-gold/50 focus:outline-none"
                        placeholder="Mô tả ngắn về combo..."
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-cream/70">Danh sách món *</label>
                      <textarea
                        rows={5}
                        required
                        value={formData.dishesText}
                        onChange={(e) => setFormData((current) => ({ ...current, dishesText: e.target.value }))}
                        className="w-full resize-none rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-cream transition-colors focus:border-gold/50 focus:outline-none"
                        placeholder={"Mỗi dòng là một món\nVD: Salad cá hồi\nSườn nướng sốt tiêu\nTráng miệng theo mùa"}
                      />
                      <p className="mt-1 text-xs text-cream/40">Mỗi dòng sẽ được lưu thành một món trong combo.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 justify-end gap-3 border-t border-white/5 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-cream transition-colors hover:bg-white/5"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-charcoal transition-colors hover:bg-yellow-600 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? "Lưu thay đổi" : "Tạo combo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingCombo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-gold">Chi tiết combo</h3>
              <button
                onClick={() => setViewingCombo(null)}
                className="text-cream/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-44 h-32 rounded-xl bg-black/30 overflow-hidden border border-white/5 flex items-center justify-center text-cream/20">
                  {viewingCombo.image ? (
                    <img src={viewingCombo.image} alt={viewingCombo.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus size={32} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getStatusStyle(viewingCombo.status)}`}>
                      {viewingCombo.status}
                    </span>
                    {viewingCombo.featured && (
                      <span className="px-2.5 py-1 rounded text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                        Nổi bật
                      </span>
                    )}
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-cream">{viewingCombo.name}</h4>
                  <p className="text-sm text-cream/60 mt-2">{viewingCombo.description || "Chưa có mô tả"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-black/30 rounded-lg border border-white/5 p-3">
                  <div className="text-cream/40 text-xs mb-1">Giá</div>
                  <div className="text-gold font-bold">{formatVND(viewingCombo.price)}</div>
                </div>
                <div className="bg-black/30 rounded-lg border border-white/5 p-3">
                  <div className="text-cream/40 text-xs mb-1">Số khách</div>
                  <div className="text-cream">{viewingCombo.guests}</div>
                </div>
                <div className="bg-black/30 rounded-lg border border-white/5 p-3">
                  <div className="text-cream/40 text-xs mb-1">Số món</div>
                  <div className="text-cream">{viewingCombo.dishes?.length || 0}</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg border border-white/5 p-4">
                <div className="text-sm text-cream/50 mb-3">Danh sách món</div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-cream/80">
                  {(viewingCombo.dishes || []).map((dish, index) => (
                    <li key={`${dish}-${index}`} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                      <span>{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setViewingCombo(null);
                  openEditModal(viewingCombo);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-cream rounded-lg text-sm transition-colors"
              >
                <Edit2 size={14} /> Chỉnh sửa
              </button>
              <button
                onClick={() => setViewingCombo(null)}
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
