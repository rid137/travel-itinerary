import axiosClient from "@/lib/axios"
import type { FlightDestination, FlightSearchParams } from "@/types"

const destinationCache = new Map<string, FlightDestination[]>()
let currentController: AbortController | null = null

export const flightService = {
  searchDestinations: async (query: string): Promise<FlightDestination[]> => {
    const key = query.trim().toLowerCase()
    if (destinationCache.has(key)) return destinationCache.get(key)!

    currentController?.abort()
    currentController = new AbortController()

    try {
      const response = await axiosClient.get("/flights/searchDestination", {
        params: { query },
        signal: currentController.signal,
      })

      destinationCache.set(key, response.data || [])
      return response.data || []
    } catch (error: any) {
      console.log("Error searching flight destinations:", error)
      throw error
    }
  },

  searchFlights: async (params: FlightSearchParams) => {
    try {
      const response = await axiosClient.get("/flights/searchFlights", {
        params: {
          fromId: params.fromId,
          toId: params.toId,
          departDate: params.departDate,
          returnDate: params.returnDate || "",
          stops: params.stops || "none",
          pageNo: params.pageNo || 1,
          adults: params.adults || 1,
          children: params.children || "",
          sort: params.sort || "BEST",
          cabinClass: params.cabinClass || "ECONOMY",
          currency_code: params.currency_code || "USD",
        },
      })
      return response
    } catch (error) {
      console.log("Error searching flights:", error)
      throw error
    }
  },
}
