import { usePromoBanner } from "../Hook/usePromoBanner";

const formatDate = (date?: string) => {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("vi-VN").format(parsed);
};

const PromoBanner = () => {
  const { promotions, loading } = usePromoBanner();

  if (loading || promotions.length === 0) return null;

  return (
    <section className="bg-charcoal border-y editorial-border relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
        <span className="text-gold text-[12px] tracking-[4px] uppercase mb-4 block">
          Ưu Đãi Đang Áp Dụng
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-cream mb-8">
          Đặc Quyền Dành Cho Khách Đặt Bàn Trực Tuyến
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 mb-10 text-cream/80 font-light">
          {promotions.map((promotion, index) => (
            <div
              key={promotion._id}
              className={`flex flex-col items-center px-6 ${
                index > 0 ? "md:border-l md:border-white/10" : ""
              }`}
            >
              <span className="text-gold text-2xl mb-2 font-serif italic">{promotion.highlight}</span>
              <span className="text-sm text-cream">{promotion.title}</span>
              <span className="text-xs text-cream/50 mt-2 leading-relaxed">{promotion.description}</span>
              {promotion.condition && (
                <span className="text-[11px] text-cream/40 mt-2 leading-relaxed">{promotion.condition}</span>
              )}
              {promotion.validUntil && (
                <span className="text-[11px] text-gold/70 mt-3">Đến {formatDate(promotion.validUntil)}</span>
              )}
            </div>
          ))}
        </div>

        <a href="#reservation" className="lux-button px-8 py-3.5 mt-4 inline-block">
          Đặt Bàn Ngay
        </a>
      </div>
    </section>
  );
};

export default PromoBanner;
