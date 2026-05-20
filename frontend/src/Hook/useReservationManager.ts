import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface Reservation {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  type: string;
  area: string;
  table: string;
  combo?: string;
  notes?: string;
  source?: string;
  status: string;
  createdAt?: string;
}

interface Table {
  _id: string;
  tableId: string;
  area: string;
  capacity: number;
  status: string;
}

const initialFormData = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: 2,
  type: "Standard",
  area: "Sảnh chính",
  table: "",
  status: "Pending",
};

export const useReservationManager = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tablesList, setTablesList] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [viewingRes, setViewingRes] = useState<Reservation | null>(null);

  const token = localStorage.getItem("adminToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchTables = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/tables", config);
      setTablesList(data.data);
    } catch (err) {
      console.error("Failed to fetch tables", err);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/reservations",
        config,
      );
      setReservations(data.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách đặt bàn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchTables();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đặt bàn này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/reservations/${id}`, config);
        setReservations((current) => current.filter((r) => r._id !== id));
      } catch (err: any) {
        alert(err.response?.data?.message || "Xóa thất bại");
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/v1/reservations/${id}/status`,
        { status },
        config,
      );
      setReservations((current) =>
        current.map((r) => (r._id === id ? data.data : r)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const openAddModal = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (reservation: Reservation) => {
    setFormData({
      name: reservation.name,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      type: reservation.type,
      area: reservation.area || "Sảnh chính",
      table: reservation.table,
      status: reservation.status,
    });
    setEditingId(reservation._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { data } = await axios.put(
          `http://localhost:5000/api/v1/reservations/${editingId}`,
          formData,
          config,
        );
        setReservations((current) =>
          current.map((r) => (r._id === editingId ? data.data : r)),
        );
      } else {
        const { data } = await axios.post(
          "http://localhost:5000/api/v1/reservations",
          formData,
          config,
        );
        setReservations((current) => [data.data, ...current]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lưu đặt bàn thất bại");
    }
  };

  return {
    reservations,
    tablesList,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    viewingRes,
    setViewingRes,
    handleDelete,
    handleStatusUpdate,
    openAddModal,
    openEditModal,
    handleSubmit,
  };
};
