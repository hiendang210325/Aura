import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { login, register } from "../services/authClient";
import { setCredentials } from "../store/slices/authSlice";
import { useAppDispatch } from "../Hook/useStore";

type AuthMode = "login" | "register";

type AuthPageProps = {
  mode: AuthMode;
};

const getErrorMessage = (error: any) =>
  error.response?.data?.message || "Không thể xác thực. Vui lòng thử lại.";

export default function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);

    try {
      const session = isRegister
        ? await register(name.trim(), email.trim(), password)
        : await login(email.trim(), password);

      dispatch(setCredentials(session));
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-charcoal text-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-[0.9fr_1fr] overflow-hidden rounded-lg border border-white/10 bg-[#121212] shadow-2xl">
        <aside className="hidden md:flex flex-col justify-between border-r border-white/10 bg-[#0d0d0d] p-10">
          <Link
            to="/"
            className="font-serif text-3xl font-bold tracking-[3px] text-gold uppercase"
          >
            AURA
          </Link>

          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[3px] text-gold/80">
              Private dining
            </p>
            <h1 className="max-w-sm text-5xl font-serif leading-tight text-cream">
              {isRegister ? "Tạo tài khoản AURA" : "Đăng nhập AURA"}
            </h1>
            <p className="max-w-sm text-sm leading-6 text-cream/60">
              {isRegister
                ? "Lưu thông tin liên hệ và theo dõi các lần đặt bàn của bạn."
                : "Tiếp tục với tài khoản của bạn để sử dụng các tính năng riêng."}
            </p>
          </div>

          <Link
            to="/"
            className="text-sm text-cream/60 transition-colors hover:text-gold"
          >
            Quay về trang chủ
          </Link>
        </aside>

        <section className="p-6 sm:p-8 md:p-10">
          <div className="mb-8 flex items-start justify-between gap-4 md:hidden">
            <Link
              to="/"
              className="font-serif text-2xl font-bold tracking-[2px] text-gold uppercase"
            >
              AURA
            </Link>
            <Link
              to="/"
              className="text-sm text-cream/60 transition-colors hover:text-gold"
            >
              Trang chủ
            </Link>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-xs uppercase tracking-[2px] text-gold">
              {isRegister ? "Đăng ký" : "Đăng nhập"}
            </p>
            <h2 className="text-3xl font-serif font-semibold text-cream">
              {isRegister ? "Bắt đầu với AURA" : "Chào mừng trở lại"}
            </h2>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-cream/75">
                  Họ tên
                </span>
                <span className="relative block">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/35"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 pl-11 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-cream/75">
                Email
              </span>
              <span className="relative block">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/35"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 pl-11 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                  placeholder="you@example.com"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-cream/75">
                  Mật khẩu
              </span>
              <span className="relative block">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/35"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 pl-11 pr-12 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                  placeholder="Tối thiểu 6 ký tự"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-cream/45 transition-colors hover:text-gold focus:outline-none focus:text-gold"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-cream/75">
                  Xác nhận mật khẩu
                </span>
                <span className="relative block">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/35"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 pl-11 pr-12 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                    placeholder="Nhập lại mật khẩu"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-cream/45 transition-colors hover:text-gold focus:outline-none focus:text-gold"
                    aria-label={
                      showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"
                    }
                    title={
                      showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"
                    }
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="lux-button flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Đang xử lý..."
                : isRegister
                  ? "Tạo tài khoản"
                  : "Đăng nhập"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cream/60">
            {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
            <Link
              to={isRegister ? "/login" : "/register"}
              className="font-medium text-gold transition-colors hover:text-gold-hover"
            >
              {isRegister ? "Đăng nhập" : "Đăng ký"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
