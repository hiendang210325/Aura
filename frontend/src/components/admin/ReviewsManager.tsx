import {
  Eye,
  EyeOff,
  Filter,
  Loader2,
  MessageSquare,
  Plus,
  Reply,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useReviewsManager } from "../../Hook/useReviewsManager";

type ReviewStatus = "Mới" | "Đã phản hồi" | "Đã ẩn";

const STATUS_FILTERS = ["Tất cả", "Mới", "Đã phản hồi", "Đã ẩn"] as const;

const getStatusStyle = (status: ReviewStatus) => {
  switch (status) {
    case "Mới":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "Đã phản hồi":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Đã ẩn":
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const formatDate = (date?: string) => {
  if (!date) return "Chưa có";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("vi-VN").format(parsed);
};

const renderStars = (rating: number, size = 14) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={size}
        className={index < rating ? "fill-gold text-gold" : "text-white/10"}
      />
    ))}
  </div>
);

export default function ReviewsManager() {
  const {
    reviews,
    loading,
    error,
    search,
    setSearch,
    activeStatus,
    setActiveStatus,
    selectedReview,
    setSelectedReview,
    replyText,
    setReplyText,
    isCreateOpen,
    setIsCreateOpen,
    formData,
    setFormData,
    submitting,
    filteredReviews,
    visibleReviews,
    averageRating,
    pendingCount,
    hiddenCount,
    ratingCounts,
    openReplyModal,
    openCreateModal,
    handleCreateSubmit,
    handleReplySubmit,
    toggleHidden,
    handleDelete,
  } = useReviewsManager();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-gold">Đánh giá khách hàng</h2>
              <p className="text-sm text-cream/50 mt-1">
                Dữ liệu lưu trong hệ thống — {reviews.length} đánh giá
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm đánh giá..."
                  className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors w-full sm:w-56"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
                <select
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value as (typeof STATUS_FILTERS)[number])}
                  className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none w-full sm:w-40"
                >
                  {STATUS_FILTERS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors"
              >
                <Plus size={16} />
                Thêm
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 text-red-400 text-sm border-b border-red-500/20 text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64 text-gold">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredReviews.length === 0 ? (
                <div className="px-6 py-16 text-center text-cream/50">Không tìm thấy đánh giá nào.</div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review._id} className="p-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-medium text-cream">{review.customer}</h3>
                          <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getStatusStyle(review.status)}`}>
                            {review.status}
                          </span>
                          <span className="text-xs text-cream/40">{review._id.slice(-6).toUpperCase()}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-cream/50 mb-3">
                          {renderStars(review.rating)}
                          <span>{formatDate(review.date)}</span>
                          <span>{review.source}</span>
                          {review.phone && <span>{review.phone}</span>}
                        </div>

                        <p className="text-sm text-cream/75 leading-relaxed">{review.text}</p>

                        {review.reply && (
                          <div className="mt-4 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3">
                            <div className="text-xs text-gold/80 mb-1">Phản hồi của nhà hàng</div>
                            <p className="text-sm text-cream/70">{review.reply}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex lg:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => openReplyModal(review)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors text-cream/70 text-sm"
                        >
                          <Reply size={15} />
                          Phản hồi
                        </button>
                        <button
                          onClick={() => toggleHidden(review)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 rounded-lg transition-colors text-cream/70 text-sm"
                        >
                          {review.status === "Đã ẩn" ? <Eye size={15} /> : <EyeOff size={15} />}
                          {review.status === "Đã ẩn" ? "Hiện" : "Ẩn"}
                        </button>
                        <button
                          onClick={() => handleDelete(review)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-cream/70 text-sm"
                        >
                          <Trash2 size={15} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-lg p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-serif font-bold text-gold">Tổng quan</h3>
                <p className="text-xs text-cream/40 mt-1">Không tính đánh giá đã ẩn</p>
              </div>
              <MessageSquare className="text-gold/70" size={22} />
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-4xl font-serif text-cream">{averageRating.toFixed(1)}</div>
                <div className="mt-1">{renderStars(Math.round(averageRating), 16)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-black/30 border border-white/5 p-3">
                  <div className="text-cream/40 text-xs">Cần phản hồi</div>
                  <div className="text-cream font-medium mt-1">{pendingCount}</div>
                </div>
                <div className="rounded-lg bg-black/30 border border-white/5 p-3">
                  <div className="text-cream/40 text-xs">Đã ẩn</div>
                  <div className="text-cream font-medium mt-1">{hiddenCount}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-lg p-6">
            <h3 className="text-lg font-serif font-bold text-gold mb-4">Phân bố sao</h3>
            <div className="space-y-3">
              {ratingCounts.map((item) => {
                const width = visibleReviews.length ? (item.count / visibleReviews.length) * 100 : 0;

                return (
                  <div key={item.rating} className="flex items-center gap-3 text-sm">
                    <span className="w-8 text-cream/60">{item.rating}★</span>
                    <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${width}%` }} />
                    </div>
                    <span className="w-6 text-right text-cream/50">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-gold">Phản hồi đánh giá</h3>
                <p className="text-sm text-cream/50 mt-1">{selectedReview.customer}</p>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-cream/50 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReplySubmit} className="p-6 space-y-5">
              <div className="rounded-lg bg-black/30 border border-white/5 p-4">
                <div className="mb-2">{renderStars(selectedReview.rating)}</div>
                <p className="text-sm text-cream/70 leading-relaxed">{selectedReview.text}</p>
              </div>

              <div>
                <label className="block text-sm text-cream/70 mb-2">Nội dung phản hồi</label>
                <textarea
                  required
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  placeholder="Nhập phản hồi gửi khách hàng..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
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
                  Lưu phản hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-gold">Thêm đánh giá</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-cream/50 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Tên khách *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer}
                    onChange={(e) => setFormData((current) => ({ ...current, customer: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData((current) => ({ ...current, phone: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Số sao *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData((current) => ({ ...current, rating: Number(e.target.value) }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} sao
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Ngày</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((current) => ({ ...current, date: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Nguồn</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData((current) => ({ ...current, source: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Website, Combo, Đặt bàn online..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-cream/70 mb-2">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value as ReviewStatus }))}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="Mới">Mới</option>
                    <option value="Đã phản hồi">Đã phản hồi</option>
                    <option value="Đã ẩn">Đã ẩn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-cream/70 mb-2">Nội dung đánh giá *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.text}
                  onChange={(e) => setFormData((current) => ({ ...current, text: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/50 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
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
                  Tạo đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
