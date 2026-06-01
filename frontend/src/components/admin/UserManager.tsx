import {
  Edit2,
  Filter,
  KeyRound,
  Loader2,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  ROLE_FILTERS,
  useUserManager,
  type ManagedUser,
  type UserRole,
} from "../../Hook/useUserManager";

const getRoleLabel = (role: UserRole) =>
  role === "admin" ? "Quản trị viên" : "Người dùng";

const getRoleBadge = (role: UserRole) =>
  role === "admin"
    ? "bg-gold/10 text-gold border-gold/20"
    : "bg-blue-500/10 text-blue-400 border-blue-500/20";

const formatDate = (date?: string) => {
  if (!date) return "Chưa có";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
};

const getUserInitials = (user: ManagedUser) => {
  const source = user.name || user.email;
  const initials = source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "US";
};

export default function UserManager() {
  const {
    users,
    loading,
    error,
    search,
    setSearch,
    activeRole,
    setActiveRole,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    submitting,
    filteredUsers,
    adminCount,
    userCount,
    currentUserId,
    openAddModal,
    openEditModal,
    handleSubmit,
    handleDelete,
  } = useUserManager();

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-gold">Người dùng</h2>
            <p className="text-sm text-cream/50 mt-1">
              {users.length} tài khoản — {adminCount} quản trị viên / {userCount} người dùng
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto">
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm người dùng..."
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div className="relative sm:w-44">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
              <select
                value={activeRole}
                onChange={(event) => setActiveRole(event.target.value as typeof activeRole)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
              >
                {ROLE_FILTERS.map((role) => (
                  <option key={role} value={role}>
                    {role === "Tất cả" ? "Tất cả quyền" : getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors"
            >
              <Plus size={18} />
              <span>Tạo người dùng</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-400 text-sm border-b border-red-500/20 text-center">
            {error}
          </div>
        )}

        <div className="overflow-x-auto min-h-[420px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gold">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-cream/50 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Tài khoản</th>
                  <th className="px-6 py-4 font-medium">Quyền</th>
                  <th className="px-6 py-4 font-medium">Ngày tạo</th>
                  <th className="px-6 py-4 font-medium">Cập nhật</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-cream/50">
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isCurrentUser = currentUserId === user.id;

                    return (
                      <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 text-gold flex items-center justify-center text-xs font-semibold">
                              {getUserInitials(user)}
                            </div>
                            <div>
                              <div className="font-medium text-cream flex items-center gap-2">
                                {user.name}
                                {isCurrentUser && (
                                  <span className="text-[11px] px-2 py-0.5 rounded border border-white/10 text-cream/50">
                                    Bạn
                                  </span>
                                )}
                              </div>
                              <div className="text-cream/50 text-xs mt-0.5">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getRoleBadge(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-cream/70">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-cream/70">
                          {formatDate(user.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(user)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-cream/70 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            >
                              <Edit2 size={15} />
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              disabled={isCurrentUser}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-cream/70 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 size={15} />
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-gold">
                  {editingId ? "Chỉnh sửa người dùng" : "Tạo người dùng"}
                </h3>
                <p className="text-sm text-cream/50 mt-1">
                  {editingId ? "Để trống mật khẩu nếu không cần đổi." : "Mật khẩu tối thiểu 6 ký tự."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-cream/50 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm text-cream/70 mb-2">Họ tên *</span>
                  <span className="relative block">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/35" size={17} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="Nguyễn Văn A"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="block text-sm text-cream/70 mb-2">Email *</span>
                  <span className="relative block">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/35" size={17} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="user@example.com"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="block text-sm text-cream/70 mb-2">Mật khẩu {editingId ? "" : "*"}</span>
                  <span className="relative block">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/35" size={17} />
                    <input
                      type="password"
                      required={!editingId}
                      minLength={formData.password ? 6 : undefined}
                      value={formData.password}
                      onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-cream focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder={editingId ? "Không đổi mật khẩu" : "Tối thiểu 6 ký tự"}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="block text-sm text-cream/70 mb-2">Quyền</span>
                  <span className="relative block">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/35" size={17} />
                    <select
                      value={formData.role}
                      onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value as UserRole }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                    >
                      <option value="user">Người dùng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </span>
                </label>
              </div>

              <div className="px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm text-cream hover:bg-white/5 transition-colors border border-white/10"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gold hover:bg-yellow-600 text-charcoal font-bold rounded-lg text-sm transition-colors disabled:opacity-60"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? "Lưu thay đổi" : "Tạo người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
