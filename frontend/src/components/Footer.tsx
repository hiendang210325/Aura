import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal border-t editorial-border pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          <div className="lg:pr-8 lg:col-span-2">
            <span className="font-serif text-[24px] tracking-[2px] text-gold font-bold uppercase mb-6 block">Aura</span>
            <p className="text-cream/50 font-light text-sm leading-relaxed mb-8 max-w-md">
              Điểm đến ẩm thực tinh tế, mang đến trải nghiệm cao cấp hiện đại cho mọi dịp đáng nhớ. Tận hưởng nghệ thuật ẩm thực đỉnh cao.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-cream/40 hover:text-gold transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-cream/40 hover:text-gold transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-cream/40 hover:text-gold transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-cream font-serif text-xl mb-6">Liên Kết Nhanh</h4>
            <ul className="space-y-3 text-cream/50 text-sm font-light">
              <li><a href="#menu" className="hover:text-gold transition-colors">Thực Đơn</a></li>
              <li><a href="#combos" className="hover:text-gold transition-colors">Combo Dùng Bữa</a></li>
              <li><a href="#reservation" className="hover:text-gold transition-colors">Đặt Bàn</a></li>
              <li><a href="#gallery" className="hover:text-gold transition-colors">Thư Viện Ảnh</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Tiệc Riêng Tư</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-serif text-xl mb-6">Liên Hệ</h4>
            <ul className="space-y-4 text-cream/50 text-sm font-light">
              <li>123 Đường Luxury, Quận 1,<br />TP. Hồ Chí Minh</li>
              <li>+84 123 456 789</li>
              <li>reservations@auradining.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-serif text-xl mb-6">Giờ Mở Cửa</h4>
            <ul className="space-y-4 text-cream/50 text-sm font-light">
              <li>Thứ Hai - Chủ Nhật</li>
              <li>10:00 Sáng - 10:30 Tối</li>
              <li>Nhận gọi món cuối lúc 10:00 Tối</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t editorial-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/30 text-[11px] tracking-[1.5px] uppercase">
            &copy; {new Date().getFullYear()} Aura Dining. Đã đăng ký bản quyền.
          </p>
          <div className="flex gap-6 text-cream/30 text-[11px] tracking-[1.5px] uppercase">
            <a href="#" className="hover:text-cream/60 transition-colors">Chính Sách Bảo Mật</a>
            <a href="#" className="hover:text-cream/60 transition-colors">Điều Khoản Dịch Vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
