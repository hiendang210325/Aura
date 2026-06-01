import { useEffect, useState } from "react";
import axios from "axios";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
};

export const useSignatureDishes = () => {
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignatureDishes = async () => {
      try {
        const response = await axios.get("/api/v1/menu");
        const allItems: MenuItem[] = response.data.data || [];
        const signature = allItems.filter((item) => item.featured).slice(0, 6);
        setDishes(signature);
      } catch (error) {
        console.error("Error fetching signature dishes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignatureDishes();
  }, []);

  return {
    dishes,
    loading,
  };
};
