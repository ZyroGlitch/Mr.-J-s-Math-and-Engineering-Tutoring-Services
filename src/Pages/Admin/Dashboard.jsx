
import { AlarmClockCheck, Bell, Dot, Menu, UserRound, Wrench } from 'lucide-react';
import React, { useState } from 'react'
import { BsSearch, BsPeople, BsBag, BsBarChartLine } from "react-icons/bs";
import { FaArrowLeft, FaSpotify, FaRegEnvelope } from "react-icons/fa6";
import { LuSquareArrowLeft } from "react-icons/lu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Link, Outlet } from 'react-router-dom';


function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeLink, setActiveLink] = useState(1);

    const [sidebarLinks] = useState([
        { id: 1, navigate: '/admin-dashboard', icon: <BsBarChartLine />, name: 'Dashboard' },
        { id: 2, navigate: '/admin-booking', icon: <BsBag />, name: 'Booking' },
        { id: 3, navigate: '/admin-services', icon: <BsPeople />, name: 'Services' },
        { id: 4, navigate: '/admin-messages', icon: <FaRegEnvelope />, name: 'Messages' }
    ]);



    return (
        <>
            <div className="flex overflow-hidden">
                {/* Sidebar Content */}
                <div
                    className={`flex-col justify-between bg-white h-screen border-r border-slate-200 shadow-xl duration-300 hidden lg:flex ${isSidebarOpen ? 'w-[250px]' : 'w-[60px]'}`}
                >
                    <div>
                        <div className="px-4 border-b border-slate-300 mb-3">
                            <div className={`relative inline-flex items-center w-full ${isSidebarOpen ? 'gap-2' : 'justify-center'}`}>
                                <div className="h-[80px] w-[80px] flex items-center justify-center">
                                    <img src="logo.png" alt="Logo" className="object-cover" />
                                </div>
                                <p className="text-xs font-bold drop-shadow text-left">Mr. J’s Math and Engineering <br />Tutoring Services</p>
                            </div>
                        </div>

                        {/* Sidebar Links */}
                        <ul className="space-y-1 mx-2.5">
                            {sidebarLinks.map((link) => (
                                <Link
                                    to={link.navigate}
                                    key={link.id}
                                    onClick={() => setActiveLink(link.id)}
                                    className={`flex items-center gap-2 rounded px-3 py-1.5 cursor-pointer ${activeLink === link.id ? 'bg-blue-500 text-white' : 'bg-transparent hover:bg-slate-200'} ${!isSidebarOpen && 'justify-center'}`}
                                >
                                    {link.icon}
                                    <p className={`text-sm w-full text-left ${!isSidebarOpen && 'opacity-0 scale-0 absolute'}`}>{link.name}</p>
                                </Link>
                            ))}
                        </ul>
                    </div>

                    {/* Logout Section */}
                    <ul className="space-y-2 mx-2.5 mb-3">
                        <li className={`flex items-center gap-2 rounded bg-transparent px-3 py-1.5 cursor-pointer hover:bg-slate-200 ${!isSidebarOpen && 'justify-center'}`}>
                            <LuSquareArrowLeft className='text-lg' />
                            <p className={`text-sm w-full text-left ${!isSidebarOpen && 'opacity-0 scale-0 absolute'}`}>Logout</p>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="bg-white h-screen w-full overflow-y-auto flex flex-col">
                    <nav className="sticky top-0 z-10 flex items-center bg-slate-100 max-h-[50px] w-full shadow p-4 shrink-0">
                        {/* Show only in larger screens */}
                        <div
                            className={`text-black rounded-lg p-2 mr-4 cursor-pointer hover:bg-slate-200 hover:shadow hidden lg:block ${!isSidebarOpen && 'rotate-180'}`}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <FaArrowLeft size={16} />
                        </div>
                        <p className="text-xl hidden text-slate-700 lg:block">Navbar</p>

                        {/* Sheet - Notifications */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button
                                        type="button"
                                        className="bg-white hover:shadow hover:bg-slate-200 rounded p-2 flex items-center justify-center"
                                    >
                                        <Menu color="#1e293b" size={18} />
                                    </button>
                                </SheetTrigger>

                                <SheetContent side="right" className="w-[380px] sm:w-[420px] p-0">
                                    <div className="flex h-full flex-col">
                                        <SheetHeader className="p-4 pb-2">
                                            <SheetTitle>Notifications</SheetTitle>

                                            {/* Main - Header */}
                                            <Tabs defaultValue="all" className="mb-2">
                                                <TabsList variant="line" className="bg-transparent shadow-none border-none">
                                                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                                                    <TabsTrigger value="system" className="text-xs">
                                                        System
                                                        <span className="inline-block ml-2">10</span>
                                                    </TabsTrigger>
                                                    <TabsTrigger value="inbox" className="text-xs">
                                                        Inbox
                                                        <span className="inline-block ml-2">5</span>
                                                    </TabsTrigger>
                                                    <TabsTrigger value="task" className="text-xs">
                                                        Task
                                                        <span className="inline-block ml-2">2</span>
                                                    </TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </SheetHeader>

                                        <div className="no-scrollbar flex-1 overflow-y-auto">
                                            <Link href="#"
                                                className="flex items-center hover:bg-gray-100 border-gray-300 border-b-[1px] gap-4 py-2 px-[16px]"
                                            >
                                                <div className=" bg-green-200 text-white rounded-full p-2">
                                                    <UserRound color='#16a34a' size={18} />
                                                </div>

                                                <div className="flex flex-col w-full">
                                                    <div className='flex justify-between items-center'>
                                                        <p className="text-xs text-gray-500 font-semibold">Boss sent you an a message.</p>
                                                        <span className="bg-green-400 rounded-full w-[8px] h-[8px]"></span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <p className="text-[11px] text-black">4hrs ago</p>
                                                        <Dot size={16} />
                                                        <p className="text-[11px] text-black">Inbox</p>
                                                    </div>

                                                </div>
                                            </Link>

                                            <Link href="#"
                                                className="flex items-center hover:bg-gray-100 border-gray-300 border-b-[1px] gap-4 py-2 px-[16px]"
                                            >
                                                <div className="bg-cyan-200 text-white rounded-full p-2">
                                                    <AlarmClockCheck color='#0891b2' size={18} />
                                                </div>

                                                <div className="flex flex-col w-full">
                                                    <div className='flex justify-between items-center'>
                                                        <p className="text-xs text-gray-500 font-semibold">Iphone 13 Pro Max is out of stock.</p>
                                                        <span className="bg-cyan-400 rounded-full w-[8px] h-[8px]"></span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <p className="text-[11px] text-black">8hrs ago</p>
                                                        <Dot size={16} />
                                                        <p className="text-[11px] text-black">Task</p>
                                                    </div>

                                                </div>
                                            </Link>

                                            <Link href="#"
                                                className="flex items-center hover:bg-gray-100 border-gray-300 border-b-[1px] gap-4 py-2 px-[16px]"
                                            >
                                                <div className=" bg-yellow-200 text-white rounded-full p-2">
                                                    <Wrench color='#ca8a04' size={18} />
                                                </div>

                                                <div className="flex flex-col w-full">
                                                    <div className='flex justify-between items-center'>
                                                        <p className="text-xs text-gray-500 font-semibold">System Encountered Issue</p>
                                                        <span className="bg-yellow-400 rounded-full w-[8px] h-[8px]"></span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <p className="text-[11px] text-black">1day ago</p>
                                                        <Dot size={16} />
                                                        <p className="text-[11px] text-black">System</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                        {/* <SheetFooter className="p-4 pt-2 border-t">
                                    <button className="btn">Submit</button>
                                    <SheetClose asChild>
                                        <button className="btn-outline">Cancel</button>
                                    </SheetClose>
                                </SheetFooter> */}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </nav>

                    {/* Dynamic Content */}
                    <div className="px-8 py-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
