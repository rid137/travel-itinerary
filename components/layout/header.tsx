import {
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MobileNav from "@/components/MobileNav"
import { ArrowDownIcon, CartIcon, CommissionIcon, CreateIcon, DashboardIcon, HomeIcon, LineIcon, LogoIcon, NotificationIcon, PlanIcon, UserIcon, WalletIcon } from "@/public/icons"

export const Header = () => {    
    return (
      <header className="bg-white px-4 lg:px-6 py-4 lg:py-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between ax-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-4 lg:gap-6 w-full xl:w-auto">
            <LogoIcon className="size-10" />
            <MobileNav />
            <div className="relative flex-1 xl:flex-none bg-[#F0F2F5] rounded">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search destinations..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-[#647995] w-full xl:w-72"
              />
            </div>
          </div>
            <div className="flex items-center gap-4 lg:gap-8 w-full lg:w-auto justify-between lg:justify-end">
              <nav className="hidden xl:flex items-center gap-6 text-sm text-gray">
                  
                  <div className="flex flex-col items-center text-center gap-1 font-medium cursor-pointer">
                      <HomeIcon className="size-4" />
                      <span>Home</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 font-medium cursor-pointer">
                      <DashboardIcon className="size-4" />
                      <span>Dashbaord</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 font-medium cursor-pointer">
                      <WalletIcon className="size-4" />
                      <span>Wallet</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 font-medium cursor-pointer">
                      <PlanIcon className="size-4" />
                      <span className="text-[#1D2433]">Plan a trip</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 font-medium cursor-pointer">
                      <CommissionIcon className="w-5 h-5" />
                      <span>Commission for life</span>
                  </div>

                  <LineIcon className="h-8" />

                  <Button>
                      Subscribe
                  </Button>

                  <div className="flex flex-col items-center text-center gap-1 font-medium cursor-pointer">
                      <NotificationIcon className="size-4" />
                      <span>Notification</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 font-medium cursor-pointer">
                      <CartIcon className="size-4" />
                      <span>Cart</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 font-medium cursor-pointer">
                      <CreateIcon className="size-4" />
                      <span>Create</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer">
                      <UserIcon className="size-8" />
                      <ArrowDownIcon />
                  </div>
              </nav>
          </div>
        </div>
      </header>
    )
}