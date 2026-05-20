import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useSignatureDishes } from '../Hook/useSignatureDishes';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};

const SignatureDishes = () => {
  const { dishes, loading } = useSignatureDishes();

  return (
    <section id="menu" className="py-24 bg-charcoal border-y editorial-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-[12px] tracking-[4px] uppercase mb-4 block">Hương Vị Kinh Điển</span>
          <h2 className="text-4xl md:text-5xl font-serif text-cream">Món Ăn Đặc Trưng</h2>
        </div>
        
        {loading ? (
          <div className="text-center text-gold py-12">Đang tải dữ liệu...</div>
        ) : dishes.length === 0 ? (
          <div className="text-center text-cream/50 py-12">Chưa có món nổi bật nào.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish, idx) => (
              <motion.div 
                key={dish._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-charcoal group rounded-sm overflow-hidden border editorial-border transition-all duration-500 flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-charcoal-light shrink-0">
                  <img 
                    src={dish.image || "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"} 
                    alt={dish.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-xl sm:text-2xl font-serif text-cream">{dish.name}</h3>
                    <span className="font-sans text-gold font-medium whitespace-nowrap">{formatPrice(dish.price)}</span>
                  </div>
                  <p className="text-cream/60 text-sm font-light mb-8 flex-1 line-clamp-3">{dish.description}</p>
                  <a href="/menu" className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-widest text-cream hover:text-gold transition-colors font-medium">
                    Xem Chi Tiết <ChevronRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SignatureDishes;
