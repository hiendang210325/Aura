import { useEffect, useState } from "react";
import axios from "axios";

interface Promotion {
  _id: string;
  title: string;
  description: string;
  highlight: string;
  condition: string;
  validUntil: string;
  featured: boolean;
}

const API = "http://localhost:5000/api/v1/promotions/public?limit=10";

export const usePromoBanner = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data } = await axios.get(API);
        const allPromotions: Promotion[] = data.data || [];
        const featuredPromotions = allPromotions
          .filter((promo) => promo.featured)
          .slice(0, 3);
        setPromotions(featuredPromotions);
      } catch (err) {
        console.error("Error fetching promotions", err);
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return {
    promotions,
    loading,
  };
};
