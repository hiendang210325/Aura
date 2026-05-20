import { useEffect, useState } from "react";
import axios from "axios";

type Combo = {
  _id: string;
  name: string;
  guests: string;
  dishes: string[];
  price: number;
  featured: boolean;
  image: string;
};

export const useDiningCombos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/combos");
        const allCombos: Combo[] = response.data.data || [];
        const featuredCombos = allCombos
          .filter((combo) => combo.featured)
          .slice(0, 3);
        setCombos(featuredCombos);
      } catch (error) {
        console.error("Error fetching combos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  return {
    combos,
    loading,
  };
};
