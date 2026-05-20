import { motion } from 'motion/react';

const Introduction = () => {
  const features = [
    { title: "Không Gian Thoáng Đãng", desc: "Cách bài trí tinh tế, thoải mái và riêng tư" },
    { title: "Thực Đơn Đặc Trưng", desc: "Các món ăn thượng hạng mang phong cách Michelin" },
    { title: "Combo Nhóm Tinh Tế", desc: "Trải nghiệm chia sẻ hoàn hảo" },
    { title: "Đặt Bàn Trực Tuyến", desc: "Thao tác đặt bàn nhanh chóng và tiện lợi" }
  ];

  return (
    <section className="py-24 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto bg-charcoal">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] w-full"
        >
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" 
            alt="Refined Dining Room" 
            className="w-full h-full object-cover rounded-sm"
          />
          <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square border editorial-border -z-10 rounded-sm hidden md:block"></div>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-cream mb-6 leading-tight">Điểm Đến Ẩm Thực <br /><span className="text-gold italic">Tinh Tế</span></h2>
          <p className="text-cream/70 text-lg mb-12 font-light leading-relaxed">
            Nhà hàng sang trọng với không gian rộng rãi, được thiết kế để mang đến những bữa ăn đáng nhớ, các buổi họp mặt nhóm, tiệc doanh nghiệp, sinh nhật và sự kiện riêng tư. Thưởng thức ẩm thực cao cấp, các combo đặc sắc và đặt bàn trực tuyến tiện lợi.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="border-l border-gold/40 pl-6 py-1">
                <h4 className="text-cream font-serif text-xl mb-2">{feature.title}</h4>
                <p className="text-cream/50 text-sm font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Introduction;
