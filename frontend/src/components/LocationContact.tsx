import { MapPin, Clock, Phone } from 'lucide-react';

const LocationContact = () => {
  return (
    <section id="contact" className="py-24 bg-charcoal border-t editorial-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold text-[12px] tracking-[4px] uppercase mb-4 block">Ghé Thăm</span>
            <h2 className="text-4xl md:text-5xl font-serif text-cream mb-8 leading-tight">Vị Trí & Liên Hệ</h2>
            
            <div className="space-y-8 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
                  <MapPin className="text-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-cream text-lg font-serif mb-2">Địa Chỉ</h4>
                  <p className="text-cream/60 font-light text-sm leading-relaxed">
                    123 Đường Luxury, Quận 1,<br />
                    TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
                  <Clock className="text-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-cream text-lg font-serif mb-2">Giờ Mở Cửa</h4>
                  <p className="text-cream/60 font-light text-sm leading-relaxed">
                    Thứ Hai - Chủ Nhật: 10:00 Sáng - 10:30 Tối<br />
                    (Nhận gọi món cuối lúc 10:00 Tối)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
                  <Phone className="text-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-cream text-lg font-serif mb-2">Thông Tin Liên Hệ</h4>
                  <p className="text-cream/60 font-light text-sm leading-relaxed">
                    +84 123 456 789<br />
                    reservations@auradining.com
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="tel:+84123456789" className="flex-1 lux-button py-3 text-center">
                Gọi Ngay
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=123%20%C4%90%C6%B0%E1%BB%9Dng%20Luxury%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh"
                target="_blank"
                rel="noreferrer"
                className="flex-1 lux-button-outline py-3 text-center"
              >
                Chỉ Đường
              </a>
            </div>
          </div>
          
          <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square w-full rounded-sm overflow-hidden bg-charcoal border editorial-border">
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
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationContact;
