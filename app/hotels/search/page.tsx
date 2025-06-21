"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, Building2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import HotelDestinationSearch from "@/components/HotelDestinationSearch"
import type { HotelDestination, HotelSearchParams } from "@/types"

export default function HotelSearchPage() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState<Partial<HotelSearchParams>>({
    adults: 1,
    children_age: "",
    room_qty: 1,
    price_min: 0,
    price_max: 0,
    page_number: 1,
    sort_by: "",
    categories_filter: "",
    units: "metric",
    temperature_unit: "c",
    languagecode: "en-us",
    currency_code: "USD",
    location: "US",
  })
  const [destination, setDestination] = useState<HotelDestination | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!destination || !searchParams.arrival_date || !searchParams.departure_date) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    const params = new URLSearchParams({
      dest_id: destination.dest_id.toString(),
      search_type: destination.search_type,
      arrival_date: searchParams.arrival_date,
      departure_date: searchParams.departure_date,
      adults: searchParams.adults?.toString() || "1",
      room_qty: searchParams.room_qty?.toString() || "1",
      page_number: searchParams.page_number?.toString() || "1",
      units: searchParams.units || "metric",
      temperature_unit: searchParams.temperature_unit || "c",
      languagecode: searchParams.languagecode || "en-us",
      currency_code: searchParams.currency_code || "USD",
    })

    if (searchParams.children_age) {
      params.append("children_age", searchParams.children_age)
    }
    if (searchParams.price_min && searchParams.price_min > 0) {
      params.append("price_min", searchParams.price_min.toString())
    }
    if (searchParams.price_max && searchParams.price_max > 0) {
      params.append("price_max", searchParams.price_max.toString())
    }
    if (searchParams.sort_by) {
      params.append("sort_by", searchParams.sort_by)
    }
    if (searchParams.categories_filter) {
      params.append("categories_filter", searchParams.categories_filter)
    }
    if (searchParams.location) {
      params.append("location", searchParams.location)
    }

    router.push(`/hotels/results?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-[#0d6efd] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4 flex-col sm:flex-row">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-transparent hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Search Hotels</h1>
            <p className="text-white/80">Find the perfect accommodation for your stay</p>
          </div>
        </div>
      </header>

      <div className="max-w-full lg:max-w-4xl mx-auto p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-dark font-medium">
              Hotel Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray mb-2">Destination</label>
              <HotelDestinationSearch
                placeholder="Enter city, hotel, or landmark"
                onSelect={setDestination}
                value={destination}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Check-in Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={searchParams.arrival_date || ""}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, arrival_date: e.target.value }))}
                    className="pl-10"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Check-out Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={searchParams.departure_date || ""}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, departure_date: e.target.value }))}
                    className="pl-10"
                    min={searchParams.arrival_date || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            {/* Guests and Rooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Adults</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={searchParams.adults || 1}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, adults: Number.parseInt(e.target.value) }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Children Ages (Optional)</label>
                <Input
                  placeholder="e.g., 5,12,17"
                  value={searchParams.children_age || ""}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, children_age: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Rooms</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={searchParams.room_qty || 1}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, room_qty: Number.parseInt(e.target.value) }))}
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Minimum Price (Optional)</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={searchParams.price_min || ""}
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, price_min: Number.parseInt(e.target.value) || 0 }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Maximum Price (Optional)</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={searchParams.price_max || ""}
                  onChange={(e) =>
                    setSearchParams((prev) => ({ ...prev, price_max: Number.parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>

            {/* Other Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Units</label>
                <Select
                  value={searchParams.units}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, units: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric</SelectItem>
                    <SelectItem value="imperial">Imperial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Temperature Unit</label>
                <Select
                  value={searchParams.temperature_unit}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, temperature_unit: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c">Celsius</SelectItem>
                    <SelectItem value="f">Fahrenheit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Location</label>
                <Select
                  value={searchParams.location}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="AE">United Arab Emirates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Currency</label>
                <Select
                  value={searchParams.currency_code}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, currency_code: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="AED">AED</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Language</label>
                <Select
                  value={searchParams.languagecode}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, languagecode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="en-gb">English (UK)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={isLoading || !destination || !searchParams.arrival_date || !searchParams.departure_date}
              className="w-full bg-[#0d6efd] hover:bg-[#0a6de4] h-12 text-lg"
            >
              {isLoading ? "Searching..." : "Search Hotels"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
