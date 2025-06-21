import { useRouter } from "next/navigation"
import { ActivityIcon, FlightIcon, GoIcon, HotelsIcon, ImmigrationIcon, MedicalIcon, StudyIcon, UpDownIcon, VacationIcon, VisaIcon } from "@/public/icons";

export const Sidebar = () => {
    const router = useRouter();

    return (
        <aside className="hidden xl:block w-72 bg-white border-r border-[#e4e7ec] h-fit in-h-screen rounded">
            <div className="px-6 pt-6 pb-16">
                <nav className="space-y-1 text-gray mb-8">
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
                </nav>

                <div className="bg-[#F0F2F5] p-2 flex items-center justify-between rounded-sm">
                    <div className="flex items-center gap-1">
                        <div className="bg-primary rounded-sm p-3 flex items-center"><GoIcon /></div>
                        <span className="font-medium text-gray text-sm">Personal Account</span>
                    </div>
                    <UpDownIcon />
                </div>
            </div>
        </aside>
    )
}