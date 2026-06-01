import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

type ReviewStatus = "Mới" | "Đã phản hồi" | "Đã ẩn";

interface Review {
  _id: string;
  customer: string;
  phone: string;
  rating: number;
  date: string;
  source: string;
  text: string;
  status: ReviewStatus;
  reply?: string;
  createdAt?: string;
}

interface ReviewForm {
  customer: string;
  phone: string;
  rating: number;
  date: string;
  source: string;
  text: string;
  status: ReviewStatus;
}

const API = "/api/v1/reviews";
const STATUS_FILTERS = ["Tất cả", "Mới", "Đã phản hồi", "Đã ẩn"] as const;

const initialForm: ReviewForm = {
  customer: "",
  phone: "",
  rating: 5,
  date: new Date().toISOString().slice(0, 10),
  source: "Website",
  text: "",
  status: "Mới",
};

export const useReviewsManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] =
    useState<(typeof STATUS_FILTERS)[number]>("Tất cả");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<ReviewForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API, config());
      setReviews(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải dữ liệu đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesStatus =
        activeStatus === "Tất cả" || review.status === activeStatus;
      const searchText = [
        review.customer,
        review.phone,
        review.source,
        review.text,
        review.reply || "",
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !keyword || searchText.includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, reviews, search]);

  const visibleReviews = reviews.filter((review) => review.status !== "Đã ẩn");
  const averageRating =
    visibleReviews.length > 0
      ? visibleReviews.reduce((sum, review) => sum + review.rating, 0) /
        visibleReviews.length
      : 0;
  const pendingCount = reviews.filter((review) => review.status === "Mới").length;
  const hiddenCount = reviews.filter((review) => review.status === "Đã ẩn").length;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: visibleReviews.filter((review) => review.rating === rating).length,
  }));

  const openReplyModal = (review: Review) => {
    setSelectedReview(review);
    setReplyText(review.reply || "");
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        customer: formData.customer.trim(),
        phone: formData.phone.trim(),
        source: formData.source.trim(),
        text: formData.text.trim(),
        rating: Number(formData.rating),
      };
      const { data } = await axios.post(API, payload, config());
      setReviews((current) => [data.data, ...current]);
      setIsCreateOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Tạo đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    setSubmitting(true);
    try {
      const { data } = await axios.patch(
        `${API}/${selectedReview._id}/reply`,
        { reply: replyText.trim() },
        config(),
      );
      setReviews((current) =>
        current.map((review) =>
          review._id === selectedReview._id ? data.data : review,
        ),
      );
      setSelectedReview(null);
      setReplyText("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lưu phản hồi thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHidden = async (review: Review) => {
    const nextStatus: ReviewStatus =
      review.status === "Đã ẩn" ? (review.reply ? "Đã phản hồi" : "Mới") : "Đã ẩn";

    try {
      const { data } = await axios.patch(
        `${API}/${review._id}/status`,
        { status: nextStatus },
        config(),
      );
      setReviews((current) =>
        current.map((item) => (item._id === review._id ? data.data : item)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const handleDelete = async (review: Review) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đánh giá của "${review.customer}" không?`)) return;

    try {
      await axios.delete(`${API}/${review._id}`, config());
      setReviews((current) => current.filter((item) => item._id !== review._id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa đánh giá thất bại");
    }
  };

  return {
    reviews,
    loading,
    error,
    search,
    setSearch,
    activeStatus,
    setActiveStatus,
    selectedReview,
    setSelectedReview,
    replyText,
    setReplyText,
    isCreateOpen,
    setIsCreateOpen,
    formData,
    setFormData,
    submitting,
    filteredReviews,
    visibleReviews,
    averageRating,
    pendingCount,
    hiddenCount,
    ratingCounts,
    openReplyModal,
    openCreateModal,
    handleCreateSubmit,
    handleReplySubmit,
    toggleHidden,
    handleDelete,
  };
};
