import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

type PromotionStatus = "Đang áp dụng" | "Tạm dừng";

interface Promotion {
  _id: string;
  title: string;
  description: string;
  highlight: string;
  condition: string;
  validUntil: string;
  status: PromotionStatus;
  featured: boolean;
  displayOrder: number;
  createdAt?: string;
}

interface PromotionForm {
  title: string;
  description: string;
  highlight: string;
  condition: string;
  validUntil: string;
  status: PromotionStatus;
  featured: boolean;
  displayOrder: number;
}

const API = "/api/v1/promotions";
const STATUS_FILTERS = ["Tất cả", "Đang áp dụng", "Tạm dừng"] as const;

const initialForm: PromotionForm = {
  title: "",
  description: "",
  highlight: "",
  condition: "",
  validUntil: "",
  status: "Đang áp dụng",
  featured: false,
  displayOrder: 0,
};

export const usePromotionsManager = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] =
    useState<(typeof STATUS_FILTERS)[number]>("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PromotionForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API, config());
      setPromotions(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const filteredPromotions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return promotions.filter((promo) => {
      const matchesStatus =
        activeStatus === "Tất cả" || promo.status === activeStatus;
      const searchText = [
        promo.title,
        promo.description,
        promo.highlight,
        promo.condition,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !keyword || searchText.includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, promotions, search]);

  const openAddModal = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (promotion: Promotion) => {
    setFormData({
      title: promotion.title,
      description: promotion.description,
      highlight: promotion.highlight,
      condition: promotion.condition || "",
      validUntil: promotion.validUntil || "",
      status: promotion.status,
      featured: Boolean(promotion.featured),
      displayOrder: promotion.displayOrder || 0,
    });
    setEditingId(promotion._id);
    setIsModalOpen(true);
  };

  const buildPayload = () => ({
    title: formData.title.trim(),
    description: formData.description.trim(),
    highlight: formData.highlight.trim(),
    condition: formData.condition.trim(),
    validUntil: formData.validUntil,
    status: formData.status,
    featured: formData.featured,
    displayOrder: Number(formData.displayOrder) || 0,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = buildPayload();

      if (editingId) {
        const { data } = await axios.put(`${API}/${editingId}`, payload, config());
        setPromotions((current) =>
          current.map((promotion) =>
            promotion._id === editingId ? data.data : promotion,
          ),
        );
      } else {
        const { data } = await axios.post(API, payload, config());
        setPromotions((current) => [data.data, ...current]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lưu khuyến mãi thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (promotion: Promotion) => {
    const nextStatus: PromotionStatus =
      promotion.status === "Đang áp dụng" ? "Tạm dừng" : "Đang áp dụng";

    try {
      const { data } = await axios.patch(
        `${API}/${promotion._id}/status`,
        { status: nextStatus },
        config(),
      );
      setPromotions((current) =>
        current.map((item) => (item._id === promotion._id ? data.data : item)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const handleDelete = async (promotion: Promotion) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khuyến mãi "${promotion.title}" không?`)) return;

    try {
      await axios.delete(`${API}/${promotion._id}`, config());
      setPromotions((current) => current.filter((item) => item._id !== promotion._id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa khuyến mãi thất bại");
    }
  };

  return {
    promotions,
    loading,
    error,
    search,
    setSearch,
    activeStatus,
    setActiveStatus,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    submitting,
    filteredPromotions,
    openAddModal,
    openEditModal,
    handleSubmit,
    toggleStatus,
    handleDelete,
  };
};
