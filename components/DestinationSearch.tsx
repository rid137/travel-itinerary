"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { flightService } from "@/services/flightService"
import type { FlightDestination } from "@/types"

interface DestinationSearchProps {
  placeholder: string
  onSelect: (destination: FlightDestination) => void
  value?: FlightDestination | null
}

export default function DestinationSearch({ placeholder, onSelect, value }: DestinationSearchProps) {
  const [query, setQuery] = useState("")
  const [destinations, setDestinations] = useState<FlightDestination[]>([])
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
      const results = await flightService.searchDestinations(query)
      setDestinations(results)

    } catch (error) {
      console.log("Error searching destinations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setHasSelected(false)
    setShowResults(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleSelect = (destination: FlightDestination) => {
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (query.length >= 3) {
      timeoutId = setTimeout(() => {
        handleSearch()
      }, 300)
    } else {
      setDestinations([])
      setShowResults(false)
      setIsLoading(false)
    }

    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pl-10"
          />
        </div>
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
          {isLoading ? (
            <div className="p-4 text-center text-gray-600">Searching for destinations...</div>
          ) : destinations.length > 0 ? (
            destinations.map((destination) => (
              <button
                key={destination.id}
                onClick={() => handleSelect(destination)}
                className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{destination.name}</div>
                  <div className="text-sm text-gray-500">{destination.country}</div>
                </div>
                <div className="ml-auto text-sm text-gray-400">{destination.code}</div>
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
