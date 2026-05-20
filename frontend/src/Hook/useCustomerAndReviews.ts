import { useEffect, useMemo, useState } from "react";
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
  status: string;
  createdAt?: string;
}

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  bookings: number;
  totalGuests: number;
  lastVisit: string;
  lastVisitValue: number;
  type: string;
  history: Reservation[];
}

const API = "http://localhost:5000/api/v1/reservations";

const normalizePhone = (phone: string) => phone.replace(/\s+/g, "").toLowerCase();

const getReservationTimeValue = (reservation: Reservation) => {
  const dateTime = reservation.date
    ? new Date(`${reservation.date}T${reservation.time || "00:00"}`).getTime()
    : Number.NaN;

  if (!Number.isNaN(dateTime)) return dateTime;
  if (reservation.createdAt) {
    const createdAt = new Date(reservation.createdAt).getTime();
    if (!Number.isNaN(createdAt)) return createdAt;
  }
  return 0;
};

const formatDate = (date: string) => {
  if (!date) return "Chưa có";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("vi-VN").format(parsed);
};

const formatReservationDateTime = (reservation: Reservation) => {
  const date = formatDate(reservation.date);
  return reservation.time ? `${date} • ${reservation.time}` : date;
};

const getCustomerType = (history: Reservation[]) => {
  const hasGroupBooking = history.some(
    (reservation) =>
      reservation.type === "Corporate" || Number(reservation.guests) >= 8,
  );

  if (hasGroupBooking) return "Khách đoàn";
  if (history.length >= 5) return "Khách VIP";
  if (history.length >= 2) return "Khách quay lại";
  return "Khách mới";
};

const buildCustomerProfiles = (reservations: Reservation[]) => {
  const grouped = new Map<string, Reservation[]>();

  reservations.forEach((reservation) => {
    const key = normalizePhone(reservation.phone || reservation._id);
    const current = grouped.get(key) || [];
    grouped.set(key, [...current, reservation]);
  });

  return Array.from(grouped.entries())
    .map(([key, history], index): CustomerProfile => {
      const sortedHistory = [...history].sort(
        (a, b) => getReservationTimeValue(b) - getReservationTimeValue(a),
      );
      const latest = sortedHistory[0];

      return {
        id: `CUS-${String(index + 1).padStart(3, "0")}`,
        name: latest.name,
        phone: latest.phone,
        email: latest.email || "Chưa có email",
        bookings: sortedHistory.length,
        totalGuests: sortedHistory.reduce(
          (sum, reservation) => sum + Number(reservation.guests || 0),
          0,
        ),
        lastVisit: formatReservationDateTime(latest),
        lastVisitValue: getReservationTimeValue(latest),
        type: getCustomerType(sortedHistory),
        history: sortedHistory,
      };
    })
    .sort((a, b) => b.lastVisitValue - a.lastVisitValue);
};

export const useCustomerAndReviews = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("Tất cả");
  const [viewingCustomer, setViewingCustomer] = useState<CustomerProfile | null>(null);

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API, config());
      setReservations(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải dữ liệu khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const customers = useMemo(
    () => buildCustomerProfiles(reservations),
    [reservations],
  );

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesType = activeType === "Tất cả" || customer.type === activeType;
      const searchText = [customer.name, customer.phone, customer.email, customer.type]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !keyword || searchText.includes(keyword);

      return matchesType && matchesSearch;
    });
  }, [activeType, customers, search]);

  return {
    reservations,
    loading,
    error,
    search,
    setSearch,
    activeType,
    setActiveType,
    viewingCustomer,
    setViewingCustomer,
    customers,
    filteredCustomers,
  };
};
