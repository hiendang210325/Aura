import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

type ComboStatus = "Đang hoạt động" | "Ngừng hoạt động";

interface Combo {
  _id: string;
  name: string;
  description: string;
  guests: string;
  dishes: string[];
  price: number;
  image: string;
  status: ComboStatus;
  featured: boolean;
  createdAt?: string;
}

interface ComboForm {
  name: string;
  description: string;
  guests: string;
  dishesText: string;
  price: number;
  image: string;
  status: ComboStatus;
  featured: boolean;
}

const API = "/api/v1/combos";
const ITEMS_PER_PAGE = 6;
const STATUS_FILTERS = ["Tất cả", "Đang hoạt động", "Ngừng hoạt động"] as const;

const initialForm: ComboForm = {
  name: "",
  description: "",
  guests: "4-6",
  dishesText: "",
  price: 0,
  image: "",
  status: "Đang hoạt động",
  featured: false,
};

const dishesFromText = (value: string) =>
  value
    .split(/\r?\n/)
    .map((dish) => dish.trim())
    .filter(Boolean);

const textFromDishes = (dishes: string[] = []) => dishes.join("\n");

export const useComboManager = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] =
    useState<(typeof STATUS_FILTERS)[number]>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ComboForm>(initialForm);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [viewingCombo, setViewingCombo] = useState<Combo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  const fetchCombos = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API, config());
      setCombos(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách combo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const filteredCombos = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return combos.filter((combo) => {
      const matchStatus =
        activeStatus === "Tất cả" || combo.status === activeStatus;
      const searchText = [
        combo.name,
        combo.description,
        combo.guests,
        ...(combo.dishes || []),
      ]
        .join(" ")
        .toLowerCase();
      const matchSearch = !keyword || searchText.includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [activeStatus, combos, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCombos.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedCombos = filteredCombos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: (typeof STATUS_FILTERS)[number]) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh phải nhỏ hơn 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData((current) => ({ ...current, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setFormData(initialForm);
    setImagePreview("");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (combo: Combo) => {
    setFormData({
      name: combo.name,
      description: combo.description || "",
      guests: combo.guests,
      dishesText: textFromDishes(combo.dishes),
      price: combo.price,
      image: combo.image || "",
      status: combo.status,
      featured: Boolean(combo.featured),
    });
    setImagePreview(combo.image || "");
    setEditingId(combo._id);
    setIsModalOpen(true);
  };

  const buildPayload = () => ({
    name: formData.name.trim(),
    description: formData.description.trim(),
    guests: formData.guests.trim(),
    dishes: dishesFromText(formData.dishesText),
    price: Number(formData.price) || 0,
    image: formData.image,
    status: formData.status,
    featured: formData.featured,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = buildPayload();
    if (payload.dishes.length === 0) {
      alert("Vui lòng nhập ít nhất 1 món trong combo");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const { data } = await axios.put(`${API}/${editingId}`, payload, config());
        setCombos((current) =>
          current.map((combo) => (combo._id === editingId ? data.data : combo)),
        );
      } else {
        const { data } = await axios.post(API, payload, config());
        setCombos((current) => [data.data, ...current]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lưu combo thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (combo: Combo) => {
    const nextStatus: ComboStatus =
      combo.status === "Đang hoạt động" ? "Ngừng hoạt động" : "Đang hoạt động";

    try {
      const { data } = await axios.patch(
        `${API}/${combo._id}/status`,
        { status: nextStatus },
        config(),
      );
      setCombos((current) =>
        current.map((item) => (item._id === combo._id ? data.data : item)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const handleDelete = async (combo: Combo) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa combo "${combo.name}" không?`)) return;

    try {
      await axios.delete(`${API}/${combo._id}`, config());
      setCombos((current) => current.filter((item) => item._id !== combo._id));
      if (viewingCombo?._id === combo._id) setViewingCombo(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa combo thất bại");
    }
  };

  return {
    combos,
    loading,
    error,
    search,
    activeStatus,
    currentPage,
    setCurrentPage,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    imagePreview,
    submitting,
    viewingCombo,
    setViewingCombo,
    fileInputRef,
    filteredCombos,
    totalPages,
    paginatedCombos,
    handleSearch,
    handleStatusFilter,
    handleImageChange,
    openAddModal,
    openEditModal,
    handleSubmit,
    toggleStatus,
    handleDelete,
  };
};
