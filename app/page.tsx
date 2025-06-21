"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Plane,
  MapPin,
  X,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useItinerary } from "@/context/ItineraryContext"
import RemoveItemModal from "@/components/RemoveItemModal"
import ImageCarousel from "@/components/ImageCarousel"
import AirlineLogo from "@/components/AirlineLogo"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import Image from "next/image"
import { ActivityTitleIcon, ArrowLeftIcon, ArrowRightIcon, BaggageIcon, BarIcon, BigIcon, CabinIcon, CalenderIcon, CheckCalenderIcon, CircleDownIcon, CircleUpIcon, ClockIcon, ElipsesIcon, FlightDownIcon, FlightTakeOffIcon, FlightTitleIcon, FoodIcon, HotelsTitleIcon, InFlightIcon, PoolIcon, UserPlusIcon } from "@/public/icons"
import { getCurrencySymbol, returnCapitalize, truncateSentence } from "@/lib/utils"
import { JSX } from "react"

export default function HomePage() {
  const router = useRouter()
  const { itinerary, removeFromItinerary } = useItinerary()
  const [removeModal, setRemoveModal] = useState<{
    isOpen: boolean
    itemId: string
    itemName: string
    itemType: string
  }>({
    isOpen: false,
    itemId: "",
    itemName: "",
    itemType: "",
  })

  const flightItems = itinerary.filter((item) => item.type === "flight")
  const hotelItems = itinerary.filter((item) => item.type === "hotel")
  const activityItems = itinerary.filter((item) => item.type === "activity")

  const iconMap: Record<string, JSX.Element> = {
    'cabin baggage': <CabinIcon />,
    'baggage': <BaggageIcon />,
    'in flight entertainment': <InFlightIcon />,
    'in flight meal': <FoodIcon />,
  };

  const getFacilityIcon = (facility: string): JSX.Element | null => {
    const lower = facility.toLowerCase();
    const sortedKeys = Object.keys(iconMap).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
      if (lower.includes(key)) {
        return iconMap[key];
      }
    }

    return null;
  };

  const extractTaxesLine = (accessibilityLabel: string): string | null => {
    return (
      accessibilityLabel
        .split('\n')
        .find((line) => {
          const lower = line.toLowerCase();
          return (
            lower.includes('taxes and charges') ||
            lower.includes('taxes') ||
            lower.includes('charges')
          );
        }) ?? null
    );
  }

  const getWhatsIncludedForActivity = (slug: string): string => {
    if (!slug) return '';

    const parts = slug.split('-').slice(1);
    return parts
      .join(' ')
      .replace(/^./, (c) => c.toUpperCase());
  }

  const handleRemoveClick = (item: any) => {
    const data = item.data as any
    let itemName = ""
    let itemType = ""

    if (item.type === "flight") {
      itemName = `${data.airline} ${data.flightNumber}`
      itemType = "Flight"
    } else if (item.type === "hotel") {
      itemName = data.name
      itemType = "Hotel"
    } else if (item.type === "activity") {
      itemName = data.name
      itemType = "Activity"
    }

    setRemoveModal({
      isOpen: true,
      itemId: item.id,
      itemName,
      itemType,
    })
  }

  const handleConfirmRemove = () => {
    removeFromItinerary(removeModal.itemId)
    setRemoveModal({
      isOpen: false,
      itemId: "",
      itemName: "",
      itemType: "",
    })
  }

  const handleCloseModal = () => {
    setRemoveModal({
      isOpen: false,
      itemId: "",
      itemName: "",
      itemType: "",
    })
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <Header />

      <div className="flex p-4 lg:p-6 gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6 lg:mb-8 overflow-hidden rounded bg-white p-4 lg:p-6">
            <div className="w-full h-32 lg:h-48 relative mb-6 rounded overflow-hidden">
              <div className="absolute top-4 left-4 z-10"><ArrowLeftIcon className="size-10" /></div>
              <Image
                src="/images/banner.png"
                alt="Trip Planner Banner"
                fill
                priority
                sizes="100vw"
              />
            </div>

            <div className="flex items-start justify-between w-ful mb-16">
              {/* First item */}
              <div className="">
                <div className="bg-[#FEF4E6] mb-1 p-2 rounded-sm flex items-center gap-1 text-sm font-medium w-fit">
                  <span className="mb-0.5"><CalenderIcon /></span> <span className="text-[#7A4504]">21 March 2024</span> <ArrowRightIcon /> <span className="text-[#7A4504]">21 March 2024</span>
                </div>

                <h2 className="text-xl lg:text-2xl font-semibold text-black mb-1">Bahamas Family Trip</h2>
                <div className="flex items-cen gap-1 mb-4">
                  <p className="text-gray-1 font-medium">New York,  United States of America </p>
                  <span className="text-[#D0D5DD]"> | </span>
                  <p className="text-gray-1 font-medium">Solo Trip</p>
                </div>

                <div className="flex items-center flex-wrap gap-3">
                  {/* Activity card */}
                  <div className="bg-[#000031] p-4 rounded text-white w-full md:w-fit">
                    <p className="font-semibold mb-2">Activities</p>
                    <p className="text-sm mb-8">Build, personalize, and optimize your <br /> itineraries with our trip planner.</p>
                    <Button 
                      className="w-full"
                      onClick={() => router.push("/activities/search")}
                    >
                      Add Actvities
                    </Button>
                  </div>

                  {/* Hotels card */}
                  <div className="bg-[#E7F0FF] p-4 rounded w-full md:w-fit">
                    <p className="font-semibold text-black mb-2">Hotels</p>
                    <p className="text-sm text-[#1D2433] mb-8">Build, personalize, and optimize your <br /> itineraries with our trip planner.</p>
                    <Button 
                      className="w-full"
                      onClick={() => router.push("/hotels/search")}
                    >
                      Add Hotels
                    </Button>
                  </div>

                  {/* Flight card */}
                  <div className="bg-primary p-4 rounded text-white w-full md:w-fit">
                    <p className="font-semibold mb-2">Flights</p>
                    <p className="text-sm mb-8">Build, personalize, and optimize your <br /> itineraries with our trip planner.</p>
                    <Button 
                      className="w-full text-primary bg-white hover:bg-white hover:opacity-80"
                      onClick={() => router.push("/flights/search")}
                    >
                      Add Actvities
                    </Button>
                  </div>
                </div>
              </div>

              {/* Second Item */}
              <div className="hidden lg:flex flex-col items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="bg-[#E7F0FF] py-2 px-14 rounded-sm"><UserPlusIcon /></div>
                  <ElipsesIcon />
                </div>
                <BigIcon className="w-full h-8" />
              </div>
            </div>

            {/* Empty State */}
            {itinerary.length === 0 && (
              <div className="text-center pt-12 pb-12 lg:pt-16 lg:pb-24">
                <div>
                  <div className="w-20 lg:w-24 h-20 lg:h-24 bg-[#f0f8ff] rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-8 lg:w-10 h-8 lg:h-12 text-primary" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-dark mb-3">Start Planning Your Trip</h3>
                  <p className="text-gray mb-6 lg:mb-8 text-base lg:text-lg max-w-md mx-auto">
                    Add flights, hotels, and activities to create your perfect itinerary
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => router.push("/flights/search")}
                      className="px-6 lg:px-8 py-2 lg:py-3"
                    >
                      <Plane className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
                      Search Flights
                    </Button>
                    <Button
                      onClick={() => router.push("/hotels/search")}
                      variant="outline"
                      className="px-6 lg:px-8 py-2 lg:py-3"
                    >
                      <Building2 className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
                      Search Hotels
                    </Button>
                    <Button
                      onClick={() => router.push("/activities/search")}
                      variant="outline"
                      className="px-6 lg:px-8 py-2 lg:py-3"
                    >
                      <MapPin className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
                      Search Activities
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary sections */}
            <div className="">
              {
                itinerary.length > 0 && (
                  <div className="pb-12 pt-10 lg:pb-16">
                    <h4 className="text-dark font-semibold mb-1">Trip itineraries</h4>
                    <p className="text-sm text-gray font-medium mb-6">Your trip itineraries are placed here</p>

                    {/* Flight Sections */}
                    {flightItems.length > 0 && (
                      <div className="mb-6 lg:mb-8 px-6 pt-5 pb-10 bg-[#F0F2F5] rounded hidden">

                        <div className="">
                          <div className="mb-6 flex flex-colm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <FlightTitleIcon className="w-5 lg:w-6 h-5 lg:h-6" />
                              <h3 className="text-base lg:text-lg font-semibold text-dark">Flights</h3>
                            </div>
                            <Button 
                              className=" text-primary bg-white hover:bg-white hover:opacity-80"
                              onClick={() => router.push("/flights/search")}
                            >
                              Add Flights
                            </Button>
                          </div>
                        </div>

                        <div className="">
                          <div className="space-y-4">
                            {flightItems.map((item) => {
                              const flight = item.data as any
                              return (
                                <div 
                                  className="flex"
                                  key={item.id}
                                >

                                  {/* First Item */}
                                  <div
                                    className="py-4 lg:py-6 bg-white rounded-tl rounded-bl flex-1"
                                  >
                                    <div className="border-b px-4 lg:px-6 border-[#E4E7EC] pb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                      <div className="flex items-center gap-4 lg:gap-6">
                                        <AirlineLogo
                                          airlineLogo={flight.airlineLogo}
                                          airlineName={flight.airline}
                                          airlineCode={flight.airlineCode}
                                          className="w-10 h-10 lg:w-12 lg:h-12"
                                        />
                                        <div>
                                          <div className="font-semibold text-dark text-base lg:text-lg">{flight.airline}</div>
                                          <div className="flex items-center gap-2">
                                            <div className="text-sm text-gray">{flight.flightNumber}</div>
                                            <div className="text-gray mb-2">.</div>
                                            <div className="bg-[#0A369D] px-2 py-1 rounded text-white capitalize text-xs">{returnCapitalize(flight.cabinClass)}</div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-6 lg:gap-12 w-full lg:w-auto justify-center">
                                        <div className="text-center">
                                          <div className="font-semibold text-dark text-base lg:text-lg">
                                            {flight.departure.time}
                                          </div>
                                          <div className="text-sm text-gray font-medium">{flight.departure.date}</div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                          {/* First item */}
                                          <div className="flex items-center gap-10">
                                            <FlightTakeOffIcon />
                                            <p className="text-gray font-medium">Duration: {flight.duration}</p>
                                            <FlightDownIcon />
                                          </div>

                                          {/* second item */}
                                          <div className="flex items-center w-full">
                                            <div className="bg-[#E7F0FF] rounded-bl-full rounded-tl-full w-1/3 h-1.5"></div>
                                            <div className="bg-primary rounded-full w-1/3 h-1.5"></div>
                                            <div className="bg-[#E7F0FF] rounded-br-full rounded-tr-full w-1/3 h-1.5"></div>
                                          </div>

                                          {/* Third item */}
                                          <div className="flex items-center gap- justify-between w-full">
                                            <div className="text-sm text-dark font-medium">{flight.departure.code}</div> 
                                            <p className="text-gray font-medium">Stops: {flight.stops}</p>
                                            <div className="text-sm text-dark font-medium">{flight.arrival.code}</div> 
                                          </div>

                                        </div>
                                        <div className="text-center">
                                          <div className="font-semibold text-dark text-base lg:text-lg">{flight.arrival.time}</div>
                                          <div className="text-sm text-gray font-medium">{flight.arrival.date}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                                        <div className="text-left lg:text-right">
                                          <div className="font-semibold text-dark text-base lg:text-lg">
                                            {getCurrencySymbol(flight.price.currency)} {flight.price.amount.toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Facilities */}
                                    <div className="py-4 px-4 lg:px-6 border-b border-[#E4E7EC]">
                                      <div className="flex flex-wrap items-center text-gray">
                                        <p className="font-medium">Facilities: </p>
                                        {
                                          flight.facilities.map((facility: string, index: number) => (
                                            <span
                                              key={index}
                                              className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium"
                                            >
                                              {getFacilityIcon(facility)}
                                              {facility}
                                            </span>
                                          ))
                                        }
                                        
                                      </div>
                                    </div>

                                    {/* bottom texts */}
                                    <div className="pt-4 px-4 lg:px-6 text-primary text-base cursor-default font-medium flex items-center justify-between w-full">
                                      <div className="flex items-center gap-10">
                                        <p>Flight details</p>
                                        <p>Price details</p>
                                      </div>
                                      <p>Edit details</p>
                                    </div>
                                  </div>

                                  {/* Second item ==> remove button */}
                                  <div className="bg-[#FBEAE9] rounded-tr rounded-br px-2 flex items-center justify-center">
                                    <X 
                                      onClick={() => handleRemoveClick(item)}
                                      className="text-destructive cursor-pointer"
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}


                    {/* Hotels section */}
                    {hotelItems.length > 0 && (
                      <div className="mb-6 lg:mb-8 px-6 pt-5 pb-10 bg-[#344054] rounded hidden">

                        <div className="">
                          <div className="mb-6 flex flex-cosm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <HotelsTitleIcon className="w-5 lg:w-6 h-5 lg:h-6" />
                              <h3 className="text-base lg:text-lg font-semibold text-white">Hotels</h3>
                            </div>
                            <Button 
                              className=" text-dark bg-white hover:bg-white hover:opacity-80"
                              onClick={() => router.push("/hotels/search")}
                            >
                              Add Hotels
                            </Button>
                          </div>
                        </div>


                        <div className="">
                          <div className="space-y-6">
                            {hotelItems.map((item) => {
                              const hotel = item.data as any
                              const hotelImages = hotel.images || ["/placeholder.svg"]
                              const taxesLine = extractTaxesLine(hotel.accessibilityLabel);
                              const formattedTaxes = taxesLine?.replace('+', '').trim();


                              return (
                                <div 
                                  className="flex"
                                  key={item.id}
                                >
                                  
                                  {/* First Item */}
                                  <div
                                    className="p-4 lg:p-6 flex flex-col lg:flex-row gap-3 bg-white rounded-tl rounded-bl flex-1"
                                  >

                                    <div className="w-full h-48 lg:w-40 lg:h-full flex-shrink-0">
                                      <ImageCarousel images={hotelImages} alt={hotel.name} className="w-full h-full rounded-lg" />
                                    </div>

                                    <div className="flex-1">
                                      <div className="border-b border-[#E4E7EC] pb-4 flex flex-col lg:flex-row items-start justify-between">
                                        <div>
                                          <h4 className="font-semibold text-black text-lg">{hotel.name}</h4>
                                          <p className="text-sm text-dark mb-2">{hotel.address}</p>
                                          <div className="flex items-center gap-4 text-sm text-[#647995]">
                                            <div className="flex items-center gap-1 text-primary">
                                              <MapPin className="w-4 h-4" />
                                              <span>Show in map</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Star className="w-4 h-4 fill-[#fec035] text-[#fec035]" />
                                              <span className="text-sm text-gray">
                                                {hotel.rating} ({hotel.reviews})
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="lg:text-right">
                                          <div className="font-semibold text-dark text-base lg:text-lg">
                                            {getCurrencySymbol(hotel.price.currency)} {hotel.price.amount.toLocaleString()}
                                          </div>
                                          <div className="text-xs text-dark">
                                            Total Price: {getCurrencySymbol(hotel.price.currency)} {hotel.price.amount.toLocaleString()}
                                          </div>
                                          <div className="text-xs text-dark">{formattedTaxes}</div>
                                        </div>
                                      </div>

                                      {/* Second row */}
                                      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between py-4 border-b border-[#E4E7EC]">
                                        <div className="flex flex-wrap items-center gap-2 text-gray">
                                          <p className="font-medium">Facilities: </p>
                                          {
                                            hotel?.facility ? (
                                              <>
                                                {
                                                  hotel.facilities.map((facility: string, index: number) => (
                                                    <span
                                                      key={index}
                                                      className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium"
                                                    >
                                                      {facility}
                                                    </span>
                                                  ))
                                                }
                                              </>
                                            )
                                            :
                                            (
                                              <>
                                                <div className="flex items-center gap-1">
                                                  <PoolIcon />
                                                  <p>Pool</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <BarIcon />
                                                  <p>Bar</p>
                                                </div>
                                              </>
                                            )
                                          }
                                          
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray font-medium">
                                          <span className="flex items-center gap-1"><CheckCalenderIcon /> Check in: {hotel.checkIn}</span>
                                          <span className="flex items-center gap-1"><CheckCalenderIcon />Check out: {hotel.checkOut}</span>
                                        </div>
                                        
                                      </div>

                                      {/* bottom texts */}
                                      <div className="pt-4 text-primary font-medium text-base cursor-default flex items-center justify-between w-full">
                                        <div className="flex items-center gap-10">
                                          <p>Hotel details</p>
                                          <p>Price details</p>
                                        </div>
                                        <p>Edit details</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Second item ==> remove button */}
                                  <div className="bg-[#FBEAE9] rounded-tr rounded-br px-2 flex items-center justify-center">
                                    <X 
                                      onClick={() => handleRemoveClick(item)}
                                      className="text-destructive cursor-pointer"
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Activities Itinerary */}
                    {activityItems.length > 0 && (
                      <div className="mb-6 lg:mb-8 px-6 pt-5 pb-10 bg-[#0054E4] rounded">

                        <div className="">
                          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <ActivityTitleIcon className="w-5 lg:w-6 h-5 lg:h-6" />
                              <h3 className="text-base lg:text-lg font-semibold text-white">Activities</h3>
                            </div>
                            <Button 
                              className=" text-primary bg-white hover:bg-white hover:opacity-80"
                              onClick={() => router.push("/activities/search")}
                            >
                              Add Activities
                            </Button>
                          </div>
                        </div>

                        <div className="">
                          <div className="space-y-6">
                            {activityItems.map((item) => {
                              const activity = item.data as any
                              const activityImages = activity.image || ["/placeholder.svg"]

                              return (
                                <div 
                                  className="flex"
                                  key={item.id}
                                > 
                                  {/* First Item */}
                                  <div
                                    className="p-4 lg:p-6 flex flex-col lg:flex-row gap-3 bg-white rounded-tl rounded-bl flex-1"
                                  >

                                    <div className="w-full h-48 lg:w-40 lg:h-full flex-shrink-0">
                                      <ImageCarousel 
                                        images={activityImages} 
                                        alt={activity.name} 
                                        className="w-full h-full rounded-lg" 
                                      />
                                    </div>

                                    <div className="flex-1">
                                      <div className="border-b border-[#E4E7EC] pb-4 flex flex-col lg:flex-row items-start justify-between">
                                        <div>
                                          <h4 className="font-semibold text-black text-lg">{activity.name}</h4>
                                          <p className="text-sm text-dark mb-2">{activity.description}</p>
                                          
                                          <div className="flex items-center gap-4 text-sm text-[#647995]">
                                            <div className="flex items-center gap-1 text-primary">
                                              <MapPin className="w-4 h-4" />
                                              <span>Directions</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Star className="w-4 h-4 fill-[#fec035] text-[#fec035]" />
                                              <span className="text-sm text-gray">
                                                {activity.rating} ({activity.reviews})
                                              </span>
                                            </div>
                                            {/* Time/date is not returned by the API, I added dummy here for reference purpose */}
                                            <div className="flex items-center gap-1">
                                              <ClockIcon />
                                              <span className="text-sm text-gray">1 Hour</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="lg:text-right">
                                          <div className="font-semibold text-dark text-base lg:text-lg">
                                            {getCurrencySymbol(activity.price.currency)} {activity.price.amount.toLocaleString()}
                                          </div>
                                          {/* Time/date is not returned by the API, I added dummy here for reference purpose */}
                                          <div className="text-xs text-dark">
                                            10:30 AM on Mar 19
                                          </div>
                                        </div>
                                      </div>

                                      {/* Second row */}
                                      <div className="flex items-start flex-col md:flex-row justify-between py-2 border-b border-[#E4E7EC]">
                                        <div className="flex items-center font-medium gap-2 text-gray">
                                          <p>What's Incuded: </p>
                                          <p>{truncateSentence(getWhatsIncludedForActivity(activity.slug), 35)}  <span className="text-primary">See more</span></p>
                                        </div>

                                        {/* Number of days returned by the API, I added dummy here for reference purpose */}
                                        <div className="flex items-center gap-4">
                                          <div className="bg-[#0A369D] px-1.5 py-1 rounded text-white text-sm">Day 1</div>
                                          <div className="flex flex-col gap-3">
                                            <CircleDownIcon />
                                            <CircleUpIcon />
                                          </div>
                                        </div>
                                        
                                      </div>

                                      {/* bottom texts */}
                                      <div className="pt-4 text-primary font-medium text-base cursor-default flex items-center justify-between w-full">
                                        <div className="flex items-center gap-10">
                                          <p>Activity details</p>
                                          <p>Price details</p>
                                        </div>
                                        <p>Edit details</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Second item ==> remove button */}
                                  <div className="bg-[#FBEAE9] rounded-tr rounded-br px-2 flex items-center justify-center">
                                    <X 
                                      onClick={() => handleRemoveClick(item)}
                                      className="text-destructive cursor-pointer"
                                    />
                                  </div>

                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
            </div>
          </div>          
        </main>
      </div>

      <RemoveItemModal
        isOpen={removeModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRemove}
        itemName={removeModal.itemName}
        itemType={removeModal.itemType}
      />
    </div>
  )
};