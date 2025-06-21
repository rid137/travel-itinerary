import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ItineraryProvider } from "@/context/ItineraryContext"
import { Toaster } from "@/components/ui/toaster"


export const metadata: Metadata = {
  title: "Travel Itinerary Platform",
  description: "Plan your perfect trip with flights, hotels, and activities"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-poppins">
        <ItineraryProvider>
          {children}
          <Toaster />
        </ItineraryProvider>
      </body>
    </html>
  )
}
