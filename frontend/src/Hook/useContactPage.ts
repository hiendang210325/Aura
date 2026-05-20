import { useState } from "react";
import type { FormEvent } from "react";

export const useContactPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(
      "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất trong giờ làm việc.",
    );
  };

  return {
    openFAQ,
    toggleFAQ,
    handleSubmit,
  };
};
