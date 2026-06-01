import Header from "../components/Header";
import Footer from "../components/Footer";
import { useGalleryPage } from "../Hook/useGalleryPage";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

// --- Mock Data ---

const galleryCategories = [
  "Tất cả",
  "Sảnh chính",
  "Phòng VIP",
  "Món ăn nghệ thuật",
  "Sự kiện & Tiệc",
  "Khu vực gia đình",
  "Khu vực ngoài trời",
];

const featuredSpaces = [
  {
    id: "feat-1",
    name: "Sảnh Dùng Bữa Chính",
    description:
      "Không gian dùng bữa rộng rãi và thanh lịch cho bữa ăn gia đình, nhóm và tiệc tùng.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
  },
  {
    id: "feat-2",
    name: "Phòng VIP Riêng Tư",
    description:
      "Phòng riêng biệt và tinh tế dành cho tiệc doanh nghiệp, kỷ niệm và gặp gỡ thân mật.",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80",
  },
  {
    id: "feat-3",
    name: "Khu Vực Sự Kiện & Tiệc",
    description:
      "Không gian cao cấp linh hoạt cho sinh nhật, sự kiện công ty và tiệc riêng tư lớn.",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
  },
];

const galleryImages = [
  {
    id: 1,
    category: "Sảnh chính",
    title: "Bố Trí Buổi Tối Thanh Lịch",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    category: "Món ăn nghệ thuật",
    title: "Bò Wagyu Đặc Trưng",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    category: "Phòng VIP",
    title: "Phòng Họp Mặt Thân Mật",
    img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    category: "Món ăn nghệ thuật",
    title: "Tráng Miệng Của Bếp Trưởng",
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    category: "Sự kiện & Tiệc",
    title: "Tiệc Sinh Nhật",
    img: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QmlydGhkYXklMjBDZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 6,
    category: "Khu vực gia đình",
    title: "Bàn Gia Đình Ấm Cúng",
    img: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    category: "Khu vực ngoài trời",
    title: "Dùng Bữa Ngoài Trời",
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    category: "Sảnh chính",
    title: "Không Khí Bữa Trưa",
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    category: "Phòng VIP",
    title: "Phòng Tiệc Doanh Nghiệp",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
  },
];

const diningAreas = [
  {
    id: "main-hall",
    name: "Sảnh Chính",
    description:
      "Không gian dùng bữa rộng rãi và thanh lịch với ánh sáng tuyệt đẹp.",
    capacity: "2–60 khách",
    bestFor: "Dùng bữa thông thường, gia đình, nhóm",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
  },
  {
    id: "vip-room",
    name: "Phòng VIP Riêng Tư",
    description:
      "Không gian riêng tư tinh tế với bầu không khí yên tĩnh và dịch vụ cao cấp.",
    capacity: "4–20 khách",
    bestFor: "Tiệc doanh nghiệp, tiệc riêng tư",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80",
  },
  {
    id: "event-area",
    name: "Khu Vực Sự Kiện",
    description:
      "Không gian dành riêng cho các buổi tụ họp và tiệc tùng lớn.",
    capacity: "20–100 khách",
    bestFor: "Sự kiện công ty, sinh nhật, tiệc lớn",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
  },
  {
    id: "family-area",
    name: "Khu Vực Gia Đình",
    description: "Không gian thoải mái hoàn hảo cho gia đình nhiều thế hệ.",
    capacity: "4–12 khách",
    bestFor: "Bữa tối cuối tuần gia đình",
    image:
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&q=80",
  },
  {
    id: "outdoor-area",
    name: "Khu Vực Ngoài Trời",
    description:
      "Dùng bữa ngoài trời với tầm nhìn tuyệt đẹp ra thành phố và gió mát.",
    capacity: "2–30 khách",
    bestFor: "Hẹn hò lãng mạn, cocktail buổi tối",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80",
  },
];

const eventMoments = [
  {
    type: "Tiệc Sinh Nhật",
    desc: "Những lễ kỷ niệm khó quên được thiết kế dành riêng cho bạn.",
    img: "https://images.unsplash.com/photo-1644890587862-e309716adbca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    type: "Tiệc Doanh Nghiệp",
    desc: "Sắp xếp ấn tượng cho thành công của doanh nghiệp.",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
  },
  {
    type: "Tiệc Kỷ Niệm",
    desc: "Bầu không khí lãng mạn cho những cột mốc đặc biệt.",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
  },
];

