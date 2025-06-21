"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AttractionLocationSearch from "@/components/AttractionLocationSearch"
import type { AttractionLocation, AttractionSearchParams } from "@/types"

export default function ActivitiesSearchPage() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState<Partial<AttractionSearchParams>>({
    sortBy: "trending",
    page: 1,
    currency_code: "USD", 
    languagecode: "en-us",
  })
  const [location, setLocation] = useState<AttractionLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!location) {
      alert("Please select a location")
      return
    }

    setIsLoading(true)

    const params = new URLSearchParams({
      id: location.id,
      sortBy: searchParams.sortBy || "trending",
      page: searchParams.page?.toString() || "1",
      currency_code: searchParams.currency_code || "USD",
      languagecode: searchParams.languagecode || "en-us",
    })

    if (searchParams.startDate) {
      params.append("startDate", searchParams.startDate)
    }
    if (searchParams.endDate) {
      params.append("endDate", searchParams.endDate)
    }

    router.push(`/activities/results?${params.toString()}`)
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
            <h1 className="text-2xl font-semibold">Search Activities</h1>
            <p className="text-white/80">Discover amazing attractions and experiences</p>
          </div>
        </div>
      </header>

      <div className="max-w-full lg:max-w-4xl mx-auto p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-dark font-medium ">
              Activity Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray mb-2">Location</label>
              <AttractionLocationSearch
                placeholder="Enter city or destination"
                onSelect={setLocation}
                value={location}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Start Date (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={searchParams.startDate || ""}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="pl-10"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-2">End Date (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={searchParams.endDate || ""}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="pl-10"
                    min={searchParams.startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            {/* Sort and Currency Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Sort By</label>
                <Select
                  value={searchParams.sortBy}
                  onValueChange={(value) => setSearchParams((prev) => ({ ...prev, sortBy: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="attr_book_score">Booking Score</SelectItem>
                    <SelectItem value="lowest_price">Lowest Price</SelectItem>
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
              disabled={isLoading || !location}
              className="w-full bg-[#0d6efd] hover:bg-[#0a6de4] h-12 text-lg"
            >
              {isLoading ? "Searching..." : "Search Activities"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
