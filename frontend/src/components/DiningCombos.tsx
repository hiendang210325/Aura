import { motion } from 'motion/react';
import { useDiningCombos } from '../Hook/useDiningCombos';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};

const DiningCombos = () => {
  const { combos, loading } = useDiningCombos();

  return (
    <section id="combos" className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-cream mb-4">Combo Dùng Bữa Tinh Tế</h2>
        <p className="text-cream/60 font-light text-lg">Thực đơn thiết kế hoàn hảo cho gia đình, bạn bè và các dịp tụ họp đặc biệt.</p>
      </div>

      {loading ? (
        <div className="text-center text-gold py-12">Đang tải dữ liệu...</div>
      ) : combos.length === 0 ? (
        <div className="text-center text-cream/50 py-12">Chưa có combo nổi bật nào.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {combos.map((combo, idx) => {
            // Hiệu ứng thiết kế: Combo ở giữa (idx === 1) sẽ có style nổi bật (Most Popular)
            const isPopular = idx === 1 && combos.length >= 2;

            return (
              <motion.div 
                key={combo._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative flex flex-col overflow-hidden border rounded-sm transition-transform duration-500 hover:-translate-y-2 h-full ${
                  isPopular 
                    ? 'bg-charcoal border-[#C5A059] shadow-[0_0_40px_rgba(197,160,89,0.15)] z-10 lg:scale-105' 
                    : 'bg-charcoal-muted/30 editorial-border'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-4 right-4 z-20 bg-gold text-charcoal px-3 py-1.5 text-[10px] uppercase tracking-[1.5px] font-bold rounded-sm shadow-lg">
                    Được Yêu Thích Nhất
                  </div>
                )}

                {/* ─ Image ─ */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40 shrink-0">
                  <img 
                    src={combo.image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop"} 
                    alt={combo.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                </div>
                
                {/* ─ Content ─ */}
                <div className="flex flex-col flex-1 p-6 md:p-8">
                  <div className="text-center border-b editorial-border pb-6 mb-6">
                    <span className="text-gold uppercase tracking-[1.5px] text-[11px] font-semibold mb-3 block">{combo.guests}</span>
                    <h3 className="text-2xl font-serif text-cream mb-4">{combo.name}</h3>
                    <div className="text-3xl font-light text-cream font-sans">{formatPrice(combo.price)}</div>
                  </div>
                  
                  <ul className="space-y-3 mb-8 text-center text-cream/70 font-light text-sm flex-1">
                    {combo.dishes.map((dish, i) => (
                      <li key={i}>{dish}</li>
                    ))}
                  </ul>
                  
                  <div className="text-center mt-auto">
                    <a 
                      href="/menu#reservation" 
                      className={`inline-block px-8 py-3 w-full ${
                        isPopular ? 'lux-button' : 'lux-button-outline'
                      }`}
                    >
                      Đặt Combo Này
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DiningCombos;