const GalleryPage = () => {
  const {
    activeTab,
    setActiveTab,
    lightboxOpen,
    currentImageIndex,
    dbFoods,
    filteredImages,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
  } = useGalleryPage(galleryImages);

  return (
    <div className="bg-charcoal min-h-screen font-sans text-cream">
      <Header activePage="Gallery" />

      {/* 2. Gallery Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 lg:px-8 min-h-[60vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80"
            alt="Luxury Restaurant Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/80 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="block text-gold text-sm tracking-[3px] uppercase font-medium mb-6">
            Thư Viện Ảnh Nhà Hàng
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif mb-6 leading-tight">
            Bước Vào Không Gian Ẩm Thực <span className="text-gold italic">Cao Cấp</span> Của Chúng Tôi
          </h1>
          <p className="text-lg md:text-xl text-cream-muted font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Khám phá không gian dùng bữa thanh lịch, phòng riêng, cách trình bày món ăn tinh tế và những khoảnh khắc đáng nhớ cho mọi dịp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                document
                  .getElementById("featured-spaces")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="lux-button w-full sm:w-auto px-8 py-4 text-sm tracking-widest"
            >
              Xem Thư Viện
            </button>
            <a
              href="/reservation"
              className="w-full sm:w-auto px-8 py-4 text-sm tracking-widest text-cream border border-gold/30 hover:border-gold hover:text-gold transition-all duration-300 uppercase text-center"
            >
              Đặt Bàn
            </a>
          </div>
        </div>
      </section>

      {/* 4. Featured Gallery Section */}
      <section
        id="featured-spaces"
        className="py-20 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
            Không Gian Nổi Bật
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSpaces.map((space) => (
            <div
              key={space.id}
              className="relative group overflow-hidden rounded-sm border editorial-border aspect-[4/5] cursor-pointer"
            >
              <img
                src={space.image}
                alt={space.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-serif text-gold mb-3">
                  {space.name}
                </h3>
                <p className="text-sm text-cream/90 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {space.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Masonry Gallery Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto min-h-[50vh]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
            Khám Phá Nhà Hàng Của Chúng Tôi
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto"></div>
        </div>

        <div className="mb-12 flex items-center gap-2 overflow-x-auto no-scrollbar justify-start lg:justify-center">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 ${
                activeTab === cat
                  ? "bg-gold text-charcoal font-medium"
                  : "bg-charcoal border border-gold/20 text-cream-muted hover:border-gold/60 hover:text-cream"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CSS-based Masonry Grid approximation using columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img, index) => (
            <div
              key={img.id}
              className="break-inside-avoid relative group overflow-hidden rounded-sm cursor-pointer border editorial-border"
              onClick={() => openLightbox(index)}
            >
              <img
                src={img.img}
                alt={img.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-gold text-xs uppercase tracking-widest mb-1">
                  {img.category}
                </span>
                <h4 className="text-xl font-serif text-cream">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
        {filteredImages.length === 0 && (
          <p className="text-center text-cream-muted py-20">
            Không tìm thấy hình ảnh nào cho danh mục này.
          </p>
        )}
      </section>

      {/* 6. Dining Area Showcase Section */}
      <section className="py-20 md:py-32 px-6 lg:px-8 bg-charcoal-light border-y border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
              Không Gian Cho Mọi Dịp
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diningAreas.map((area) => (
              <div
                key={area.id}
                className="bg-charcoal border editorial-border rounded-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif text-gold mb-3">
                    {area.name}
                  </h3>
                  <div className="space-y-2 mb-4 text-sm font-light text-cream/80">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-gold/70 mt-0.5 shrink-0" />
                      <span>{area.capacity}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gold/70 mt-0.5 shrink-0" />
                      <span>{area.bestFor}</span>
                    </div>
                  </div>
                  <p className="text-cream-muted text-sm font-light mb-6 flex-grow">
                    {area.description}
                  </p>
                    <a
                      href="/reservation"
                      className="text-gold text-xs uppercase tracking-widest font-medium hover:underline underline-offset-4 text-center block w-full py-3 border border-gold/30 hover:bg-gold hover:text-charcoal transition-all"
                    >
                      Đặt Khu Vực Này
                    </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Food Presentation Gallery */}
      <section className="py-20 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
            Nghệ Thuật Trình Bày Món Ăn Đặc Trưng
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbFoods.map((food, idx) => (
            <div
              key={food._id || idx}
              className="relative group overflow-hidden rounded-sm aspect-square border editorial-border"
            >
              <img
                src={
                  food.image ||
                  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"
                }
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-charcoal to-transparent">
                <h3 className="text-xl font-serif text-cream">{food.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/menu"
            className="lux-button inline-block px-10 py-4 text-sm tracking-widest"
          >
            Xem Toàn Bộ Thực Đơn
          </a>
        </div>
      </section>

      {/* 8. Event Moments Section */}
      <section className="py-20 md:py-32 px-6 lg:px-8 bg-charcoal-light border-y border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-4">
              Sự Kiện & Kỷ Niệm Đáng Nhớ
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {eventMoments.map((evt, idx) => (
              <div
                key={idx}
                className="bg-charcoal rounded-sm overflow-hidden border editorial-border group"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={evt.img}
                    alt={evt.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-serif text-gold mb-2">
                    {evt.type}
                  </h3>
                  <p className="text-cream-muted text-sm font-light mb-6">
                    {evt.desc}
                  </p>
                  <a
                    href="/reservation"
                    className="text-cream text-xs uppercase tracking-widest hover:text-gold transition-colors pb-1 border-b border-gold/30 hover:border-gold inline-block"
                  >
                    Lên Kế Hoạch Sự Kiện
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Contact Support Section */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-charcoal p-8 md:p-16 border editorial-border rounded-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-serif text-cream mb-4">
              Cần Trợ Giúp Chọn Không Gian Phù Hợp?
            </h2>
            <p className="text-cream-muted font-light max-w-xl mx-auto mb-10">
              Đội ngũ của chúng tôi có thể giúp bạn chọn khu vực dùng bữa hoàn hảo cho bữa ăn, tiệc tùng hoặc sự kiện công ty của bạn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="tel:+15550000000"
                className="flex justify-center items-center gap-2 bg-charcoal-light border border-gold/30 px-6 py-4 rounded-sm hover:border-gold transition-colors text-cream text-sm tracking-wider uppercase"
              >
                <Phone className="w-4 h-4 text-gold" />
                Gọi Ngay
              </a>
              <a
                href="mailto:events@aura.com"
                className="flex justify-center items-center gap-2 bg-charcoal-light border border-gold/30 px-6 py-4 rounded-sm hover:border-gold transition-colors text-cream text-sm tracking-wider uppercase"
              >
                <Mail className="w-4 h-4 text-gold" />
                Yêu Cầu Tư Vấn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Reservation CTA Section */}
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
            Bạn Thích Những Gì Đang Xem?
          </h2>
          <p className="text-cream-muted font-light mb-10 text-lg">
            Đặt bàn ngay hôm nay và tận hưởng trải nghiệm ẩm thực tinh tế tại một trong những không gian thanh lịch của chúng tôi.
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

      <Footer />

      {/* 9. Gallery Lightbox Preview (UI Concept) */}
      {lightboxOpen && filteredImages[currentImageIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-sm">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-cream hover:text-gold transition-colors z-[110]"
            aria-label="Close lightbox"
          >
            <X className="w-10 h-10" />
          </button>

          <div className="relative w-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center">
            <button
              onClick={prevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 p-2 text-cream hover:text-gold transition-colors z-[110] bg-black/50 rounded-full md:bg-transparent"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <div className="relative w-full h-full flex flex-col items-center">
              <img
                src={filteredImages[currentImageIndex].img}
                alt={filteredImages[currentImageIndex].title}
                className="max-w-full max-h-[70vh] object-contain rounded-sm border editorial-border shadow-2xl"
              />
              <div className="mt-6 text-center max-w-2xl px-4">
                <span className="text-gold text-xs uppercase tracking-widest mb-2 block">
                  {filteredImages[currentImageIndex].category}
                </span>
                <h3 className="text-2xl font-serif text-cream">
                  {filteredImages[currentImageIndex].title}
                </h3>
              </div>
            </div>

            <button
              onClick={nextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 p-2 text-cream hover:text-gold transition-colors z-[110] bg-black/50 rounded-full md:bg-transparent"
              aria-label="Next image"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
