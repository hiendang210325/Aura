import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: "",
  type: "Đặt bàn tiêu chuẩn",
  area: "Main Hall",
  combo: "None",
  notes: "",
  agreed: false,
};

const typeMap: Record<string, string> = {
  "Đặt bàn tiêu chuẩn": "Standard",
  "Đặt Combo": "Combo",
  "Sinh nhật & Tiệc riêng tư": "Birthday",
  "Sự kiện doanh nghiệp": "Corporate",
};

export const useReservationPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToForm = (typeTitle: string) => {
    setFormData((prev) => ({ ...prev, type: typeTitle }));
    const formSection = document.getElementById("reservation-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const resetForm = () => {
    setSubmitState("idle");
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.date ||
      !formData.time ||
      !formData.guests
    ) {
      setErrorMsg("Vui lòng điền đầy đủ các trường bắt buộc.");
      setSubmitState("error");
      return;
    }
    if (!formData.agreed) {
      setErrorMsg("Vui lòng đồng ý để nhà hàng liên hệ xác nhận.");
      setSubmitState("error");
      return;
    }

    setSubmitState("loading");
    setErrorMsg("");

    try {
      await axios.post("http://localhost:5000/api/v1/reservations/public", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        type: typeMap[formData.type] || "Standard",
        area:
          formData.area === "Main Hall" || formData.area === "Any"
            ? "Sảnh chính"
            : formData.area,
        combo: formData.combo === "None" ? "" : formData.combo,
        notes: formData.notes,
      });
      setSubmitState("success");
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Đặt bàn thất bại. Vui lòng thử lại.",
      );
      setSubmitState("error");
    }
  };

  return {
    formData,
    setFormData,
    submitState,
    setSubmitState,
    errorMsg,
    handleInputChange,
    scrollToForm,
    resetForm,
    handleSubmit,
  };
};
