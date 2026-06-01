import Header from "../components/Header";
import Footer from "../components/Footer";
import { useReservationPage } from "../Hook/useReservationPage";
import {
  Calendar,
  Users,
  Utensils,
  Gift,
  Briefcase,
  ChevronDown,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Navigation,
} from "lucide-react";

// Mock Data Arrays
const reservationTypes = [
  {
    id: "standard",
    title: "Đặt bàn tiêu chuẩn",
    description: "Đặt bàn cho bữa trưa, bữa tối hoặc dùng bữa thông thường.",
    icon: <Calendar className="w-6 h-6" />,
    cta: "Đặt Bàn",
  },
  {
    id: "combo",
    title: "Đặt Combo",
    description:
      "Chọn combo ẩm thực tinh tế cho gia đình, bạn bè hoặc họp mặt nhóm.",
    icon: <Utensils className="w-6 h-6" />,
    cta: "Đặt Combo",
  },
  {
    id: "party",
    title: "Sinh nhật & Tiệc riêng tư",
    description:
      "Lên kế hoạch sinh nhật, kỷ niệm hoặc tiệc riêng tư với các tùy chọn trang trí đặc biệt.",
    icon: <Gift className="w-6 h-6" />,
    cta: "Lên kế hoạch",
  },
  {
    id: "corporate",
    title: "Sự kiện doanh nghiệp",
    description:
      "Đặt không gian cho bữa tối công việc, họp mặt nhóm và sự kiện công ty.",
    icon: <Briefcase className="w-6 h-6" />,
    cta: "Yêu cầu sự kiện",
  },
];

const diningAreas = [
  {
    id: "main-hall",
    name: "Sảnh chính",
    description:
      "Không gian dùng bữa rộng rãi, thanh lịch với ánh sáng tuyệt đẹp.",
    capacity: "2–60 khách",
    bestFor: "Dùng bữa thông thường, bữa ăn gia đình, tiệc nhóm",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
  },
  {
    id: "vip-room",
    name: "Phòng VIP riêng tư",
    description:
      "Phòng yên tĩnh, độc quyền với dịch vụ cao cấp và sự riêng tư.",
    capacity: "4–20 khách",
    bestFor: "Tiệc công việc, tiệc riêng tư",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80",
  },
  {
    id: "event-area",
    name: "Khu vực sự kiện",
    description: "Không gian dành riêng cho các buổi tụ họp và tiệc tùng lớn.",
    capacity: "20–100 khách",
    bestFor: "Sự kiện công ty, sinh nhật, tiệc lớn",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
  },
];

const recommendedCombos = [
  {
    id: "family-combo",
    name: "Combo Gia Đình Đặc Trưng",
    guests: "4–6 khách",
    dishes: "Bao gồm 5 món đặc trưng, súp và món tráng miệng.",
    price: "2.500.000 đ",
    badge: "Yêu thích nhất",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80",
  },
  {
    id: "friends-combo",
    name: "Combo Tụ Họp Bạn Bè",
    guests: "6–10 khách",
    dishes: "Bao gồm 8 món dùng chung, món khai vị và 2 chai rượu vang.",
    price: "4.800.000 đ",
    badge: "Đáng giá nhất",
    image:
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80",
  },
  {
    id: "corporate-combo",
    name: "Combo Tiệc Doanh Nghiệp",
    guests: "10+ khách",
    dishes: "Bữa ăn cao cấp nhiều món với bò wagyu và hải sản.",
    price: "9.000.000 đ+",
    badge: "Lựa chọn cao cấp",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Chọn Ngày",
    description: "Chọn ngày và giờ bạn muốn đặt bàn.",
  },
  {
    step: "02",
    title: "Chọn Số Khách & Khu Vực",
    description: "Cho chúng tôi biết quy mô nhóm và khu vực dùng bữa bạn muốn.",
  },
  {
    step: "03",
    title: "Chọn Combo hoặc Ghi chú",
    description: "Thêm combo món ăn hoặc yêu cầu đặc biệt nếu cần.",
  },
  {
    step: "04",
    title: "Nhận Xác Nhận",
    description:
      "Đội ngũ của chúng tôi sẽ liên hệ với bạn để xác nhận đặt bàn.",
  },
];

