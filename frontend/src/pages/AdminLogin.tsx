import { useAdminLogin } from "../Hook/useAdminLogin";

export default function AdminLogin() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  } = useAdminLogin();

  return (
    <div className="min-h-screen bg-charcoal text-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gold mb-2">AURA</h1>
          <p className="text-cream/70">Đăng Nhập Cổng Quản Trị</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium text-cream/80 mb-1"
              htmlFor="email"
            >
              Địa chỉ Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-gold text-cream transition-colors"
              placeholder="admin@gmail.com"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-cream/80 mb-1"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-gold text-cream transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg transition-colors flex items-center justify-center mt-2 disabled:opacity-50"
          >
            {isLoading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
