import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContactPage } from "../Hook/useContactPage";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Plus,
  Minus,
  MessageSquare,
  CalendarDays,
  Users,
  Briefcase,
  Map as MapIcon,
  ChevronDown,
} from "lucide-react";

// --- Mock Data ---

const contactCards = [
  {
    icon: <Phone className="w-6 h-6 text-gold mb-4" />,
    title: "Gọi Chúng Tôi",
    content: "+84 123 456 789",
    description: "Trò chuyện trực tiếp với đội ngũ đặt bàn.",
    cta: "Gọi Ngay",
    href: "tel:+84123456789",
  },
  {
    icon: <Mail className="w-6 h-6 text-gold mb-4" />,
    title: "Gửi Email",
    content: "contact@aurarestaurant.com",
    description: "Gửi câu hỏi hoặc yêu cầu sự kiện của bạn.",
    cta: "Gửi Email",
    href: "mailto:contact@aurarestaurant.com",
  },
  {
    icon: <MapPin className="w-6 h-6 text-gold mb-4" />,
    title: "Đến Cửa Hàng",
    content: "123 Đường Luxury, Quận 1, TP. Hồ Chí Minh",
    description: "Tìm chúng tôi ngay tại trung tâm thành phố.",
    cta: "Chỉ Đường",
    href: "#map-section",
  },
  {
    icon: <Clock className="w-6 h-6 text-gold mb-4" />,
    title: "Giờ Mở Cửa",
    content: "10:00 Sáng – 10:30 Tối",
    description: "Mở cửa hàng ngày cho bữa trưa, bữa tối và sự kiện.",
    cta: "Xem Giờ",
    href: "#hours-section",
  },
];

const openingHours = [
  { day: "Thứ Hai", hours: "10:00 Sáng – 10:30 Tối" },
  { day: "Thứ Ba", hours: "10:00 Sáng – 10:30 Tối" },
  { day: "Thứ Tư", hours: "10:00 Sáng – 10:30 Tối" },
  { day: "Thứ Năm", hours: "10:00 Sáng – 10:30 Tối" },
  { day: "Thứ Sáu", hours: "10:00 Sáng – 11:00 Tối" },
  { day: "Thứ Bảy", hours: "9:30 Sáng – 11:00 Tối" },
  { day: "Chủ Nhật", hours: "9:30 Sáng – 10:30 Tối" },
];

const supportCards = [
  {
    icon: <CalendarDays className="w-8 h-8 text-gold/80 mb-4" />,
    title: "Hỗ Trợ Đặt Bàn",
    description: "Cần hỗ trợ thay đổi hoặc xác nhận đặt bàn của bạn?",
    cta: "Liên Hệ Đặt Bàn",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-gold/80 mb-4" />,
    title: "Tư Vấn Phòng Riêng",
    description: "Tìm hiểu về phòng VIP và các không gian dùng bữa riêng tư.",
    cta: "Hỏi Về Phòng VIP",
  },
  {
    icon: <Users className="w-8 h-8 text-gold/80 mb-4" />,
    title: "Lên Kế Hoạch Sự Kiện & Sinh Nhật",
    description: "Lên kế hoạch tiệc sinh nhật, kỷ niệm hoặc các dịp đặc biệt.",
    cta: "Lên Kế Hoạch Sự Kiện",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-gold/80 mb-4" />,
    title: "Tiệc Doanh Nghiệp",
    description: "Tổ chức bữa tối công việc, họp mặt nhóm và sự kiện công ty.",
    cta: "Yêu Cầu Đặt Tiệc Doanh Nghiệp",
  },
];

const faqItems = [
  {
    question: "Tôi có cần đặt bàn trước không?",
    answer:
      "Chúng tôi khuyên bạn nên đặt bàn trước, đặc biệt vào cuối tuần, với phòng VIP và nhóm đông người.",
  },
  {
    question: "Tôi có thể yêu cầu phòng riêng không?",
    answer:
      "Có, chúng tôi có phòng VIP và khu vực riêng tùy vào tình trạng trống.",
  },
  {
    question: "Tôi có thể đặt combo cho nhóm không?",
    answer: "Có, bạn có thể chọn các combo đã thiết kế sẵn khi đặt bàn.",
  },
  {
    question: "Nhà hàng có hỗ trợ trang trí sinh nhật không?",
    answer:
      "Có, chúng tôi hỗ trợ trang trí sinh nhật cho các yêu cầu đặt trước.",
  },
  {
    question: "Nhà hàng có tổ chức sự kiện doanh nghiệp không?",
    answer:
      "Có, chúng tôi hỗ trợ bữa tối công việc, gặp gỡ đối tác và sự kiện nội bộ công ty.",
  },
];

