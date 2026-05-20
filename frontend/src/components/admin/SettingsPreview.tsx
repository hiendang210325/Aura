import { Clock, Loader2, Phone, Save, Shield, Store } from "lucide-react";
import { useSettingsPreview } from "../../Hook/useSettingsPreview";

export default function SettingsPreview() {
  const { settings, loading, saving, error, savedMessage, updateField, handleSubmit } =
    useSettingsPreview();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-xl font-serif font-bold text-gold">Cài đặt Nhà hàng</h2>
          <p className="text-sm text-cream/50 mt-1">Cấu hình tùy chọn hệ thống</p>
        </div>

        <button
          type="submit"
          disabled={saving || loading}
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 text-center">
          {error}
        </div>
      )}

      {savedMessage && (
        <div className="p-4 bg-green-500/10 text-green-400 text-sm rounded-xl border border-green-500/20 text-center">
          {savedMessage}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gold">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Store className="text-gold" size={20} />
              <h3 className="text-lg font-medium text-cream">Thông tin Chung</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-cream/70 mb-2">Tên nhà hàng</label>
                <input
                  type="text"
                  required
                  value={settings.restaurantName}
                  onChange={(e) => updateField("restaurantName", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">Danh mục</label>
                <input
                  type="text"
                  value={settings.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-cream/70 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-cream/70 mb-2">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  value={settings.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Phone className="text-gold" size={20} />
                <h3 className="text-lg font-medium text-cream">Thông tin Liên hệ</h3>
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">Số điện thoại</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">Địa chỉ Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Clock className="text-gold" size={20} />
                <h3 className="text-lg font-medium text-cream">Giờ Mở cửa</h3>
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">T2 - T6</label>
                <input
                  type="text"
                  value={settings.weekdayHours}
                  onChange={(e) => updateField("weekdayHours", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="17:00 - 23:00"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">T7 - CN</label>
                <input
                  type="text"
                  value={settings.weekendHours}
                  onChange={(e) => updateField("weekendHours", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="11:00 - 23:30"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Shield className="text-gold" size={20} />
              <h3 className="text-lg font-medium text-cream">Quy định & Chính sách Đặt bàn</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-cream/70 mb-2">Đặt trước tối đa (Ngày)</label>
                <input
                  type="number"
                  min={1}
                  value={settings.maxAdvanceBookingDays}
                  onChange={(e) => updateField("maxAdvanceBookingDays", Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">Thời gian Hủy trước (Giờ)</label>
                <input
                  type="number"
                  min={0}
                  value={settings.cancelBeforeHours}
                  onChange={(e) => updateField("cancelBeforeHours", Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-2">Số tiền Cọc (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.depositPercent}
                  onChange={(e) => updateField("depositPercent", Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
