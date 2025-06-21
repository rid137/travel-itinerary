"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MapPin, Star, Plus, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { activityService } from "@/services/activityService"
import { useItinerary } from "@/context/ItineraryContext"
import type { Activity, ItineraryItem } from "@/types"
import { RingSpinner } from "@/components/ui/ring-spinner"

export default function ActivitiesResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToItinerary, itinerary } = useItinerary()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const id = searchParams.get("id")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const sortBy = searchParams.get("sortBy")
  const page = searchParams.get("page")
  const currency_code = searchParams.get("currency_code")
  const languagecode = searchParams.get("languagecode")

  const isActivityInItinerary = (activity: Activity) => {
    return itinerary.some((item) => {
      if (item.type !== "activity") return false
      const existingActivity = item.data as Activity
      return (
        existingActivity.id === activity.id ||
        (existingActivity.name === activity.name && existingActivity.location === activity.location)
      )
    })
  }

  useEffect(() => {
    if (!hasSearched && id) {
      const searchActivities = async () => {
        try {
          setIsLoading(true)
          setError(null)

          const params = {
            id,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            sortBy: (sortBy as any) || "trending",
            page: page ? Number.parseInt(page) : 1,
            currency_code: currency_code || "USD",
            languagecode: languagecode || "en-us",
          }

          const results = await activityService.searchActivities(params)

          const transformedActivities: Activity[] =
            results.data?.products?.map((product: any) => ({
              id: product.id,
              name: product.name,
              slug: product.slug,
              description: product.shortDescription,
              price: {
                amount: product.representativePrice.chargeAmount,
                currency: product.representativePrice.currency,
              },
              image: [product.primaryPhoto?.small],
              rating: product.reviewsStats?.combinedNumericStats?.average || 0,
              reviews: product.reviewsStats?.combinedNumericStats?.total || 0,
              location: product.ufiDetails.bCityName,
              freeCancellation: product.cancellationPolicy?.hasFreeCancellation || false,
            })) || []

          setActivities(transformedActivities)
        } catch (error) {
          console.error("Error searching activities:", error)
        } finally {
          setIsLoading(false)
          setHasSearched(true)
        }
      }

      searchActivities()
    } else if (!id) {
      setIsLoading(false)
      setError("Missing required search parameters")
    }
  }, [])

  const handleAddToItinerary = (activity: Activity) => {
    const itineraryItem: ItineraryItem = {
      id: `itinerary-${Date.now()}`,
      type: "activity",
      data: activity,
      dateAdded: new Date().toISOString(),
    }

    addToItinerary(itineraryItem)

    toast({
      title: "Activity Added! 🎯",
      description: `${activity.name} has been added to your itinerary.`,
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <RingSpinner />
          <p className="text-gray-600">Searching for activities...</p>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold">Activity Results</h1>
            <p className="text-white/80">Discover amazing experiences and attractions</p>
            <div className="text-sm text-white/70 mt-1">
              Sorted by: {sortBy || "trending"} • Page {page || 1} • {languagecode || "en-us"} •{" "}
              {currency_code || "USD"}
              {startDate && endDate && ` • ${startDate} to ${endDate}`}
              {startDate && !endDate && ` • From ${startDate}`}
              {!startDate && endDate && ` • Until ${endDate}`}
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

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">Found {activities.length} activities</p>
          <p 
            className="text-primary underline cursor-pointer"
            onClick={() => router.push("/")}
          >
            Go Home
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {activities.map((activity) => {
            const isAdded = isActivityInItinerary(activity)

            return (
              <Card
                key={activity.id}
                className="overflow-hidden border border-[#e4e7ec] hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={activity.image?.[0] || "/placeholder.svg"}
                      alt={activity.name}
                      className="w-full h-48 object-cover"
                    />
                    {activity.freeCancellation && (
                      <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">Free cancellation</Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-dark text-lg leading-tight line-clamp-2 h-11">{activity.name}</h3>
                    </div>

                    <p className="text-sm text-gray mb-3 line-clamp-2 h-11">{activity.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{activity.rating}</span>
                        <span className="text-gray">({activity.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#647995]">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                      </div>
                    </div>                    
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="text-lg font-bold text-dark">
                            {activity.price.currency} {activity.price.amount.toLocaleString()}
                          </div>
                        </div>

                        <Button
                          onClick={() => handleAddToItinerary(activity)}
                          disabled={isAdded}
                          className={`${
                            isAdded
                              ? "bg-green-100 text-green-700 hover:bg-green-100 cursor-not-allowed"
                              : "bg-[#0d6efd] hover:bg-[#0a6de4]"
                          }`}
                          size="sm"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {activities.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
