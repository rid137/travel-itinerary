"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DestinationSearch from "@/components/DestinationSearch"
import type { FlightDestination, FlightSearchParams } from "@/types"

export default function FlightSearchPage() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState<Partial<FlightSearchParams>>({
    adults: 1,
    children: "",
    cabinClass: "ECONOMY",
    sort: "BEST",
    stops: "none",
    pageNo: 1,
    currency_code: "USD", 
  })
  const [fromDestination, setFromDestination] = useState<FlightDestination | null>(null)
  const [toDestination, setToDestination] = useState<FlightDestination | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!fromDestination || !toDestination || !searchParams.departDate) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    const params = new URLSearchParams({
      fromId: fromDestination.id,
      toId: toDestination.id,
      departDate: searchParams.departDate,
      adults: searchParams.adults?.toString() || "1",
      cabinClass: searchParams.cabinClass || "ECONOMY",
      sort: searchParams.sort || "BEST",
      stops: searchParams.stops || "none",
      pageNo: searchParams.pageNo?.toString() || "1",
      currency_code: searchParams.currency_code || "USD",
    })

    if (searchParams.returnDate) {
      params.append("returnDate", searchParams.returnDate)
    }
    if (searchParams.children) {
      params.append("children", searchParams.children)
    }

    router.push(`/flights/results?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-primary text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-transparent hover:text-white w-fit">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Search Flights</h1>
            <p className="text-white/80">Find the best flights for your journey</p>
          </div>
        </div>
      </header>

      <div className="max-w-full lg:max-w-4xl mx-auto p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-dark font-medium ">
              Flight Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Destinations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">From</label>
                <DestinationSearch
                  placeholder="Departure city or airport"
                  onSelect={setFromDestination}
                  value={fromDestination}
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray mb-2">To</label>
                <DestinationSearch
                  placeholder="Arrival city or airport"
                  onSelect={setToDestination}
                  value={toDestination}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={searchParams.departDate || ""}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, departDate: e.target.value }))}
                    className="pl-10"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Return Date (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={searchParams.returnDate || ""}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, returnDate: e.target.value }))}
                    className="pl-10"
                    min={searchParams.departDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            {/* Passengers and Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Adults</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="number"
                    min="1"
                    max="9"
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
                  value={searchParams.children || ""}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, children: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Cabin Class</label>
                <Select
                  value={searchParams.cabinClass}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, cabinClass: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ECONOMY">Economy</SelectItem>
                    <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="FIRST">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Other Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Sort By</label>
                <Select
                  value={searchParams.sort}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, sort: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEST">Best</SelectItem>
                    <SelectItem value="CHEAPEST">Cheapest</SelectItem>
                    <SelectItem value="FASTEST">Fastest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">Stops</label>
                <Select
                  value={searchParams.stops || "none"}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, stops: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any</SelectItem>
                    <SelectItem value="0">Non-stop</SelectItem>
                    <SelectItem value="1">1 Stop</SelectItem>
                    <SelectItem value="2">2 Stops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={isLoading || !fromDestination || !toDestination || !searchParams.departDate}
              className="w-full bg-[#0d6efd] hover:bg-[#0a6de4] h-12 text-lg"
            >
              {isLoading ? "Searching..." : "Search Flights"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
