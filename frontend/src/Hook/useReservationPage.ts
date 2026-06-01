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
  const [successMsg, setSuccessMsg] = useState("");

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
    setSuccessMsg("");
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.date ||
      !formData.time ||
      !formData.guests
    ) {
      setErrorMsg("Vui lòng điền đầy đủ các trường bắt buộc.");
      setSubmitState("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg("Vui lòng nhập địa chỉ email hợp lệ.");
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
    setSuccessMsg("");

    try {
      const guests =
        formData.guests === "20+" ? 21 : Number(formData.guests);
      const response = await axios.post("/api/v1/reservations/public", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        date: formData.date,
        time: formData.time,
        guests,
        type: typeMap[formData.type] || "Standard",
        area:
          formData.area === "Main Hall" || formData.area === "Any"
            ? "Sảnh chính"
            : formData.area,
        combo: formData.combo === "None" ? "" : formData.combo,
        notes: formData.notes,
      });
      setSuccessMsg(
        response.data?.message ||
          "Đặt bàn thành công! Email xác nhận đã được gửi đến địa chỉ của bạn.",
      );
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
    successMsg,
    handleInputChange,
    scrollToForm,
    resetForm,
    handleSubmit,
  };
};
