"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ProductImageCarouselProps = {
  productName: string;
  mainImage: string;
  imageAlt?: string;
  galleryImages?: string[];
};

export function ProductImageCarousel({
  productName,
  mainImage,
  imageAlt,
  galleryImages = [],
}: ProductImageCarouselProps) {
  const images = useMemo(
    () =>
      [mainImage, ...galleryImages]
        .map((image) => image.trim())
        .filter((image, index, list) => image && list.indexOf(image) === index),
    [galleryImages, mainImage],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? mainImage;
  const hasMultipleImages = images.length > 1;

  const showPreviousImage = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)] sm:p-6">
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.20),transparent_68%)] opacity-90" />
      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[1.4rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)] sm:min-h-[460px]">
        <Image
          src={activeImage}
          alt={
            activeIndex === 0
              ? imageAlt || productName
              : `${productName} image ${activeIndex + 1}`
          }
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-contain p-6"
        />

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-xl font-semibold text-slate-900 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.8)] transition hover:border-cyan-300 hover:text-cyan-800"
              aria-label="Previous product image"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-xl font-semibold text-slate-900 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.8)] transition hover:border-cyan-300 hover:text-cyan-800"
              aria-label="Next product image"
            >
              &gt;
            </button>
            <div className="absolute bottom-4 left-1/2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="relative mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((imageUrl, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={imageUrl}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-24 overflow-hidden rounded-[1rem] border bg-slate-50 transition ${
                  isActive
                    ? "border-cyan-400 ring-2 ring-cyan-200"
                    : "border-slate-100 hover:border-cyan-200"
                }`}
                aria-label={`Show product image ${index + 1}`}
              >
                <Image
                  src={imageUrl}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
