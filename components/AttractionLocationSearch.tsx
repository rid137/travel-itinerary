"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { activityService } from "@/services/activityService"
import type { AttractionLocation } from "@/types"

interface AttractionLocationSearchProps {
  placeholder: string
  onSelect: (location: AttractionLocation) => void
  value?: AttractionLocation | null
}

export default function AttractionLocationSearch({ placeholder, onSelect, value }: AttractionLocationSearchProps) {
  const [query, setQuery] = useState("")
  const [locations, setLocations] = useState<AttractionLocation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (value && !hasSelected) {
      setQuery(value.name)
    }
  }, [value, hasSelected])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (hasSelected || query.length < 3) {
      setLocations([])
      setShowResults(false)
      setIsLoading(false)
      return
    }

    if (value && query === value.name) {
      setShowResults(false)
      return
    }

    const searchLocations = async () => {
      setIsLoading(true)
      setShowResults(true)
      try {
        const results = await activityService.searchLocations(query)
        setLocations(results)
      } catch (error) {
        console.error("Error searching attraction locations:", error)
        setLocations([])
      } finally {
        setIsLoading(false)
      }
    }

    debounceRef.current = setTimeout(searchLocations, 1000)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, hasSelected, value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setHasSelected(false)
  }

  const handleSelect = (location: AttractionLocation) => {
    setHasSelected(true)
    setQuery(location.name)
    setShowResults(false)
    setIsLoading(false)
    onSelect(location)
  }

  const handleFocus = () => {
    if (!hasSelected && locations.length > 0) {
      setShowResults(true)
    }
  }

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200)
  }

  return (
    <div className="relative">
      <div className="relative">
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
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-600">Searching for locations...</div>
          ) : locations.length > 0 ? (
            locations.map((location, index) => (
              <button
                key={`${location.id}-${index}`}
                onClick={() => handleSelect(location)}
                className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-500">{location.country}</div>
                </div>
              </button>
            ))
          ) : query.length >= 3 ? (
            <div className="p-4 text-center text-gray-500">No locations found. Please refine your search.</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
