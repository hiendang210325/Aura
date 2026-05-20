import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import axios from "axios";

type GalleryImage = {
  id: number;
  category: string;
  title: string;
  img: string;
};

export const useGalleryPage = (galleryImages: GalleryImage[]) => {
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dbFoods, setDbFoods] = useState<any[]>([]);

  useEffect(() => {
    const fetchSignatureDishes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/menu");
        const allItems = response.data.data || [];
        const signature = allItems
          .filter((item: any) => item.featured)
          .slice(0, 6);
        setDbFoods(signature);
      } catch (error) {
        console.error("Error fetching signature dishes", error);
      }
    };

    fetchSignatureDishes();
  }, []);

  const filteredImages =
    activeTab === "Tất cả"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeTab);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length,
    );
  };

  return {
    activeTab,
    setActiveTab,
    lightboxOpen,
    currentImageIndex,
    dbFoods,
    filteredImages,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
  };
};
