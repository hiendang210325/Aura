import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  status: "Còn hàng" | "Hết hàng" | "Tạm ngưng";
  featured: boolean;
}

const API = "http://localhost:5000/api/v1/menu";
const ITEMS_PER_PAGE = 9;

const initialForm = {
  name: "",
  category: "Khai vị",
  price: 0,
  description: "",
  image: "",
  status: "Còn hàng" as MenuItem["status"],
  featured: false,
};

export const useMenuManager = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API, config);
      setItems(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thực đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
      setFormData((f) => ({ ...f, image: base64 }));
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

  const openEditModal = (item: MenuItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      status: item.status,
      featured: item.featured,
    });
    setImagePreview(item.image);
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const { data } = await axios.put(`${API}/${editingId}`, formData, config);
        setItems((current) =>
          current.map((item) => (item._id === editingId ? data.data : item)),
        );
      } else {
        const { data } = await axios.post(API, formData, config);
        setItems((current) => [data.data, ...current]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lưu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (item: MenuItem) => {
    const next = item.status === "Còn hàng" ? "Hết hàng" : "Còn hàng";
    try {
      const { data } = await axios.patch(
        `${API}/${item._id}/status`,
        { status: next },
        config,
      );
      setItems((current) =>
        current.map((currentItem) =>
          currentItem._id === item._id ? data.data : currentItem,
        ),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món này?")) return;
    try {
      await axios.delete(`${API}/${id}`, config);
      setItems((current) => current.filter((item) => item._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa thất bại");
    }
  };

  const filtered = items.filter((item) => {
    const matchCat =
      activeCategory === "Tất cả" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return {
    items,
    loading,
    error,
    search,
    activeCategory,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    imagePreview,
    submitting,
    fileInputRef,
    currentPage,
    setCurrentPage,
    filtered,
    totalPages,
    paginated,
    handleImageChange,
    openAddModal,
    openEditModal,
    handleSubmit,
    toggleStatus,
    handleDelete,
    handleSearch,
    handleCategory,
  };
};
