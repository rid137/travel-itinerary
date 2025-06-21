import axiosClient from "@/lib/axios"
import type { AttractionLocation, AttractionSearchParams } from "@/types"

const attractionLocationCache = new Map<string, AttractionLocation[]>()
let currentAttractionController: AbortController | null = null

export const activityService = {
  searchLocations: async (query: string): Promise<AttractionLocation[]> => {
    const key = query.trim().toLowerCase()
    if (attractionLocationCache.has(key)) return attractionLocationCache.get(key)!

    currentAttractionController?.abort()
    currentAttractionController = new AbortController()

    try {
      const response = await axiosClient.get("/attraction/searchLocation", {
        params: { query },
        signal: currentAttractionController.signal,
      })

      const destinations = response.data?.destinations || []
      const transformedLocations: AttractionLocation[] = destinations.map((dest: any) => ({
        id: dest.id,
        name: dest.cityName,
        country: dest.country,
        region: dest.cc1,
      }))

      attractionLocationCache.set(key, transformedLocations)
      return transformedLocations
    } catch (error: any) {
      console.log("Error searching attraction locations:", error)
      return []
    }
  },

  searchActivities: async (params: AttractionSearchParams) => {
    try {
      const response = await axiosClient.get("/attraction/searchAttractions", {
        params: {
          id: params.id,
          startDate: params.startDate || "",
          endDate: params.endDate || "",
          sortBy: params.sortBy || "trending",
          page: params.page || 1,
          currency_code: params.currency_code || "USD",
          languagecode: params.languagecode || "en-us",
        },
      })
      return response
    } catch (error) {
      console.log("Error searching attractions:", error)
      throw error
    }
  },
}