const ReservationPage = () => {
  const {
    formData,
    setFormData,
    submitState,
    errorMsg,
    successMsg,
    handleInputChange,
    scrollToForm,
    resetForm,
    handleSubmit,
  } = useReservationPage();

  return (
    <div className="bg-charcoal min-h-screen font-sans text-cream">
      <Header activePage="Reservation" />

      {/* 2. Reservation Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 lg:px-8 min-h-[70vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80"
            alt="Luxury Restaurant Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/80 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="block text-gold text-sm tracking-[3px] uppercase font-medium mb-6">
            Đặt Bàn Trực Tuyến
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight">
            Đặt Bàn Cho Trải Nghiệm Ẩm Thực{" "}
            <span className="text-gold italic">Hoàn Hảo</span> Của Bạn
          </h1>
          <p className="text-lg md:text-xl text-cream-muted font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Đặt bàn, chọn combo món ăn yêu thích hoặc lên kế hoạch cho một bữa
            tiệc riêng tư tại nhà hàng cao cấp của chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToForm("Đặt bàn tiêu chuẩn")}
              className="lux-button w-full sm:w-auto px-8 py-4 text-sm tracking-widest"
            >
              Đặt Ngay
            </button>
            <a
              href="#combos"
              className="w-full sm:w-auto px-8 py-4 text-sm tracking-widest text-cream border border-gold/30 hover:border-gold hover:text-gold transition-all duration-300 uppercase"
            >
              Khám Phá Combo
            </a>
          </div>
        </div>
      </section>

      {/* 3. Reservation Type Cards */}
      <section className="py-20 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
            Chọn Loại Hình Đặt Bàn
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reservationTypes.map((type) => (
            <div
              key={type.id}
              className="bg-charcoal-light border editorial-border p-8 rounded-sm hover:border-gold/50 transition-all duration-300 flex flex-col items-start group"
            >
              <div className="text-gold mb-6 bg-charcoal p-4 rounded-full border border-gold/20 group-hover:scale-110 transition-transform duration-300">
                {type.icon}
              </div>
              <h3 className="text-xl font-serif mb-3 text-cream">
                {type.title}
              </h3>
              <p className="text-cream-muted font-light text-sm mb-8 flex-grow leading-relaxed">
                {type.description}
              </p>
              <button
                onClick={() => scrollToForm(type.title)}
                className="text-gold text-sm uppercase tracking-widest font-medium group-hover:underline underline-offset-4"
              >
                {type.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4 & 5. Main Reservation Form Section & Summary Card */}
      <section
        id="reservation-form"
        className="py-20 bg-charcoal-light border-y border-gold/10 px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
              Đặt Bàn
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Form */}
            <div className="lg:col-span-8 bg-charcoal p-8 md:p-12 rounded-sm border editorial-border">
              {submitState === "success" ? (
                <div className="text-center py-16 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-serif text-cream">
                    Đặt Bàn Thành Công!
                  </h3>
                  <p className="text-cream-muted font-light max-w-md mx-auto">
                    {successMsg ||
                      "Cảm ơn bạn đã đặt bàn. Email xác nhận đã được gửi đến địa chỉ của bạn."}
                  </p>
                  <button
                    onClick={resetForm}
                    className="lux-button px-8 py-3 text-sm tracking-widest"
                  >
                    Đặt Bàn Khác
                  </button>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                  {submitState === "error" && errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm text-red-400 text-sm text-center">
                      {errorMsg}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors"
                        placeholder="+84 123 456 789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                      Địa chỉ Email (Mail sẽ được gửi về hòm thư) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors"
                      placeholder="nguyenvana@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                        Ngày
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                        Giờ
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                        Số khách
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Chọn Số Khách</option>
                        {[...Array(20)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} Khách
                          </option>
                        ))}
                        <option value="20+">Hơn 20 khách</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                        Loại hình đặt bàn
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors appearance-none pr-10"
                      >
                        {reservationTypes.map((t) => (
                          <option key={t.id} value={t.title}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-11 text-gold/50 pointer-events-none w-5 h-5" />
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                        Khu vực ưu tiên
                      </label>
                      <select
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors appearance-none pr-10"
                      >
                        <option value="Any">Không yêu cầu</option>
                        {diningAreas.map((a) => (
                          <option key={a.id} value={a.name}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-11 text-gold/50 pointer-events-none w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                      Combo ưu tiên (Tùy chọn)
                    </label>
                    <select
                      name="combo"
                      value={formData.combo}
                      onChange={handleInputChange}
                      className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors appearance-none pr-10"
                    >
                      <option value="None">Không</option>
                      {recommendedCombos.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-11 text-gold/50 pointer-events-none w-5 h-5" />
                  </div>

                  <div>
                    <label className="block text-sm text-cream-muted uppercase tracking-wider mb-2">
                      Yêu cầu đặc biệt / Ghi chú
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-charcoal-light border border-gold/20 p-4 text-cream focus:border-gold focus:outline-none transition-colors resize-none"
                      placeholder="Hạn chế chế độ ăn, dịp đặc biệt, v.v."
                    ></textarea>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agree"
                      checked={formData.agreed}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreed: e.target.checked,
                        }))
                      }
                      className="mt-1 w-5 h-5 accent-gold border-gold/20 bg-charcoal-light"
                    />
                    <label
                      htmlFor="agree"
                      className="text-sm text-cream-muted leading-relaxed"
                    >
                      Tôi đồng ý để nhà hàng liên hệ xác nhận đặt bàn.
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitState === "loading"}
                      className="lux-button w-full py-5 text-sm tracking-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitState === "loading"
                        ? "Đang gửi..."
                        : "Xác Nhận Đặt Bàn"}
                    </button>
                    <p className="text-center text-xs text-cream-muted mt-4 font-light">
                      Đội ngũ của chúng tôi sẽ sớm liên hệ với bạn để xác nhận
                      đặt bàn.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-charcoal p-8 rounded-sm border border-gold/30 sticky top-32 shadow-2xl">
                <h3 className="text-2xl font-serif text-cream mb-6 pb-4 border-b border-gold/20">
                  Tóm Tắt Đặt Bàn
                </h3>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-cream-muted text-sm uppercase tracking-wider">
                      Ngày
                    </span>
                    <span className="text-cream font-medium">
                      {formData.date || "Chọn một ngày"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cream-muted text-sm uppercase tracking-wider">
                      Giờ
                    </span>
                    <span className="text-cream font-medium">
                      {formData.time || "Chọn một giờ"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cream-muted text-sm uppercase tracking-wider">
                      Số khách
                    </span>
                    <span className="text-cream font-medium">
                      {formData.guests
                        ? `${formData.guests} Khách`
                        : "Chọn số khách"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-gold/10">
                    <span className="text-cream-muted text-sm uppercase tracking-wider">
                      Loại hình
                    </span>
                    <span className="text-gold font-serif text-right">
                      {formData.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cream-muted text-sm uppercase tracking-wider">
                      Khu vực
                    </span>
                    <span className="text-cream font-medium text-right">
                      {formData.area}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cream-muted text-sm uppercase tracking-wider">
                      Combo
                    </span>
                    <span className="text-cream font-medium text-right max-w-[150px] truncate">
                      {formData.combo}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gold/20 bg-charcoal-light p-4 rounded-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-gold w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-xs text-cream-muted font-light leading-relaxed">
                      Không cần thanh toán ngay. Tiền cọc có thể được yêu cầu
                      sau đối với phòng riêng hoặc nhóm đông người.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-gold w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-xs text-cream-muted font-light leading-relaxed">
                      Khách hàng vui lòng nhập đúng email để nhận được thông tin
                      gửi về email của mình.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Available Dining Areas Section */}
      <section className="py-20 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
            Chọn Khu Vực Dùng Bữa
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
          <p className="text-cream-muted font-light max-w-2xl mx-auto">
            Khám phá các không gian khác biệt của chúng tôi được thiết kế để
            mang đến bầu không khí hoàn hảo cho mọi dịp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diningAreas.map((area) => (
            <div
              key={area.id}
              className="group relative overflow-hidden rounded-sm bg-charcoal border editorial-border cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent"></div>
              </div>
              <div className="p-6 relative -mt-16 bg-gradient-to-t from-charcoal via-charcoal to-transparent">
                <h3 className="text-2xl font-serif text-gold mb-2">
                  {area.name}
                </h3>
                <p className="text-cream-muted text-sm font-light mb-6 line-clamp-2">
                  {area.description}
                </p>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-gold/70 mt-0.5 shrink-0" />
                    <span className="text-cream/80">
                      Sức chứa: {area.capacity}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold/70 mt-0.5 shrink-0" />
                    <span className="text-cream/80">
                      Tốt nhất cho: {area.bestFor}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, area: area.name }));
                    document
                      .getElementById("reservation-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-3 border border-gold/30 text-gold text-xs uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-colors duration-300"
                >
                  Chọn Khu Vực
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Recommended Combos Section */}
      <section
        id="combos"
        className="py-20 md:py-32 px-6 lg:px-8 bg-charcoal-light border-y border-gold/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
              Combo Dùng Bữa Đề Xuất
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
            <p className="text-cream-muted font-light max-w-2xl mx-auto">
              Đặt bàn nhanh hơn với thực đơn được thiết kế sẵn cho các quy mô
              nhóm khác nhau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedCombos.map((combo) => (
              <div
                key={combo.id}
                className="bg-charcoal border editorial-border p-6 rounded-sm flex flex-col relative overflow-hidden group"
              >
                <div className="absolute top-4 right-[-32px] bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest py-1 px-10 rotate-45 shadow-lg z-10">
                  {combo.badge}
                </div>
                <div className="aspect-video overflow-hidden rounded-sm mb-6 relative">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-serif text-gold mb-2">
                  {combo.name}
                </h3>
                <p className="text-sm text-cream/70 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> {combo.guests}
                </p>
                <p className="text-cream-muted text-sm font-light mb-6 flex-grow">
                  {combo.dishes}
                </p>
                <div className="flex items-center justify-between mb-6 pt-4 border-t border-gold/10">
                  <span className="text-sm text-cream-muted uppercase tracking-wider">
                    Giá từ
                  </span>
                  <span className="text-2xl font-serif text-gold">
                    {combo.price}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, combo: combo.name }));
                    document
                      .getElementById("reservation-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="lux-button w-full py-3 text-xs tracking-widest"
                >
                  Đặt Combo Này
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Reservation Process Section */}
      <section className="py-20 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
            Cách Hoạt Động Của Việc Đặt Bàn Trực Tuyến
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gold/20 border-dashed border-b border-gold/30"></div>

          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative text-center flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full bg-charcoal border-2 border-gold/30 flex items-center justify-center mb-6 z-10 shadow-xl shadow-black/50">
                <span className="text-3xl font-serif text-gold">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-serif text-cream mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-cream-muted font-light px-4 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Reservation Policy Section */}
      <section className="py-20 px-6 lg:px-8 bg-charcoal-light border-t border-gold/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-serif text-cream mb-4">
              Chính Sách Đặt Bàn
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-charcoal p-6 border editorial-border rounded-sm flex items-start gap-4">
              <Clock className="text-gold w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="text-cream font-medium mb-1">Giờ đến</h4>
                <p className="text-cream-muted text-sm font-light">
                  Vui lòng đến đúng giờ. Bàn sẽ được giữ trong vòng 15 phút sau
                  giờ đặt.
                </p>
              </div>
            </div>
            <div className="bg-charcoal p-6 border editorial-border rounded-sm flex items-start gap-4">
              <Users className="text-gold w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="text-cream font-medium mb-1">Nhóm đông người</h4>
                <p className="text-cream-muted text-sm font-light">
                  Nhóm từ 8 người trở lên cần được nhân viên của chúng tôi xác
                  nhận trước.
                </p>
              </div>
            </div>
            <div className="bg-charcoal p-6 border editorial-border rounded-sm flex items-start gap-4">
              <Briefcase className="text-gold w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="text-cream font-medium mb-1">VIP & Sự kiện</h4>
                <p className="text-cream-muted text-sm font-light">
                  Phòng VIP và khu vực sự kiện có thể yêu cầu đặt cọc để đảm bảo
                  đặt chỗ.
                </p>
              </div>
            </div>
            <div className="bg-charcoal p-6 border editorial-border rounded-sm flex items-start gap-4">
              <Phone className="text-gold w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="text-cream font-medium mb-1">Hủy bàn</h4>
                <p className="text-cream-muted text-sm font-light">
                  Mọi thay đổi hoặc hủy bàn nên được thực hiện trước ít nhất 12
                  giờ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Contact Support Section */}
      <section className="py-20 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-charcoal p-8 md:p-16 border editorial-border rounded-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-6">
              Cần Hỗ Trợ Đặt Bàn?
            </h2>
            <p className="text-cream-muted font-light max-w-2xl mx-auto mb-10 text-lg">
              Đội ngũ nhân viên tận tâm của chúng tôi sẵn sàng hỗ trợ bạn với
              các yêu cầu đặc biệt, nhu cầu ăn kiêng hoặc lên kế hoạch sự kiện.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="tel:+15550000000"
                className="flex items-center gap-3 bg-charcoal-light border border-gold/30 px-6 py-4 rounded-sm hover:border-gold transition-colors text-cream"
              >
                <Phone className="w-5 h-5 text-gold" />
                <span className="font-medium tracking-wide">
                  +1 (555) 000-0000
                </span>
              </a>
              <a
                href="mailto:reserve@aura.com"
                className="flex items-center gap-3 bg-charcoal-light border border-gold/30 px-6 py-4 rounded-sm hover:border-gold transition-colors text-cream"
              >
                <Mail className="w-5 h-5 text-gold" />
                <span className="font-medium tracking-wide">
                  reserve@aura.com
                </span>
              </a>
              <a
                href="#contact"
                className="flex items-center gap-3 bg-charcoal-light border border-gold/30 px-6 py-4 rounded-sm hover:border-gold transition-colors text-cream"
              >
                <MapPin className="w-5 h-5 text-gold" />
                <span className="font-medium tracking-wide">Chỉ Đường</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Final CTA Section */}
      <section className="py-24 bg-charcoal-light text-center px-6 border-t border-gold/10 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #D4AF37 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-6">
            Sẵn Sàng Cho Một Trải Nghiệm Ẩm Thực Đáng Nhớ?
          </h2>
          <p className="text-cream-muted font-light mb-10 text-lg">
            Đặt bàn ngay hôm nay và để chúng tôi chuẩn bị không gian hoàn hảo
            cho dịp của bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() =>
                document
                  .getElementById("reservation-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="lux-button px-10 py-4 text-sm tracking-widest"
            >
              Đặt Bàn
            </button>
            <a
              href="/menu"
              className="px-10 py-4 border border-gold/30 text-cream text-sm tracking-widest uppercase hover:bg-gold hover:text-charcoal transition-colors duration-300"
            >
              Xem Thực Đơn
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReservationPage;
