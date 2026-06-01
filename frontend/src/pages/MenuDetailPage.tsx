import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  status: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};

export default function MenuDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenuItem = async () => {
      if (!id) {
        setError("Không tìm thấy mã món ăn.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`/api/v1/menu/${id}`);
        setItem(response.data.data || null);
      } catch (err) {
        console.error("Error fetching menu item", err);
        setError("Không tìm thấy món ăn hoặc dữ liệu đang tạm thời gián đoạn.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  return (
    <div className="min-h-screen bg-charcoal text-cream font-sans overflow-x-hidden">
      <Header activePage="Menu" />
      <main>
        <section className="relative overflow-hidden border-b border-gold/10 pt-28 md:pt-36">
          <div className="absolute inset-0">
            <img
              src={item?.image || fallbackImage}
              alt={item?.name || "Chi tiết món ăn"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/82" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.96)_0%,rgba(17,17,17,0.78)_48%,rgba(17,17,17,0.42)_100%)]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <Link
              to="/menu#full-menu"
              className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.5px] text-cream/60 transition-colors hover:text-gold"
            >
              <ArrowLeft size={16} />
              Quay lại thực đơn
            </Link>

            {loading ? (
              <div className="py-24 text-center text-gold">Đang tải chi tiết món ăn...</div>
            ) : error || !item ? (
              <div className="max-w-2xl py-20">
                <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[3px] text-gold">
                  Chi Tiết Món Ăn
                </span>
                <h1 className="text-[36px] leading-tight text-cream md:text-5xl">
                  Không tìm thấy món ăn
                </h1>
                <p className="mt-5 text-sm leading-7 text-cream/60 md:text-base">
                  {error || "Món ăn này không tồn tại trong thực đơn hiện tại."}
                </p>
              </div>
            ) : (
              <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div className="overflow-hidden rounded-[8px] border border-gold/18 bg-charcoal-light shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                </div>

                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-gold/25 bg-charcoal/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[1.4px] text-gold">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[1.4px] ${
                        item.status === "Còn hàng"
                          ? "border-cream/15 text-cream/60"
                          : "border-gold/25 text-gold"
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.featured && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-[1.4px] text-charcoal">
                        <Sparkles size={13} />
                        Nổi bật
                      </span>
                    )}
                  </div>

                  <h1 className="max-w-3xl text-[38px] leading-[1.08] text-cream sm:text-[48px] md:text-[64px]">
                    {item.name}
                  </h1>

                  <p className="mt-6 max-w-2xl text-sm leading-7 text-cream/68 md:text-base md:leading-8">
                    {item.description || "Món ăn đang được cập nhật mô tả chi tiết."}
                  </p>

                  <div className="mt-8 flex flex-col gap-5 border-y border-gold/12 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-[1.5px] text-cream/40">
                        Giá món ăn
                      </span>
                      <strong className="mt-1 block text-3xl font-semibold text-gold">
                        {formatPrice(item.price)}
                      </strong>
                    </div>
                    <Link
                      to="/reservation"
                      className="lux-button w-full px-8 py-3.5 text-center sm:w-auto"
                    >
                      Đặt bàn thưởng thức
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {item && !loading && !error && (
          <section className="bg-[#151210] py-14 md:py-20">
            <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
              <div className="rounded-[8px] border border-gold/16 bg-charcoal p-5">
                <Utensils className="mb-4 text-gold" size={22} />
                <span className="block text-[10px] font-semibold uppercase tracking-[1.5px] text-cream/40">
                  Danh mục
                </span>
                <strong className="mt-2 block text-lg text-cream">{item.category}</strong>
              </div>
              <div className="rounded-[8px] border border-gold/16 bg-charcoal p-5">
                <CheckCircle className="mb-4 text-gold" size={22} />
                <span className="block text-[10px] font-semibold uppercase tracking-[1.5px] text-cream/40">
                  Trạng thái
                </span>
                <strong className="mt-2 block text-lg text-cream">{item.status}</strong>
              </div>
              <div className="rounded-[8px] border border-gold/16 bg-charcoal p-5">
                {item.updatedAt ? (
                  <CalendarDays className="mb-4 text-gold" size={22} />
                ) : (
                  <Clock className="mb-4 text-gold" size={22} />
                )}
                <span className="block text-[10px] font-semibold uppercase tracking-[1.5px] text-cream/40">
                  Cập nhật
                </span>
                <strong className="mt-2 block text-lg text-cream">
                  {item.updatedAt
                    ? new Intl.DateTimeFormat("vi-VN").format(new Date(item.updatedAt))
                    : "Đang cập nhật"}
                </strong>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
