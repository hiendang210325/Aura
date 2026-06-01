import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { getStoredUser } from "../services/authClient";

export type UserRole = "user" | "admin";
type RoleFilter = "Tất cả" | UserRole;

export interface ManagedUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const API = "/api/v1/users";

const initialForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

export const ROLE_FILTERS: RoleFilter[] = ["Tất cả", "admin", "user"];

export const useUserManager = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState<RoleFilter>("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const currentUser = getStoredUser();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API);
      setUsers(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = activeRole === "Tất cả" || user.role === activeRole;
      const searchText = [user.name, user.email, user.role].join(" ").toLowerCase();
      const matchesSearch = !keyword || searchText.includes(keyword);

      return matchesRole && matchesSearch;
    });
  }, [activeRole, search, users]);

  const adminCount = users.filter((user) => user.role === "admin").length;
  const userCount = users.filter((user) => user.role === "user").length;

  const openAddModal = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: ManagedUser) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditingId(user._id);
    setIsModalOpen(true);
  };

  const buildPayload = () => {
    const payload: Partial<UserForm> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
    };

    if (!editingId || formData.password.trim()) {
      payload.password = formData.password;
    }

    return payload;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = buildPayload();

      if (editingId) {
        const { data } = await axios.put(`${API}/${editingId}`, payload);
        setUsers((current) =>
          current.map((user) => (user._id === editingId ? data.data : user)),
        );
      } else {
        const { data } = await axios.post(API, payload);
        setUsers((current) => [data.data, ...current]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lưu người dùng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: ManagedUser) => {
    if (currentUser?.id === user.id) {
      alert("Bạn không thể xóa tài khoản đang đăng nhập.");
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user.email}" không?`)) {
      return;
    }

    try {
      await axios.delete(`${API}/${user._id}`);
      setUsers((current) => current.filter((item) => item._id !== user._id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa người dùng thất bại");
    }
  };

  return {
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
    currentUserId: currentUser?.id || "",
    openAddModal,
    openEditModal,
    handleSubmit,
    handleDelete,
  };
};
