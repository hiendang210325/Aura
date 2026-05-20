import { motion } from "motion/react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop"
          alt="Luxury Restaurant Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/70"></div>
      </div>

      <div className="relative z-10 text-center md:text-left px-4 max-w-7xl mx-auto flex flex-col items-center md:items-start w-full">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold uppercase tracking-[4px] text-[12px] font-medium mb-6 block"
        >
          Trải Nghiệm Ẩm Thực Cao Cấp
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-[64px] font-serif text-cream mb-8 leading-[1.1] font-normal max-w-2xl"
        >
          Ẩm Thực Cao Cấp Hiện Đại Cho Mọi Dịp Đặc Biệt
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-cream/80 text-[16px] leading-[1.6] mb-12 max-w-xl"
        >
          Khám phá các món ăn đặc trưng, combo dùng bữa tinh tế và đặt bàn tại 
          không gian sang trọng cho các buổi tụ họp gia đình, tiệc riêng tư hay sự kiện doanh nghiệp.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start"
        >
          <a href="#reservation" className="lux-button px-8 py-3.5">
            Đặt Bàn Ngay
          </a>
          <Link to="/menu" className="lux-button-outline px-8 py-3.5">
            Khám Phá Thực Đơn
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
