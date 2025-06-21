"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { hotelService } from "@/services/hotelService"
import type { HotelDestination } from "@/types"

interface HotelDestinationSearchProps {
  placeholder: string
  onSelect: (destination: HotelDestination) => void
  value?: HotelDestination | null
}

export default function HotelDestinationSearch({ placeholder, onSelect, value }: HotelDestinationSearchProps) {
  const [query, setQuery] = useState("")
  const [destinations, setDestinations] = useState<HotelDestination[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)

  useEffect(() => {
    if (value && !hasSelected) {
      setQuery(value.name)
    }
  }, [value, hasSelected])

  const handleSearch = async () => {
    if (query.length < 3) {
      setDestinations([])
      setShowResults(false)
      return
    }

    if (value && query === value.name) {
      setShowResults(false)
      return
    }

    setIsLoading(true)
    setShowResults(true)
    try {
      const results = await hotelService.searchDestinations(query)
      setDestinations(results)
    } catch (error) {
      console.error("Error searching hotel destinations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setHasSelected(false)
    setShowResults(false)
  }

  useEffect(() => {
    if (query.length >= 3) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch()
      }, 500)

      return () => clearTimeout(delayDebounceFn)
    } else {
      setDestinations([])
      setShowResults(false)
    }
  }, [query])

  const handleSelect = (destination: HotelDestination) => {
    setHasSelected(true)
    setQuery(destination.name)
    setShowResults(false)
    onSelect(destination)
  }

  const handleFocus = () => {
    if (!hasSelected && destinations.length > 0) {
      setShowResults(true)
    }
  }

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200)
  }

  return (
    <div className="relative">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-10"
        />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
          {isLoading ? (
            <div className="p-4 text-center text-gray-600">Searching for destinations...</div>
          ) : destinations.length > 0 ? (
            destinations.map((destination, index) => (
              <button
                key={`${destination.dest_id}-${index}`}
                onClick={() => handleSelect(destination)}
                className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{destination.name}</div>
                  <div className="text-sm text-gray-500">{destination.country}</div>
                </div>
                <div className="ml-auto text-sm text-gray-400">{destination.search_type}</div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No destinations found. Try a different search term.</div>
          )}
        </div>
      )}
    </div>
  )
}
