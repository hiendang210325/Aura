import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface SettingsForm {
  restaurantName: string;
  category: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  weekdayHours: string;
  weekendHours: string;
  maxAdvanceBookingDays: number;
  cancelBeforeHours: number;
  depositPercent: number;
}

const API = "/api/v1/settings";

const initialSettings: SettingsForm = {
  restaurantName: "AURA Luxury Dining",
  category: "Nhà hàng Cao cấp / Quốc tế",
  address: "123 Luxury Avenue, District 1, Ho Chi Minh City",
  description:
    "Trải nghiệm ẩm thực độc quyền kết hợp nghệ thuật ẩm thực hiện đại với sự thanh lịch cổ điển.",
  phone: "+84 28 3822 0000",
  email: "reservations@aura-dining.com",
  weekdayHours: "17:00 - 23:00",
  weekendHours: "11:00 - 23:30",
  maxAdvanceBookingDays: 30,
  cancelBeforeHours: 24,
  depositPercent: 30,
};

export const useSettingsPreview = () => {
  const [settings, setSettings] = useState<SettingsForm>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API, config());
      setSettings({ ...initialSettings, ...data.data });
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải cấu hình nhà hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateField = <K extends keyof SettingsForm>(
    field: K,
    value: SettingsForm[K],
  ) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setSavedMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSavedMessage("");

    try {
      const { data } = await axios.put(API, settings, config());
      setSettings({ ...initialSettings, ...data.data });
      setSavedMessage("Đã lưu cấu hình thành công");
    } catch (err: any) {
      setError(err.response?.data?.message || "Lưu cấu hình thất bại");
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    error,
    savedMessage,
    updateField,
    handleSubmit,
  };
};
