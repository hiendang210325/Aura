import { useEffect, useState } from "react";
import axios from "axios";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  status: string;
  featured: boolean;
};

type Combo = {
  _id: string;
  name: string;
  description: string;
  guests: string;
  dishes: string[];
  price: number;
  image: string;
  status: string;
  featured: boolean;
};

const COMBO_PER_PAGE = 6;
const MENU_PER_PAGE = 9;

export const useMenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [comboPage, setComboPage] = useState(1);
  const [menuPage, setMenuPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, comboRes] = await Promise.all([
          axios.get("/api/v1/menu"),
          axios.get("/api/v1/combos"),
        ]);
        setMenuItems(menuRes.data.data || []);
        setCombos(comboRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalComboPages = Math.ceil(combos.length / COMBO_PER_PAGE);
  const currentCombos = combos.slice(
    (comboPage - 1) * COMBO_PER_PAGE,
    comboPage * COMBO_PER_PAGE,
  );

  const filteredMenu =
    activeCategory === "Tất cả"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const totalMenuPages = Math.ceil(filteredMenu.length / MENU_PER_PAGE);
  const currentMenu = filteredMenu.slice(
    (menuPage - 1) * MENU_PER_PAGE,
    menuPage * MENU_PER_PAGE,
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setMenuPage(1);
  };

  return {
    combos,
    loading,
    activeCategory,
    comboPage,
    setComboPage,
    menuPage,
    setMenuPage,
    totalComboPages,
    currentCombos,
    filteredMenu,
    totalMenuPages,
    currentMenu,
    handleCategoryChange,
  };
};
