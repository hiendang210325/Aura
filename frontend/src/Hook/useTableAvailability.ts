import { useEffect, useState } from "react";
import axios from "axios";

interface Reservation {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  time: string;
  date: string;
  guests: number;
  type: string;
  area: string;
  table: string;
  combo?: string;
  notes?: string;
  source?: string;
  status: string;
}

interface Table {
  _id: string;
  tableId: string;
  area: string;
  capacity: number;
  status: string;
}

interface TableCard {
  tableId: string;
  area: string;
  capacity: number;
  reservations: Reservation[];
  displayStatus: string;
  primaryRes: Reservation | null;
}

const computeDisplayStatus = (resList: Reservation[]): string => {
  const active = resList.filter(
    (r) => r.status !== "Cancelled" && r.status !== "Completed",
  );
  if (active.length === 0) return "Còn trống";
  if (active.some((r) => r.status === "Seated")) return "Có khách";
  if (active.some((r) => r.status === "Pending" || r.status === "Confirmed")) {
    return "Đã đặt";
  }
  return "Còn trống";
};

export const useTableAvailability = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeArea, setActiveArea] = useState("Tất cả");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedCard, setSelectedCard] = useState<TableCard | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [tablesRes, reservationsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/v1/tables", config),
          axios.get(
            `http://localhost:5000/api/v1/reservations?date=${selectedDate}`,
            config,
          ),
        ]);
        setTables(tablesRes.data.data);
        setReservations(reservationsRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const refreshReservations = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/reservations?date=${selectedDate}`,
      config,
    );
    setReservations(data.data);
  };

  const handleStatusUpdate = async (resId: string, newStatus: string) => {
    try {
      setActionLoading(true);
      await axios.patch(
        `http://localhost:5000/api/v1/reservations/${resId}/status`,
        { status: newStatus },
        config,
      );
      await refreshReservations();
      setSelectedCard(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTable = async (resId: string, tableId: string) => {
    try {
      setActionLoading(true);
      await axios.put(
        `http://localhost:5000/api/v1/reservations/${resId}`,
        { table: tableId },
        config,
      );
      await refreshReservations();
      setSelectedCard(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Phân bàn thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const unassignedReservations = reservations.filter(
    (r) =>
      (!r.table || r.table === "Chưa phân") &&
      r.status !== "Cancelled" &&
      r.status !== "Completed",
  );

  const assignedByTable: Record<string, Reservation[]> = {};
  reservations.forEach((r) => {
    if (r.table && r.table !== "Chưa phân") {
      if (!assignedByTable[r.table]) assignedByTable[r.table] = [];
      assignedByTable[r.table].push(r);
    }
  });

  const tableCards: TableCard[] = tables.map((table) => {
    const resList = assignedByTable[table.tableId] || [];
    const displayStatus =
      resList.length > 0 ? computeDisplayStatus(resList) : "Còn trống";
    const primaryRes =
      resList.find((r) => r.status === "Seated") ||
      resList.find((r) => r.status === "Confirmed") ||
      resList.find((r) => r.status === "Pending") ||
      resList[0] ||
      null;

    return {
      tableId: table.tableId,
      area: table.area,
      capacity: table.capacity,
      reservations: resList,
      displayStatus,
      primaryRes,
    };
  });

  const areas = [
    "Tất cả",
    ...Array.from(new Set(tables.map((t) => t.area))).filter(Boolean),
  ];

  const filtered =
    activeArea === "Tất cả"
      ? tableCards
      : tableCards.filter((t) => t.area === activeArea);

  return {
    tables,
    loading,
    error,
    activeArea,
    setActiveArea,
    selectedDate,
    setSelectedDate,
    selectedCard,
    setSelectedCard,
    actionLoading,
    unassignedReservations,
    areas,
    filtered,
    handleStatusUpdate,
    handleAssignTable,
  };
};
