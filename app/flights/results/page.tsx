"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Plane, Clock, Plus, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { flightService } from "@/services/flightService"
import { useItinerary } from "@/context/ItineraryContext"
import AirlineLogo from "@/components/AirlineLogo"
import type { Flight, ItineraryItem } from "@/types"
import { RingSpinner } from "@/components/ui/ring-spinner"

export default function FlightResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToItinerary, itinerary } = useItinerary()
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const fromId = searchParams.get("fromId")
  const toId = searchParams.get("toId")
  const departDate = searchParams.get("departDate")
  const returnDate = searchParams.get("returnDate")
  const stops = searchParams.get("stops")
  const pageNo = searchParams.get("pageNo")
  const adults = searchParams.get("adults")
  const children = searchParams.get("children")
  const sort = searchParams.get("sort")
  const cabinClass = searchParams.get("cabinClass")
  const currency_code = searchParams.get("currency_code")

  const isFlightInItinerary = (flight: Flight) => {
    return itinerary.some((item) => {
      if (item.type !== "flight") return false
      const existingFlight = item.data as Flight
      return (
        existingFlight.uniqueId === flight.uniqueId 
      )
    })
  }

  useEffect(() => {
    if (!hasSearched && fromId && toId && departDate) {
      const searchFlights = async () => {
        try {
          setIsLoading(true)
          setError(null)

          const params = {
            fromId,
            toId,
            departDate,
            returnDate: returnDate || undefined,
            stops: (stops as any) || "none",
            pageNo: pageNo ? Number.parseInt(pageNo) : 1,
            adults: adults ? Number.parseInt(adults) : 1,
            children: children || undefined,
            sort: (sort as any) || "BEST",
            cabinClass: (cabinClass as any) || "ECONOMY",
            currency_code: currency_code || "USD",
          }

          const results = await flightService.searchFlights(params)

          const transformedFlights: Flight[] =
            results.data?.flightOffers?.map((offer: any) => {
              const outboundSegment = offer.segments[0]
              const carrierData = outboundSegment.legs[0].carriersData[0]

              return {
                id: offer.token,
                uniqueId: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
                airline: carrierData.name,
                airlineCode: carrierData.code,
                airlineLogo: carrierData.logo || undefined,
                flightNumber: outboundSegment.legs[0].flightInfo.flightNumber.toString(),
                departure: {
                  time: new Date(outboundSegment.departureTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }),
                  date: new Date(outboundSegment.departureTime).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  }),
                  airport: outboundSegment.departureAirport.cityName,
                  code: outboundSegment.departureAirport.code,
                },
                arrival: {
                  time: new Date(outboundSegment.arrivalTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }),
                  date: new Date(outboundSegment.arrivalTime).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  }),
                  airport: outboundSegment.arrivalAirport.cityName,
                  code: outboundSegment.arrivalAirport.code,
                },
                duration: `${Math.floor(outboundSegment.totalTime / 3600)}h ${Math.floor((outboundSegment.totalTime % 3600) / 60)}m`,
                stops: outboundSegment.legs[0].flightStops?.length || 0,
                price: {
                  amount: offer.priceBreakdown.total.units + offer.priceBreakdown.total.nanos / 1000000000,
                  currency: offer.priceBreakdown.total.currencyCode,
                },
                cabinClass: outboundSegment.legs[0].cabinClass,
                facilities: [
                  `Baggage: ${outboundSegment.travellerCheckedLuggage[0]?.luggageAllowance?.maxWeightPerPiece || "N/A"}${outboundSegment.travellerCheckedLuggage[0]?.luggageAllowance?.massUnit || ""}`,
                  `Cabin Baggage: ${outboundSegment.travellerCabinLuggage[0]?.luggageAllowance?.maxWeightPerPiece || "N/A"}${outboundSegment.travellerCabinLuggage[0]?.luggageAllowance?.massUnit || ""}`,
                  "In flight entertainment",
                  "In flight meal",
                ],
              }
            }) || []

          setFlights(transformedFlights)
        } catch (error) {
          console.log("Error searching flights:", error)
        } finally {
          setIsLoading(false)
          setHasSearched(true)
        }
      }

      searchFlights()
    } else if (!fromId || !toId || !departDate) {
      setIsLoading(false)
      setError("Missing required search parameters")
    }
  }, [])

  const handleAddToItinerary = (flight: Flight) => {
    const itineraryItem: ItineraryItem = {
      id: `itinerary-${Date.now()}`,
      type: "flight",
      data: flight,
      dateAdded: new Date().toISOString(),
    }

    addToItinerary(itineraryItem)

    toast({
      title: "Flight Added! ✈️",
      description: `${flight.airline} ${flight.flightNumber} has been added to your itinerary.`,
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <RingSpinner />
          <p className="text-gray-600">Searching for flights...</p>
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
            <h1 className="text-2xl font-bold">Flight Results</h1>
            <p className="text-white/80">
              {fromId} → {toId} • {departDate} {returnDate && `• Return: ${returnDate}`}
            </p>
            <div className="text-sm text-white/70 mt-1">
              {adults} adult{adults && Number.parseInt(adults) > 1 ? "s" : ""} • {cabinClass || "Economy"} •{" "}
              {sort || "Best"} results
              {children && ` • Children: ${children}`}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-gray-600">Found {flights.length} flights</p>
            <div className="text-sm text-gray-500">
              Showing results for{" "}
              {stops === "0" ? "non-stop" : stops === "1" ? "1 stop" : stops === "2" ? "2 stops" : "all"} flights
              {currency_code && ` • Prices in ${currency_code}`}
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
          {flights.map((flight) => {
            const isAdded = isFlightInItinerary(flight)

            return (
              <Card key={flight.id} className="p-6 border border-[#e4e7ec]">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
                    <div className="flex items-center gap-4">
                      <AirlineLogo
                        airlineLogo={flight.airlineLogo}
                        airlineName={flight.airline}
                        airlineCode={flight.airlineCode}
                        className="w-10 h-10"
                      />
                      <div>
                        <div className="font-semibold text-dark">{flight.airline}</div>
                        <div className="text-sm text-gray">{flight.flightNumber}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="font-semibold text-dark text-lg">{flight.departure.time}</div>
                        <div className="text-sm text-gray">{flight.departure.code}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#0d6efd] rounded-full"></div>
                        <div className="w-20 h-px bg-[#e4e7ec] relative">
                          <Plane className="w-4 h-4 text-gray absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="w-2 h-2 bg-[#0d6efd] rounded-full"></div>
                      </div>

                      <div className="text-center">
                        <div className="font-semibold text-dark text-lg">{flight.arrival.time}</div>
                        <div className="text-sm text-gray">{flight.arrival.code}</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm text-gray mb-1">
                        <Clock className="w-4 h-4" />
                        <span>{flight.duration}</span>
                      </div>
                      <div className="text-sm text-gray">
                        {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-dark text-xl">
                        {flight.price.currency} {flight.price.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray">Total price</div>
                    </div>

                    <Button
                      onClick={() => handleAddToItinerary(flight)}
                      disabled={isAdded}
                      className={`${
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

                  {flight.facilities.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#e4e7ec]">
                      <div className="flex items-center gap-4 text-sm text-gray">
                        <span className="font-medium">Facilities:</span>
                        {flight.facilities.map((facility, index) => (
                          <span key={index}>{facility}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {flights.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
