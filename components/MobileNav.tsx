"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ActivityIcon, FlightIcon, GoIcon, HotelsIcon, ImmigrationIcon, LogoIcon, MedicalIcon, StudyIcon, UpDownIcon, VacationIcon, VisaIcon } from "@/public/icons"

export default function MobileNav() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="xl:hidden text-dark hover:bg-white/10">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <LogoIcon className="size-10" />
            <span className="font-semibold text-lg">Travel Itinerary</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="p-4">
          <div className="space-y-2">
            <div
                onClick={() => router.push("/activities/search")}
                className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] rounded-xl cursor-pointer w-full text-left transition-colors"
            >
                <ActivityIcon className="size-5" />
                <span className="font-medium">Activities</span>
            </div>
            <div
                onClick={() => router.push("/hotels/search")}
                className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] rounded-xl cursor-pointer w-full text-left transition-colors"
            >
                <HotelsIcon className="size-5" />
                <span className="font-medium">Hotels</span>
            </div>

            <div
                onClick={() => router.push("/flights/search")}
                className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] rounded-xl cursor-pointer w-full text-left transition-colors"
            >
                <FlightIcon className="size-5" />
                <span className="font-medium">Flights</span>
            </div>

            <div className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] rounded-xl cursor-pointer transition-colors">
                <StudyIcon className="size-5" />
                <span className="font-medium">Study</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] rounded-xl cursor-pointer transition-colors">
                <VisaIcon className="size-5" />
                <span className="font-medium">Visa</span>
            </div>

            <div className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] rounded-xl cursor-pointer transition-colors">
                <ImmigrationIcon className="size-6" />
                <span className="font-medium">Immigration</span>
            </div>

            <div className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] rounded-xl cursor-pointer transition-colors">
                <MedicalIcon className="size-5" />
                <span className="font-medium">Medical</span>
            </div>

            <div className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] rounded-xl cursor-pointer transition-colors">
                <VacationIcon className="size-5" />
                <span className="font-medium">Vacation Packages</span>
            </div>

            <div className="bg-[#F0F2F5] p-2 flex items-center justify-between rounded-sm">
              <div className="flex items-center gap-1">
                <div className="bg-primary rounded-sm p-3 flex items-center"><GoIcon /></div>
                <span className="font-medium text-gray text-sm">Personal Account</span>
              </div>
              <UpDownIcon />
            </div>
                            
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
