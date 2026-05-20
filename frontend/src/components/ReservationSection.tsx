import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";

const serviceCues = [
  {
    icon: Users,
    title: "Phòng riêng",
    description: "Không gian yên tĩnh cho nhóm thân mật.",
  },
  {
    icon: Utensils,
    title: "Combo gia đình",
    description: "Gợi ý thực đơn theo số khách và dịp dùng bữa.",
  },
  {
    icon: Building2,
    title: "Sự kiện công ty",
    description: "Sắp xếp khu vực và nhịp phục vụ riêng.",
  },
  {
    icon: CheckCircle2,
    title: "Xác nhận nhanh",
    description: "Đội ngũ liên hệ lại sau khi gửi yêu cầu.",
  },
];

const ReservationSection = () => {
  return (
    <section
      id="reservation"
      className="relative overflow-hidden bg-brown-deep text-cream border-y editorial-border"
    >
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop"
          alt="Private dining room"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brown-deep via-brown-deep/90 to-charcoal/70" />
      </div>

      <div className="relative grid min-h-[720px] grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative min-h-[360px] overflow-hidden lg:min-h-[720px]"
        >
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
            alt="Elegant restaurant event setup"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 border-t border-cream/20 pt-5 sm:inset-x-10 sm:bottom-10">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[2.5px] text-cream/75">
              <Sparkles className="h-4 w-4 text-gold" />
              Aura Private Dining
            </div>
          </div>
        </motion.div>

        <div className="flex items-center px-6 py-16 sm:px-10 md:px-16 lg:px-20">
          <div className="mx-auto w-full max-w-2xl">
            <span className="mb-5 block text-[12px] uppercase tracking-[4px] text-gold">
              Đảm Bảo Chỗ Ngồi Của Bạn
            </span>

            <h2 className="max-w-xl text-[42px] font-serif leading-[1.04] text-cream sm:text-5xl md:text-6xl">
              Giữ Chỗ Cho Một Buổi Tối Đáng Nhớ
            </h2>

            <p className="mt-6 max-w-lg text-[15px] font-light leading-7 text-cream/70 md:text-base">
              Chọn thời gian phù hợp, gửi yêu cầu về không gian, thực đơn hoặc
              dịp đặc biệt; đội ngũ Aura sẽ chuẩn bị trải nghiệm dùng bữa trọn vẹn.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {serviceCues.map((cue) => {
                const Icon = cue.icon;

                return (
                  <div
                    key={cue.title}
                    className="group border-t border-gold/20 pt-5"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="text-sm font-medium uppercase tracking-[1.8px] text-cream/90">
                        {cue.title}
                      </h3>
                    </div>
                    <p className="text-sm font-light leading-6 text-cream/70">
                      {cue.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/reservation"
                className="lux-button inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm uppercase tracking-[2px]"
              >
                Chọn Thời Gian
                <CalendarClock className="h-4 w-4" />
              </Link>
              <motion.a
                href="#gallery"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center gap-3 border border-gold/30 px-8 py-3.5 text-sm uppercase tracking-[2px] text-cream transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                Xem Không Gian
                <ChevronRight className="h-4 w-4" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
