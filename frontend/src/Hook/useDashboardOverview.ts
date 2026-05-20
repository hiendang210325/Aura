import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CalendarCheck, Clock, DollarSign, Users } from "lucide-react";

interface Reservation {
  _id: string;
  name: string;
  date: string;
  guests: number;
  type: string;
  status: string;
  createdAt: string;
}

interface Table {
  _id: string;
  status: string;
}

export const useDashboardOverview = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [resResponse, tableResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/v1/reservations", config),
          axios.get("http://localhost:5000/api/v1/tables", config),
        ]);

        setReservations(resResponse.data.data || []);
        setTables(tableResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { stats, revenueData, reservationData, typeData } = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let todayBookings = 0;
    let pendingRequests = 0;
    const availableTables = tables.filter((t) => t.status === "Available").length;
    let monthlyRevenue = 0;

    const revenueMap: Record<number, number> = {};
    const bookingDayMap: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      0: 0,
    };
    const typeMap: Record<string, number> = {
      Standard: 0,
      Combo: 0,
      Birthday: 0,
      Corporate: 0,
    };

    reservations.forEach((res) => {
      if (res.date === todayStr) todayBookings++;
      if (res.status === "Pending") pendingRequests++;

      const resDate = new Date(res.date);
      if (Number.isNaN(resDate.getTime())) return;

      const resMonth = resDate.getMonth();
      const resYear = resDate.getFullYear();

      if (res.status !== "Cancelled") {
        const estimatedRevenue = res.guests * 500000;

        if (resMonth === currentMonth && resYear === currentYear) {
          monthlyRevenue += estimatedRevenue;
        }

        if (resYear === currentYear) {
          revenueMap[resMonth] = (revenueMap[resMonth] || 0) + estimatedRevenue;
        }

        const dayOfWeek = resDate.getDay();
        bookingDayMap[dayOfWeek] = (bookingDayMap[dayOfWeek] || 0) + 1;

        const type = res.type || "Standard";
        typeMap[type] = (typeMap[type] || 0) + 1;
      }
    });

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat("vi-VN").format(val) + " đ";

    const monthNames = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    const computedRevenueData = monthNames
      .map((name, index) => ({
        name,
        revenue: revenueMap[index] || 0,
      }))
      .filter((_, i) => i <= currentMonth)
      .slice(-6);

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const computedReservationData = [1, 2, 3, 4, 5, 6, 0].map((dayIdx) => ({
      day: dayNames[dayIdx],
      bookings: bookingDayMap[dayIdx],
    }));

    const typeTranslations: Record<string, string> = {
      Standard: "Tiêu Chuẩn",
      Combo: "Combo",
      Birthday: "Sinh nhật",
      Corporate: "Khách Đoàn",
    };
    const computedTypeData = Object.keys(typeMap)
      .filter((k) => typeMap[k] > 0)
      .map((key) => ({
        name: typeTranslations[key] || key,
        value: typeMap[key],
      }));

    return {
      stats: [
        {
          title: "Đặt bàn hôm nay",
          value: todayBookings.toString(),
          icon: CalendarCheck,
          change: "+5%",
          positive: true,
        },
        {
          title: "Yêu cầu chờ xử lý",
          value: pendingRequests.toString(),
          icon: Clock,
          change: "Cần duyệt",
          positive: true,
        },
        {
          title: "Bàn trống",
          value: availableTables.toString(),
          icon: Users,
          change: "Sẵn sàng",
          positive: true,
        },
        {
          title: "Doanh thu ước tính (tháng)",
          value: formatCurrency(monthlyRevenue),
          icon: DollarSign,
          change: "Đang tính...",
          positive: true,
        },
      ],
      revenueData: computedRevenueData,
      reservationData: computedReservationData,
      typeData:
        computedTypeData.length > 0
          ? computedTypeData
          : [{ name: "Chưa có dữ liệu", value: 1 }],
    };
  }, [reservations, tables]);

  return {
    loading,
    stats,
    revenueData,
    reservationData,
    typeData,
  };
};
