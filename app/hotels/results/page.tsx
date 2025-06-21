"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Building2, Star, Plus, ArrowLeft, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { hotelService } from "@/services/hotelService"
import { useItinerary } from "@/context/ItineraryContext"
import type { Hotel, ItineraryItem } from "@/types"
import { RingSpinner } from "@/components/ui/ring-spinner"
import Image from "next/image"

export default function HotelResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToItinerary, itinerary } = useItinerary()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const dest_id = searchParams.get("dest_id")
  const search_type = searchParams.get("search_type")
  const arrival_date = searchParams.get("arrival_date")
  const departure_date = searchParams.get("departure_date")
  const adults = searchParams.get("adults")
  const children_age = searchParams.get("children_age")
  const room_qty = searchParams.get("room_qty")
  const page_number = searchParams.get("page_number")
  const price_min = searchParams.get("price_min")
  const price_max = searchParams.get("price_max")
  const sort_by = searchParams.get("sort_by")
  const categories_filter = searchParams.get("categories_filter")
  const units = searchParams.get("units")
  const temperature_unit = searchParams.get("temperature_unit")
  const languagecode = searchParams.get("languagecode")
  const currency_code = searchParams.get("currency_code")
  const location = searchParams.get("location")

  const isHotelInItinerary = (hotel: Hotel) => {
    return itinerary.some((item) => {
      if (item.type !== "hotel") return false
      const existingHotel = item.data as Hotel
      return (
        existingHotel.id === hotel.id ||
        (existingHotel.name === hotel.name &&
          existingHotel.address === hotel.address &&
          existingHotel.checkIn === hotel.checkIn)
      )
    })
  }

  useEffect(() => {
    if (!hasSearched && dest_id && search_type && arrival_date && departure_date) {
      const searchHotels = async () => {
        try {
          setIsLoading(true)
          setError(null)

          const params = {
            dest_id: Number.parseInt(dest_id),
            search_type,
            arrival_date,
            departure_date,
            adults: adults ? Number.parseInt(adults) : 1,
            children_age: children_age || undefined,
            room_qty: room_qty ? Number.parseInt(room_qty) : 1,
            page_number: page_number ? Number.parseInt(page_number) : 1,
            price_min: price_min ? Number.parseInt(price_min) : undefined,
            price_max: price_max ? Number.parseInt(price_max) : undefined,
            sort_by: sort_by || undefined,
            categories_filter: categories_filter || undefined,
            units: (units as any) || "metric",
            temperature_unit: (temperature_unit as any) || "c",
            languagecode: languagecode || "en-us",
            currency_code: currency_code || "USD",
            location: location || "US",
          }

          const results = await hotelService.searchHotels(params)

          const transformedHotels: Hotel[] =
            results.data?.hotels?.map((hotel: any) => ({
              id: hotel.property.id.toString(),
              name: hotel.property.name,
              address: hotel.property.wishlistName || hotel.property.name,
              rating: hotel.property.reviewScore || 0,
              reviews: hotel.property.reviewCount || 0,
              price: {
                amount: hotel.property.priceBreakdown.grossPrice.value,
                currency: hotel.property.priceBreakdown.grossPrice.currency,
              },
              images: hotel.property.photoUrls,
              checkIn: arrival_date,
              facilities: hotel.property.facilities,
              accessibilityLabel: hotel.accessibilityLabel,
              checkOut: departure_date,
              location: hotel.property.wishlistName || "Location",
              propertyClass: hotel.property.propertyClass || 0,
            })) || []

          setHotels(transformedHotels)
        } catch (error) {
          console.log("Error searching hotels:", error)
        } finally {
          setIsLoading(false)
          setHasSearched(true)
        }
      }

      searchHotels()
    } else if (!dest_id || !arrival_date || !departure_date) {
      setIsLoading(false)
      setError("Missing required search parameters")
    }
  }, [])

  const handleAddToItinerary = (hotel: Hotel) => {
    const itineraryItem: ItineraryItem = {
      id: `itinerary-${Date.now()}`,
      type: "hotel",
      data: hotel,
      dateAdded: new Date().toISOString(),
    }

    addToItinerary(itineraryItem)

    toast({
      title: "Hotel Added! 🏨",
      description: `${hotel.name} has been added to your itinerary.`,
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <RingSpinner />
          <p className="text-gray-600">Searching for hotels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-[#0d6efd] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-transparent hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Hotel Results</h1>
            <p className="text-white/80">
              {arrival_date} - {departure_date} • {adults || 1} adult{adults && Number.parseInt(adults) > 1 ? "s" : ""}{" "}
              • {room_qty || 1} room{room_qty && Number.parseInt(room_qty) > 1 ? "s" : ""}
            </p>
            <div className="text-sm text-white/70 mt-1">
              {search_type} search • {languagecode || "en-us"} • {currency_code || "USD"}
              {children_age && ` • Children: ${children_age}`}
              {price_min && price_max && ` • Price: ${currency_code || "USD"} ${price_min} - ${price_max}`}
              {sort_by && ` • Sorted by: ${sort_by}`}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full lg:max-w-6xl mx-auto p-4 lg:p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-">
            <p className="text-gray-600">Found {hotels.length} hotels</p>
            <div className="text-sm text-gray-500">
              Page {page_number || 1} • {units || "metric"} units • {temperature_unit === "f" ? "Fahrenheit" : "Celsius"}
              {categories_filter && ` • Filter: ${categories_filter}`}
            </div>
          </div>
          <p 
            className="text-primary underline cursor-pointer"
            onClick={() => router.push("/")}
          >
            Go Home
          </p>
        </div>

        <div className="space-y-4">
          {hotels.map((hotel) => {
            const isAdded = isHotelInItinerary(hotel)

            return (
              <Card key={hotel.id} className="overflow-hidden border border-[#e4e7ec]">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-64 h-48 flex-shrink-0">
                      <Image
                        src={hotel?.images?.[0] || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        width={1000}
                        height={1000}
                      />
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-dark">{hotel.name}</h3>
                            <div className="flex">
                              {[...Array(hotel.propertyClass || 0)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{hotel.address}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <div className="bg-[#0d6efd] text-white px-2 py-1 rounded text-sm font-medium">
                                {hotel.rating}
                              </div>
                              <span className="text-sm font-medium">
                                {hotel.rating >= 9
                                  ? "Superb"
                                  : hotel.rating >= 8
                                    ? "Very good"
                                    : hotel.rating >= 7
                                      ? "Good"
                                      : "Pleasant"}
                              </span>
                            </div>
                            <span className="text-sm text-gray">({hotel.reviews} reviews)</span>
                          </div>

                          <div className="text-sm text-gray">
                            Check-in: {hotel.checkIn} • Check-out: {hotel.checkOut}
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-dark mb-1">
                            {hotel.price.currency} {hotel.price.amount.toLocaleString()}
                          </div>
                          <Button
                            onClick={() => handleAddToItinerary(hotel)}
                            disabled={isAdded}
                            className={`w-full ${
                              isAdded
                                ? "bg-green-100 text-green-700 hover:bg-green-100 cursor-not-allowed"
                                : "bg-[#0d6efd] hover:bg-[#0a6de4]"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Itinerary
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {hotels.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
