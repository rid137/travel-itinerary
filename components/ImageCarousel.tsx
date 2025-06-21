"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export default function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-xs">No image</span>
      </div>
    )
  }

  if (images.length === 1) {
    return <img src={images[0] || "/placeholder.svg"} alt={alt} className={`object-cover ${className}`} />
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToSlide = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentIndex(index)
  }

  return (
    <div className={`relative group ${className}`}>
      <img
        src={images[currentIndex] || "/placeholder.svg"}
        alt={`${alt} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full p-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full p-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
          >
            <ChevronRight className="w-3 h-3" />
          </Button>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(e, index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "bg-white shadow-md" : "bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  )
}
