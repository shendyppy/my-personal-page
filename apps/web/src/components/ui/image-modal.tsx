"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageAlt: string;
  onClose: () => void;
}

export const ImageModal = ({
  isOpen,
  imageUrl,
  imageAlt,
  onClose,
}: ImageModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && e.target === modalRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
        document.removeEventListener("click", handleClickOutside);
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300 opacity-100 pointer-events-auto"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300 opacity-100">
        <div className="relative w-full h-full flex items-center justify-center p-4 pointer-events-auto transform transition-all duration-300 scale-100">
          {/* Image Container */}
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              priority
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 cursor-pointer"
            aria-label="Close image modal"
          >
            <X size={24} />
          </button>

          {/* Image Info (optional) */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg max-w-xs">
            {imageAlt}
          </div>
        </div>
      </div>
    </>
  );
};
