"use client"

import { useState } from "react"
import { Plane } from "lucide-react"

interface AirlineLogoProps {
  airlineLogo?: string
  airlineName: string
  airlineCode?: string
  className?: string
}

export default function AirlineLogo({ airlineLogo, airlineName, airlineCode, className = "" }: AirlineLogoProps) {
  const [imageError, setImageError] = useState(false)

  if (!airlineLogo || imageError) {
    return (
      <div className={`bg-[#0d6efd] rounded-lg flex items-center justify-center ${className}`}>
        <Plane className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg flex items-center justify-center p-1 ${className}`}>
      <img
        src={airlineLogo || "/placeholder.svg"}
        alt={`${airlineName} logo`}
        className="w-full h-full object-contain"
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
    </div>
  )
}
