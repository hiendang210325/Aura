import { Star } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Eleanor Richards",
      text: "Không gian sang trọng, thức ăn tuyệt vời và việc đặt bàn trực tuyến vô cùng tiện lợi.",
      rating: 5
    },
    {
      name: "David Chen",
      text: "Một nhà hàng hoàn hảo cho bữa tiệc của công ty chúng tôi. Thực đơn combo được thiết kế rất tốt và phục vụ không chê vào đâu được.",
      rating: 5
    },
    {
      name: "Sophia Martinez",
      text: "Không khí tuyệt vời cho các buổi họp mặt gia đình và tiệc riêng tư. Rất đáng để trải nghiệm cho những dịp đặc biệt.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-cream mb-4">Đánh Giá Từ Khách Hàng</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-charcoal p-8 rounded-sm border editorial-border relative">
            <div className="text-gold mb-6 absolute top-8 right-8 opacity-20">
              <Star size={48} fill="currentColor" />
            </div>
            <div className="flex gap-1 text-gold mb-6">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="text-cream/80 font-light lg:text-lg mb-8 leading-relaxed italic">"{review.text}"</p>
            <div className="font-sans text-[11px] tracking-[1.5px] text-gold uppercase font-medium">
              — {review.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
