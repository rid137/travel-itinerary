export interface FlightDestination {
  id: string
  name: string
  code: string
  country: string
  city: string
}

export interface FlightSearchParams {
  fromId: string
  toId: string
  departDate: string
  returnDate?: string
  stops?: "none" | "0" | "1" | "2"
  pageNo?: number
  adults?: number
  children?: string
  sort?: "BEST" | "CHEAPEST" | "FASTEST"
  cabinClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST"
  currency_code?: string
}

export interface Flight {
  id: string
  uniqueId: string
  airline: string
  airlineCode?: string
  airlineLogo?: string
  flightNumber: string
  departure: {
    time: string
    airport: string
    code: string
  }
  arrival: {
    time: string
    airport: string
    code: string
  }
  duration: string
  stops: number
  price: {
    amount: number
    currency: string
  }
  cabinClass: string
  facilities: string[]
}

export interface ItineraryItem {
  id: string
  type: "flight" | "hotel" | "activity"
  data: Flight | Hotel | Activity
  dateAdded: string
}

export interface Hotel {
  id: string
  name: string
  address: string
  rating: number
  reviews: number
  price: {
    amount: number
    currency: string
  }
  image: string
  images?: string[]
  amenities: string[]
  checkIn: string
  checkOut: string
  location?: string
  propertyClass?: number
}

export interface Activity {
  id: string
  name: string
  slug: string
  description: string
  rating: number
  reviews: number
  price: {
    amount: number
    currency: string
  }
  image: string
  images?: string[]
  duration: string
  location: string
  category: string
  highlights?: string[]
  freeCancellation?: boolean
}

export interface HotelDestination {
  dest_id: number
  name: string
  search_type: string
  country: string
  region?: string
}

export interface HotelSearchParams {
  dest_id: number
  search_type: string
  arrival_date: string
  departure_date: string
  adults?: number
  children_age?: string
  room_qty?: number
  page_number?: number
  price_min?: number
  price_max?: number
  sort_by?: string
  categories_filter?: string
  units?: "metric" | "imperial"
  temperature_unit?: "c" | "f"
  languagecode?: string
  currency_code?: string
  location?: string
}

export interface AttractionLocation {
  id: string
  name: string
  country: string
  region?: string
}

export interface AttractionSearchParams {
  id: string
  startDate?: string
  endDate?: string
  sortBy?: "trending" | "attr_book_score" | "lowest_price"
  page?: number
  currency_code?: string
  languagecode?: string
}
