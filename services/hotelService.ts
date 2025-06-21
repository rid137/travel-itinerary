import axiosClient from "@/lib/axios"
import type { HotelDestination, HotelSearchParams } from "@/types"

const hotelDestinationCache = new Map<string, HotelDestination[]>()
let currentHotelController: AbortController | null = null

export const hotelService = {
  searchDestinations: async (query: string): Promise<HotelDestination[]> => {
    const key = query.trim().toLowerCase()
    if (hotelDestinationCache.has(key)) return hotelDestinationCache.get(key)!

    currentHotelController?.abort()
    currentHotelController = new AbortController()

    try {
      const response = await axiosClient.get("/hotels/searchDestination", {
        params: { query },
        signal: currentHotelController.signal,
      })

      hotelDestinationCache.set(key, response.data || [])
      return response.data || []
    } catch (error: any) {
      console.log("Error searching hotel destinations:", error)
      return []
    }
  },

  searchHotels: async (params: HotelSearchParams) => {
    try {
      const response = await axiosClient.get("/hotels/searchHotels", {
        params: {
          dest_id: params.dest_id,
          search_type: params.search_type,
          arrival_date: params.arrival_date,
          departure_date: params.departure_date,
          adults: params.adults || 1,
          children_age: params.children_age || "",
          room_qty: params.room_qty || 1,
          page_number: params.page_number || 1,
          price_min: params.price_min || 0,
          price_max: params.price_max || 0,
          sort_by: params.sort_by || "",
          categories_filter: params.categories_filter || "",
          units: params.units || "metric",
          temperature_unit: params.temperature_unit || "c",
          languagecode: params.languagecode || "en-us",
          currency_code: params.currency_code || "USD",
          location: params.location || "US",
        },
      })
      return response
    } catch (error) {
      console.log("Error searching hotels:", error)
      throw error
    }
  },
}
