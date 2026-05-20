import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHeader } from "../Hook/useHeader";

type HeaderProps = {
  activePage?: "Home" | "Menu" | "Reservation" | "Gallery" | "Contact";
};

const Header = ({ activePage = "Home" }: HeaderProps) => {
  const { isScrolled, mobileMenuOpen, setMobileMenuOpen } = useHeader();

  const notHomePage = activePage !== "Home";

  const navLinks = [
    { id: "Home", label: "Trang chủ", href: notHomePage ? "/" : "#home" },
    { id: "Menu", label: "Thực đơn", href: "/menu" },
    { id: "Reservation", label: "Đặt bàn", href: "/reservation" },
    { id: "Gallery", label: "Thư viện", href: "/gallery" },
    { id: "Contact", label: "Liên hệ", href: "/contact" },
  ];

  const reservationHref = "/reservation";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b editorial-border ${
        isScrolled
          ? "bg-charcoal/95 backdrop-blur-md py-3 md:py-4"
          : "bg-charcoal/95 py-4 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-xl sm:text-2xl tracking-[2px] text-gold font-bold uppercase">
            Aura
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] uppercase tracking-[1.5px] font-medium">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`transition-colors ${
                activePage === link.id
                  ? "text-gold"
                  : "text-cream-muted hover:text-gold"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:block">
            <a href={reservationHref} className="lux-button whitespace-nowrap px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm">
              Đặt Bàn Ngay
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-cream p-1 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-charcoal-light absolute top-full left-0 w-full border-b border-gold/20 shadow-2xl"
          >
            <div className="flex flex-col items-center py-8 gap-6 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-lg font-serif tracking-wide transition-colors ${
                    activePage === link.id
                      ? "text-gold"
                      : "text-cream hover:text-gold"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="w-full max-w-xs md:hidden mt-2 border-t border-gold/10 pt-6 text-center">
                <a
                  href={reservationHref}
                  className="lux-button block w-full px-8 py-3.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đặt Bàn Ngay
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