// SVG for TikTok since Lucide doesn't have it
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const ContactPage = () => {
  const { openFAQ, toggleFAQ, handleSubmit } = useContactPage();

  return (
    <div className="bg-charcoal min-h-screen font-sans text-cream">
      <Header activePage="Contact" />

      {/* 2. Contact Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 lg:px-8 min-h-[60vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80"
            alt="Luxury Restaurant Atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/80 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="block text-gold text-sm tracking-[3px] uppercase font-medium mb-6">
            Liên Hệ
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif mb-6 leading-tight">
            Kết Nối Với <span className="text-gold italic">Nhà Hàng</span> Chúng
            Tôi
          </h1>
          <p className="text-lg md:text-xl text-cream-muted font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi ở đây để hỗ trợ bạn đặt bàn, lên kế hoạch tiệc riêng tư
            hoặc chuẩn bị trải nghiệm ẩm thực cao cấp cho khách của bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+84123456789"
              className="lux-button w-full sm:w-auto px-10 py-4 text-sm tracking-widest text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Gọi Ngay
            </a>
            <a
              href="#map-section"
              className="w-full sm:w-auto px-10 py-4 text-sm tracking-widest text-cream border border-gold/30 hover:border-gold hover:text-gold transition-all duration-300 uppercase text-center flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Chỉ Đường
            </a>
          </div>
        </div>
      </section>

      {/* 3. Quick Contact Cards Section */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-charcoal-light border editorial-border p-8 text-center flex flex-col items-center justify-between rounded-sm shadow-xl hover:border-gold/50 transition-colors duration-300"
            >
              <div className="flex flex-col items-center flex-grow">
                {card.icon}
                <h3 className="text-xl font-serif text-cream mb-2">
                  {card.title}
                </h3>
                <p className="text-gold font-medium text-sm tracking-wide mb-3">
                  {card.content}
                </p>
                <p className="text-cream-muted font-light text-sm mb-6 flex-grow">
                  {card.description}
                </p>
              </div>
              <a
                href={card.href}
                className="text-xs uppercase tracking-widest text-cream hover:text-gold border-b border-gold/30 hover:border-gold pb-1 transition-colors"
              >
                {card.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Contact Form Section */}
      <section className="py-20 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="bg-charcoal p-8 md:p-12 border editorial-border rounded-sm">
            <div className="mb-10 text-center lg:text-left">
              <span className="text-gold text-xs tracking-[3px] uppercase font-medium mb-3 block">
                Yêu Cầu Hỗ Trợ
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-cream mb-4">
                Gửi Tin Nhắn
              </h2>
              <div className="w-12 h-0.5 bg-gold mx-auto lg:mx-0"></div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cream-muted mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full bg-charcoal-light border border-gold/20 focus:border-gold text-cream px-4 py-3 outline-none transition-colors rounded-sm"
                  placeholder="Tên của bạn"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cream-muted mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-charcoal-light border border-gold/20 focus:border-gold text-cream px-4 py-3 outline-none transition-colors rounded-sm"
                    placeholder="Số điện thoại của bạn"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cream-muted mb-2">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-charcoal-light border border-gold/20 focus:border-gold text-cream px-4 py-3 outline-none transition-colors rounded-sm"
                    placeholder="Email của bạn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cream-muted mb-2">
                    Loại yêu cầu
                  </label>
                  <div className="relative">
                    <select className="w-full bg-charcoal-light border border-gold/20 focus:border-gold text-cream px-4 py-3 outline-none transition-colors rounded-sm appearance-none cursor-pointer">
                      <option>Câu hỏi chung</option>
                      <option>Hỗ trợ đặt bàn</option>
                      <option>Hỗ trợ đặt combo</option>
                      <option>Sinh nhật / Tiệc riêng tư</option>
                      <option>Sự kiện doanh nghiệp</option>
                      <option>Tư vấn phòng VIP</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gold">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-cream-muted mb-2">
                    Phương thức liên hệ
                  </label>
                  <div className="relative">
                    <select className="w-full bg-charcoal-light border border-gold/20 focus:border-gold text-cream px-4 py-3 outline-none transition-colors rounded-sm appearance-none cursor-pointer">
                      <option>Gọi điện thoại</option>
                      <option>Gửi Email</option>
                      <option>Zalo / Ứng dụng nhắn tin</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gold">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-cream-muted mb-2">
                  Lời nhắn
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-charcoal-light border border-gold/20 focus:border-gold text-cream px-4 py-3 outline-none transition-colors rounded-sm resize-none"
                  placeholder="Chúng tôi có thể giúp gì cho bạn?"
                ></textarea>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  className="mt-1 accent-gold cursor-pointer"
                />
                <label
                  htmlFor="agree"
                  className="text-sm font-light text-cream-muted cursor-pointer leading-relaxed"
                >
                  Tôi đồng ý để nhà hàng liên hệ về yêu cầu của tôi.
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="lux-button w-full px-8 py-4 text-sm tracking-widest flex justify-center items-center gap-2"
                >
                  Gửi Tin Nhắn <Send size={16} />
                </button>
                <p className="text-center text-xs text-cream-muted font-light mt-4">
                  Đội ngũ của chúng tôi sẽ phản hồi sớm nhất có thể trong giờ
                  làm việc.
                </p>
              </div>
            </form>
          </div>

          <div className="relative rounded-sm overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-full border editorial-border">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
              alt="Restaurant Table Setup"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 w-full p-10 text-center">
              <span className="text-gold text-xs tracking-[3px] uppercase block mb-4">
                Dịch Vụ Ngoại Hạng
              </span>
              <h3 className="text-3xl font-serif text-cream">
                Chúng Tôi Đang Chờ Yêu Cầu Của Bạn
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Location & Map Section */}
      <section
        id="map-section"
        className="py-20 md:py-32 bg-charcoal-light border-y border-gold/10"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
              Tìm Nhà Hàng Của Chúng Tôi
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-5/12">
              <h3 className="text-2xl font-serif text-gold mb-6 uppercase tracking-wider">
                Nhà Hàng AURA
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-cream mb-1">
                      Địa Chỉ
                    </h4>
                    <p className="text-cream-muted font-light leading-relaxed">
                      123 Đường Luxury, Quận 1<br />
                      Thành phố Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-cream mb-1">
                      Giờ Mở Cửa
                    </h4>
                    <p className="text-cream-muted font-light leading-relaxed">
                      Hàng ngày: 10:00 Sáng – 10:30 Tối
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-cream mb-1">
                      Điện Thoại
                    </h4>
                    <p className="text-cream-muted font-light leading-relaxed">
                      +84 123 456 789
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gold/10">
                <h4 className="text-sm uppercase tracking-widest text-cream mb-2">
                  Thông Tin Gửi Xe
                </h4>
                <p className="text-cream-muted font-light leading-relaxed text-sm mb-8">
                  Dịch vụ đỗ xe hộ có sẵn ở cửa chính. Tầng hầm đỗ xe an toàn
                  nằm ở phía sau tòa nhà nhà hàng.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-6 py-3 border border-gold text-gold text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-charcoal transition-colors rounded-sm text-center">
                    Chỉ Đường
                  </button>
                  <a
                    href="tel:+84123456789"
                    className="px-6 py-3 border border-gold/30 text-cream text-xs uppercase tracking-widest hover:border-gold transition-colors rounded-sm text-center"
                  >
                    Gọi Nhà Hàng
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-7/12">
              <div className="aspect-[4/3] w-full rounded-sm overflow-hidden border editorial-border relative bg-charcoal">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4678887857037!2d106.69741581480088!3d10.775430992321856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f385570472f%3A0x1787491df0ed8d6a!2sIndependence%20Palace!5e0!3m2!1sen!2svn!4v1622615438843!5m2!1sen!2svn"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: "grayscale(1) contrast(1.2) brightness(0.8)",
                  }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aura Restaurant Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Opening Hours Section */}
      <section
        id="hours-section"
        className="py-20 md:py-32 px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-cream mb-4">
            Giờ Mở Cửa
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
          <p className="text-cream-muted font-light">
            Chúng tôi hân hạnh đón tiếp bạn suốt tuần.
          </p>
        </div>

        <div className="bg-charcoal border editorial-border rounded-sm p-8 md:p-12 shadow-2xl">
          <ul className="divide-y divide-gold/10">
            {openingHours.map((schedule, idx) => (
              <li
                key={idx}
                className="py-4 flex justify-between items-center text-sm md:text-base"
              >
                <span
                  className={`font-medium ${idx === new Date().getDay() - 1 || (idx === 6 && new Date().getDay() === 0) ? "text-gold" : "text-cream"}`}
                >
                  {schedule.day}
                </span>
                <span className="text-cream-muted font-light tracking-wide">
                  {schedule.hours}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-8 border-t border-gold/20 text-center">
            <p className="text-gold text-sm italic font-serif">
              * Các sự kiện riêng tư và phòng VIP được phục vụ khi đặt trước.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Support for Special Requests Section */}
      <section className="py-20 md:py-32 px-6 lg:px-8 bg-charcoal-light border-y border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
              Chúng Tôi Có Thể Giúp Gì?
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-charcoal p-8 border editorial-border rounded-sm flex flex-col items-start hover:-translate-y-1 transition-transform duration-300"
              >
                {card.icon}
                <h3 className="text-xl font-serif text-cream mb-3">
                  {card.title}
                </h3>
                <p className="text-cream-muted text-sm font-light mb-8 flex-grow leading-relaxed">
                  {card.description}
                </p>
                <button className="text-gold text-xs tracking-widest uppercase hover:underline underline-offset-4 font-medium flex items-center gap-2">
                  {card.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Social Media Section */}
      <section className="py-20 px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <span className="text-gold text-xs tracking-[3px] uppercase font-medium mb-4 block">
          Kết Nối
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">
          Theo Dõi Chúng Tôi
        </h2>
        <p className="text-cream-muted font-light mb-10 max-w-xl mx-auto">
          Theo dõi các món ăn mới nhất, khoảnh khắc nhà hàng, sự kiện và ưu đãi
          độc quyền của chúng tôi.
        </p>

        <div className="flex justify-center items-center gap-6">
          <a
            href="#"
            className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center text-cream hover:bg-gold hover:text-charcoal hover:border-gold transition-all duration-300"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center text-cream hover:bg-gold hover:text-charcoal hover:border-gold transition-all duration-300"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center text-cream hover:bg-gold hover:text-charcoal hover:border-gold transition-all duration-300"
          >
            <TikTokIcon className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center text-cream hover:bg-gold hover:text-charcoal hover:border-gold transition-all duration-300"
          >
            <Youtube className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-20 md:py-32 px-6 lg:px-8 bg-charcoal-light border-y border-gold/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
              Câu Hỏi Thường Gặp
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-charcoal border editorial-border rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span
                    className={`font-medium ${openFAQ === idx ? "text-gold" : "text-cream"}`}
                  >
                    {item.question}
                  </span>
                  <span className="text-gold shrink-0 ml-4">
                    {openFAQ === idx ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === idx
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-cream-muted font-light leading-relaxed border-t border-gold/5 mt-2 pt-4">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA Section */}
      <section className="py-24 bg-charcoal text-center px-6 border-b border-gold/10 relative overflow-hidden">
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
            Sẵn Sàng Ghé Thăm?
          </h2>
          <p className="text-cream-muted font-light mb-10 text-lg">
            Đặt bàn ngay hôm nay và để đội ngũ của chúng tôi chuẩn bị trải
            nghiệm ẩm thực tinh tế cho dịp của bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/reservation"
              className="lux-button inline-block px-10 py-4 text-sm tracking-widest text-center"
            >
              Đặt Bàn
            </a>
            <a
              href="/menu"
              className="px-10 py-4 border border-gold/30 text-cream text-sm tracking-widest uppercase hover:bg-gold hover:text-charcoal transition-colors duration-300 text-center"
            >
              Xem Thực Đơn
            </a>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
