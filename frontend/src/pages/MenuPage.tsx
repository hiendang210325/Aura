import {
  CalendarDays,
  ChevronRight,
  Clock,
  Flame,
  GlassWater,
  Leaf,
  Search,
  Sparkles,
  Star,
  Users,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useMenuPage } from "../Hook/useMenuPage";

const categories = [
  "Tất cả",
  "Khai vị",
  "Món chính",
  "Tráng miệng",
  "Đồ uống",
];

const fieldClass =
  "w-full rounded-[8px] border border-gold/25 bg-charcoal/70 px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-cream/35 focus:border-gold";
const selectClass = `${fieldClass} appearance-none`;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};

const SectionHeader = ({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="mx-auto mb-8 md:mb-12 max-w-3xl text-center px-4">
    {label && (
      <span className="mb-3 md:mb-4 block text-[10px] md:text-[11px] font-semibold uppercase tracking-[3px] md:tracking-[4px] text-gold">
        {label}
      </span>
    )}
    <h2 className="text-[32px] sm:text-[36px] md:text-5xl leading-tight text-cream">
      {title}
    </h2>
    {subtitle && (
      <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-sm leading-6 md:leading-7 text-cream/60 md:text-base">
        {subtitle}
      </p>
    )}
  </div>
);

export default function MenuPage() {
  const {
    combos,
    loading,
    activeCategory,
    comboPage,
    setComboPage,
    menuPage,
    setMenuPage,
    totalComboPages,
    currentCombos,
    filteredMenu,
    totalMenuPages,
    currentMenu,
    handleCategoryChange,
  } = useMenuPage();

  return (
    <div className="min-h-screen bg-charcoal text-cream font-sans smooth-scroll overflow-x-hidden">
      <Header activePage="Menu" />
      <main>
        <section className="relative min-h-[78svh] overflow-hidden pt-28 md:pt-36">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2600&auto=format&fit=crop"
              alt="Fine dining table with plated dishes"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/70" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.9)_0%,rgba(17,17,17,0.68)_42%,rgba(17,17,17,0.35)_100%)]" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(78svh-7rem)] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl py-16 md:py-20 text-center sm:text-left mx-auto sm:mx-0">
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-4 md:mb-6 block text-[10px] md:text-[12px] font-semibold uppercase tracking-[3px] md:tracking-[4px] text-gold"
              >
                Thực Đơn Của Chúng Tôi
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="max-w-3xl text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-normal leading-[1.1] md:leading-[1.05] text-cream"
              >
                Khám Phá Các Món Ăn Đặc Trưng & Combo Dùng Bữa Tinh Tế
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 md:mt-8 max-w-2xl text-sm sm:text-base leading-7 md:leading-8 text-cream/75 md:text-lg mx-auto sm:mx-0"
              >
                Khám phá các món ăn cao cấp, gợi ý từ bếp trưởng và các combo dành cho nhóm được thiết kế cho mọi dịp đặc biệt.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center sm:justify-start gap-4"
              >
                <a href="#full-menu" className="lux-button w-full sm:w-auto px-8 py-3.5 text-center">
                  Xem Món Ăn
                </a>
                <a
                  href="#combos"
                  className="lux-button-outline w-full sm:w-auto px-8 py-3.5 text-center"
                >
                  Khám Phá Combo
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-y border-gold/15 bg-charcoal/95 py-5 backdrop-blur-xl sticky top-[72px] z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_auto] lg:items-center">
              <label className="relative block w-full">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gold"
                />
                <input
                  type="search"
                  placeholder="Tìm kiếm món ăn..."
                  className="w-full rounded-[8px] border border-gold/20 bg-charcoal-muted/50 py-3 pl-12 pr-4 text-sm text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-gold"
                />
              </label>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 lg:w-[560px]">
                <select className={selectClass} defaultValue="">
                  <option value="" className="bg-charcoal">
                    Mức giá
                  </option>
                  <option className="bg-charcoal">Dưới 100k</option>
                  <option className="bg-charcoal">100k - 500k</option>
                  <option className="bg-charcoal">Trên 500k</option>
                </select>
                <select className={selectClass} defaultValue="">
                  <option value="" className="bg-charcoal">
                    Độ phổ biến
                  </option>
                  <option className="bg-charcoal">Bán chạy nhất</option>
                  <option className="bg-charcoal">Lựa chọn của bếp trưởng</option>
                  <option className="bg-charcoal">Món mới</option>
                </select>
                <select className={selectClass} defaultValue="">
                  <option value="" className="bg-charcoal">
                    Trạng thái
                  </option>
                  <option className="bg-charcoal">Còn hàng</option>
                  <option className="bg-charcoal">Hết hàng</option>
                  <option className="bg-charcoal">Tạm ngưng</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 hide-scrollbar max-w-full">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`shrink-0 rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[1.4px] transition-colors ${
                    activeCategory === category
                      ? "border-gold bg-gold text-charcoal"
                      : "border-gold/20 text-cream/65 hover:border-gold/60 hover:text-gold"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Sparkles size={14} />
                Lựa chọn Bếp trưởng
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Star size={14} />
                Bán chạy nhất
              </button>
            </div>
          </div>
        </section>

        <section id="combos" className="border-b border-gold/10 bg-charcoal py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Nổi Bật"
              title="Combo Dùng Bữa Đặc Trưng"
              subtitle="Những combo đặc sắc nhất được lựa chọn cho thực khách muốn thưởng thức hương vị trọn vẹn của Aura."
            />

            {loading ? (
              <div className="text-center text-gold">Đang tải dữ liệu...</div>
            ) : combos.length === 0 ? (
              <div className="text-center text-cream/50">Không có combo nào.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                  {currentCombos.map((combo, index) => (
                    <motion.article
                      key={combo._id}
                      initial={{ opacity: 0, y: 26 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-70px" }}
                      transition={{ duration: 0.55, delay: index * 0.08 }}
                      className={`group relative overflow-hidden rounded-[8px] border bg-charcoal shadow-[0_24px_72px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1 flex flex-col w-full ${
                        combo.featured
                          ? "border-gold shadow-[0_24px_90px_rgba(197,160,89,0.22)]"
                          : "border-gold/16 hover:border-gold/45"
                      }`}
                    >
                      {combo.featured && (
                        <div className="absolute right-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[1.4px] text-charcoal shadow-lg">
                          Nổi bật
                        </div>
                      )}
                      <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0 bg-charcoal-light">
                        <img
                          src={combo.image || "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"}
                          alt={combo.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
                      </div>
                      <div className="p-5 md:p-6 flex flex-col flex-1">
                        <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[1.4px] text-gold">
                          <Users size={14} /> {combo.guests}
                        </span>
                        <h3 className="text-xl sm:text-2xl leading-tight text-cream mb-2">
                          {combo.name}
                        </h3>
                        {combo.description && (
                          <p className="text-xs text-cream/60 leading-relaxed mb-4">
                            {combo.description}
                          </p>
                        )}
                        <div className="my-4 border-y border-gold/12 py-4 flex-1">
                          <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[1.5px] text-cream/45">
                            <span>{combo.dishes.length} món</span>
                          </div>
                          <ul className="space-y-2 text-xs md:text-sm leading-6 text-cream/70 list-disc pl-4">
                            {combo.dishes.map((dish, i) => (
                              <li key={i}>{dish}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mb-6 flex items-end justify-between">
                          <span className="text-[10px] uppercase tracking-[1.5px] text-cream/40">
                            Giá từ
                          </span>
                          <strong className="text-xl sm:text-2xl font-semibold text-gold">
                            {formatPrice(combo.price)}
                          </strong>
                        </div>
                        <div className="grid gap-3 shrink-0">
                          <a
                            href="#reservation"
                            className={`w-full px-5 py-3 text-center text-[11px] md:text-xs ${
                              combo.featured ? "lux-button" : "lux-button-outline"
                            }`}
                          >
                            Đặt Combo Này
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
                {totalComboPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: totalComboPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setComboPage(i + 1)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          comboPage === i + 1
                            ? "bg-gold text-charcoal shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                            : "border border-gold/30 text-gold hover:bg-gold/10"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section id="full-menu" className="bg-[#151210] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Lựa Chọn Hoàn Hảo"
              title="Toàn Bộ Thực Đơn"
              subtitle="Khám phá đầy đủ các món khai vị, món chính, lẩu, nướng BBQ, sushi, tráng miệng và đồ uống hảo hạng."
            />

            {loading ? (
              <div className="text-center text-gold">Đang tải dữ liệu...</div>
            ) : filteredMenu.length === 0 ? (
              <div className="text-center text-cream/50">Không có món ăn nào trong danh mục này.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.map((item, index) => (
                    <motion.article
                    key={item._id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, delay: (index % 6) * 0.035 }}
                    className={`group overflow-hidden rounded-[8px] border bg-charcoal shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition-all duration-500 hover:border-gold/40 flex flex-col h-full w-full ${
                      item.status === "Còn hàng"
                        ? "border-gold/12"
                        : "border-cream/10 opacity-60 grayscale-[35%]"
                    }`}
                  >
                    <div className="relative h-[220px] sm:h-[240px] w-full shrink-0 overflow-hidden bg-charcoal-light">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-gold/20 bg-charcoal/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[1.3px] text-gold">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-[1.2px] ${
                            item.status === "Còn hàng" ? "text-cream/45" : "text-gold"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-[24px] leading-tight text-cream">
                        {item.name}
                      </h3>
                      <p className="mt-2 sm:mt-3 flex-1 text-xs sm:text-sm leading-6 text-cream/55 line-clamp-3">
                        {item.description}
                      </p>
                      <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <span className="text-lg font-semibold text-gold">
                          {formatPrice(item.price)}
                        </span>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            disabled={item.status !== "Còn hàng"}
                            className="flex-1 sm:flex-none justify-center text-center rounded-full border border-gold/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[1.3px] text-cream transition-colors hover:border-gold hover:text-gold disabled:pointer-events-none disabled:text-cream/35"
                          >
                            Chi Tiết
                          </button>
                          <button
                            type="button"
                            disabled={item.status !== "Còn hàng"}
                            className="flex-1 sm:flex-none justify-center text-center rounded-full bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-[1.3px] text-charcoal transition-colors hover:bg-gold-hover disabled:pointer-events-none disabled:bg-cream/20 disabled:text-cream/40"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                    </motion.article>
                  ))}
                </div>
                {totalMenuPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: totalMenuPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setMenuPage(i + 1)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          menuPage === i + 1
                            ? "bg-gold text-charcoal shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                            : "border border-gold/30 text-gold hover:bg-gold/10"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden bg-brown-deep py-16 md:py-24">
          <div className="absolute left-0 top-12 h-px w-1/3 bg-gradient-to-r from-transparent to-gold/45" />
          <div className="absolute bottom-12 right-0 h-px w-1/3 bg-gradient-to-l from-transparent to-gold/45" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center lg:px-8">
            <span className="mb-4 md:mb-5 block text-[10px] md:text-[11px] font-semibold uppercase tracking-[3px] md:tracking-[4px] text-gold">
              Đặt Bàn
            </span>
            <h2 className="text-[32px] sm:text-[40px] leading-tight text-cream md:text-6xl">
              Đã tìm thấy món yêu thích?
            </h2>
            <p className="mx-auto mt-4 md:mt-6 max-w-2xl text-sm sm:text-base leading-7 md:leading-8 text-cream/65">
              Hãy đặt bàn ngay hôm nay để tận hưởng không gian sang trọng và trải nghiệm ẩm thực đẳng cấp.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#reservation" className="lux-button w-full sm:w-auto px-9 py-3.5">
                Đặt Bàn Ngay
              </a>
              <a href="#reservation" className="lux-button-outline w-full sm:w-auto px-9 py-3.5">
                Đặt Combo
              </a>
            </div>
          </div>
        </section>

        <section id="reservation" className="bg-charcoal py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div className="lg:sticky lg:top-32 text-center lg:text-left">
                <span className="mb-3 md:mb-4 block text-[10px] md:text-[11px] font-semibold uppercase tracking-[3px] md:tracking-[4px] text-gold">
                  Đặt Bàn Nhanh
                </span>
                <h2 className="text-[32px] sm:text-[36px] leading-tight text-cream md:text-5xl">
                  Đặt chỗ tại Aura.
                </h2>
                <p className="mt-4 md:mt-5 max-w-md mx-auto lg:mx-0 text-sm leading-6 md:leading-7 text-cream/60">
                  Chọn ngày giờ và số lượng khách. Đội ngũ của chúng tôi sẽ xác nhận và chuẩn bị bàn phù hợp nhất cho bạn.
                </p>
                <div className="mt-6 md:mt-8 grid max-w-md mx-auto lg:mx-0 gap-4 grid-cols-1 sm:grid-cols-2 text-left">
                  <div className="rounded-[8px] border border-gold/16 bg-charcoal-light p-4 md:p-5">
                    <Clock size={18} className="mb-2 md:mb-3 text-gold md:w-[20px] md:h-[20px]" />
                    <span className="block text-[10px] md:text-[11px] uppercase tracking-[1.4px] text-cream/40">
                      Giờ mở cửa
                    </span>
                    <strong className="mt-1 md:mt-2 block text-xs md:text-sm font-medium text-cream">
                      10:00 Sáng - 10:30 Tối
                    </strong>
                  </div>
                  <div className="rounded-[8px] border border-gold/16 bg-charcoal-light p-4 md:p-5">
                    <GlassWater size={18} className="mb-2 md:mb-3 text-gold md:w-[20px] md:h-[20px]" />
                    <span className="block text-[10px] md:text-[11px] uppercase tracking-[1.4px] text-cream/40">
                      Phong cách
                    </span>
                    <strong className="mt-1 md:mt-2 block text-xs md:text-sm font-medium text-cream">
                      Thưởng thức Menu
                    </strong>
                  </div>
                </div>
              </div>

              <form
                className="rounded-[8px] border border-gold/18 bg-charcoal-light p-5 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-8 w-full"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-cream/55">
                      Họ và tên
                    </label>
                    <input className={fieldClass} type="text" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-cream/55">
                      Số điện thoại
                    </label>
                    <input
                      className={fieldClass}
                      type="tel"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-cream/55">
                      Ngày đặt
                    </label>
                    <input className={fieldClass} type="date" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-cream/55">
                      Giờ đến
                    </label>
                    <input className={fieldClass} type="time" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-cream/55">
                      Số lượng khách
                    </label>
                    <select className={selectClass} defaultValue="">
                      <option value="" className="bg-charcoal">
                        Chọn số người
                      </option>
                      <option className="bg-charcoal">2 người</option>
                      <option className="bg-charcoal">4 người</option>
                      <option className="bg-charcoal">6 người</option>
                      <option className="bg-charcoal">8 người</option>
                      <option className="bg-charcoal">Từ 10 người trở lên</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-cream/55">
                      Hình thức
                    </label>
                    <select className={selectClass} defaultValue="Standard table booking">
                      <option className="bg-charcoal">Đặt bàn thông thường</option>
                      <option className="bg-charcoal">Sử dụng Combo</option>
                      <option className="bg-charcoal">Tiệc sinh nhật</option>
                      <option className="bg-charcoal">Sự kiện công ty</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-cream/55">
                      Combo yêu thích (nếu có)
                    </label>
                    <select className={selectClass} defaultValue="None">
                      <option className="bg-charcoal">Không có</option>
                      {combos.map(combo => (
                        <option key={combo._id} className="bg-charcoal">{combo.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-cream/55">
                      Ghi chú thêm
                    </label>
                    <textarea
                      className={`${fieldClass} min-h-[90px] md:min-h-[112px] resize-none`}
                      placeholder="Yêu cầu dị ứng món ăn, vị trí ngồi..."
                    />
                  </div>
                </div>

                <div className="mt-6 md:mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2 text-[10px] md:text-[11px] uppercase tracking-[1.2px] text-cream/45">
                    <span className="inline-flex items-center gap-1">
                      <Flame size={12} className="text-gold md:w-[13px] md:h-[13px]" /> Đồ cay nóng
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Leaf size={12} className="text-gold md:w-[13px] md:h-[13px]" /> Đồ chay
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="lux-button w-full sm:w-auto px-8 py-3.5 text-center"
                  >
                    Xác Nhận Đặt Bàn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
